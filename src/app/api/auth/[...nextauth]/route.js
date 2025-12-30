import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Ensure we have a secret for NextAuth
// Use consistent fallback secret - same for local and production
const DEFAULT_SECRET = "QsL6uMshgcGREGtoBloGKKQKXholRe2QI3jmCQQqweI=";

let secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || DEFAULT_SECRET;

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

// Initialize NextAuth for Auth.js v5
// Auth.js v5 exports handlers object with GET and POST methods
const handler = NextAuth(authOptions);

// Export GET and POST handlers
// Handle different possible return structures
let GET, POST;

if (handler?.handlers) {
  // Standard Auth.js v5 structure
  GET = handler.handlers.GET;
  POST = handler.handlers.POST;
} else if (handler?.GET && handler?.POST) {
  // Direct GET/POST methods
  GET = handler.GET;
  POST = handler.POST;
} else if (typeof handler === 'function') {
  // Handler is a function (older pattern)
  GET = handler;
  POST = handler;
} else {
  // Fallback: use handler as is
  GET = handler;
  POST = handler;
}

export { GET, POST };


