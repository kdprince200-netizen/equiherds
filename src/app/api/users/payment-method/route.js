import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { validateNoCardData, validatePaymentRequest, sanitizeForLogging } from '@/lib/stripe-security';

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
          success: false,
          message: 'SECURITY_VIOLATION: Credit card data must be collected securely using Stripe Elements on the client side. Card numbers cannot be sent to the server.',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    const { userId, stripeCustomerId, paymentMethodId, makeDefault = true } = body;
    
    // Validate that paymentMethodId is a string (payment method ID), not an object (card data)
    if (paymentMethodId && typeof paymentMethodId !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          message: 'SECURITY_VIOLATION: paymentMethodId must be a payment method ID string from Stripe Elements, not raw card data.',
          code: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    if (!userId || !stripeCustomerId || !paymentMethodId) {
      return NextResponse.json(
        { success: false, message: "userId, stripeCustomerId and paymentMethodId are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const update = {
      stripeCustomerId,
    };
    if (makeDefault) {
      update.defaultPaymentMethodId = paymentMethodId;
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      update,
      { new: true }
    ).select("-password");

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Error saving payment method:", error.message);
    // Don't log full error object as it might contain sensitive data
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save payment method" },
      { status: 500 }
    );
  }
}


