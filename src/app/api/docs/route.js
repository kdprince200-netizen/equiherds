import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(req) {
  await connectDB();
  
  try {
    // Get Authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Swagger API Documentation"'
        }
      });
    }

    // Decode base64 credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Swagger API Documentation"'
        }
      });
    }

    // Find user in database
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Swagger API Documentation"'
        }
      });
    }

    // Check if user is superAdmin
    if (user.accountType !== 'superAdmin') {
      return new NextResponse('Forbidden - SuperAdmin access required', {
        status: 403
      });
    }

    // Verify password for local auth users
    if (user.authProvider === 'local' && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new NextResponse('Unauthorized', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Swagger API Documentation"'
          }
        });
      }
    }

    // For Google users, we'll allow access if they're superAdmin
    // (In production, you might want to implement additional verification)
    if (user.authProvider === 'google') {
      // For Google users, we'll allow access if they're superAdmin
      // You might want to implement additional verification here
    }

    // Import and return swagger spec
    const swaggerSpec = await import('@/lib/swagger');
    return NextResponse.json(swaggerSpec.default);
    
  } catch (error) {
    console.error('Swagger auth error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}