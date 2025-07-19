"use strict";

// index.js
require("dotenv").config();

var express = require("express");

var cors = require("cors");

var mongoose = require("mongoose");

var authRoutes = require("./routes/auth");

var supplierRoutes = require("./routes/supplierRoutes");

var app = express();
console.log("✅ MONGO_URI =", process.env.MONGO_URI); // Connect to MongoDB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000
}).then(function () {
  return console.log("✅ MongoDB connected");
})["catch"](function (err) {
  return console.error("❌ MongoDB connection error:", err);
}); // Middleware

app.use(cors({
  origin: ["http://localhost:3000", "https://connectingconstructions1.netlify.app"],
  credentials: true
}));
app.use(express.json({
  limit: "10mb"
}));
app.use(express.urlencoded({
  extended: true,
  limit: "10mb"
})); // Routes

app.use("/api/auth", authRoutes);
app.use("/api/supplier", supplierRoutes); // Basic route for testing server

app.get("/", function (req, res) {
  res.send("API is running...");
}); // Start server

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("\uD83D\uDE80 Server running on port ".concat(PORT));
});