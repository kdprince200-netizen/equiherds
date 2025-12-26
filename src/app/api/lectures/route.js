import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Lecture from '../../models/Lecture';

// GET /api/lectures - list lectures with optional filters & pagination
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'live' | 'offline' | null
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const query = {};
    if (type === 'live' || type === 'offline') {
      query.lectureType = type;
    }

    const [items, total] = await Promise.all([
      Lecture.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Lecture.countDocuments(query),
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
    console.error('GET /api/lectures error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/lectures - create new lecture
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Basic required fields validation
    const requiredFields = [
      'courseTitle',
      'description',
      'coverImageUrl',
      'demoVideoUrl',
      'coursePrice',
      'lectureType',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Normalize arrays
    if (body.courseType && !Array.isArray(body.courseType)) {
      body.courseType = [body.courseType].filter(Boolean);
    }
    if (body.lectureVideos && !Array.isArray(body.lectureVideos)) {
      body.lectureVideos = [body.lectureVideos].filter(Boolean);
    }

    // Create document
    const lecture = new Lecture(body);
    await lecture.save();

    return NextResponse.json(
      { success: true, data: lecture },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/lectures error:', error);
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


