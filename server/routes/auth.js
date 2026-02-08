// server/routes/auth.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const {
  authLimiter,
  passwordResetLimiter,
  refreshLimiter,
} = require("../middleware/rateLimiter.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  registerValidator,
  loginValidator,
  googleLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
} = require("../utils/validators");

// ===== PUBLIC ROUTES =====

// Registration & Login (rate limited + validated)
router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  registerUser,
);

router.post("/login", authLimiter, loginValidator, validate, loginUser);

router.post(
  "/google",
  authLimiter,
  googleLoginValidator,
  validate,
  googleLogin,
);

// Password Reset (rate limited + validated)
router.post(
  "/forgot-password",
  passwordResetLimiter,
  forgotPasswordValidator,
  validate,
  forgotPassword,
);

router.post(
  "/reset-password/:token",
  passwordResetLimiter,
  resetPasswordValidator,
  validate,
  resetPassword,
);

router.get("/verify-reset-token/:token", verifyResetToken);

// Token Refresh (rate limited)
router.post("/refresh", refreshLimiter, refreshAccessToken);

// ===== PROTECTED ROUTES =====

// Profile Management
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateProfileValidator, validate, updateUserProfile);

// Logout
router.post("/logout", protect, logoutUser);
router.post("/logout-all", protect, logoutAllDevices);

module.exports = router;
