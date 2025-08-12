"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/authController"),
    registerUser = _require.registerUser,
    loginUser = _require.loginUser,
    googleLogin = _require.googleLogin,
    sendOtp = _require.sendOtp,
    resetPassword = _require.resetPassword,
    getUserProfile = _require.getUserProfile,
    updateUserProfile = _require.updateUserProfile,
    completeUserProfile = _require.completeUserProfile;

var _require2 = require("../middleware/authMiddleware"),
    protect = _require2.protect; // NEW: Import protect middleware
// Define public routes


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword); // NEW: Private routes for user profile management

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);
router.post("/complete-profile", protect, completeUserProfile);
module.exports = router;