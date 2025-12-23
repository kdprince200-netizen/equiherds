import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BookingOtherService from "@/models/BookingOtherService";
import "@/models/User";
import "@/models/OtherService";

// Helper function to parse request body
async function parseRequestBody(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      return await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    } else {
      const text = await req.text();
      return text ? JSON.parse(text) : {};
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return {};
  }
}

// GET - Fetch all other service bookings
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const clientId = searchParams.get("clientId");
    const serviceId = searchParams.get("serviceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const bookingStatus = searchParams.get("bookingStatus");

    // Build query object
    const query = {};
    if (userId) query.userId = userId;
    if (clientId) query.clientId = clientId;
    if (serviceId) query.serviceId = serviceId;
    if (bookingStatus) query.bookingStatus = bookingStatus;

    // Date range filtering
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startDate.$lte = new Date(endDate);
      }
    }

    const bookings = await BookingOtherService.find(query)
      .populate({
        path: "userId",
        select: "firstName lastName email"
      })
      .populate({
        path: "clientId", 
        select: "firstName lastName email"
      })
      .populate({
        path: "serviceId",
        select: "title serviceType pricePerHour location"
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { 
        success: true, 
        data: bookings,
        count: bookings.length 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching other service bookings:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch other service bookings" 
      },
      { status: 500 }
    );
  }
}

// POST - Create a new other service booking
export async function POST(req) {
  await connectDB();
  try {
    const body = await parseRequestBody(req);

    const {
      userId,
      serviceId,
      bookingType,
      startDate,
      endDate,
      startTime,
      endTime,
      basePrice,
      additionalServices,
      servicePriceDetails,
      additionalServiceCosts,
      totalPrice,
      numberOfHours,
      clientId,
      bookingStatus,
      paymentId
    } = body;

    // Validate required fields
    if (!userId || !serviceId || !bookingType || !startDate || !totalPrice || !clientId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, serviceId, bookingType, startDate, totalPrice, clientId" },
        { status: 400 }
      );
    }

    // Validate bookingType
    if (!["hour", "day"].includes(bookingType)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking type. Must be 'hour' or 'day'" },
        { status: 400 }
      );
    }

    // Validate bookingStatus if provided
    if (bookingStatus && !['pending', 'confirmed', 'cancelled', 'completed'].includes(bookingStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid bookingStatus. Must be one of: pending, confirmed, cancelled, completed" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    
    if (isNaN(start.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid startDate format" },
        { status: 400 }
      );
    }

    if (endDate && isNaN(end.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid endDate format" },
        { status: 400 }
      );
    }

    if (start < new Date()) {
      return NextResponse.json(
        { success: false, message: "Start date cannot be in the past" },
        { status: 400 }
      );
    }

    if (endDate && end < start) {
      return NextResponse.json(
        { success: false, message: "End date cannot be before start date" },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await BookingOtherService.findOne({
      serviceId,
      bookingStatus: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start }
        }
      ]
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { 
          success: false, 
          message: "This service is already booked for the selected time period" 
        },
        { status: 409 }
      );
    }

    // Create the booking
    const booking = await BookingOtherService.create({
      userId,
      serviceId,
      bookingType,
      startDate: start,
      endDate: end,
      startTime: startTime || null,
      endTime: endTime || null,
      basePrice: basePrice || 0,
      additionalServices: additionalServices || {},
      servicePriceDetails: servicePriceDetails || {},
      additionalServiceCosts: additionalServiceCosts || 0,
      totalPrice,
      numberOfHours: numberOfHours || 1,
      clientId,
      bookingStatus: bookingStatus || 'pending',
      paymentId: paymentId || null
    });

    // Populate the created booking
    const populatedBooking = await BookingOtherService.findById(booking._id)
      .populate({
        path: "userId",
        select: "firstName lastName email"
      })
      .populate({
        path: "clientId",
        select: "firstName lastName email"
      })
      .populate({
        path: "serviceId",
        select: "title serviceType pricePerHour location"
      });

    return NextResponse.json(
      { 
        success: true, 
        data: populatedBooking,
        message: "Other service booking created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating other service booking:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create other service booking" 
      },
      { status: 500 }
    );
  }
}
