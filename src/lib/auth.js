import jwt from 'jsonwebtoken';

/**
 * Verify JWT token and extract userId
 * @param {Request} request - Next.js request object
 * @returns {Object} - { userId, email, accountType } or null if invalid
 */
export function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      userId: decoded.userId,
      email: decoded.email,
      accountType: decoded.accountType
    };
  } catch (error) {
    return null;
  }
}








