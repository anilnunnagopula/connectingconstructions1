"use strict";

// server/routes/auth.js
var express = require("express");

var router = express.Router();

var _require = require("../controllers/authController"),
    registerUser = _require.registerUser,
    loginUser = _require.loginUser,
    googleLogin = _require.googleLogin,
    forgotPassword = _require.forgotPassword,
    resetPassword = _require.resetPassword,
    verifyResetToken = _require.verifyResetToken,
    getUserProfile = _require.getUserProfile,
    updateUserProfile = _require.updateUserProfile,
    refreshAccessToken = _require.refreshAccessToken,
    logoutUser = _require.logoutUser,
    logoutAllDevices = _require.logoutAllDevices;

var _require2 = require("../middleware/authMiddleware"),
    protect = _require2.protect;

var _require3 = require("../middleware/rateLimiter.middleware"),
    authLimiter = _require3.authLimiter,
    passwordResetLimiter = _require3.passwordResetLimiter,
    refreshLimiter = _require3.refreshLimiter;

var _require4 = require("../middleware/validation.middleware"),
    validate = _require4.validate;

var _require5 = require("../utils/validators"),
    registerValidator = _require5.registerValidator,
    loginValidator = _require5.loginValidator,
    googleLoginValidator = _require5.googleLoginValidator,
    forgotPasswordValidator = _require5.forgotPasswordValidator,
    resetPasswordValidator = _require5.resetPasswordValidator,
    updateProfileValidator = _require5.updateProfileValidator; // ===== PUBLIC ROUTES =====
// Registration & Login (rate limited + validated)


router.post("/register", authLimiter, registerValidator, validate, registerUser);
router.post("/login", authLimiter, loginValidator, validate, loginUser);
router.post("/google", authLimiter, googleLoginValidator, validate, googleLogin); // Password Reset (rate limited + validated)

router.post("/forgot-password", passwordResetLimiter, forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, resetPasswordValidator, validate, resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken); // Token Refresh (rate limited)

router.post("/refresh", refreshLimiter, refreshAccessToken); // ===== PROTECTED ROUTES =====
// Profile Management

router.route("/profile").get(protect, getUserProfile).put(protect, updateProfileValidator, validate, updateUserProfile); // Logout

router.post("/logout", protect, logoutUser);
router.post("/logout-all", protect, logoutAllDevices);
module.exports = router;