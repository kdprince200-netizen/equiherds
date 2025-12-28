import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import News from "@/models/News";

export async function GET() {
  await connectDB();
  try {
    const list = await News.find({}).sort({ date: -1, createdAt: -1 });
    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch news";
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function parseBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return req.json();
  const raw = await req.text();
  return raw ? JSON.parse(raw) : {};
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await parseBody(req);
    const { title, details, date, images } = body || {};
    if (!title || !details || !date) {
      return NextResponse.json({ message: "title, details, and date are required" }, { status: 400 });
    }
    const created = await News.create({
      title: String(title).trim(),
      details: String(details).trim(),
      date: new Date(date),
      images: Array.isArray(images) ? images.filter(i => i && String(i).trim()) : images ? [String(images).trim()] : []
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error?.message || "Failed to create news";
    return NextResponse.json({ message }, { status: 400 });
  }
}


