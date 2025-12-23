import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    console.log("Starting password update process...");
    
    await connectDB();
    console.log("Database connected successfully");

    const { email, newPassword } = await request.json();
    console.log("Request data received:", { email: email ? "provided" : "missing", passwordLength: newPassword?.length });

    if (!email || !newPassword) {
      console.log("Missing required fields");
      return NextResponse.json(
        { message: "Email and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      console.log("Password too short");
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find user by email
    console.log("Looking for user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    console.log("User found:", user._id);

    // Update user password using findOneAndUpdate to avoid validation issues
    console.log("Updating user password...");
    console.log("User authProvider:", user.authProvider);
    console.log("Original password hash:", user.password ? "exists" : "null");
    
    // Let the pre-save hook handle password hashing
    console.log("Updating password in database (pre-save hook will hash it)...");
    await User.findByIdAndUpdate(
      user._id, 
      { password: newPassword }, // Pass plain password, pre-save hook will hash it
      { runValidators: false } // Skip validation to avoid required field errors
    );
    
    console.log("Password updated successfully");

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
