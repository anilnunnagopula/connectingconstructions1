const express = require("express");
const router = express.Router();
const { registerUser, loginUser,sendOtp,verifyOtp } = require("../controllers/authController");
const { resetPassword } = require("../controllers/authController");
// Use controller methods only
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
