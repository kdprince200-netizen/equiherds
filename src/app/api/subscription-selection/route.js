import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { calculateSubscriptionExpiry, getSubscriptionStatus } from "@/app/utils/subscriptionUtils";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    const { userId, subscriptionData } = body;

    if (!userId) {
      console.error('Missing userId in request');
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!subscriptionData) {
      console.error('Missing subscriptionData in request');
      return NextResponse.json(
        { success: false, message: 'Subscription data is required' },
        { status: 400 }
      );
    }

    console.log('Processing subscription selection for user:', userId);
    console.log('Subscription data:', subscriptionData);

    // Validate required subscription data fields
    const requiredFields = ['subscriptionId', 'subscriptionName', 'subscriptionPrice', 'subscriptionDuration'];
    const missingFields = requiredFields.filter(field => !subscriptionData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required subscription fields:', missingFields);
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
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

    // Calculate expiry date and status
    const expiryDate = calculateSubscriptionExpiry(subscriptionData.subscriptionDuration);
    const status = getSubscriptionStatus(expiryDate);

    // Update user with subscription data
    const updateData = {
      subscriptionId: subscriptionData.subscriptionId,
      subscriptionName: subscriptionData.subscriptionName,
      subscriptionPrice: subscriptionData.subscriptionPrice,
      subscriptionDuration: subscriptionData.subscriptionDuration,
      subscriptionStatus: status,
      subscriptionExpiry: expiryDate.toISOString()
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      message: 'Subscription selected successfully',
      user: updatedUser,
      subscriptionData: {
        subscriptionId: subscriptionData.subscriptionId,
        subscriptionName: subscriptionData.subscriptionName,
        subscriptionPrice: subscriptionData.subscriptionPrice,
        subscriptionDuration: subscriptionData.subscriptionDuration,
        subscriptionExpiry: expiryDate.toISOString(),
        subscriptionStatus: status
      }
    });

  } catch (error) {
    console.error('Error selecting subscription:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
