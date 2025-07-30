// server/routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Import customer controller functions
const {
  createOrder,
  getMyOrders,
  getOrderById,
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
  recordProductView,
  getMyViewHistory,
  createSupportRequest,
  getMySupportRequests,
} = require("../controllers/customerController");

// Import customer dashboard and profile controller functions
const {
  getCustomerDashboardData,
} = require("../controllers/customerDashboardController");
const {
  getCustomerProfile,
  updateCustomerProfile,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/customerProfileController"); // NEW: Import profile controller

// --- Customer-specific Protected Routes (Require authentication and 'customer' role) ---

// Customer Dashboard Data
router.get(
  "/dashboard",
  protect,
  authorizeRoles("customer"),
  getCustomerDashboardData
); // GET /api/customer/dashboard

// Customer Profile Management
router
  .route("/profile")
  .get(protect, authorizeRoles("customer"), getCustomerProfile) // GET /api/customer/profile
  .put(protect, authorizeRoles("customer"), updateCustomerProfile); // PUT /api/customer/profile

// Customer Payment Methods Management
router
  .route("/payment-methods")
  .get(protect, authorizeRoles("customer"), getPaymentMethods) // GET /api/customer/payment-methods
  .post(protect, authorizeRoles("customer"), addPaymentMethod); // POST /api/customer/payment-methods

router
  .route("/payment-methods/:id")
  .put(protect, authorizeRoles("customer"), updatePaymentMethod) // PUT /api/customer/payment-methods/:id (e.g., set default)
  .delete(protect, authorizeRoles("customer"), deletePaymentMethod); // DELETE /api/customer/payment-methods/:id

// Order Management
router
  .route("/orders")
  .post(protect, authorizeRoles("customer"), createOrder)
  .get(protect, authorizeRoles("customer"), getMyOrders);

router.get("/orders/:id", protect, authorizeRoles("customer"), getOrderById);

// Wishlist Management
router
  .route("/wishlist")
  .post(protect, authorizeRoles("customer"), addToWishlist)
  .get(protect, authorizeRoles("customer"), getMyWishlist);

router.delete(
  "/wishlist/:id",
  protect,
  authorizeRoles("customer"),
  removeFromWishlist
);

// View History Management
router
  .route("/view-history")
  .post(protect, authorizeRoles("customer"), recordProductView)
  .get(protect, authorizeRoles("customer"), getMyViewHistory);

// Support Request Management
router
  .route("/support-requests")
  .post(protect, authorizeRoles("customer"), createSupportRequest)
  .get(protect, authorizeRoles("customer"), getMySupportRequests);

module.exports = router;
