import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validateNoCardData, validatePaymentRequest, sanitizeForLogging } from '@/lib/stripe-security';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    
    // SECURITY: Validate that no card data is in the request
    try {
      validateNoCardData(body);
      validatePaymentRequest(body);
    } catch (securityError) {
      console.error('SECURITY VIOLATION:', securityError.message);
      console.error('Request body (sanitized):', sanitizeForLogging(body));
      return NextResponse.json(
        { 
          error: 'SECURITY_VIOLATION: Credit card data must be collected securely using Stripe Elements on the client side. Card numbers cannot be sent to the server.',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    const { amount, currency = 'eur', metadata = {} } = body;

    // Normalize amount to cents: if caller sent euros (e.g., 23), convert to 2300; if already cents (e.g., 2300), keep as-is
    const normalizedAmountCents = Number.isFinite(amount)
      ? (amount >= 100 ? Math.round(amount) : Math.round(amount * 100))
      : 0;

    console.log('Creating payment intent. Amount:', amount, '→ normalized (cents):', normalizedAmountCents, 'currency:', currency);

    // Create a PaymentIntent with the normalized amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: normalizedAmountCents,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: 'booking',
        ...metadata
      },
    });

    console.log('Payment intent created:', paymentIntent.id);
    console.log('Payment intent amount:', paymentIntent.amount, 'cents');
    console.log('Payment intent currency:', paymentIntent.currency);
    console.log('Payment intent metadata:', sanitizeForLogging(paymentIntent.metadata));

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

