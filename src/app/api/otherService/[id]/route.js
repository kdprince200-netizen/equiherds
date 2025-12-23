import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OtherService from "@/models/OtherService";
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
    const item = await OtherService.findById(id).populate({ path: "userId", select: "firstName lastName email" });
    if (!item) return NextResponse.json({ message: "Other service not found" }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch other service";
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

    // Validate coordinates if provided
    if (coordinates !== undefined) {
      if (!coordinates.lat || !coordinates.lng) {
        return NextResponse.json({ message: "coordinates must have lat and lng properties" }, { status: 400 });
      }
    }

    // Normalize schedule if provided
    let normalizedSchedule = undefined;
    if (schedule !== undefined) {
      if (Array.isArray(schedule)) normalizedSchedule = schedule;
      else if (typeof schedule === "string") {
        try {
          const parsed = JSON.parse(schedule);
          normalizedSchedule = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          return NextResponse.json({ message: "Invalid schedule format" }, { status: 400 });
        }
      } else if (schedule && typeof schedule === "object") normalizedSchedule = [schedule];

      if (normalizedSchedule && normalizedSchedule.length > 0) {
        for (const slot of normalizedSchedule) {
          if (!slot?.day || !slot?.startTime || !slot?.endTime) {
            return NextResponse.json({ message: "Each schedule slot must have day, startTime, and endTime properties" }, { status: 400 });
          }
        }
      }
    }

    const update = {};
    if (userId !== undefined) update.userId = userId;
    if (title !== undefined) update.title = String(title).trim();
    if (details !== undefined) update.details = String(details).trim();
    if (serviceType !== undefined) update.serviceType = String(serviceType).trim();
    if (pricePerHour !== undefined) update.pricePerHour = Number(pricePerHour);
    if (experience !== undefined) update.experience = String(experience).trim();
    if (degree !== undefined) update.degree = String(degree).trim();
    if (normalizedSchedule !== undefined) {
      update.schedule = normalizedSchedule.map(slot => ({
        day: String(slot.day).trim(),
        startTime: String(slot.startTime).trim(),
        endTime: String(slot.endTime).trim(),
      }));
    }
    if (images !== undefined) {
      update.images = Array.isArray(images) ? images.filter(i => i && i.trim()) : images ? [String(images).trim()] : [];
    }
    if (status !== undefined) update.status = status;
    if (location !== undefined) update.location = String(location).trim();
    if (coordinates !== undefined) update.coordinates = { lat: Number(coordinates.lat), lng: Number(coordinates.lng) };
    if (serviceOptions !== undefined) {
      try {
        const obj = typeof serviceOptions === 'string' ? JSON.parse(serviceOptions) : serviceOptions;
        if (obj && typeof obj === 'object') {
          const normalized = {};
          for (const [k, v] of Object.entries(obj)) {
            const num = v === null || v === '' || v === undefined ? null : Number(v);
            normalized[k] = num === null || Number.isNaN(num) ? null : num;
          }
          update.serviceOptions = normalized;
        }
      } catch (_) {
        // ignore invalid serviceOptions
      }
    }

    const saved = await OtherService.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate({ path: "userId", select: "firstName lastName email" });
    if (!saved) return NextResponse.json({ message: "Other service not found" }, { status: 404 });
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to update other service";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const result = await OtherService.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ message: "Other service not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error?.message || "Failed to delete other service";
    return NextResponse.json({ message }, { status: 400 });
  }
}


