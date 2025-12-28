import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { customerId, userId, email, name, metadata = {} } = await request.json();
    
    console.log('Creating setup intent for customer:', customerId || userId);
    
    let stripeCustomer;
    
    // If we have userId, email, name - create a new Stripe customer
    if (userId && email && name) {
      console.log('Creating new Stripe customer for user:', userId);
      try {
        stripeCustomer = await stripe.customers.create({
          email: email,
          name: name,
          metadata: {
            user_id: userId,
            type: 'subscription_customer',
            ...metadata
          }
        });
        console.log('New Stripe customer created:', stripeCustomer.id);
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        return NextResponse.json(
          { error: 'Failed to create Stripe customer' },
          { status: 500 }
        );
      }
    } else if (customerId) {
      // If we have customerId, try to retrieve existing customer
      const customerIdString = customerId.toString();
      try {
        stripeCustomer = await stripe.customers.retrieve(customerIdString);
        console.log('Retrieved existing Stripe customer:', stripeCustomer.id);
      } catch (error) {
        console.log('Customer not found, creating new Stripe customer');
        stripeCustomer = await stripe.customers.create({
          id: customerIdString,
          metadata: {
            type: 'booking_customer',
            ...metadata
          }
        });
      }
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Create a SetupIntent to save the payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      usage: 'off_session', // For future payments
      metadata: {
        type: 'subscription_setup',
        user_id: userId || customerId,
        ...metadata
      },
    });

    console.log('Setup intent created:', setupIntent.id);
    console.log('Setup intent metadata:', setupIntent.metadata);

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
      customerId: stripeCustomer.id
    });
  } catch (err) {
    console.error('Error creating setup intent:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
