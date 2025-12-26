import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import RecordedSession from '../../models/RecordedSession';

/**
 * @swagger
 * /api/recorded-sessions:
 *   get:
 *     summary: Get all recorded sessions
 *     tags: [RecordedSessions]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Active, Inactive]
 *         description: Filter by status
 *       - in: query
 *         name: clubId
 *         schema:
 *           type: string
 *         description: Filter by club ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of recorded sessions
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clubId = searchParams.get('clubId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const query = {};
    if (status && ['Pending', 'Active', 'Inactive'].includes(status)) {
      query.status = status;
    }
    if (clubId) {
      query.clubId = clubId;
    }

    const [items, total] = await Promise.all([
      RecordedSession.find(query)
        .populate('createdBy', 'firstName lastName email')
        .populate('clubId', 'clubGymName')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      RecordedSession.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/recorded-sessions error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/recorded-sessions:
 *   post:
 *     summary: Create a new recorded session
 *     tags: [RecordedSessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - level
 *               - duration
 *               - videoUrl
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               category:
 *                 type: string
 *                 enum: [technique, fundamentals, conditioning, mental training, competition prep]
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced, all levels]
 *               duration:
 *                 type: number
 *               isPaid:
 *                 type: boolean
 *               price:
 *                 type: number
 *               videoUrl:
 *                 type: string
 *                 description: Primary video URL
 *               videoUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of all video URLs (for multiple videos)
 *               coach:
 *                 type: string
 *               clubId:
 *                 type: string
 *               createdBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recorded session created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    await connectDB();

    // Parse JSON body
    const body = await request.json();
    
    // Extract fields
    const { title, description, category, level, duration, isPaid, price, videoUrl, videoUrls, coach, clubId, createdBy } = body;

    // Validation
    if (!title || !description || !category || !level || !duration) {
      return NextResponse.json(
        { success: false, error: 'Title, description, category, level, and duration are required' },
        { status: 400 }
      );
    }

    // Support both single videoUrl and multiple videoUrls
    let finalVideoUrl = videoUrl;
    let finalVideoUrls = videoUrls || [];

    // If videoUrls array is provided, use first one as primary
    if (Array.isArray(videoUrls) && videoUrls.length > 0 && !videoUrl) {
      finalVideoUrl = videoUrls[0];
      finalVideoUrls = videoUrls;
    }

    // If only single videoUrl is provided, create array
    if (videoUrl && !Array.isArray(videoUrls)) {
      finalVideoUrls = [videoUrl];
    }

    if (!finalVideoUrl || typeof finalVideoUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'At least one video URL is required' },
        { status: 400 }
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Description must be 500 characters or less' },
        { status: 400 }
      );
    }

    if (isPaid && (!price || price <= 0)) {
      return NextResponse.json(
        { success: false, error: 'Price is required for paid sessions' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['technique', 'fundamentals', 'conditioning', 'mental training', 'competition prep'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced', 'all levels'];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { success: false, error: 'Invalid level' },
        { status: 400 }
      );
    }

    // Create recorded session document
    const sessionData = {
      title,
      description,
      category,
      level,
      duration: parseInt(duration, 10),
      isPaid,
      price: isPaid ? price : 0,
      videoUrl: finalVideoUrl, // Primary video URL
      videoUrls: finalVideoUrls, // Array of all video URLs
      coach: coach || undefined,
      status: 'Pending', // New sessions start as Pending
      views: 0,
      subscribers: 0,
      revenue: 0,
      rating: 0,
    };

    if (clubId) {
      sessionData.clubId = clubId;
    }

    if (createdBy) {
      sessionData.createdBy = createdBy;
    }

    const recordedSession = new RecordedSession(sessionData);
    await recordedSession.save();

    return NextResponse.json(
      { 
        success: true, 
        data: recordedSession,
        message: 'Session uploaded successfully! It will be reviewed by admin within 24-48 hours.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/recorded-sessions error:', error);
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

