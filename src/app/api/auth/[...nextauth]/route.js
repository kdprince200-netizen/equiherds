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
        if (user) {
          token.id = user.id;
        }

        return token;
      } catch (error) {
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          session.user.id = token.id;
        }

        return session;
      } catch (error) {
        throw error;
      }
    },
  },
  debug: false,
  events: {
    async signIn({ user, account, profile }) {
      try {
        // Sign in event handled
      } catch (error) {
        // Error handled silently
      }
    },
    async signOut({ session, token }) {
      try {
        // Sign out event handled
      } catch (error) {
        // Error handled silently
      }
    },
    async error({ error }) {
      // Error event handled silently
    },
  },
};

// Initialize NextAuth handler
let handler;
try {
  handler = NextAuth(authOptions);
} catch (error) {
  throw error;
}

// NextAuth v5 beta returns an object with handlers.GET and handlers.POST
// Export GET and POST handlers directly
export async function GET(req, context) {
  try {
    // Wrap handler execution with timeout
    const response = await withTimeout(
      async () => {
        // NextAuth v5 beta structure: handler.handlers.GET
        if (handler?.handlers?.GET && typeof handler.handlers.GET === 'function') {
          return await handler.handlers.GET(req, context);
        }
        
        // Fallback for other NextAuth versions
        if (handler?.GET && typeof handler.GET === 'function') {
          return await handler.GET(req, context);
        }
        
        if (typeof handler === 'function') {
          return await handler(req, context);
        }
        
        throw new Error('NextAuth handler not found');
      },
      HANDLER_TIMEOUT,
      "NextAuth GET handler"
    );

    return response;
  } catch (error) {
    const errorType = error?.name || 'UnknownError';
    const errorMessage = error?.message || 'Authentication error';

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
  try {
    // Wrap handler execution with timeout
    const response = await withTimeout(
      async () => {
        // NextAuth v5 beta structure: handler.handlers.POST
        if (handler?.handlers?.POST && typeof handler.handlers.POST === 'function') {
          return await handler.handlers.POST(req, context);
        }
        
        // Fallback for other NextAuth versions
        if (handler?.POST && typeof handler.POST === 'function') {
          return await handler.POST(req, context);
        }
        
        if (typeof handler === 'function') {
          return await handler(req, context);
        }
        
        throw new Error('NextAuth handler not found');
      },
      HANDLER_TIMEOUT,
      "NextAuth POST handler"
    );

    return response;
  } catch (error) {
    const errorType = error?.name || 'UnknownError';
    const errorMessage = error?.message || 'Authentication error';

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


