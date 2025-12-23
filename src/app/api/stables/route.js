/**
 * @swagger
 * tags:
 *   - name: Stables
 *     description: Stable listings and booking slots
 *
 * /api/stables:
 *   get:
 *     summary: List stables
 *     tags: [Stables]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter stables by owning user id
 *     responses:
 *       200:
 *         description: List of stables with subscription status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Stable'
 *                   - type: object
 *                     properties:
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           subscriptionStatus:
 *                             type: string
 *                             enum: [active, expired]
 *                           subscriptionExpiry:
 *                             type: string
 *                             format: date-time
 *   post:
 *     summary: Create a stable
 *     tags: [Stables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StableInput'
 *     responses:
 *       201:
 *         description: Stable created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stable'
 *       400:
 *         description: Validation error
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Stable from "@/models/Stables";
import "@/models/User";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const query = {};
    if (userId) query.userId = userId;
    const stables = await Stable.find(query).populate({ path: "userId", select: "firstName lastName email subscriptionExpiry subscriptionStatus accountType" });
    
    // Add status to each stable's userId field and filter only active sellers
    const stablesWithStatus = stables.map(stable => {
      if (stable.userId) {
        // Check if user is superAdmin - always active
        if (stable.userId.accountType === "superAdmin") {
          return {
            ...stable.toObject(),
            userId: {
              ...stable.userId.toObject(),
              status: "active"
            }
          };
        }
        
        // Check subscription status based on subscriptionExpiry for other account types
        const now = new Date();
        let status = "expired"; // Default to expired
        
        if (stable.userId.subscriptionExpiry) {
          const expiryDate = new Date(stable.userId.subscriptionExpiry);
          status = now < expiryDate ? "active" : "expired";
        }
        
        return {
          ...stable.toObject(),
          userId: {
            ...stable.userId.toObject(),
            status: status
          }
        };
      }
      return stable;
    }).filter(stable => {
      // Only return stables where userId exists and status is active
      return stable.userId && stable.userId.status === "active";
    });
    
    return NextResponse.json(stablesWithStatus, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch stables";
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
      userId, Tittle, Deatils, location, coordinates, image, Rating, noofRatingCustomers, 
      PriceRate, Slotes, status, sponsoredType, shortTermStay, longTermStay, stallionsAccepted, 
      stallionsPrice, eventPricing, specialFacilities 
    } = body || {};

    if (!userId || !Tittle || !Deatils) {
      return NextResponse.json({ message: "userId, Tittle, Deatils are required" }, { status: 400 });
    }
 
    const normalizedSlotes = typeof Slotes === "string" ? JSON.parse(Slotes) : Slotes;
    const normalizedPriceRate = typeof PriceRate === "string" ? JSON.parse(PriceRate) : PriceRate;

    const stable = await Stable.create({
      userId,
      Tittle: String(Tittle).trim(),
      Deatils: String(Deatils).trim(),
      location: location ? String(location).trim() : "",
      coordinates: coordinates || null,
      image: Array.isArray(image) ? image : image ? [image] : [],
      Rating: Rating === undefined ? undefined : Number(Rating),
      noofRatingCustomers: noofRatingCustomers === undefined ? undefined : Number(noofRatingCustomers),
      status: status || "active",
      sponsoredType: sponsoredType || "normal",
      PriceRate: Array.isArray(normalizedPriceRate)
        ? normalizedPriceRate.map(s => ({
            PriceRate: Number(s?.PriceRate),
            RateType: String(s?.RateType),
          }))
        : normalizedPriceRate && typeof normalizedPriceRate === "object"
          ? [{
              PriceRate: Number(normalizedPriceRate?.PriceRate),
              RateType: String(normalizedPriceRate?.RateType),
            }]
          : [],
      Slotes: Array.isArray(normalizedSlotes) ? normalizedSlotes.map(s => ({
        date: String(s?.date),
        startTime: String(s?.startTime),
        endTime: String(s?.endTime),
      })) : [],
      // New fields
      shortTermStay: shortTermStay || {},
      longTermStay: longTermStay || {},
      stallionsAccepted: Boolean(stallionsAccepted),
      stallionsPrice: stallionsPrice ? Number(stallionsPrice) : null,
      eventPricing: eventPricing || {},
      specialFacilities: specialFacilities || {}
    });

    return NextResponse.json(stable, { status: 201 });
  } catch (error) {
    const message = error?.message || "Failed to create stable";
    return NextResponse.json({ message }, { status: 400 });
  }
}