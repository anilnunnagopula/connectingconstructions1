// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Import configurations
const connectDB = require("./config/db");
const getCorsOptions = require("./config/cors");

// Import middleware
const { apiLimiter } = require("./middleware/rateLimiter.middleware");
const { notFound, errorHandler } = require("./middleware/error.middleware");

// ===== IMPORT ROUTES =====
const authRoutes = require("./routes/auth");
const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/customerRoutes");
const generalRoutes = require("./routes/generalRoutes");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const quoteRoutes = require("./routes/quotes");
// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// ===== SECURITY MIDDLEWARE =====
app.use(helmet()); // Security headers
app.use(cors(getCorsOptions())); // CORS with whitelist
app.use(cookieParser()); // Parse cookies

// ===== BODY PARSING =====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===== RATE LIMITING =====
app.use("/api", apiLimiter); // Apply to all API routes

// ===== REGISTER ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api", generalRoutes);

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ===== ROOT ROUTE =====
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ConnectConstructions API v2.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// ===== ERROR HANDLING =====
app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📋 Registered routes: /api/auth, /api/supplier, /api/customer, /api/cart, /api/orders`,
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
