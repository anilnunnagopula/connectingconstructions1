const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  sendOtp,
  resetPassword,
  getUserProfile, 
  updateUserProfile, 
  completeUserProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware"); // NEW: Import protect middleware

// Define public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);

// NEW: Private routes for user profile management
router
  .route("/profile")
  .get(protect, getUserProfile) 
  .put(protect, updateUserProfile);
router.post("/complete-profile", protect, completeUserProfile);
module.exports = router;
