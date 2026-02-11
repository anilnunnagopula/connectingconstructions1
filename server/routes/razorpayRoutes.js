// server/routes/razorpayRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  getPaymentDetails,
  issueRefund,
} = require("../controllers/razorpayController");

// All routes require authentication and customer role
router.use(protect);
router.use(authorizeRoles("customer"));

// Create Razorpay order
router.post("/create-order", createRazorpayOrder);

// Verify payment signature
router.post("/verify-payment", verifyRazorpayPayment);

// Handle payment failure
router.post("/payment-failed", handlePaymentFailure);

// Get payment details
router.get("/payment/:paymentId", getPaymentDetails);

// Issue refund
router.post("/refund", issueRefund);

module.exports = router;
