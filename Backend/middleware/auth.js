const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 * 
 * ⭐ IMPORTANT: Allows OPTIONS requests (preflight) to bypass auth
 * This prevents CORS preflight requests from being blocked by auth
 */
exports.verifyToken = (req, res, next) => {
  // ✅ Allow OPTIONS requests to bypass authentication
  // Browser sends OPTIONS before POST/PUT/DELETE for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        message: 'No token provided. Authorization denied.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Invalid token. Authorization denied.'
    });
  }
};
