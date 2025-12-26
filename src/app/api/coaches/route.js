import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import User from '../../models/User.js';

/**
 * @swagger
 * /api/coaches:
 *   get:
 *     summary: Get all coaches or filter by club ID
 *     tags: [Coaches]
 *     parameters:
 *       - in: query
 *         name: clubId
 *         schema:
 *           type: string
 *         description: Filter coaches by parent club ID
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
 *         description: List of coaches
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('clubId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query to get coaches
    const query = { accountType: 'coach' };
    
    // If clubId is provided, filter by parentClubId
    if (clubId) {
      query.parentClubId = clubId;
    }
    
    const coaches = await User.find(query)
      .select('-password -confirmPassword')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: coaches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET /api/coaches error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/coaches:
 *   post:
 *     summary: Create a new coach
 *     tags: [Coaches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               parentClubId:
 *                 type: string
 *               coachingBusinessName:
 *                 type: string
 *               yearsOfExperience:
 *                 type: number
 *               certificationsCredentials:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Coach created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate password match
    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password before saving
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // Create coach object with accountType set to 'coach'
    const coachData = {
      ...body,
      accountType: 'coach',
      password: hashedPassword,
      confirmPassword: hashedPassword
    };

    const coach = new User(coachData);
    await coach.save();

    const coachResponse = coach.toObject();
    delete coachResponse.password;
    delete coachResponse.confirmPassword;

    return NextResponse.json(
      { success: true, data: coachResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/coaches error:', error);
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



