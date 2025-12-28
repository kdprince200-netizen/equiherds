import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";

// Ensure we have a secret for NextAuth
// Use consistent fallback secret - same for local and production
const DEFAULT_SECRET = "QsL6uMshgcGREGtoBloGKKQKXholRe2QI3jmCQQqweI=";

let secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || DEFAULT_SECRET;

// Timeout configuration (in milliseconds)
const HANDLER_TIMEOUT = 30000; // 30 seconds for NextAuth handlers

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
      console.error(`❌ [NEXTAUTH TIMEOUT ERROR] ${operationName}:`, {
        timeout: `${timeoutMs}ms`,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw new Error(`${operationName} timed out after ${timeoutMs}ms. Please try again.`);
    }
    throw error;
  }
}

export const authOptions = {
  trustHost: true, 
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: secret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      try {
        console.log("🔄 [NEXTAUTH JWT CALLBACK]: Processing JWT token", {
          hasUser: !!user,
          hasAccount: !!account,
          hasProfile: !!profile,
          timestamp: new Date().toISOString()
        });

        if (user) {
          token.id = user.id;
          console.log("✅ [NEXTAUTH JWT CALLBACK]: User ID added to token", {
            userId: user.id
          });
        }

        return token;
      } catch (error) {
        console.error("❌ [NEXTAUTH JWT CALLBACK ERROR]:", {
          error: error?.message || 'Unknown error',
          errorType: error?.name || 'UnknownError',
          stack: error?.stack,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        console.log("🔄 [NEXTAUTH SESSION CALLBACK]: Processing session", {
          hasSession: !!session,
          hasToken: !!token,
          userId: token?.id,
          timestamp: new Date().toISOString()
        });

        if (session?.user) {
          session.user.id = token.id;
          console.log("✅ [NEXTAUTH SESSION CALLBACK]: User ID added to session", {
            userId: token.id,
            email: session.user.email
          });
        }

        return session;
      } catch (error) {
        console.error("❌ [NEXTAUTH SESSION CALLBACK ERROR]:", {
          error: error?.message || 'Unknown error',
          errorType: error?.name || 'UnknownError',
          stack: error?.stack,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
  events: {
    async signIn({ user, account, profile }) {
      try {
        console.log("✅ [NEXTAUTH SIGN IN EVENT]: User signed in", {
          userId: user?.id,
          email: user?.email,
          provider: account?.provider,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("❌ [NEXTAUTH SIGN IN EVENT ERROR]:", {
          error: error?.message || 'Unknown error',
          errorType: error?.name || 'UnknownError',
          timestamp: new Date().toISOString()
        });
      }
    },
    async signOut({ session, token }) {
      try {
        console.log("👋 [NEXTAUTH SIGN OUT EVENT]: User signed out", {
          userId: token?.id || session?.user?.id,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("❌ [NEXTAUTH SIGN OUT EVENT ERROR]:", {
          error: error?.message || 'Unknown error',
          errorType: error?.name || 'UnknownError',
          timestamp: new Date().toISOString()
        });
      }
    },
    async error({ error }) {
      console.error("❌ [NEXTAUTH ERROR EVENT]: Authentication error occurred", {
        error: error?.message || 'Unknown error',
        errorType: error?.name || 'UnknownError',
        stack: error?.stack,
        timestamp: new Date().toISOString()
      });
    },
  },
};

// Initialize NextAuth handler
let handler;
try {
  console.log("🔧 [NEXTAUTH INIT]: Initializing NextAuth handler", {
    hasSecret: !!secret,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    timestamp: new Date().toISOString()
  });
  handler = NextAuth(authOptions);
  console.log("✅ [NEXTAUTH INIT]: NextAuth handler initialized successfully");
} catch (error) {
  console.error("❌ [NEXTAUTH INIT ERROR]: Failed to initialize NextAuth", {
    error: error?.message || 'Unknown error',
    errorType: error?.name || 'UnknownError',
    stack: error?.stack,
    timestamp: new Date().toISOString()
  });
  throw error;
}

// NextAuth v5 beta returns an object with handlers.GET and handlers.POST
// Export GET and POST handlers directly
export async function GET(req, context) {
  const requestStartTime = Date.now();
  console.log("📥 [NEXTAUTH GET REQUEST]: Received GET request", {
    url: req.url,
    timestamp: new Date().toISOString()
  });

  try {
    // Wrap handler execution with timeout
    const response = await withTimeout(
      async () => {
        // NextAuth v5 beta structure: handler.handlers.GET
        if (handler?.handlers?.GET && typeof handler.handlers.GET === 'function') {
          console.log("🔀 [NEXTAUTH GET]: Using NextAuth v5 beta handler");
          return await handler.handlers.GET(req, context);
        }
        
        // Fallback for other NextAuth versions
        if (handler?.GET && typeof handler.GET === 'function') {
          console.log("🔀 [NEXTAUTH GET]: Using handler.GET method");
          return await handler.GET(req, context);
        }
        
        if (typeof handler === 'function') {
          console.log("🔀 [NEXTAUTH GET]: Using handler as function");
          return await handler(req, context);
        }
        
        throw new Error('NextAuth handler not found');
      },
      HANDLER_TIMEOUT,
      "NextAuth GET handler"
    );

    const requestDuration = Date.now() - requestStartTime;
    console.log("✅ [NEXTAUTH GET SUCCESS]: GET request completed", {
      duration: `${requestDuration}ms`,
      status: response?.status || 'unknown',
      timestamp: new Date().toISOString()
    });

    return response;
  } catch (error) {
    const requestDuration = Date.now() - requestStartTime;
    const errorType = error?.name || 'UnknownError';
    const errorMessage = error?.message || 'Authentication error';

    if (error.message.includes('Timeout') || error.message.includes('timed out')) {
      console.error("❌ [NEXTAUTH GET TIMEOUT ERROR]:", {
        error: errorMessage,
        errorType,
        duration: `${requestDuration}ms`,
        timeout: `${HANDLER_TIMEOUT}ms`,
        timestamp: new Date().toISOString()
      });
    } else if (error.message.includes('handler not found')) {
      console.error("❌ [NEXTAUTH GET HANDLER ERROR]: NextAuth handler not found", {
        error: errorMessage,
        errorType,
        handlerType: typeof handler,
        hasHandlers: !!handler?.handlers,
        hasGET: !!handler?.GET,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error("❌ [NEXTAUTH GET ERROR]: Unexpected error", {
        error: errorMessage,
        errorType,
        duration: `${requestDuration}ms`,
        stack: error?.stack,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { 
        error: 'Authentication error', 
        message: errorMessage,
        errorType 
      },
      { status: error.message.includes('Timeout') ? 504 : 500 }
    );
  }
}

export async function POST(req, context) {
  const requestStartTime = Date.now();
  console.log("📥 [NEXTAUTH POST REQUEST]: Received POST request", {
    url: req.url,
    timestamp: new Date().toISOString()
  });

  try {
    // Wrap handler execution with timeout
    const response = await withTimeout(
      async () => {
        // NextAuth v5 beta structure: handler.handlers.POST
        if (handler?.handlers?.POST && typeof handler.handlers.POST === 'function') {
          console.log("🔀 [NEXTAUTH POST]: Using NextAuth v5 beta handler");
          return await handler.handlers.POST(req, context);
        }
        
        // Fallback for other NextAuth versions
        if (handler?.POST && typeof handler.POST === 'function') {
          console.log("🔀 [NEXTAUTH POST]: Using handler.POST method");
          return await handler.POST(req, context);
        }
        
        if (typeof handler === 'function') {
          console.log("🔀 [NEXTAUTH POST]: Using handler as function");
          return await handler(req, context);
        }
        
        throw new Error('NextAuth handler not found');
      },
      HANDLER_TIMEOUT,
      "NextAuth POST handler"
    );

    const requestDuration = Date.now() - requestStartTime;
    console.log("✅ [NEXTAUTH POST SUCCESS]: POST request completed", {
      duration: `${requestDuration}ms`,
      status: response?.status || 'unknown',
      timestamp: new Date().toISOString()
    });

    return response;
  } catch (error) {
    const requestDuration = Date.now() - requestStartTime;
    const errorType = error?.name || 'UnknownError';
    const errorMessage = error?.message || 'Authentication error';

    if (error.message.includes('Timeout') || error.message.includes('timed out')) {
      console.error("❌ [NEXTAUTH POST TIMEOUT ERROR]:", {
        error: errorMessage,
        errorType,
        duration: `${requestDuration}ms`,
        timeout: `${HANDLER_TIMEOUT}ms`,
        timestamp: new Date().toISOString()
      });
    } else if (error.message.includes('handler not found')) {
      console.error("❌ [NEXTAUTH POST HANDLER ERROR]: NextAuth handler not found", {
        error: errorMessage,
        errorType,
        handlerType: typeof handler,
        hasHandlers: !!handler?.handlers,
        hasPOST: !!handler?.POST,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error("❌ [NEXTAUTH POST ERROR]: Unexpected error", {
        error: errorMessage,
        errorType,
        duration: `${requestDuration}ms`,
        stack: error?.stack,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { 
        error: 'Authentication error', 
        message: errorMessage,
        errorType 
      },
      { status: error.message.includes('Timeout') ? 504 : 500 }
    );
  }
}


