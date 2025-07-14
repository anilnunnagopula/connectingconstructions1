const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendOtp,
  resetPassword, // all in one clean import
} = require("../controllers/authController");

// Define routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
