import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Class from '../../models/Class';
import { verifyToken } from '../../../lib/auth';

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     parameters:
 *       - in: query
 *         name: clubId
 *         schema:
 *           type: string
 *         description: Filter by club/user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, cancelled, completed]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of classes
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('clubId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (clubId) {
      query.createdBy = clubId;
    }
    if (status) {
      query.status = status;
    }

    const [classes, total] = await Promise.all([
      Class.find(query)
        .populate('createdBy', 'firstName lastName clubGymName email')
        .populate('enrolledStudents.userId', 'firstName lastName email')
        .populate('reviews.userId', 'firstName lastName')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Class.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: classes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/classes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - instructor
 *               - category
 *               - level
 *               - day
 *               - time
 *               - duration
 *               - maxStudents
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               instructor:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *               day:
 *                 type: string
 *               time:
 *                 type: string
 *               duration:
 *                 type: number
 *               maxStudents:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Class created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export async function POST(request) {
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

    const body = await request.json();

    // Required fields validation
    const requiredFields = [
      'title',
      'instructor',
      'category',
      'level',
      'day',
      'time',
      'duration',
      'maxStudents',
      'startDate',
      'endDate',
    ];

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate date range
    if (new Date(body.endDate) < new Date(body.startDate)) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Create class with userId from token
    const classData = {
      ...body,
      createdBy: auth.userId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      enrolledStudents: [],
      reviews: [],
      rating: 0,
      ratingCount: 0,
      status: 'active',
    };

    const newClass = new Class(classData);
    await newClass.save();

    // Populate createdBy for response
    await newClass.populate('createdBy', 'firstName lastName clubGymName email');

    return NextResponse.json(
      { success: true, data: newClass },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/classes error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}








