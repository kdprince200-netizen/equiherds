import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from "@/lib/db";
import BookingOtherService from "@/models/BookingOtherService";
import { validateNoCardData, sanitizeForLogging } from '@/lib/stripe-security';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    
    // SECURITY: Validate that no card data is in the request
    try {
      validateNoCardData(body);
    } catch (securityError) {
      console.error('SECURITY VIOLATION:', securityError.message);
      console.error('Request body (sanitized):', sanitizeForLogging(body));
      return NextResponse.json(
        { 
          success: false,
          message: 'SECURITY_VIOLATION: Credit card data must be collected securely using Stripe Elements on the client side. Card numbers cannot be sent to the server.',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }
    
    const { bookingId } = body;
    
    console.log('Charging saved payment method for other service booking:', bookingId);
    
    await connectDB();
    
    // Get the booking to verify it exists and get details
    const booking = await BookingOtherService.findById(bookingId);
    console.log('Other service booking clientId:', booking.clientId, 'Type:', typeof booking.clientId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Other service booking not found' },
        { status: 404 }
      );
    }

    if (!booking.paymentId) {
      return NextResponse.json(
        { success: false, message: 'No payment method saved for this other service booking' },
        { status: 400 }
      );
    }

    // First, ensure the customer exists in Stripe
    let stripeCustomer;
    const customerId = booking.clientId.toString(); // Convert ObjectId to string
    
    try {
      stripeCustomer = await stripe.customers.retrieve(customerId);
    } catch (error) {
      // If customer doesn't exist, create a new one
      console.log('Customer not found, creating new Stripe customer with ID:', customerId);
      try {
        stripeCustomer = await stripe.customers.create({
          id: customerId,
          metadata: {
            type: 'other_service_booking_customer'
          }
        });
        console.log('Stripe customer created successfully:', stripeCustomer.id);
      } catch (createError) {
        console.error('Error creating Stripe customer:', createError);
        return NextResponse.json(
          { success: false, message: 'Error creating customer' },
          { status: 500 }
        );
      }
    }

    // Normalize amount to cents
    const rawAmount = Number(booking.totalPrice);
    const normalizedAmountCents = Number.isFinite(rawAmount)
      ? (rawAmount >= 100 ? Math.round(rawAmount) : Math.round(rawAmount * 100))
      : 0;

    // Create PaymentIntent using the saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: normalizedAmountCents,
      currency: 'eur',
      customer: stripeCustomer.id,
      payment_method: booking.paymentId, // Use the saved payment method ID
      confirmation_method: 'manual',
      confirm: true,
      off_session: true, // This is a saved payment method
      metadata: {
        bookingId: bookingId,
        type: 'other_service_booking_charge'
      }
    });

    console.log('Payment intent created for saved other service payment:', paymentIntent.id);
    console.log('Payment status:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      // Update booking status to confirmed
      booking.bookingStatus = 'confirmed';
      booking.paymentId = paymentIntent.id; // Update paymentId to the actual PaymentIntent ID
      await booking.save();

      return NextResponse.json({
        success: true,
        message: 'Other service booking payment charged and booking confirmed successfully!',
        paymentIntent: paymentIntent
      });
    } else {
      // Handle other statuses like 'requires_action', 'requires_confirmation', etc.
      return NextResponse.json({
        success: false,
        message: `Payment requires further action: ${paymentIntent.status}`,
        paymentIntent: paymentIntent
      });
    }
  } catch (err) {
    console.error('Error charging saved other service payment:', err.message || 'Unknown error');
    // Don't log full error object as it might contain sensitive data
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to charge payment' },
      { status: 500 }
    );
  }
}
