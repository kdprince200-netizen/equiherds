import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Class from '../../../models/Class';
import { verifyToken } from '../../../../lib/auth';

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Get a class by ID
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
 *         description: Class details
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Class ID is required' },
        { status: 400 }
      );
    }

    const classItem = await Class.findById(id)
      .populate('createdBy', 'firstName lastName clubGymName email')
      .populate('enrolledStudents.userId', 'firstName lastName email')
      .populate('reviews.userId', 'firstName lastName email');

    if (!classItem) {
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: classItem });
  } catch (error) {
    console.error('GET /api/classes/[id] error:', error);
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
 * /api/classes/{id}:
 *   put:
 *     summary: Update a class
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
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
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
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Class ID is required' },
        { status: 400 }
      );
    }

    // Check if class exists and user owns it
    const existingClass = await Class.findById(id);
    if (!existingClass) {
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingClass.createdBy.toString() !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update this class' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate date range if dates are being updated
    if (body.startDate && body.endDate) {
      if (new Date(body.endDate) < new Date(body.startDate)) {
        return NextResponse.json(
          { success: false, error: 'End date must be after start date' },
          { status: 400 }
        );
      }
    }

    // Convert date strings to Date objects if provided
    if (body.startDate) {
      body.startDate = new Date(body.startDate);
    }
    if (body.endDate) {
      body.endDate = new Date(body.endDate);
    }

    // Clean empty strings
    Object.keys(body).forEach((key) => {
      if (body[key] === '') {
        body[key] = undefined;
      }
    });

    // Don't allow updating createdBy, enrolledStudents, reviews, rating, ratingCount directly
    delete body.createdBy;
    delete body.enrolledStudents;
    delete body.reviews;
    delete body.rating;
    delete body.ratingCount;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'firstName lastName clubGymName email')
      .populate('enrolledStudents.userId', 'firstName lastName email')
      .populate('reviews.userId', 'firstName lastName email');

    return NextResponse.json({ success: true, data: updatedClass });
  } catch (error) {
    console.error('PUT /api/classes/[id] error:', error);
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
 * /api/classes/{id}:
 *   delete:
 *     summary: Delete a class
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
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
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
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Class ID is required' },
        { status: 400 }
      );
    }

    // Check if class exists and user owns it
    const existingClass = await Class.findById(id);
    if (!existingClass) {
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingClass.createdBy.toString() !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete this class' },
        { status: 403 }
      );
    }

    await Class.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/classes/[id] error:', error);
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








