const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendOtp,
  resetPassword,
  getUserProfile, // NEW: Imported
  updateUserProfile, // NEW: Imported
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware"); // NEW: Import protect middleware

// Define public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);

// NEW: Private routes for user profile management
router
  .route("/profile")
  .get(protect, getUserProfile) // GET /api/auth/profile - Get current user's profile, requires authentication
  .put(protect, updateUserProfile); // PUT /api/auth/profile - Update current user's profile, requires authentication

module.exports = router;
