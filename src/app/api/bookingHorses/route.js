/**
 * @swagger
 * tags:
 *   - name: BookingHorses
 *     description: Horse appointment booking management
 *
 * /api/bookingHorses:
 *   get:
 *     summary: Get all horse appointment bookings with optional filters
 *     tags: [BookingHorses]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter bookings by user ID
 *       - in: query
 *         name: horseId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter bookings by horse ID
 *       - in: query
 *         name: sellerId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter bookings by seller ID
 *       - in: query
 *         name: appointmentDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter bookings by appointment date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of bookings
 *   post:
 *     summary: Create a new horse appointment booking
 *     tags: [BookingHorses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - horseId
 *               - sellerId
 *               - userId
 *               - appointmentDate
 *               - visitTime
 *               - quotationAmount
 *             properties:
 *               horseId:
 *                 type: string
 *               sellerId:
 *                 type: string
 *               userId:
 *                 type: string
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *               visitTime:
 *                 type: string
 *               quotationAmount:
 *                 type: number
 *               status:
 *                 type: string
 *                 description: Optional booking status (e.g., "pending", "approved", "rejected")
 *               reason:
 *                 type: string
 *                 description: Optional reason for status change
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Horse or user not found
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// CRITICAL: Import HorseMarket and User FIRST to ensure they're registered
// BEFORE BookingHorse schema tries to reference them
import HorseMarket from "@/models/HorseMarket";
import User from "@/models/User";

// Now import BookingHorse - it references HorseMarket and User
import BookingHorse from "@/models/BookingHourse";

// Force model registration - ensure models are registered with correct names
const _ensureModelsRegistered = async () => {
  // The models should be registered via imports, but we verify
  // If not registered, we need to ensure they are before populate operations
  
  // Check and ensure HorseMarket is registered
  if (!mongoose.models.HorseMarket) {
    // Model not registered - this shouldn't happen if import worked
    // But as fallback, try to access it to trigger registration
    try {
      // The import should have registered it, but if not, access it
      if (HorseMarket) {
        // Model exists, just ensure it's registered
        // Accessing the model should trigger registration
        const modelName = HorseMarket.modelName || "HorseMarket";
        if (modelName && !mongoose.models[modelName]) {
          // Force registration by getting schema
          const schema = HorseMarket.schema;
          if (schema) {
            mongoose.model("HorseMarket", schema);
          }
        }
      }
    } catch (e) {
      console.error("Error registering HorseMarket:", e);
      // Last resort: dynamic import
      try {
        await import("@/models/HorseMarket");
      } catch (importError) {
        console.error("Failed to import HorseMarket:", importError);
      }
    }
  }
  
  // Ensure User model is registered
  if (!mongoose.models.User) {
    try {
      if (User) {
        const modelName = User.modelName || "User";
        if (modelName && !mongoose.models[modelName]) {
          const schema = User.schema;
          if (schema) {
            mongoose.model("User", schema);
          }
        }
      }
    } catch (e) {
      console.error("Error registering User:", e);
      try {
        await import("@/models/User");
      } catch (importError) {
        console.error("Failed to import User:", importError);
      }
    }
  }
};

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await req.json();
  }
  return {};
}

export async function GET(req) {
  await connectDB();
  try {
    await _ensureModelsRegistered();
    
    // Verify models are registered
    if (!mongoose.models.HorseMarket || !mongoose.models.User) {
      console.error("Models not registered in GET request");
      console.log("Available models:", Object.keys(mongoose.models));
    }
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const horseId = searchParams.get("horseId");
    const sellerId = searchParams.get("sellerId");
    const appointmentDate = searchParams.get("appointmentDate");

    const filter = {};
    if (userId) filter.userId = userId;
    if (horseId) filter.horseId = horseId;
    if (sellerId) filter.sellerId = sellerId;
    if (appointmentDate) {
      const date = new Date(appointmentDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      filter.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // CRITICAL: Verify models are registered before populate
    // The error "HourseMarket" suggests mongoose is looking for wrong model name
    // Ensure HorseMarket is registered with correct name
    if (!mongoose.models.HorseMarket) {
      console.error("HorseMarket not registered! Available models:", Object.keys(mongoose.models));
      // The model should be registered via import, but if not, we need to handle it
      // Try to access the model to trigger registration
      try {
        // Accessing the model should trigger its registration
        const modelName = HorseMarket?.modelName;
        if (!modelName || modelName !== "HorseMarket") {
          console.error("HorseMarket model name mismatch:", modelName);
        }
      } catch (e) {
        console.error("Error accessing HorseMarket model:", e);
      }
    }

    // Try to populate, but if it fails due to model registration, return without populate
    let bookings;
    try {
      bookings = await BookingHorse.find(filter)
        .populate("horseId", "horseName breed photos askingPrice")
        .populate("sellerId", "firstName lastName email")
        .populate("userId", "firstName lastName email")
        .sort({ appointmentDate: -1, createdAt: -1 });
    } catch (populateError) {
      console.error("Error during populate in GET:", populateError);
      // If populate fails, return bookings without populated data
      bookings = await BookingHorse.find(filter)
        .sort({ appointmentDate: -1, createdAt: -1 });
      // Return with warning
      return NextResponse.json({ 
        success: true, 
        data: bookings,
        warning: "Bookings retrieved but related data could not be populated due to model registration issue"
      }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching horse bookings:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDB();
  try {
    // CRITICAL: Ensure models are registered BEFORE any operations
    await _ensureModelsRegistered();
    
    // Final verification - log if still not registered
    if (!mongoose.models.HorseMarket) {
      console.error("CRITICAL ERROR: HorseMarket model still not registered after all attempts!");
      console.log("Available mongoose models:", Object.keys(mongoose.models));
      console.log("HorseMarket import:", HorseMarket);
      // Return error instead of continuing
      return NextResponse.json(
        { success: false, message: "Internal server error: HorseMarket model not registered. Please restart the server." },
        { status: 500 }
      );
    }
    
    const body = await parseRequestBody(req);

    const {
      horseId,
      sellerId,
      userId,
      appointmentDate,
      visitTime,
      quotationAmount,
      status,
      reason
    } = body;

    // Validate required fields
    if (!horseId || !sellerId || !userId || !appointmentDate || !visitTime || quotationAmount === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: horseId, sellerId, userId, appointmentDate, visitTime, quotationAmount" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(horseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid horseId format" },
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid sellerId format" },
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId format" },
        { status: 400 }
      );
    }

    // Validate quotationAmount
    if (typeof quotationAmount !== "number" || quotationAmount < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid quotationAmount. Must be a non-negative number" },
        { status: 400 }
      );
    }

    // Validate appointment date
    const appointment = new Date(appointmentDate);
    if (isNaN(appointment.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid appointmentDate format" },
        { status: 400 }
      );
    }

    if (appointment < new Date()) {
      return NextResponse.json(
        { success: false, message: "Appointment date cannot be in the past" },
        { status: 400 }
      );
    }

    // Check if horse exists
    const horse = await HorseMarket.findById(horseId);
    if (!horse) {
      return NextResponse.json(
        { success: false, message: "Horse not found" },
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

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Multiple appointments are allowed for the same horse on the same date and time
    // No duplicate check needed - sellers can have multiple buyers interested in the same time slot

    // Create new booking
    const booking = new BookingHorse({
      horseId,
      sellerId,
      userId,
      appointmentDate: appointment,
      visitTime,
      quotationAmount,
      ...(status && { status }),
      ...(reason && { reason })
    });

    await booking.save();

    // CRITICAL: Ensure models are registered before populate (one more check)
    await _ensureModelsRegistered();
    
    // Final check before populate - if still not registered, return error
    if (!mongoose.models.HorseMarket || !mongoose.models.User) {
      console.error("Models not registered before populate!");
      console.log("HorseMarket registered:", !!mongoose.models.HorseMarket);
      console.log("User registered:", !!mongoose.models.User);
      // Return the booking without populate rather than failing
      return NextResponse.json(
        { 
          success: true, 
          message: "Appointment booked successfully", 
          data: booking,
          warning: "Some data could not be populated due to model registration issue"
        },
        { status: 201 }
      );
    }

    // Final check - ensure models are registered before populate
    // If HorseMarket is not registered, return booking without populate to avoid error
    if (!mongoose.models.HorseMarket || !mongoose.models.User) {
      console.error("Models not registered! HorseMarket:", !!mongoose.models.HorseMarket, "User:", !!mongoose.models.User);
      console.log("All registered models:", Object.keys(mongoose.models));
      
      // Return booking without populate to avoid the error
      // The booking is still created successfully
      return NextResponse.json(
        { 
          success: true, 
          message: "Appointment booked successfully", 
          data: {
            _id: booking._id,
            horseId: booking.horseId,
            sellerId: booking.sellerId,
            userId: booking.userId,
            appointmentDate: booking.appointmentDate,
            visitTime: booking.visitTime,
            quotationAmount: booking.quotationAmount,
            status: booking.status,
            reason: booking.reason,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
          },
          note: "Booking created successfully. Some related data could not be populated due to model registration."
        },
        { status: 201 }
      );
    }

    // Populate and return
    try {
      const populatedBooking = await BookingHorse.findById(booking._id)
        .populate("horseId", "horseName breed photos askingPrice")
        .populate("sellerId", "firstName lastName email")
        .populate("userId", "firstName lastName email");
      
      return NextResponse.json(
        { success: true, message: "Appointment booked successfully", data: populatedBooking },
        { status: 201 }
      );
    } catch (populateError) {
      console.error("Error during populate:", populateError);
      // If populate fails, still return success with unpopulated data
      return NextResponse.json(
        { 
          success: true, 
          message: "Appointment booked successfully", 
          data: {
            _id: booking._id,
            horseId: booking.horseId,
            sellerId: booking.sellerId,
            userId: booking.userId,
            appointmentDate: booking.appointmentDate,
            visitTime: booking.visitTime,
            quotationAmount: booking.quotationAmount,
            status: booking.status,
            reason: booking.reason,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
          },
          warning: "Booking created but could not populate related data"
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating horse booking:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

