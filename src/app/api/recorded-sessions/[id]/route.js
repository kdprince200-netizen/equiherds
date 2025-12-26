import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import RecordedSession from '../../../models/RecordedSession';

/**
 * @swagger
 * /api/recorded-sessions/{id}:
 *   get:
 *     summary: Get a recorded session by ID
 *     tags: [RecordedSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recorded session ID
 *     responses:
 *       200:
 *         description: Recorded session details
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = params instanceof Promise ? await params : params;
    const sessionId = resolvedParams?.id;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await RecordedSession.findById(sessionId)
      .populate('createdBy', 'firstName lastName email')
      .populate('clubId', 'clubGymName');

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('GET /api/recorded-sessions/[id] error:', error);
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid session ID format' },
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
 * /api/recorded-sessions/{id}:
 *   put:
 *     summary: Update a recorded session
 *     tags: [RecordedSessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recorded session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               videoUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Pending, Active, Inactive]
 *               coach:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = params instanceof Promise ? await params : params;
    const sessionId = resolvedParams?.id;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check if session exists
    const existingSession = await RecordedSession.findById(sessionId);
    if (!existingSession) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate description length if provided
    if (body.description && body.description.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Description must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (body.category) {
      const validCategories = ['technique', 'fundamentals', 'conditioning', 'mental training', 'competition prep'];
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { success: false, error: 'Invalid category' },
          { status: 400 }
        );
      }
    }

    // Validate level if provided
    if (body.level) {
      const validLevels = ['beginner', 'intermediate', 'advanced', 'all levels'];
      if (!validLevels.includes(body.level)) {
        return NextResponse.json(
          { success: false, error: 'Invalid level' },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['Pending', 'Active', 'Inactive'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 }
        );
      }
    }

    // Handle video URLs
    if (body.videoUrls && Array.isArray(body.videoUrls) && body.videoUrls.length > 0) {
      body.videoUrl = body.videoUrls[0]; // Set primary video URL
    }

    // Don't allow updating certain fields directly
    delete body.createdBy;
    delete body.clubId;
    delete body.views;
    delete body.subscribers;
    delete body.revenue;
    delete body.rating;

    // Clean empty strings
    Object.keys(body).forEach((key) => {
      if (body[key] === '') {
        delete body[key];
      }
    });

    // Update session
    const updatedSession = await RecordedSession.findByIdAndUpdate(
      sessionId,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'firstName lastName email')
      .populate('clubId', 'clubGymName');

    return NextResponse.json({
      success: true,
      data: updatedSession,
      message: 'Session updated successfully'
    });
  } catch (error) {
    console.error('PUT /api/recorded-sessions/[id] error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid session ID format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

