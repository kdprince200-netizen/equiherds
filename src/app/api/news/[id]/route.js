import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import News from "@/models/News";

async function parseBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return req.json();
  const raw = await req.text();
  return raw ? JSON.parse(raw) : {};
}

export async function GET(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const item = await News.findById(id);
    if (!item) return NextResponse.json({ message: "News not found" }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch news";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await parseBody(req);
    const { title, details, date, images } = body || {};
    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (details !== undefined) update.details = String(details).trim();
    if (date !== undefined) update.date = new Date(date);
    if (images !== undefined) update.images = Array.isArray(images) ? images.filter(i => i && String(i).trim()) : images ? [String(images).trim()] : [];
    const saved = await News.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!saved) return NextResponse.json({ message: "News not found" }, { status: 404 });
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to update news";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const result = await News.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ message: "News not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error?.message || "Failed to delete news";
    return NextResponse.json({ message }, { status: 400 });
  }
}


