"use strict";

// server/middleware/authMiddleware.js
var _require = require("../utils/tokenUtils"),
    verifyAccessToken = _require.verifyAccessToken;

var User = require("../models/User"); // Protect routes - verify access token from Authorization header


var protect = function protect(req, res, next) {
  var token, decoded;
  return regeneratorRuntime.async(function protect$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          // Extract token from Authorization header
          if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
          }

          if (token) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: "Not authorized, no token provided"
          }));

        case 4:
          // Verify token
          decoded = verifyAccessToken(token); // Fetch user from database

          _context.next = 7;
          return regeneratorRuntime.awrap(User.findById(decoded.id).select("-password"));

        case 7:
          req.user = _context.sent;

          if (req.user) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: "User not found"
          }));

        case 10:
          // Attach role for convenience
          req.user.role = decoded.role;
          next();
          _context.next = 20;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error("Auth middleware error:", _context.t0.message); // Handle specific JWT errors

          if (!(_context.t0.message === "Invalid or expired access token")) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: "Token expired, please refresh",
            code: "TOKEN_EXPIRED"
          }));

        case 19:
          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: "Not authorized, token failed"
          }));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // Authorize specific roles


var authorizeRoles = function authorizeRoles() {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this resource"
      });
    }

    next();
  };
};

module.exports = {
  protect: protect,
  authorizeRoles: authorizeRoles
};