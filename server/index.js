// // index.js
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/auth");
// const supplierRoutes = require("./routes/supplierRoutes");
// const customerRoutes = require("./routes/customerRoutes");
// const generalRoutes = require("./routes/generalRoutes"); 

// const app = express();

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 30000,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://connectingconstructions1.netlify.app",
//       "https://connectingconstructions1.vercel.app",
//     ],
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Routes
// app.use("/api/auth", authRoutes); 
// app.use("/api/supplier", supplierRoutes);
// app.use("/api/customer", customerRoutes);
// app.use("/api", generalRoutes);

// // Basic route for testing server
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

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

// Import routes
const authRoutes = require("./routes/auth");
const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/customerRoutes");
const generalRoutes = require("./routes/generalRoutes");

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

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api", generalRoutes);

// Health check endpoint (for monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});