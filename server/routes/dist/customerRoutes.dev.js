"use strict";

// server/routes/customerRoutes.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles; // Import customer controller functions


var _require2 = require("../controllers/customerController"),
    createOrder = _require2.createOrder,
    getMyOrders = _require2.getMyOrders,
    getOrderById = _require2.getOrderById,
    addToWishlist = _require2.addToWishlist,
    getMyWishlist = _require2.getMyWishlist,
    removeFromWishlist = _require2.removeFromWishlist,
    recordProductView = _require2.recordProductView,
    getMyViewHistory = _require2.getMyViewHistory,
    createSupportRequest = _require2.createSupportRequest,
    getMySupportRequests = _require2.getMySupportRequests; // Import customer dashboard and profile controller functions


var _require3 = require("../controllers/customerDashboardController"),
    getCustomerDashboardData = _require3.getCustomerDashboardData;

var _require4 = require("../controllers/customerProfileController"),
    getCustomerProfile = _require4.getCustomerProfile,
    updateCustomerProfile = _require4.updateCustomerProfile,
    getPaymentMethods = _require4.getPaymentMethods,
    addPaymentMethod = _require4.addPaymentMethod,
    updatePaymentMethod = _require4.updatePaymentMethod,
    deletePaymentMethod = _require4.deletePaymentMethod; // NEW: Import profile controller
// --- Customer-specific Protected Routes (Require authentication and 'customer' role) ---
// Customer Dashboard Data


router.get("/dashboard", protect, authorizeRoles("customer"), getCustomerDashboardData); // GET /api/customer/dashboard
// Customer Profile Management

router.route("/profile").get(protect, authorizeRoles("customer"), getCustomerProfile) // GET /api/customer/profile
.put(protect, authorizeRoles("customer"), updateCustomerProfile); // PUT /api/customer/profile
// Customer Payment Methods Management

router.route("/payment-methods").get(protect, authorizeRoles("customer"), getPaymentMethods) // GET /api/customer/payment-methods
.post(protect, authorizeRoles("customer"), addPaymentMethod); // POST /api/customer/payment-methods

router.route("/payment-methods/:id").put(protect, authorizeRoles("customer"), updatePaymentMethod) // PUT /api/customer/payment-methods/:id (e.g., set default)
["delete"](protect, authorizeRoles("customer"), deletePaymentMethod); // DELETE /api/customer/payment-methods/:id
// Order Management

router.route("/orders").post(protect, authorizeRoles("customer"), createOrder).get(protect, authorizeRoles("customer"), getMyOrders);
router.get("/orders/:id", protect, authorizeRoles("customer"), getOrderById); // Wishlist Management

router.route("/wishlist").post(protect, authorizeRoles("customer"), addToWishlist).get(protect, authorizeRoles("customer"), getMyWishlist);
router["delete"]("/wishlist/:id", protect, authorizeRoles("customer"), removeFromWishlist); // View History Management

router.route("/view-history").post(protect, authorizeRoles("customer"), recordProductView).get(protect, authorizeRoles("customer"), getMyViewHistory); // Support Request Management

router.route("/support-requests").post(protect, authorizeRoles("customer"), createSupportRequest).get(protect, authorizeRoles("customer"), getMySupportRequests);
module.exports = router;