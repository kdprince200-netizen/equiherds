/**
 * @swagger
 * /api/bookingHorses/{id}:
 *   get:
 *     summary: Get a horse appointment booking by id
 *     tags: [BookingHorses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Booking found
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a horse appointment booking by id
 *     tags: [BookingHorses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Updated booking
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a horse appointment booking by id
 *     tags: [BookingHorses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BookingHorse from "@/models/BookingHourse";
import HorseMarket from "@/models/HorseMarket";
import User from "@/models/User";
import mongoose from "mongoose";

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await req.json();
  }
  return {};
}

export async function GET(_req, { params }) {
  await connectDB();
  try {
    // Ensure models are registered
    if (!mongoose.models.HorseMarket) {
      await import("@/models/HorseMarket");
    }
    if (!mongoose.models.User) {
      await import("@/models/User");
    }
    
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await BookingHorse.findById(id)
      .populate("horseId", "horseName breed photos askingPrice")
      .populate("sellerId", "firstName lastName email")
      .populate("userId", "firstName lastName email");

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
    const { appointmentDate, visitTime, quotationAmount, status, reason } = body;

    const booking = await BookingHorse.findById(id);
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    if (appointmentDate) {
      const appointment = new Date(appointmentDate);
      if (isNaN(appointment.getTime())) {
        return NextResponse.json({ success: false, message: "Invalid appointmentDate format" }, { status: 400 });
      }
      booking.appointmentDate = appointment;
    }

    if (visitTime !== undefined) booking.visitTime = visitTime;
    if (quotationAmount !== undefined) {
      if (typeof quotationAmount !== "number" || quotationAmount < 0) {
        return NextResponse.json({ success: false, message: "Invalid quotationAmount" }, { status: 400 });
      }
      booking.quotationAmount = quotationAmount;
    }

    if (status !== undefined) {
      booking.status = status;
    }

    if (reason !== undefined) {
      booking.reason = reason;
    }

    await booking.save();

    // Ensure models are registered before populate
    if (!mongoose.models.HorseMarket) {
      await import("@/models/HorseMarket");
    }
    if (!mongoose.models.User) {
      await import("@/models/User");
    }

    const updatedBooking = await BookingHorse.findById(id)
      .populate("horseId", "horseName breed photos askingPrice")
      .populate("sellerId", "firstName lastName email")
      .populate("userId", "firstName lastName email");

    return NextResponse.json({ success: true, message: "Booking updated successfully", data: updatedBooking }, { status: 200 });
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

    const booking = await BookingHorse.findByIdAndDelete(id);
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

