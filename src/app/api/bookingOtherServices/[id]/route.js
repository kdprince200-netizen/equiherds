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

// GET - Fetch a specific other service booking by ID
export async function GET(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await BookingOtherService.findById(id)
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
        select: "title serviceType pricePerHour location images details experience degree"
      });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Other service booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: booking 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching other service booking:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch other service booking" 
      },
      { status: 500 }
    );
  }
}

// PUT - Update a specific other service booking
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await parseRequestBody(req);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const {
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
      bookingStatus,
      paymentId
    } = body;

    // Check if booking exists
    const existingBooking = await BookingOtherService.findById(id);
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, message: "Other service booking not found" },
        { status: 404 }
      );
    }

    // Validate bookingStatus if provided
    if (bookingStatus && !['pending', 'confirmed', 'cancelled', 'completed'].includes(bookingStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid bookingStatus. Must be one of: pending, confirmed, cancelled, completed" },
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid startDate format" },
          { status: 400 }
        );
      }
      if (start < new Date()) {
        return NextResponse.json(
          { success: false, message: "Start date cannot be in the past" },
          { status: 400 }
        );
      }
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid endDate format" },
          { status: 400 }
        );
      }
    }

    // Check for overlapping bookings (excluding current booking)
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : existingBooking.startDate;
      const end = endDate ? new Date(endDate) : existingBooking.endDate;

      const overlappingBooking = await BookingOtherService.findOne({
        _id: { $ne: id },
        serviceId: existingBooking.serviceId,
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
    }

    // Build update object
    const updateData = {};
    if (bookingType !== undefined) updateData.bookingType = bookingType;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (additionalServices !== undefined) updateData.additionalServices = additionalServices;
    if (servicePriceDetails !== undefined) updateData.servicePriceDetails = servicePriceDetails;
    if (additionalServiceCosts !== undefined) updateData.additionalServiceCosts = additionalServiceCosts;
    if (totalPrice !== undefined) updateData.totalPrice = totalPrice;
    if (numberOfHours !== undefined) updateData.numberOfHours = numberOfHours;
    if (bookingStatus !== undefined) updateData.bookingStatus = bookingStatus;
    if (paymentId !== undefined) updateData.paymentId = paymentId;

    // Update the booking
    const updatedBooking = await BookingOtherService.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
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

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, message: "Failed to update other service booking" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: updatedBooking,
        message: "Other service booking updated successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating other service booking:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update other service booking" 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific other service booking
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await BookingOtherService.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Other service booking not found" },
        { status: 404 }
      );
    }

    // Check if booking can be cancelled (only pending or confirmed bookings)
    if (booking.bookingStatus === 'completed') {
      return NextResponse.json(
        { success: false, message: "Cannot delete completed bookings" },
        { status: 400 }
      );
    }

    await BookingOtherService.findByIdAndDelete(id);

    return NextResponse.json(
      { 
        success: true, 
        message: "Other service booking deleted successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting other service booking:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete other service booking" 
      },
      { status: 500 }
    );
  }
}
