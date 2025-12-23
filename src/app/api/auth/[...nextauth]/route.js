import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Ensure we have a secret for NextAuth
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

if (!secret && process.env.NODE_ENV === "production") {
  console.warn(
    "Warning: NEXTAUTH_SECRET or AUTH_SECRET is not set. Authentication may not work correctly."
  );
}

export const authOptions = {
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };