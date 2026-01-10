import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import User from "@/models/User";

// Timeout configuration (in milliseconds)
const DB_TIMEOUT = 10000; // 10 seconds for database operations
const REQUEST_TIMEOUT = 30000; // 30 seconds for entire request

// Helper function to create timeout promises
function createTimeoutPromise(timeoutMs, operationName) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout: ${operationName} exceeded ${timeoutMs}ms`));
    }, timeoutMs);
  });
}

// Helper function to wrap async operations with timeout
async function withTimeout(operation, timeoutMs, operationName) {
  try {
    return await Promise.race([
      operation(),
      createTimeoutPromise(timeoutMs, operationName)
    ]);
  } catch (error) {
    if (error.message.includes('Timeout')) {
      throw new Error(`${operationName} timed out after ${timeoutMs}ms. Please try again.`);
    }
    throw error;
  }
}

function getJwtSecret() {
  try {
    const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret || typeof secret !== "string" || secret.trim().length === 0) {
      throw new Error("Missing JWT secret. Set JWT_SECRET in .env.local");
    }
    return secret;
  } catch (error) {
    throw error;
  }
}

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";
  try {
    let body;
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await req.formData();
      const data = {};
      for (const [key, value] of form.entries()) {
        data[key] = typeof value === "string" ? value : value.name || "";
      }
      body = data;
    } else {
      const raw = await req.text();
      body = raw ? JSON.parse(raw) : {};
    }

    return body;
  } catch (error) {
    throw new Error("Invalid request body. Ensure valid JSON or form data.");
  }
}

export async function POST(req) {
  try {
    // Connect to database with timeout and verify connection
    try {
      await withTimeout(
        async () => {
          await connectDB();
          // Verify connection is ready before proceeding
          if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not ready after connection attempt');
          }
        },
        DB_TIMEOUT,
        "Database connection"
      );
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return NextResponse.json(
        { 
          message: "Database connection failed. Please try again later.",
          error: "MongoNotConnectedError"
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await parseRequestBody(req);
    const { email, password, authMethod } = body || {};

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Verify connection is still ready before querying
    if (mongoose.connection.readyState !== 1) {
      console.error('Database connection lost before query');
      return NextResponse.json(
        { 
          message: "Database connection lost. Please try again.",
          error: "MongoNotConnectedError"
        },
        { status: 503 }
      );
    }

    // Find user in database with timeout
    const user = await withTimeout(
      async () => {
        // Double-check connection before query
        if (mongoose.connection.readyState !== 1) {
          throw new Error('Database connection not ready');
        }
        const foundUser = await User.findOne({ email: email.toLowerCase().trim() });
        return foundUser;
      },
      DB_TIMEOUT,
      "Database query (find user)"
    );

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

      // Verify password with timeout
      const isMatch = await withTimeout(
        async () => {
          return await bcrypt.compare(password, user.password);
        },
        DB_TIMEOUT,
        "Password verification"
      );

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
    const errorType = error?.name || 'UnknownError';
    const errorMessage = error?.message || "Login failed";

    // Return appropriate status code based on error type
    const statusCode = error.message.includes('Timeout') ? 504 : 
                      error.message.includes('database') || error.message.includes('MongoDB') ? 503 : 
                      400;

    return NextResponse.json({ 
      message: errorMessage,
      error: errorType 
    }, { status: statusCode });
  }
}
