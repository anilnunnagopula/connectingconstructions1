// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  let token;

  console.log("🔐 Auth Middleware - Checking authentication...");

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("❌ No token found");
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", { id: decoded.id, role: decoded.role });

    // Get user from token
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.log("❌ User not found in database");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User authenticated:", {
      id: req.user._id,
      role: req.user.role,
      email: req.user.email,
    });

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

/**
 * Authorize specific roles
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("🔑 Checking role authorization...");
    console.log("  Required roles:", roles);
    console.log("  User role:", req.user?.role);

    if (!req.user) {
      console.log("❌ No user found in request");
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(
        `❌ User role '${req.user.role}' not in allowed roles:`,
        roles,
      );
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    console.log(`✅ User role '${req.user.role}' authorized`);
    next();
  };
};
