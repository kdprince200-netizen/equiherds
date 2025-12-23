/**
 * @swagger
 * tags:
 *   - name: Equipments
 *     description: Equipment marketplace listings
 *
 * /api/equipments:
 *   get:
 *     summary: List equipment marketplace listings
 *     tags: [Equipments]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter equipments by owning user id
 *     responses:
 *       200:
 *         description: List of equipment marketplace listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 *   post:
 *     summary: Create an equipment marketplace listing
 *     tags: [Equipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productName
 *               - price
 *               - mainCategory
 *               - subcategory
 *               - subSubcategory
 *             properties:
 *               userId:
 *                 type: string
 *               productName:
 *                 type: string
 *               price:
 *                 type: number
 *               discount:
 *                 type: number
 *               deliveryCharges:
 *                 type: number
 *               noOfDaysDelivery:
 *                 type: number
 *               details:
 *                 type: string
 *               mainCategory:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               subSubcategory:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Equipment marketplace listing created
 *       400:
 *         description: Validation error
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Equipment from "@/models/Equipment";
import "@/models/User";
import mongoose from "mongoose";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const query = {};
    if (userId) {
      // Convert userId to ObjectId if it's a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query.userId = new mongoose.Types.ObjectId(userId);
      } else {
        query.userId = userId;
      }
    }
    const equipments = await Equipment.find(query).populate({ 
      path: "userId", 
      select: "firstName lastName email subscriptionExpiry accountType" 
    });
    
    console.log("Total equipments found:", equipments.length);
    
    // If userId is provided (user viewing their own equipment), return all without filtering
    if (userId) {
      const mappedEquipments = equipments.map(equipment => ({
        ...equipment.toObject()
      }));
      console.log("Returning user's equipments:", mappedEquipments.length);
      return NextResponse.json(mappedEquipments, { status: 200 });
    }
    
    // For public listings (no userId), filter only active sellers AND active equipment
    console.log("Filtering public equipments, total:", equipments.length);
    
    // First, filter by equipment status
    const activeEquipments = equipments.filter(equipment => {
      const equipmentStatus = equipment.status || "active";
      return equipmentStatus === "active";
    });
    console.log("Active equipments (by status):", activeEquipments.length);
    
    // Then check user subscription status
    const equipmentsWithStatus = activeEquipments.map(equipment => {
      if (equipment.userId) {
        // Check if user is superAdmin - always active
        if (equipment.userId.accountType === "superAdmin") {
          return {
            ...equipment.toObject(),
            userId: {
              ...equipment.userId.toObject(),
              status: "active"
            }
          };
        }
        
        // Check subscription status based on subscriptionExpiry for other account types
        const now = new Date();
        let status = "active"; // Default to active (show by default)
        
        if (equipment.userId.subscriptionExpiry) {
          const expiryDate = new Date(equipment.userId.subscriptionExpiry);
          status = now < expiryDate ? "active" : "expired";
        } else {
          // If no subscriptionExpiry, assume active (might have lifetime subscription or other model)
          status = "active";
        }
        
        return {
          ...equipment.toObject(),
          userId: {
            ...equipment.userId.toObject(),
            status: status
          }
        };
      }
      // If no userId, still return the equipment (might be from system or deleted user)
      return {
        ...equipment.toObject(),
        userId: null
      };
    });
    
    console.log("Equipments with status mapped:", equipmentsWithStatus.length);
    
    // Filter by user subscription status
    const finalEquipments = equipmentsWithStatus.filter(equipment => {
      // Only return equipments where userId exists and status is active, OR equipment has no userId (show it anyway)
      if (!equipment.userId) {
        return true; // Show equipment even if userId is missing
      }
      return equipment.userId.status === "active";
    });
    
    console.log("Final filtered equipments:", finalEquipments.length);
    
    return NextResponse.json(finalEquipments, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch equipment marketplace listings";
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function parseBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return req.json();
  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const form = await req.formData();
    const data = {};
    for (const [key, value] of form.entries()) data[key] = typeof value === "string" ? value : value.name || "";
    return data;
  }
  const raw = await req.text();
  return raw ? JSON.parse(raw) : {};
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await parseBody(req);
    const {
      userId,
      productName,
      price,
      discount,
      deliveryCharges,
      noOfDaysDelivery,
      totalStock,
      details,
      mainCategory,
      subcategory,
      subSubcategory,
      category,
      photos,
      status,
      sponsoredType
    } = body || {};

    // Validate required fields
    if (!userId || !productName || !price || !mainCategory || !subcategory || !subSubcategory) {
      return NextResponse.json({ 
        message: "Missing required fields: userId, productName, price, mainCategory, subcategory, and subSubcategory are required" 
      }, { status: 400 });
    }

    // Validate price
    if (isNaN(price) || Number(price) < 0) {
      return NextResponse.json({ 
        message: "Price must be a valid positive number" 
      }, { status: 400 });
    }

    // Validate discount if provided
    if (discount !== undefined && discount !== null && discount !== "") {
      const discountNum = Number(discount);
      if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
        return NextResponse.json({ 
          message: "Discount must be a number between 0 and 100" 
        }, { status: 400 });
      }
    }

    // Validate total stock if provided
    if (totalStock !== undefined && totalStock !== null && totalStock !== "") {
      const totalStockNum = Number(totalStock);
      if (isNaN(totalStockNum) || totalStockNum < 0) {
        return NextResponse.json({ 
          message: "Total stock must be a valid non-negative number" 
        }, { status: 400 });
      }
    }

    const equipment = await Equipment.create({
      userId,
      productName: String(productName).trim(),
      price: Number(price),
      discount: discount !== undefined && discount !== null && discount !== "" ? Number(discount) : 0,
      deliveryCharges: deliveryCharges !== undefined && deliveryCharges !== null && deliveryCharges !== "" ? Number(deliveryCharges) : 0,
      noOfDaysDelivery: noOfDaysDelivery !== undefined && noOfDaysDelivery !== null && noOfDaysDelivery !== "" ? Number(noOfDaysDelivery) : 0,
      totalStock: totalStock !== undefined && totalStock !== null && totalStock !== "" ? Number(totalStock) : 0,
      details: details ? String(details).trim() : "",
      mainCategory: String(mainCategory).trim(),
      subcategory: String(subcategory).trim(),
      subSubcategory: String(subSubcategory).trim(),
      category: category ? String(category).trim() : (subSubcategory || subcategory || mainCategory),
      photos: Array.isArray(photos) ? photos.filter(url => url && url.trim()) : [],
      status: status || "active",
      sponsoredType: sponsoredType || "normal"
    });

    // Populate the userId field before returning
    const populatedEquipment = await Equipment.findById(equipment._id).populate({ 
      path: "userId", 
      select: "firstName lastName email" 
    });

    return NextResponse.json(populatedEquipment, { status: 201 });
  } catch (error) {
    console.error('Equipment creation error:', error);
    const message = error?.message || "Failed to create equipment marketplace listing";
    return NextResponse.json({ message }, { status: 400 });
  }
}

