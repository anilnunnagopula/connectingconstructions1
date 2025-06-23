const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const app = express();
require("dotenv").config();
app.use(express.json());
// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON body

// Routes
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
