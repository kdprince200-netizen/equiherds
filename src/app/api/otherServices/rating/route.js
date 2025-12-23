/**
 * @swagger
 * tags:
 *   - name: OtherServices
 *     description: Other service listings and ratings
 *
 * /api/otherServices/rating:
 *   post:
 *     summary: Update other service rating
 *     tags: [OtherServices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otherServiceId
 *               - rating
 *             properties:
 *               otherServiceId:
 *                 type: string
 *                 description: The ID of the other service to update rating
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: The new rating value (0-5)
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/OtherService'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Other service not found
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OtherService from "@/models/OtherService";
import "@/models/User";

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";
  
  if (contentType.includes("application/json")) {
    try {
      return await req.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON format");
    }
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    try {
      const formData = await req.formData();
      const body = {};
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }
      return body;
    } catch (error) {
      console.error("Error parsing form data:", error);
      throw new Error("Invalid form data format");
    }
  } else {
    throw new Error("Unsupported content type");
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await parseRequestBody(req);
    const { otherServiceId, rating } = body;

    // Validate required fields
    if (!otherServiceId || rating === undefined) {
      return NextResponse.json(
        { success: false, message: "otherServiceId and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating value
    const ratingValue = Number(rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be a number between 0 and 5" },
        { status: 400 }
      );
    }

    // Check if other service exists
    const otherService = await OtherService.findById(otherServiceId);
    if (!otherService) {
      return NextResponse.json(
        { success: false, message: "Other service not found" },
        { status: 404 }
      );
    }

    // Get current rating data
    const currentRating = otherService.Rating || 0;
    const currentCustomersCount = otherService.noofRatingCustomers || 0;
    
    // Calculate new average rating using the formula: Average Rating = Sum of Ratings / Number of Ratings
    // New Sum = (Current Average × Current Count) + New Rating
    // New Average = New Sum / (Current Count + 1)
    const currentSum = currentRating * currentCustomersCount;
    const newSum = currentSum + ratingValue;
    const newCustomersCount = currentCustomersCount + 1;
    const newAverageRating = newSum / newCustomersCount;

    // Update the other service with new average rating and incremented customer count
    const updatedOtherService = await OtherService.findByIdAndUpdate(
      otherServiceId,
      {
        Rating: newAverageRating,
        noofRatingCustomers: newCustomersCount
      },
      { new: true, runValidators: true }
    ).populate({ path: "userId", select: "firstName lastName email" });

    return NextResponse.json(
      {
        success: true,
        message: "Other service rating updated successfully",
        data: updatedOtherService
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating other service rating:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
