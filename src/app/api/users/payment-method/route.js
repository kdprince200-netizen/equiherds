import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { userId, stripeCustomerId, paymentMethodId, makeDefault = true } = await request.json();

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
    console.error("Error saving payment method:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save payment method" },
      { status: 500 }
    );
  }
}


