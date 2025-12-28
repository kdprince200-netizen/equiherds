import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BookingEquipment from "@/models/BookingEquipment";
import mongoose from "mongoose";

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      return await req.json();
    }
    const raw = await req.text();
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    throw new Error("Invalid request body. Ensure valid JSON.");
  }
}

export async function GET(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await BookingEquipment.findById(id)
      .populate("customerId", "firstName lastName email phoneNumber")
      .populate("sellerId", "firstName lastName email phoneNumber")
      .populate("equipmentId", "productName price discount deliveryCharges photos");

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
    }

    const body = await parseRequestBody(req);
    const { bookingStatus, reason } = body;

    const booking = await BookingEquipment.findById(id);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    if (bookingStatus !== undefined) {
      if (!["pending", "confirmed", "cancelled", "completed"].includes(bookingStatus)) {
        return NextResponse.json(
          { success: false, message: "Invalid bookingStatus. Must be one of: pending, confirmed, cancelled, completed" },
          { status: 400 }
        );
      }
      booking.bookingStatus = bookingStatus;
    }

    if (reason !== undefined) {
      booking.reason = reason;
    }

    await booking.save();

    const updatedBooking = await BookingEquipment.findById(id)
      .populate("customerId", "firstName lastName email phoneNumber")
      .populate("sellerId", "firstName lastName email phoneNumber")
      .populate("equipmentId", "productName price discount deliveryCharges photos");

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await BookingEquipment.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Booking deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete booking" },
      { status: 500 }
    );
  }
}

