"use strict";

// server/config/cors.js
var getCorsOptions = function getCorsOptions() {
  var allowedOrigins = process.env.NODE_ENV === "production" ? [process.env.CLIENT_URL, // Primary production URL
  "https://connectingconstructions1.netlify.app", "https://connectingconstructions1.vercel.app"].filter(Boolean) // Remove undefined values
  : ["http://localhost:3000", "http://localhost:3001"];
  return {
    origin: function origin(_origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!_origin) return callback(null, true);

      if (allowedOrigins.includes(_origin)) {
        callback(null, true);
      } else {
        console.warn("\u26A0\uFE0F  Blocked CORS request from origin: ".concat(_origin));
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeadrers: ["Set-Cookie"]
  };
};

module.exports = getCorsOptions;