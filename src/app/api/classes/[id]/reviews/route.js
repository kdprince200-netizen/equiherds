import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import Class from '../../../../models/Class';
import User from '../../../../models/User';
import { verifyToken } from '../../../../../lib/auth';

/**
 * @swagger
 * /api/classes/{id}/reviews:
 *   post:
 *     summary: Add a review/rating to a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
export async function POST(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const auth = verifyToken(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const classId = resolvedParams?.id;

    if (!classId) {
      return NextResponse.json(
        { success: false, error: 'Class ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Find the class
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    // Get user details for the review
    const user = await User.findById(auth.userId).select('firstName lastName');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this class
    const existingReviewIndex = classItem.reviews.findIndex(
      (review) => review.userId.toString() === auth.userId
    );

    const reviewData = {
      userId: auth.userId,
      rating: rating,
      comment: comment || '',
      userName: `${user.firstName} ${user.lastName}`.trim(),
    };

    if (existingReviewIndex >= 0) {
      // Update existing review
      classItem.reviews[existingReviewIndex] = reviewData;
    } else {
      // Add new review
      classItem.reviews.push(reviewData);
    }

    // Calculate average rating
    classItem.calculateAverageRating();

    // Save the class
    await classItem.save();

    // Populate and return updated class
    const updatedClass = await Class.findById(classId)
      .populate('createdBy', 'firstName lastName clubGymName email')
      .populate('enrolledStudents.userId', 'firstName lastName email')
      .populate('reviews.userId', 'firstName lastName email');

    return NextResponse.json(
      {
        success: true,
        data: updatedClass,
        message: existingReviewIndex >= 0 ? 'Review updated successfully' : 'Review added successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/classes/[id]/reviews error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid class ID format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/classes/{id}/reviews:
 *   get:
 *     summary: Get all reviews for a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: List of reviews
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = params instanceof Promise ? await params : params;
    const classId = resolvedParams?.id;

    if (!classId) {
      return NextResponse.json(
        { success: false, error: 'Class ID is required' },
        { status: 400 }
      );
    }

    const classItem = await Class.findById(classId)
      .populate('reviews.userId', 'firstName lastName email')
      .select('reviews rating ratingCount');

    if (!classItem) {
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews: classItem.reviews,
        rating: classItem.rating,
        ratingCount: classItem.ratingCount,
      },
    });
  } catch (error) {
    console.error('GET /api/classes/[id]/reviews error:', error);
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid class ID format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}








