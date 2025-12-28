/**
 * @swagger
 * tags:
 *   - name: BookingEquipments
 *     description: Equipment booking management
 *
 * /api/bookingEquipments:
 *   get:
 *     summary: Get all equipment bookings with optional filters
 *     tags: [BookingEquipments]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter bookings by customer ID
 *       - in: query
 *         name: sellerId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter bookings by seller ID
 *       - in: query
 *         name: equipmentId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter bookings by equipment ID
 *   post:
 *     summary: Create a new equipment booking
 *     tags: [BookingEquipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - equipmentId
 *               - customerId
 *               - sellerId
 *               - quantity
 *               - bookingDate
 *               - totalPrice
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BookingEquipment from "@/models/BookingEquipment";
import User from "@/models/User";
import Equipment from "@/models/Equipment";
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

// GET - Get all equipment bookings
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const sellerId = searchParams.get("sellerId");
    const equipmentId = searchParams.get("equipmentId");

    let query = {};
    
    if (customerId) {
      query.customerId = customerId;
    }
    
    if (sellerId) {
      query.sellerId = sellerId;
    }
    
    if (equipmentId) {
      query.equipmentId = equipmentId;
    }

    const bookings = await BookingEquipment.find(query)
      .populate("customerId", "firstName lastName email phoneNumber")
      .populate("sellerId", "firstName lastName email phoneNumber")
      .populate("equipmentId", "productName price discount deliveryCharges photos")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: bookings
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching equipment bookings:', error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch equipment bookings" },
      { status: 500 }
    );
  }
}

// POST - Create a new equipment booking
export async function POST(req) {
  await connectDB();
  try {
    const body = await parseRequestBody(req);
    const {
      equipmentId,
      customerId,
      sellerId,
      quantity,
      bookingDate,
      unitPrice,
      discount = 0,
      deliveryCharges = 0,
      totalPrice,
      paymentId,
      bookingStatus = "pending",
      reason,
      address,
      zipCode,
      country,
      description
    } = body;

    // Validate required fields
    if (!equipmentId || !customerId || !sellerId || !quantity || !bookingDate || !totalPrice) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: equipmentId, customerId, sellerId, quantity, bookingDate, totalPrice" },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Validate dates
    const bookingDateObj = new Date(bookingDate);
    if (isNaN(bookingDateObj.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid booking date format" },
        { status: 400 }
      );
    }

    // Validate price
    if (totalPrice < 0) {
      return NextResponse.json(
        { success: false, message: "Total price must be non-negative" },
        { status: 400 }
      );
    }

    // Check if equipment exists
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return NextResponse.json(
        { success: false, message: "Equipment not found" },
        { status: 404 }
      );
    }

    // Check if customer exists
    const customer = await User.findById(customerId);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    // Check if seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    // Create booking
    const booking = new BookingEquipment({
      equipmentId,
      customerId,
      sellerId,
      quantity,
      bookingDate: bookingDateObj,
      unitPrice: unitPrice || equipment.price,
      discount: discount || equipment.discount || 0,
      deliveryCharges: deliveryCharges || equipment.deliveryCharges || 0,
      totalPrice,
      paymentId,
      bookingStatus,
      reason,
      address: body.address || "",
      zipCode: body.zipCode || "",
      country: body.country || "",
      description: body.description || ""
    });

    await booking.save();

    // Populate the booking before returning
    await booking.populate("customerId", "firstName lastName email");
    await booking.populate("sellerId", "firstName lastName email");
    await booking.populate("equipmentId", "productName price photos");

    return NextResponse.json({
      success: true,
      message: "Equipment booking created successfully",
      data: booking
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating equipment booking:', error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create equipment booking" },
      { status: 500 }
    );
  }
}

