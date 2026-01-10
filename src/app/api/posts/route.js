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
    // Try to connect to DB, but don't fail if it doesn't work
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('Database connection failed, continuing with file-based storage:', dbError.message);
    }
    
    // Read data from file
    let data;
    try {
      data = readData();
    } catch (fileError) {
      console.error('Error reading posts file:', fileError);
      // Return empty array if file read fails
      return NextResponse.json([], { status: 200 });
    }
    
    // Ensure data has required structure
    if (!data || typeof data !== 'object') {
      data = { posts: [], likes: {}, comments: {} };
    }
    if (!Array.isArray(data.posts)) {
      data.posts = [];
    }
    if (!data.likes || typeof data.likes !== 'object') {
      data.likes = {};
    }
    if (!data.comments || typeof data.comments !== 'object') {
      data.comments = {};
    }
    
    // Get unique user IDs from posts
    const userIds = [...new Set(data.posts.map(post => post?.userId).filter(Boolean))];
    
    // Try to fetch user data if DB is available
    let userMap = {};
    if (userIds.length > 0) {
      try {
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
        users.forEach(user => {
          userMap[user._id.toString()] = {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
            avatar: user.profilePicture || user.brandImage || ''
          };
        });
      } catch (userError) {
        console.warn('Error fetching user data:', userError.message);
        // Continue without user data
      }
    }
    
    // Add likes, comments count, and user details to each post
    const postsWithCounts = data.posts.map((post) => {
      if (!post || !post.id) return null; // Skip invalid posts
      
      const postLikes = data.likes[post.id] || [];
      const postComments = data.comments[post.id] || [];
      const userData = userMap[post.userId] || {
        name: 'Unknown User',
        avatar: ''
      };
      
      return {
        ...post,
        likes: Array.isArray(postLikes) ? postLikes.length : 0,
        comments: Array.isArray(postComments) ? postComments.length : 0,
        isLiked: false, // This will be determined on client side based on userId
        user: {
          name: userData.name,
          avatar: userData.avatar
        }
      };
    }).filter(Boolean); // Remove null entries
    
    // Sort by date (newest first)
    postsWithCounts.sort((a, b) => {
      const dateA = new Date(a.dateTime || a.createdAt || 0);
      const dateB = new Date(b.dateTime || b.createdAt || 0);
      return dateB - dateA;
    });
    
    return NextResponse.json(postsWithCounts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return empty array instead of error to prevent UI breaking
    return NextResponse.json([], { status: 200 });
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

