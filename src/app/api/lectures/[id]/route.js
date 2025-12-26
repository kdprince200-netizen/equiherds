import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Lecture from '../../../models/Lecture';

// GET /api/lectures/[id] - get single lecture
export async function GET(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lecture ID is required' },
        { status: 400 }
      );
    }

    const lecture = await Lecture.findById(id);

    if (!lecture) {
      return NextResponse.json(
        { success: false, error: 'Lecture not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: lecture });
  } catch (error) {
    console.error('GET /api/lectures/[id] error:', error);
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid lecture ID format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/lectures/[id] - update lecture
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lecture ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Normalize arrays
    if (body.courseType && !Array.isArray(body.courseType)) {
      body.courseType = [body.courseType].filter(Boolean);
    }
    if (body.lectureVideos && !Array.isArray(body.lectureVideos)) {
      body.lectureVideos = [body.lectureVideos].filter(Boolean);
    }

    // Clean empty strings
    Object.keys(body).forEach((key) => {
      if (body[key] === '') {
        body[key] = undefined;
      }
    });

    const lecture = await Lecture.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!lecture) {
      return NextResponse.json(
        { success: false, error: 'Lecture not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: lecture });
  } catch (error) {
    console.error('PUT /api/lectures/[id] error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid lecture ID format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/lectures/[id] - delete lecture
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Lecture ID is required' },
        { status: 400 }
      );
    }

    const lecture = await Lecture.findByIdAndDelete(id);

    if (!lecture) {
      return NextResponse.json(
        { success: false, error: 'Lecture not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lecture deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/lectures/[id] error:', error);
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid lecture ID format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


