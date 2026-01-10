import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

const dataFilePath = path.join(process.cwd(), "data", "stories.json");

function readData() {
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    return { stories: [] };
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

// GET - Fetch all stories
export async function GET() {
  try {
    await connectDB();
    const data = readData();
    
    // Get unique user IDs from stories
    const userIds = [...new Set(data.stories.map(story => story.userId))];
    
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
    
    // Add user details, likes, and comments count to each story
    const storiesWithUserData = data.stories.map((story) => {
      const userData = userMap[story.userId] || {
        name: 'Unknown User',
        avatar: ''
      };
      
      const storyLikes = data.likes[story.id] || [];
      const storyComments = data.comments[story.id] || [];
      
      return {
        ...story,
        username: userData.name,
        avatar: userData.avatar,
        likes: storyLikes.length,
        comments: storyComments.length,
        isLiked: false, // Will be updated on client side
      };
    });
    
    // Sort by timestamp (newest first)
    storiesWithUserData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return NextResponse.json(storiesWithUserData, { status: 200 });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

// POST - Create a new story
export async function POST(req) {
  try {
    await connectDB();
    const body = await parseBody(req);
    const { userId, media, type } = body;

    if (!userId || !media || !type) {
      return NextResponse.json(
        { message: "userId, media, and type are required" },
        { status: 400 }
      );
    }

    if (type !== 'image' && type !== 'video') {
      return NextResponse.json(
        { message: "type must be 'image' or 'video'" },
        { status: 400 }
      );
    }

    // Fetch user data
    let username = "Unknown User";
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
      }
    }

    const data = readData();
    const newStory = {
      id: Date.now().toString(),
      userId: String(userId).trim(),
      media: String(media).trim(),
      type: String(type),
      username: username,
      avatar: avatar,
      timestamp: new Date().toISOString(),
      views: 0,
    };

    data.stories.push(newStory);
    writeData(data);

    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { message: error.message || "Failed to create story" },
      { status: 500 }
    );
  }
}

