import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSubscriptionStatus, isSubscriptionActive } from "@/app/utils/subscriptionUtils";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check current subscription status
    const currentStatus = getSubscriptionStatus(user.subscriptionExpiry);
    const isActive = isSubscriptionActive(user.subscriptionExpiry);

    return NextResponse.json({
      success: true,
      message: 'Subscription status retrieved',
      subscriptionStatus: {
        status: currentStatus,
        isActive: isActive,
        expiryDate: user.subscriptionExpiry,
        updated: false
      }
    });

  } catch (error) {
    console.error('Error checking subscription status (GET):', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check if request has body
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, message: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Get request body safely
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { userId } = requestBody;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check current subscription status
    const currentStatus = getSubscriptionStatus(user.subscriptionExpiry);
    const isActive = isSubscriptionActive(user.subscriptionExpiry);

    // Update user subscription status if it has changed
    if (user.subscriptionStatus !== currentStatus) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { subscriptionStatus: currentStatus },
        { new: true }
      ).select('-password');

      return NextResponse.json({
        success: true,
        message: 'Subscription status updated',
        user: updatedUser,
        subscriptionStatus: {
          status: currentStatus,
          isActive: isActive,
          expiryDate: user.subscriptionExpiry,
          updated: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription status checked',
      subscriptionStatus: {
        status: currentStatus,
        isActive: isActive,
        expiryDate: user.subscriptionExpiry,
        updated: false
      }
    });

  } catch (error) {
    console.error('Error checking subscription status:', error);
    
    // Handle specific JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { success: false, message: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

