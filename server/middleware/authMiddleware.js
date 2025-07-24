// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc    Middleware to protect routes, verify JWT, and attach user to req
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (e.g., "Bearer XXX.YYY.ZZZ" -> "XXX.YYY.ZZZ")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using your JWT_SECRET from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the decoded token payload
      // .select('-password') prevents sending the hashed password back
      req.user = await User.findById(decoded.id).select("-password");
      req.user.role = decoded.role; // Attach the role from the token to req.user for convenience

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Authentication token error:", error.message);
      // Respond with 401 Unauthorized if token is invalid or expired
      return res
        .status(401)
        .json({ message: "Not authorized, token failed or expired." });
    }
  }

  // If no token was provided in the request
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }
};

// @desc    Middleware for role-based authorization
// @param   {...string} roles - An array of roles allowed to access the route (e.g., 'admin', 'supplier')
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // 'req.user' is populated by the 'protect' middleware
    // Check if user is authenticated and if their role is among the allowed roles
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      // Respond with 403 Forbidden if the user's role is not authorized
      return res
        .status(403)
        .json({
          message:
            "Not authorized to access this resource (insufficient role).",
        });
    }
    next(); // User is authorized, proceed
  };
};

module.exports = { protect, authorizeRoles };
