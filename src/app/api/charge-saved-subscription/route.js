import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { calculateSubscriptionExpiry, getSubscriptionStatus } from "@/app/utils/subscriptionUtils";
import { validateNoCardData, sanitizeForLogging } from '@/lib/stripe-security';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  let userId; // Declare userId in outer scope for error handling
  try {
    const requestData = await request.json();
    
    // SECURITY: Validate that no card data is in the request
    try {
      validateNoCardData(requestData);
    } catch (securityError) {
      console.error('SECURITY VIOLATION:', securityError.message);
      console.error('Request body (sanitized):', sanitizeForLogging(requestData));
      return NextResponse.json(
        { 
          success: false,
          message: 'SECURITY_VIOLATION: Credit card data must be collected securely using Stripe Elements on the client side. Card numbers cannot be sent to the server.',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }
    
    userId = requestData.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Check if user is already being processed to prevent race conditions
    if (user.isProcessingPayment) {
      console.log(`User ${user.email} is already being processed, skipping duplicate request`);
      return NextResponse.json({ 
        success: false, 
        message: "Payment already being processed for this user" 
      }, { status: 409 });
    }

    // Set processing flag to prevent concurrent processing
    user.isProcessingPayment = true;
    await user.save();

    if (user.accountType !== 'seller') {
      user.isProcessingPayment = false;
      await user.save();
      return NextResponse.json({ success: false, message: "Only sellers are auto-charged" }, { status: 400 });
    }

    if (!user.stripeCustomerId || !user.defaultPaymentMethodId) {
      user.isProcessingPayment = false;
      await user.save();
      return NextResponse.json({ success: false, message: "No saved payment method" }, { status: 400 });
    }

    if (!user.subscriptionPrice || !user.subscriptionDuration) {
      user.isProcessingPayment = false;
      await user.save();
      return NextResponse.json({ success: false, message: "No subscription selection found" }, { status: 400 });
    }

    // Check if subscription is actually expired before charging
    const { autoCheckSubscriptionStatus } = await import('@/app/utils/subscriptionUtils');
    const subscriptionStatus = autoCheckSubscriptionStatus(user);
    
    if (!subscriptionStatus || !subscriptionStatus.isExpired) {
      console.log(`User ${user.email} subscription is not expired, skipping auto-renewal`);
      user.isProcessingPayment = false;
      await user.save();
      return NextResponse.json({ 
        success: true, 
        message: "Subscription is not expired, no renewal needed",
        user 
      });
    }

    // Check if there's already a recent successful payment to prevent duplicates
    const recentPayment = user.payments
      .filter(payment => payment.status === 'succeeded')
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (recentPayment) {
      const paymentDate = new Date(recentPayment.date);
      const now = new Date();
      const timeDiff = now.getTime() - paymentDate.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      
      // If payment was made within the last 2 hours, don't charge again
      if (hoursDiff < 2) {
        console.log(`Recent payment found for user ${user.email}, skipping duplicate charge`);
        user.isProcessingPayment = false;
        await user.save();
        return NextResponse.json({ 
          success: true, 
          message: "Recent payment found, skipping duplicate charge",
          paymentIntentId: recentPayment.paymentId,
          user 
        });
      }
    }

    // Amount in cents
    const amountCents = Math.round(Number(user.subscriptionPrice) * 100);

    // Create and confirm an off-session payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      customer: user.stripeCustomerId,
      payment_method: user.defaultPaymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        type: 'subscription_renewal',
        userId: user.id,
        subscriptionId: user.subscriptionId?.toString() || ''
      }
    });

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ success: false, message: 'Payment requires action', paymentIntent }, { status: 402 });
    }

    // Compute new expiry and status
    const newExpiry = calculateSubscriptionExpiry(user.subscriptionDuration);
    const newStatus = getSubscriptionStatus(newExpiry);

    // Update user subscription & record payment
    user.subscriptionExpiry = newExpiry;
    user.subscriptionStatus = newStatus;
    
    // Create new payment record
    const newPayment = {
      paymentId: paymentIntent.id,
      date: new Date(),
      amount: amountCents,
      currency: 'eur',
      status: 'succeeded',
      userId: user._id.toString(), // Store userId for new payments
      customerName: `${user.firstName} ${user.lastName}`.trim(),
      customerEmail: user.email,
      subscriptionId: user.subscriptionId || null,
      subscriptionName: user.subscriptionName || null,
      subscriptionPrice: user.subscriptionPrice || null,
      subscriptionDuration: user.subscriptionDuration || null,
      subscriptionStatus: newStatus,
      subscriptionExpiry: newExpiry.toISOString()
    };
    
    // Clean up existing payments to ensure they have userId (for backward compatibility)
    user.payments.forEach(payment => {
      if (!payment.userId) {
        payment.userId = user._id.toString();
      }
    });
    
    user.payments.push(newPayment);

    // Save user with comprehensive error handling
    try {
      await user.save();
    } catch (saveError) {
      console.error('Error saving user with payment:', saveError);
      
      // If it's a validation error, try to fix it
      if (saveError.name === 'ValidationError') {
        console.log('Validation error detected, attempting to fix payment data...');
        
        // Ensure all payments have required fields
        user.payments.forEach(payment => {
          if (!payment.userId) payment.userId = user._id.toString();
          if (!payment.customerName) payment.customerName = `${user.firstName} ${user.lastName}`.trim();
          if (!payment.customerEmail) payment.customerEmail = user.email;
        });
        
        // Try saving again
        try {
          await user.save();
          console.log('Successfully fixed and saved user data');
        } catch (retryError) {
          console.error('Failed to save even after fixing validation issues:', retryError);
          throw retryError;
        }
      } else {
        throw saveError; // Re-throw if it's not a validation error
      }
    }

    // Clear processing flag
    user.isProcessingPayment = false;
    await user.save();

    return NextResponse.json({ success: true, paymentIntentId: paymentIntent.id, user });
  } catch (error) {
    console.error('Error charging saved subscription:', error.message || 'Unknown error');
    // Don't log full error object as it might contain sensitive data
    
    // Clear processing flag on error
    try {
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          user.isProcessingPayment = false;
          await user.save();
        }
      }
    } catch (clearError) {
      console.error('Error clearing processing flag:', clearError.message || 'Unknown error');
    }
    
    return NextResponse.json({ success: false, message: error.message || 'Failed to charge subscription' }, { status: 500 });
  }
}


