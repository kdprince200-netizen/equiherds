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

    const { userId, userIds } = requestBody;

    // Support both single user and bulk operations
    if (userIds && Array.isArray(userIds)) {
      // BULK OPERATION - Process multiple users at once
      if (userIds.length === 0) {
        return NextResponse.json(
          { success: false, message: 'User IDs array cannot be empty' },
          { status: 400 }
        );
      }

      await connectDB();

      // Find all users in one query
      const users = await User.find({ _id: { $in: userIds } });
      
      if (users.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No users found' },
          { status: 404 }
        );
      }

      const results = [];
      const updatePromises = [];

      // Process each user
      for (const user of users) {
        const currentStatus = getSubscriptionStatus(user.subscriptionExpiry);
        const isActive = isSubscriptionActive(user.subscriptionExpiry);

        const result = {
          userId: user._id.toString(),
          email: user.email,
          status: currentStatus,
          isActive: isActive,
          expiryDate: user.subscriptionExpiry,
          updated: false
        };

        // Update user subscription status if it has changed
        if (user.subscriptionStatus !== currentStatus) {
          updatePromises.push(
            User.findByIdAndUpdate(
              user._id,
              { subscriptionStatus: currentStatus },
              { new: true }
            ).select('-password')
          );
          result.updated = true;
        }

        results.push(result);
      }

      // Execute all updates in parallel
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }

      return NextResponse.json({
        success: true,
        message: `Subscription status checked for ${results.length} users`,
        results: results,
        summary: {
          total: results.length,
          updated: results.filter(r => r.updated).length,
          notUpdated: results.filter(r => !r.updated).length
        }
      });
    }

    // SINGLE USER OPERATION - Original behavior
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID or User IDs array is required' },
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

