// server/middleware/rateLimiter.middleware.js
const rateLimit = require("express-rate-limit");

// General API rate limiter (500 requests per 15 minutes for development, 100 for production)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 500, // Higher limit for development
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints (100 attempts per 15 minutes for dev)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skipSuccessfulRequests: true, // Don't count successful logins
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});

// Password reset rate limiter (10 attempts per hour)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Increased for development
  message: {
    success: false,
    message: "Too many password reset attempts, please try again after 1 hour.",
  },
});

// Refresh token rate limiter (30 requests per 15 minutes)
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: "Too many refresh attempts, please try again later.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  refreshLimiter,
};
