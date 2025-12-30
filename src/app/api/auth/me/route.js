import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Call the session endpoint internally using Next.js fetch
    // This works in the same runtime environment
    const baseUrl = process.env.NEXTAUTH_URL || 
                   process.env.AUTH_URL || 
                   req.nextUrl.origin;
    
    const sessionUrl = `${baseUrl}/api/auth/session`;
    
    // Use fetch to call the session endpoint
    // Next.js fetch works internally in serverless environments
    const sessionResponse = await fetch(sessionUrl, {
      method: 'GET',
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
      // Use cache to avoid unnecessary calls
      cache: 'no-store',
    });
    
    if (sessionResponse.ok) {
      const session = await sessionResponse.json();
      return NextResponse.json(session, { status: 200 });
    }
    
    // If session endpoint fails, return empty session
    return NextResponse.json(
      { user: null, expires: null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching session at /api/auth/me:", error);
    // Return empty session instead of error to prevent client-side issues
    return NextResponse.json(
      { user: null, expires: null },
      { status: 200 }
    );
  }
}

