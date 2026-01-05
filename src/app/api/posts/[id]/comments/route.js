import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

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

// GET - Fetch all comments for a post
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = readData();
    const post = data.posts.find((p) => p.id === id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const comments = data.comments[id] || [];
    
    // Get unique user IDs from comments
    const userIds = [...new Set(comments.map(comment => comment.userId))];
    
    // Convert userIds to ObjectId if valid, filter out invalid ones
    const validUserIds = userIds
      .filter(userId => mongoose.Types.ObjectId.isValid(userId))
      .map(userId => new mongoose.Types.ObjectId(userId));
    
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
    
    // Add user details to each comment
    const commentsWithUserData = comments.map(comment => {
      const userData = userMap[comment.userId] || {
        name: comment.username || 'Unknown User',
        avatar: comment.avatar || ''
      };
      
      return {
        ...comment,
        username: userData.name,
        avatar: userData.avatar
      };
    });
    
    // Sort comments by timestamp (newest first)
    commentsWithUserData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json(commentsWithUserData, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Add a comment to a post
export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await parseBody(req);
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { message: "userId and content are required" },
        { status: 400 }
      );
    }

    const data = readData();
    const post = data.posts.find((p) => p.id === id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Fetch user data from database
    let username = "Anonymous";
    let avatar = "";
    
    if (mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const user = await User.findById(userId).select('firstName lastName profilePicture brandImage');
        if (user) {
          username = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
          avatar = user.profilePicture || user.brandImage || '';
        }
      } catch (userError) {
        console.error('Error fetching user:', userError);
        // Continue with default values if user fetch fails
      }
    }

    // Initialize comments array if it doesn't exist
    if (!data.comments[id]) {
      data.comments[id] = [];
    }

    const newComment = {
      id: Date.now().toString(),
      userId: String(userId).trim(),
      content: String(content).trim(),
      username: username,
      avatar: avatar,
      timestamp: new Date().toISOString(),
    };

    data.comments[id].push(newComment);
    writeData(data);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { message: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}

