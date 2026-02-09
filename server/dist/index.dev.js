"use strict";

// server/index.js
require("dotenv").config();

var express = require("express");

var cors = require("cors");

var helmet = require("helmet");

var cookieParser = require("cookie-parser"); // Import configurations


var connectDB = require("./config/db");

var getCorsOptions = require("./config/cors"); // Import middleware


var _require = require("./middleware/rateLimiter.middleware"),
    apiLimiter = _require.apiLimiter;

var _require2 = require("./middleware/error.middleware"),
    notFound = _require2.notFound,
    errorHandler = _require2.errorHandler; // ===== IMPORT ROUTES =====


var authRoutes = require("./routes/auth");

var supplierRoutes = require("./routes/supplierRoutes");

var customerRoutes = require("./routes/customerRoutes");

var generalRoutes = require("./routes/generalRoutes");

var cartRoutes = require("./routes/cart");

var orderRoutes = require("./routes/orders");

var quoteRoutes = require("./routes/quotes"); // Initialize app


var app = express(); // Connect to MongoDB

connectDB(); // ===== SECURITY MIDDLEWARE =====

app.use(helmet()); // Security headers

app.use(cors(getCorsOptions())); // CORS with whitelist

app.use(cookieParser()); // Parse cookies
// ===== BODY PARSING =====

app.use(express.json({
  limit: "10mb"
}));
app.use(express.urlencoded({
  extended: true,
  limit: "10mb"
})); // ===== RATE LIMITING =====

app.use("/api", apiLimiter); // Apply to all API routes
// ===== REGISTER ROUTES =====

app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api", generalRoutes); // ===== HEALTH CHECK =====

app.get("/health", function (req, res) {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
}); // ===== ROOT ROUTE =====

app.get("/", function (req, res) {
  res.status(200).json({
    success: true,
    message: "ConnectConstructions API v2.0",
    environment: process.env.NODE_ENV || "development"
  });
}); // ===== ERROR HANDLING =====

app.use(notFound); // 404 handler

app.use(errorHandler); // Global error handler
// ===== START SERVER =====

var PORT = process.env.PORT || 5000;
var server = app.listen(PORT, function () {
  console.log("\uD83D\uDE80 Server running on port ".concat(PORT));
  console.log("\uD83D\uDCCC Environment: ".concat(process.env.NODE_ENV || "development"));
  console.log("\uD83D\uDCCB Registered routes: /api/auth, /api/supplier, /api/customer, /api/cart, /api/orders");
}); // Handle unhandled promise rejections

process.on("unhandledRejection", function (err) {
  console.error("\u274C Unhandled Rejection: ".concat(err.message));
  server.close(function () {
    return process.exit(1);
  });
});
module.exports = app;