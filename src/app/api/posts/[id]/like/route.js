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

// POST - Toggle like on a post
export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await parseBody(req);
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    const data = readData();
    const post = data.posts.find((p) => p.id === id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Initialize likes array if it doesn't exist
    if (!data.likes[id]) {
      data.likes[id] = [];
    }

    const likesArray = data.likes[id];
    const userIndex = likesArray.indexOf(userId);

    if (userIndex > -1) {
      // Unlike: remove userId from likes array
      likesArray.splice(userIndex, 1);
    } else {
      // Like: add userId to likes array
      likesArray.push(userId);
    }

    writeData(data);

    return NextResponse.json(
      {
        likes: likesArray.length,
        isLiked: userIndex === -1, // true if we just liked it
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to toggle like" },
      { status: 500 }
    );
  }
}

// GET - Check if user has liked the post
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    const data = readData();
    const likesArray = data.likes[id] || [];

    return NextResponse.json(
      {
        isLiked: likesArray.includes(userId),
        likes: likesArray.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to check like status" },
      { status: 500 }
    );
  }
}

