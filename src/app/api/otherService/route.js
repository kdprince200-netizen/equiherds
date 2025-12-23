import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OtherService from "@/models/OtherService";
import "@/models/User";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const query = {};
    if (userId) query.userId = userId;
    const list = await OtherService.find(query).populate({ path: "userId", select: "firstName lastName email subscriptionExpiry accountType" });
    
    // Add status to each otherService's userId field and filter only active sellers
    const listWithStatus = list.map(service => {
      if (service.userId) {
        // Check if user is superAdmin - always active
        if (service.userId.accountType === "superAdmin") {
          return {
            ...service.toObject(),
            userId: {
              ...service.userId.toObject(),
              status: "active"
            }
          };
        }
        
        // Check subscription status based on subscriptionExpiry for other account types
        const now = new Date();
        let status = "expired"; // Default to expired
        
        if (service.userId.subscriptionExpiry) {
          const expiryDate = new Date(service.userId.subscriptionExpiry);
          status = now < expiryDate ? "active" : "expired";
        }
        
        return {
          ...service.toObject(),
          userId: {
            ...service.userId.toObject(),
            status: status
          }
        };
      }
      return service;
    }).filter(service => {
      // Only return services where userId exists and status is active
      return service.userId && service.userId.status === "active";
    });
    
    return NextResponse.json(listWithStatus, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch other services";
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
      title,
      details,
      serviceType,
      pricePerHour,
      experience,
      degree,
      schedule,
      images,
      status,
      location,
      coordinates,
      serviceOptions
    } = body || {};

    if (!userId || !title || !details || !serviceType || pricePerHour === undefined || !experience || !location || !coordinates) {
      return NextResponse.json({
        message: "userId, title, details, serviceType, pricePerHour, experience, location, and coordinates are required"
      }, { status: 400 });
    }

    if (!coordinates.lat || !coordinates.lng) {
      return NextResponse.json({ message: "coordinates must have lat and lng properties" }, { status: 400 });
    }

    let normalizedSchedule = [];
    if (Array.isArray(schedule)) normalizedSchedule = schedule;
    else if (typeof schedule === "string") {
      try {
        const parsed = JSON.parse(schedule);
        normalizedSchedule = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return NextResponse.json({ message: "Invalid schedule format" }, { status: 400 });
      }
    } else if (schedule && typeof schedule === "object") normalizedSchedule = [schedule];

    if (normalizedSchedule.length === 0) {
      return NextResponse.json({ message: "At least one schedule slot is required" }, { status: 400 });
    }
    for (const slot of normalizedSchedule) {
      if (!slot?.day || !slot?.startTime || !slot?.endTime) {
        return NextResponse.json({ message: "Each schedule slot must have day, startTime, and endTime properties" }, { status: 400 });
      }
    }

    // normalize serviceOptions: ensure object of key->number|null
    let normalizedOptions = undefined;
    if (serviceOptions !== undefined) {
      try {
        const obj = typeof serviceOptions === 'string' ? JSON.parse(serviceOptions) : serviceOptions;
        if (obj && typeof obj === 'object') {
          normalizedOptions = {};
          for (const [k, v] of Object.entries(obj)) {
            const num = v === null || v === '' || v === undefined ? null : Number(v);
            normalizedOptions[k] = num === null || Number.isNaN(num) ? null : num;
          }
        }
      } catch (_) {
        normalizedOptions = undefined;
      }
    }

    const created = await OtherService.create({
      userId,
      title: String(title).trim(),
      details: String(details).trim(),
      serviceType: String(serviceType).trim(),
      pricePerHour: Number(pricePerHour),
      experience: String(experience).trim(),
      degree: degree ? String(degree).trim() : undefined,
      schedule: normalizedSchedule.map(slot => ({
        day: String(slot.day).trim(),
        startTime: String(slot.startTime).trim(),
        endTime: String(slot.endTime).trim(),
      })),
      images: Array.isArray(images) ? images.filter(i => i && i.trim()) : images ? [String(images).trim()] : [],
      status: status || "active",
      location: String(location).trim(),
      coordinates: { lat: Number(coordinates.lat), lng: Number(coordinates.lng) },
      serviceOptions: normalizedOptions
    });

    const populated = await OtherService.findById(created._id).populate({ path: "userId", select: "firstName lastName email" });
    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    const message = error?.message || "Failed to create other service";
    return NextResponse.json({ message }, { status: 400 });
  }
}


