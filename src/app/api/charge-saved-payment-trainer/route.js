import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from "@/lib/db";
import BookingTrainer from "@/models/BookingTrainer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { bookingId } = await request.json();
    
    console.log('Charging saved payment method for trainer booking:', bookingId);
    
    await connectDB();
    
    // Get the booking to verify it exists and get details
    const booking = await BookingTrainer.findById(bookingId);
    console.log('Trainer booking clientId:', booking.clientId, 'Type:', typeof booking.clientId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Trainer booking not found' },
        { status: 404 }
      );
    }

    if (!booking.paymentId) {
      return NextResponse.json(
        { success: false, message: 'No payment method saved for this trainer booking' },
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
            type: 'trainer_booking_customer'
          }
        });
        console.log('Stripe customer created successfully:', stripeCustomer.id);
      } catch (createError) {
        console.error('Error creating Stripe customer:', createError);
        return NextResponse.json(
          { success: false, error: 'Failed to create Stripe customer: ' + createError.message },
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
        type: 'trainer_booking_charge'
      }
    });

    console.log('Payment intent created for saved trainer payment:', paymentIntent.id);
    console.log('Payment status:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      // Update booking status to confirmed
      booking.bookingStatus = 'confirmed';
      booking.paymentId = paymentIntent.id; // Update paymentId to the actual PaymentIntent ID
      await booking.save();

      return NextResponse.json({
        success: true,
        message: 'Trainer booking payment charged and booking confirmed successfully!',
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
    console.error('Error charging saved trainer payment:', err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
