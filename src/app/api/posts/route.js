import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

const dataFilePath = path.join(process.cwd(), "data", "posts.json");

// Helper function to read data from JSON file
function readData() {
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    // If file doesn't exist, return default structure
    return { posts: [], likes: {}, comments: {} };
  }
}

// Helper function to write data to JSON file
function writeData(data) {
  // Ensure data directory exists
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

// GET - Fetch all posts
export async function GET() {
  try {
    await connectDB();
    const data = readData();
    
    // Get unique user IDs from posts
    const userIds = [...new Set(data.posts.map(post => post.userId))];
    
    // Convert userIds to ObjectId if valid, filter out invalid ones
    const validUserIds = userIds
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));
    
    // Fetch all users in one query
    const users = validUserIds.length > 0 
      ? await User.find({ _id: { $in: validUserIds } })
          .select('firstName lastName profilePicture brandImage')
      : [];
    
    // Create a map of userId to user data for quick lookup
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        avatar: user.profilePicture || user.brandImage || ''
      };
    });
    
    // Add likes, comments count, and user details to each post
    const postsWithCounts = data.posts.map((post) => {
      const postLikes = data.likes[post.id] || [];
      const postComments = data.comments[post.id] || [];
      const userData = userMap[post.userId] || {
        name: 'Unknown User',
        avatar: ''
      };
      
      return {
        ...post,
        likes: postLikes.length,
        comments: postComments.length,
        isLiked: false, // This will be determined on client side based on userId
        user: {
          name: userData.name,
          avatar: userData.avatar
        }
      };
    });
    
    // Sort by date (newest first)
    postsWithCounts.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    return NextResponse.json(postsWithCounts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - Create a new post
export async function POST(req) {
  try {
    const body = await parseBody(req);
    const { userId, description, dateTime, image } = body;

    if (!userId || !description || !dateTime || !image) {
      return NextResponse.json(
        { message: "userId, description, dateTime, and image are required" },
        { status: 400 }
      );
    }

    const data = readData();
    const newPost = {
      id: Date.now().toString(), // Simple ID generation
      userId: String(userId).trim(),
      description: String(description).trim(),
      dateTime: String(dateTime),
      image: String(image).trim(),
      createdAt: new Date().toISOString(),
    };

    data.posts.push(newPost);
    // Initialize likes and comments arrays for this post
    if (!data.likes[newPost.id]) {
      data.likes[newPost.id] = [];
    }
    if (!data.comments[newPost.id]) {
      data.comments[newPost.id] = [];
    }

    writeData(data);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}

