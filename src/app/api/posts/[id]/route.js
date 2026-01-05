import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

function readData() {
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    return { posts: [], likes: {}, comments: {} };
  }
}

function writeData(data) {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

async function parseBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await req.json();
  }
  const raw = await req.text();
  return raw ? JSON.parse(raw) : {};
}

// GET - Fetch a single post by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const data = readData();
    const post = data.posts.find((p) => p.id === id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const postLikes = data.likes[id] || [];
    const postComments = data.comments[id] || [];

    return NextResponse.json(
      {
        ...post,
        likes: postLikes.length,
        comments: postComments.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT - Update a post
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await parseBody(req);
    const { description, dateTime, image } = body;

    const data = readData();
    const postIndex = data.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Update post fields
    if (description !== undefined) {
      data.posts[postIndex].description = String(description).trim();
    }
    if (dateTime !== undefined) {
      data.posts[postIndex].dateTime = String(dateTime);
    }
    if (image !== undefined) {
      data.posts[postIndex].image = String(image).trim();
    }

    writeData(data);

    return NextResponse.json(data.posts[postIndex], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const data = readData();
    const postIndex = data.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Remove post
    data.posts.splice(postIndex, 1);
    // Remove associated likes and comments
    delete data.likes[id];
    delete data.comments[id];

    writeData(data);

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}

