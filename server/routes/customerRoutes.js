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
  getSuppliersFromOrders,
} = require("../controllers/customerController");

// Import customer dashboard and profile controller functions
const {
  getCustomerDashboardData,
} = require("../controllers/customerDashboardController");
const { getCustomerAnalytics } = require("../controllers/analyticsController");
const {
  getCustomerProfile,
  updateCustomerProfile,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/customerProfileController");

// Import customer address controller functions
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/customerAddressController");

// Import invoice controller functions
const {
  getInvoices,
  downloadInvoice,
  previewInvoice,
} = require("../controllers/invoiceController");

// --- Customer-specific Protected Routes (Require authentication and 'customer' role) ---

// Customer Dashboard Data
router.get(
  "/dashboard",
  protect,
  authorizeRoles("customer"),
  getCustomerDashboardData
); // GET /api/customer/dashboard

// Customer Analytics
router.get(
  "/analytics",
  protect,
  authorizeRoles("customer"),
  getCustomerAnalytics
);

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

// Customer Address Management
router
  .route("/addresses")
  .get(protect, authorizeRoles("customer"), getAddresses) // GET /api/customer/addresses
  .post(protect, authorizeRoles("customer"), createAddress); // POST /api/customer/addresses

router
  .route("/addresses/:id")
  .put(protect, authorizeRoles("customer"), updateAddress) // PUT /api/customer/addresses/:id
  .delete(protect, authorizeRoles("customer"), deleteAddress); // DELETE /api/customer/addresses/:id

router.put(
  "/addresses/:id/default",
  protect,
  authorizeRoles("customer"),
  setDefaultAddress
); // PUT /api/customer/addresses/:id/default

// Invoice Management
router.get("/invoices", protect, authorizeRoles("customer"), getInvoices); // GET /api/customer/invoices

router.get(
  "/invoices/:orderId/download",
  protect,
  authorizeRoles("customer"),
  downloadInvoice
); // GET /api/customer/invoices/:orderId/download

router.get(
  "/invoices/:orderId/preview",
  protect,
  authorizeRoles("customer"),
  previewInvoice
); // GET /api/customer/invoices/:orderId/preview

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

// Messaging - Get suppliers from past orders
router.get(
  "/suppliers-from-orders",
  protect,
  authorizeRoles("customer"),
  getSuppliersFromOrders
); // GET /api/customer/suppliers-from-orders

module.exports = router;
