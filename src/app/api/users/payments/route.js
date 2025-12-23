/**
 * @swagger
 * tags:
 *   - name: User Payments
 *     description: User payment management APIs
 *
 * /api/users/payments:
 *   post:
 *     summary: Add a new payment record to user
 *     tags: [User Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - paymentId
 *               - amount
 *               - currency
 *               - status
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to add payment to
 *               paymentId:
 *                 type: string
 *                 description: Stripe payment intent ID
 *               amount:
 *                 type: number
 *                 description: Payment amount in cents
 *               currency:
 *                 type: string
 *                 description: Payment currency
 *               status:
 *                 type: string
 *                 description: Payment status
 *               subscriptionId:
 *                 type: string
 *                 description: Associated subscription ID
 *               subscriptionStatus:
 *                 type: string
 *                 description: Subscription status
 *               subscriptionExpiry:
 *                 type: string
 *                 description: Subscription expiry date
 *     responses:
 *       200:
 *         description: Payment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */

import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      return await req.json();
    }
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await req.formData();
      const data = {};
      for (const [key, value] of form.entries()) {
        data[key] = typeof value === "string" ? value : value.name || "";
      }
      return data;
    }
    const raw = await req.text();
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    throw new Error("Invalid request body. Ensure valid JSON or form data.");
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await parseRequestBody(req);
    const {
      userId,
      paymentId,
      amount,
      currency,
      status,
      subscriptionId,
      subscriptionStatus,
      subscriptionExpiry
    } = body;

    // Validate required fields (allow amount to be 0 for free trials)
    if (!userId || !paymentId || amount === undefined || amount === null || !currency || !status) {
      return NextResponse.json(
        { message: "Missing required fields: userId, paymentId, amount, currency, status" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if payment already exists to prevent duplicates
    const existingPayment = user.payments.find(payment => payment.paymentId === paymentId);
    if (existingPayment) {
      return NextResponse.json(
        { message: "Payment already recorded", user: user.toJSON() },
        { status: 200 }
      );
    }

    // Create payment record with consistent userId
    const paymentRecord = {
      paymentId,
      date: new Date(),
      amount,
      currency,
      status,
      userId: userId, // Always store userId for consistent lookup
      customerName: `${user.firstName} ${user.lastName}`.trim(), // Store customer name for display
      customerEmail: user.email, // Store customer email for display
      subscriptionId: subscriptionId || null,
      subscriptionName: body.subscriptionName || null,
      subscriptionPrice: body.subscriptionPrice || null,
      subscriptionDuration: body.subscriptionDuration || null,
      subscriptionStatus: subscriptionStatus || null,
      subscriptionExpiry: subscriptionExpiry || null
    };

    // Add payment to user's payments array (don't replace, just add)
    user.payments.push(paymentRecord);

    // Update subscription status if provided
    if (subscriptionStatus) {
      user.subscriptionStatus = subscriptionStatus;
    }
    if (subscriptionExpiry) {
      user.subscriptionExpiry = subscriptionExpiry;
    }

    // Ensure user has a status (required field)
    if (!user.status) {
      user.status = 'active';
    }

    // For sellers, ensure required fields are present to avoid validation errors
    if (user.accountType === 'seller') {
      if (!user.brandImage) {
        user.brandImage = '/logo2.png'; // Use local placeholder instead
      }
      if (!user.companyName) {
        user.companyName = 'Default Company';
      }
      if (!user.companyInfo) {
        user.companyInfo = 'Default company information';
      }
      if (!user.vatNo) {
        user.vatNo = 'TBD'; // Temporary value for required field
      }
      if (!user.stripeAccountId) {
        user.stripeAccountId = 'TBD'; // Temporary value for required field
      }
    }

    // Save the updated user
    await user.save();

    // Return updated user without password
    const safeUser = user.toJSON();
    return NextResponse.json(
      { 
        message: "Payment added successfully", 
        user: safeUser 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding payment:", error);
    return NextResponse.json(
      { message: error.message || "Failed to add payment" },
      { status: 400 }
    );
  }
}
