"use strict";

// server/middleware/rateLimiter.middleware.js
var rateLimit = require("express-rate-limit"); // General API rate limiter (100 requests per 15 minutes)


var apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
}); // Strict rate limiter for auth endpoints (5 attempts per 15 minutes)

var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  // Don't count successful logins
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes."
  }
}); // Password reset rate limiter (3 attempts per hour)

var passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  // 1 hour
  max: 3,
  message: {
    success: false,
    message: "Too many password reset attempts, please try again after 1 hour."
  }
}); // Refresh token rate limiter (30 requests per 15 minutes)

var refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many refresh attempts, please try again later."
  }
});
module.exports = {
  apiLimiter: apiLimiter,
  authLimiter: authLimiter,
  passwordResetLimiter: passwordResetLimiter,
  refreshLimiter: refreshLimiter
};