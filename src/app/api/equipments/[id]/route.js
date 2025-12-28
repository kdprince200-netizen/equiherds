/**
 * @swagger
 * /api/equipments/{id}:
 *   get:
 *     summary: Get an equipment marketplace listing by id
 *     tags: [Equipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Equipment marketplace listing found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipment'
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update an equipment marketplace listing by id
 *     tags: [Equipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated equipment marketplace listing
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete an equipment marketplace listing by id
 *     tags: [Equipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Equipment from "@/models/Equipment";
import "@/models/User";

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

export async function GET(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const equipment = await Equipment.findById(id).populate({ 
      path: "userId", 
      select: "firstName lastName email" 
    });
    if (!equipment) return NextResponse.json({ message: "Equipment marketplace listing not found" }, { status: 404 });
    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch equipment marketplace listing";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
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

    const update = {};

    // Update fields only if they are provided
    if (userId !== undefined) update.userId = userId;
    if (productName !== undefined) update.productName = String(productName).trim();
    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0) {
        return NextResponse.json({ 
          message: "Price must be a valid positive number" 
        }, { status: 400 });
      }
      update.price = Number(price);
    }
    if (discount !== undefined) {
      if (discount !== null && discount !== "") {
        const discountNum = Number(discount);
        if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
          return NextResponse.json({ 
            message: "Discount must be a number between 0 and 100" 
          }, { status: 400 });
        }
        update.discount = discountNum;
      } else {
        update.discount = 0;
      }
    }
    if (deliveryCharges !== undefined) {
      update.deliveryCharges = deliveryCharges !== null && deliveryCharges !== "" ? Number(deliveryCharges) : 0;
    }
    if (noOfDaysDelivery !== undefined) {
      update.noOfDaysDelivery = noOfDaysDelivery !== null && noOfDaysDelivery !== "" ? Number(noOfDaysDelivery) : 0;
    }
    if (totalStock !== undefined) {
      if (totalStock !== null && totalStock !== "") {
        const totalStockNum = Number(totalStock);
        if (isNaN(totalStockNum) || totalStockNum < 0) {
          return NextResponse.json({ 
            message: "Total stock must be a valid non-negative number" 
          }, { status: 400 });
        }
        update.totalStock = totalStockNum;
      } else {
        update.totalStock = 0;
      }
    }
    if (details !== undefined) update.details = details ? String(details).trim() : "";
    if (mainCategory !== undefined) update.mainCategory = String(mainCategory).trim();
    if (subcategory !== undefined) update.subcategory = String(subcategory).trim();
    if (subSubcategory !== undefined) update.subSubcategory = String(subSubcategory).trim();
    if (category !== undefined) {
      update.category = category ? String(category).trim() : (update.subSubcategory || update.subcategory || update.mainCategory || "");
    }
    if (photos !== undefined) update.photos = Array.isArray(photos) ? photos.filter(url => url && url.trim()) : [];
    if (status !== undefined) update.status = status;
    if (sponsoredType !== undefined) update.sponsoredType = sponsoredType;

    const equipment = await Equipment.findByIdAndUpdate(id, update, { 
      new: true, 
      runValidators: true 
    }).populate({ 
      path: "userId", 
      select: "firstName lastName email" 
    });
    
    if (!equipment) return NextResponse.json({ message: "Equipment marketplace listing not found" }, { status: 404 });
    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error('Equipment update error:', error);
    const message = error?.message || "Failed to update equipment marketplace listing";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const result = await Equipment.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ message: "Equipment marketplace listing not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error?.message || "Failed to delete equipment marketplace listing";
    return NextResponse.json({ message }, { status: 400 });
  }
}


