// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth"); // Your existing auth routes
const supplierRoutes = require("./routes/supplierRoutes"); // <--- ADD THIS LINE

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Ensure this matches your frontend URL
    credentials: true,
  })
);
app.use(express.json()); // Essential for parsing JSON request bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes); // <--- ADD THIS LINE: Use the new supplier routes

// Basic route for testing server
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
