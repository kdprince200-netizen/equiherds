import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secret || typeof secret !== "string" || secret.trim().length === 0) {
    throw new Error("Missing JWT secret. Set JWT_SECRET in .env.local");
  }
  return secret;
}

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      return await req.json();
    }
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await req.formData();
      const data = {};
      for (const [key, value] of form.entries()) {
        data[key] = typeof value === "string" ? value : value.name || "";
      }
      return data;
    }
    const raw = await req.text();
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    throw new Error("Invalid request body. Ensure valid JSON or form data.");
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await parseRequestBody(req);
    const { email, password, authMethod } = body || {};

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    // Handle different authentication methods
    if (authMethod === 'google') {
      // For Google users, just verify they exist and are active
      if (user.authProvider !== 'google') {
        return NextResponse.json(
          { message: "This account was created with email/password. Please use regular login." },
          { status: 401 }
        );
      }
    } else {
      // For email/password users
      if (!password) {
        return NextResponse.json(
          { message: "Password is required for email/password login" },
          { status: 400 }
        );
      }

      if (user.authProvider === 'google') {
        return NextResponse.json(
          { message: "This account was created with Google. Please use 'Continue with Google' to sign in." },
          { status: 401 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          { message: "Invalid account type. Please contact support." },
          { status: 401 }
        );
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Incorrect password" },
          { status: 401 }
        );
      }
    }

    // Check user status
    if (user.status === 'pending') {
      return NextResponse.json(
        { message: "Your account is pending approval. Please contact support." },
        { status: 401 }
      );
    }

    if (user.status === 'inactive') {
      return NextResponse.json(
        { message: "Your account is inactive. Please contact support." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const secret = getJwtSecret();
    const { _id, firstName, lastName, email: userEmail, accountType, phoneNumber, companyName, brandImage, companyInfo, authProvider } = user;
    
    const tokenPayload = {
      id: _id.toString(),
      firstName,
      lastName,
      email: userEmail,
      accountType,
      phoneNumber,
      companyName,
      brandImage,
      companyInfo,
      authProvider,
    };

    const token = jwt.sign(tokenPayload, secret, { expiresIn: "7d" });

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: _id.toString(),
          firstName,
          lastName,
          email: userEmail,
          accountType,
          phoneNumber,
          companyName,
          brandImage,
          companyInfo,
          authProvider,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error?.message || "Login failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}
