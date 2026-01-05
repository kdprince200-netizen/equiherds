import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    // Get session using cookies in App Router
    const cookieStore = await cookies();
    let getServerSession;
    
    try {
      // Try importing from next-auth (v4)
      const nextAuth = await import("next-auth");
      getServerSession = nextAuth.getServerSession || (await import("next-auth/next")).getServerSession;
    } catch (e) {
      // Fallback: try next-auth/next
      const nextAuthNext = await import("next-auth/next");
      getServerSession = nextAuthNext.getServerSession;
    }
    
    if (!getServerSession) {
      throw new Error("getServerSession not available");
    }
    
    const session = await getServerSession({
      req: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
      ...authOptions,
    });
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "No active session found" },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if user already exists in database
    const existingUser = await User.findOne({ email: session.user.email });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          message: "User already exists", 
          user: existingUser,
          isNewUser: false 
        },
        { status: 200 }
      );
    }

    // Create new user in database
    const userData = {
      firstName: session.user.name?.split(' ')[0] || '',
      lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      email: session.user.email,
      accountType: 'buyer', // Default to buyer
      phoneNumber: '', // Will be required to fill later
      googleId: session.user.id || session.user.email,
      authProvider: 'google',
      status: 'active',
      profilePicture: session.user.image,
    };

    const newUser = new User(userData);
    await newUser.save();
    
    console.log("Google user created in database:", newUser.email);

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: newUser,
        isNewUser: true 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating Google user:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
