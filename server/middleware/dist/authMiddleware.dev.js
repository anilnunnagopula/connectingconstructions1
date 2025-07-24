"use strict";

// middleware/authMiddleware.js
var jwt = require("jsonwebtoken");

var User = require("../models/User"); // @desc    Middleware to protect routes, verify JWT, and attach user to req


var protect = function protect(req, res, next) {
  var token, decoded;
  return regeneratorRuntime.async(function protect$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
            _context.next = 15;
            break;
          }

          _context.prev = 1;
          // Extract the token (e.g., "Bearer XXX.YYY.ZZZ" -> "XXX.YYY.ZZZ")
          token = req.headers.authorization.split(" ")[1]; // Verify the token using your JWT_SECRET from .env

          decoded = jwt.verify(token, process.env.JWT_SECRET); // Find the user by ID from the decoded token payload
          // .select('-password') prevents sending the hashed password back

          _context.next = 6;
          return regeneratorRuntime.awrap(User.findById(decoded.id).select("-password"));

        case 6:
          req.user = _context.sent;
          req.user.role = decoded.role; // Attach the role from the token to req.user for convenience

          next(); // Proceed to the next middleware or route handler

          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          console.error("Authentication token error:", _context.t0.message); // Respond with 401 Unauthorized if token is invalid or expired

          return _context.abrupt("return", res.status(401).json({
            message: "Not authorized, token failed or expired."
          }));

        case 15:
          if (token) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "Not authorized, no token provided."
          }));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}; // @desc    Middleware for role-based authorization
// @param   {...string} roles - An array of roles allowed to access the route (e.g., 'admin', 'supplier')


var authorizeRoles = function authorizeRoles() {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    // 'req.user' is populated by the 'protect' middleware
    // Check if user is authenticated and if their role is among the allowed roles
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      // Respond with 403 Forbidden if the user's role is not authorized
      return res.status(403).json({
        message: "Not authorized to access this resource (insufficient role)."
      });
    }

    next(); // User is authorized, proceed
  };
};

module.exports = {
  protect: protect,
  authorizeRoles: authorizeRoles
};