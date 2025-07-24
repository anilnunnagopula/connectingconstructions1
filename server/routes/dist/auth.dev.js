"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/authController"),
    registerUser = _require.registerUser,
    loginUser = _require.loginUser,
    sendOtp = _require.sendOtp,
    resetPassword = _require.resetPassword,
    getUserProfile = _require.getUserProfile,
    updateUserProfile = _require.updateUserProfile;

var _require2 = require("../middleware/authMiddleware"),
    protect = _require2.protect; // NEW: Import protect middleware
// Define public routes


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword); // NEW: Private routes for user profile management

router.route("/profile").get(protect, getUserProfile) // GET /api/auth/profile - Get current user's profile, requires authentication
.put(protect, updateUserProfile); // PUT /api/auth/profile - Update current user's profile, requires authentication

module.exports = router;