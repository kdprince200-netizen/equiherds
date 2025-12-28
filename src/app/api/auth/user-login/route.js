import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
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
      console.error(`❌ [TIMEOUT ERROR] ${operationName}:`, {
        timeout: `${timeoutMs}ms`,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw new Error(`${operationName} timed out after ${timeoutMs}ms. Please try again.`);
    }
    throw error;
  }
}

function getJwtSecret() {
  try {
    const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret || typeof secret !== "string" || secret.trim().length === 0) {
      console.error("❌ [JWT SECRET ERROR]: Missing JWT secret");
      throw new Error("Missing JWT secret. Set JWT_SECRET in .env.local");
    }
    return secret;
  } catch (error) {
    console.error("❌ [JWT SECRET ERROR]:", {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

async function parseRequestBody(req) {
  const contentType = req.headers.get("content-type") || "";
  try {
    console.log("📥 [REQUEST PARSING]: Starting to parse request body", {
      contentType,
      timestamp: new Date().toISOString()
    });

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

    console.log("✅ [REQUEST PARSING]: Successfully parsed request body");
    return body;
  } catch (error) {
    console.error("❌ [REQUEST PARSING ERROR]:", {
      error: error.message,
      contentType,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw new Error("Invalid request body. Ensure valid JSON or form data.");
  }
}

export async function POST(req) {
  const requestStartTime = Date.now();
  console.log("🚀 [USER LOGIN REQUEST]: Starting login request", {
    timestamp: new Date().toISOString(),
    url: req.url
  });

  try {
    // Connect to database with timeout
    await withTimeout(
      async () => {
        console.log("🔌 [DB CONNECTION]: Attempting database connection");
        await connectDB();
        console.log("✅ [DB CONNECTION]: Database connection successful");
      },
      DB_TIMEOUT,
      "Database connection"
    );

    // Parse request body
    const body = await parseRequestBody(req);
    const { email, password, authMethod } = body || {};

    console.log("📋 [LOGIN REQUEST DATA]:", {
      email: email ? email.toLowerCase().trim() : null,
      authMethod: authMethod || 'email/password',
      hasPassword: !!password
    });

    // Validate email
    if (!email) {
      console.error("❌ [VALIDATION ERROR]: Email is required", {
        receivedData: Object.keys(body),
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user in database with timeout
    const user = await withTimeout(
      async () => {
        console.log("🔍 [DB QUERY]: Searching for user in database", {
          email: email.toLowerCase().trim()
        });
        const foundUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (foundUser) {
          console.log("✅ [DB QUERY]: User found", {
            userId: foundUser._id,
            authProvider: foundUser.authProvider,
            status: foundUser.status
          });
        } else {
          console.warn("⚠️ [DB QUERY]: User not found", {
            email: email.toLowerCase().trim()
          });
        }
        return foundUser;
      },
      DB_TIMEOUT,
      "Database query (find user)"
    );

    if (!user) {
      console.error("❌ [AUTH ERROR]: User not found", {
        email: email.toLowerCase().trim(),
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    // Handle different authentication methods
    if (authMethod === 'google') {
      console.log("🔐 [AUTH METHOD]: Google authentication");
      // For Google users, just verify they exist and are active
      if (user.authProvider !== 'google') {
        console.error("❌ [AUTH ERROR]: Account type mismatch for Google login", {
          userId: user._id,
          userAuthProvider: user.authProvider,
          requestedMethod: 'google'
        });
        return NextResponse.json(
          { message: "This account was created with email/password. Please use regular login." },
          { status: 401 }
        );
      }
    } else {
      console.log("🔐 [AUTH METHOD]: Email/password authentication");
      // For email/password users
      if (!password) {
        console.error("❌ [VALIDATION ERROR]: Password is required for email/password login", {
          email: email.toLowerCase().trim(),
          timestamp: new Date().toISOString()
        });
        return NextResponse.json(
          { message: "Password is required for email/password login" },
          { status: 400 }
        );
      }

      if (user.authProvider === 'google') {
        console.error("❌ [AUTH ERROR]: Account type mismatch for email/password login", {
          userId: user._id,
          userAuthProvider: user.authProvider,
          requestedMethod: 'email/password'
        });
        return NextResponse.json(
          { message: "This account was created with Google. Please use 'Continue with Google' to sign in." },
          { status: 401 }
        );
      }

      if (!user.password) {
        console.error("❌ [AUTH ERROR]: User password hash missing", {
          userId: user._id,
          email: email.toLowerCase().trim(),
          timestamp: new Date().toISOString()
        });
        return NextResponse.json(
          { message: "Invalid account type. Please contact support." },
          { status: 401 }
        );
      }

      // Verify password with timeout
      console.log("🔑 [PASSWORD VERIFICATION]: Verifying password");
      const isMatch = await withTimeout(
        async () => {
          return await bcrypt.compare(password, user.password);
        },
        DB_TIMEOUT,
        "Password verification"
      );

      if (!isMatch) {
        console.error("❌ [AUTH ERROR]: Incorrect password", {
          userId: user._id,
          email: email.toLowerCase().trim(),
          timestamp: new Date().toISOString()
        });
        return NextResponse.json(
          { message: "Incorrect password" },
          { status: 401 }
        );
      }
      console.log("✅ [PASSWORD VERIFICATION]: Password verified successfully");
    }

    // Check user status
    if (user.status === 'pending') {
      console.error("❌ [AUTH ERROR]: User account pending approval", {
        userId: user._id,
        email: email.toLowerCase().trim(),
        status: user.status,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { message: "Your account is pending approval. Please contact support." },
        { status: 401 }
      );
    }

    if (user.status === 'inactive') {
      console.error("❌ [AUTH ERROR]: User account inactive", {
        userId: user._id,
        email: email.toLowerCase().trim(),
        status: user.status,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { message: "Your account is inactive. Please contact support." },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.log("🎫 [JWT GENERATION]: Generating JWT token", {
      userId: user._id,
      email: user.email
    });
    
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
    console.log("✅ [JWT GENERATION]: JWT token generated successfully");

    const requestDuration = Date.now() - requestStartTime;
    console.log("✅ [USER LOGIN SUCCESS]: Login completed successfully", {
      userId: _id.toString(),
      email: userEmail,
      authMethod: authMethod || 'email/password',
      duration: `${requestDuration}ms`,
      timestamp: new Date().toISOString()
    });

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
    const requestDuration = Date.now() - requestStartTime;
    const errorType = error?.name || 'UnknownError';
    const errorMessage = error?.message || "Login failed";
    const errorStack = error?.stack || 'No stack trace available';

    // Log different error types with appropriate details
    if (error.message.includes('Timeout') || error.message.includes('timed out')) {
      console.error("❌ [TIMEOUT ERROR]: Request or operation timed out", {
        error: errorMessage,
        errorType,
        duration: `${requestDuration}ms`,
        stack: errorStack,
        timestamp: new Date().toISOString()
      });
    } else if (error.message.includes('database') || error.message.includes('MongoDB') || error.message.includes('connection')) {
      console.error("❌ [DATABASE ERROR]: Database operation failed", {
        error: errorMessage,
        errorType,
        duration: `${requestDuration}ms`,
        stack: errorStack,
        timestamp: new Date().toISOString()
      });
    } else if (error.message.includes('JWT') || error.message.includes('secret')) {
      console.error("❌ [JWT ERROR]: JWT operation failed", {
        error: errorMessage,
        errorType,
        duration: `${requestDuration}ms`,
        stack: errorStack,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error("❌ [UNEXPECTED ERROR]: Unexpected error occurred", {
        error: errorMessage,
        errorType,
        duration: `${requestDuration}ms`,
        stack: errorStack,
        timestamp: new Date().toISOString()
      });
    }

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
