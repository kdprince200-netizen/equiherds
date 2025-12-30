import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    // Get session using cookies in App Router (Auth.js v5 compatible)
    const cookieStore = await cookies();
    let getServerSession;
    
    try {
      // Try importing from next-auth (v5)
      const nextAuth = await import("next-auth");
      getServerSession = nextAuth.getServerSession;
      
      // If not found, try next-auth/next
      if (!getServerSession) {
        const nextAuthNext = await import("next-auth/next");
        getServerSession = nextAuthNext.getServerSession;
      }
    } catch (e) {
      // Fallback: try next-auth/next
      const nextAuthNext = await import("next-auth/next");
      getServerSession = nextAuthNext.getServerSession;
    }
    
    if (!getServerSession) {
      // If getServerSession is not available, return empty session
      return NextResponse.json(
        { user: null, expires: null },
        { status: 200 }
      );
    }
    
    const session = await getServerSession({
      req: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
      ...authOptions,
    });
    
    if (!session) {
      return NextResponse.json(
        { user: null, expires: null },
        { status: 200 }
      );
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error("Error fetching session at /api/auth/me:", error);
    // Return empty session instead of error to prevent client-side issues
    return NextResponse.json(
      { user: null, expires: null },
      { status: 200 }
    );
  }
}

