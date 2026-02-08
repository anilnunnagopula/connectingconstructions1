// server/middleware/authMiddleware.js
const { verifyAccessToken } = require("../utils/tokenUtils");
const User = require("../models/User");

// Protect routes - verify access token from Authorization header
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch user from database
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach role for convenience
    req.user.role = decoded.role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    // Handle specific JWT errors
    if (error.message === "Invalid or expired access token") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please refresh",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// Authorize specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
