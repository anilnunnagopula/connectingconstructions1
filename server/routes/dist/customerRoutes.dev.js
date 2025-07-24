"use strict";

// server/routes/customerRoutes.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles; // Import middlewares
// Import customer controller functions


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
    getMySupportRequests = _require2.getMySupportRequests; // Import customer dashboard controller function


var _require3 = require("../controllers/customerDashboardController"),
    getCustomerDashboardData = _require3.getCustomerDashboardData; // --- Customer-specific Protected Routes (Require authentication and 'customer' role) ---
// Customer Dashboard Data


router.get("/dashboard", protect, authorizeRoles("customer"), getCustomerDashboardData); // GET /api/customer/dashboard
// Order Management

router.route("/orders").post(protect, authorizeRoles("customer"), createOrder) // POST /api/customer/orders - Create a new order
.get(protect, authorizeRoles("customer"), getMyOrders); // GET /api/customer/orders - Get all orders for the customer

router.get("/orders/:id", protect, authorizeRoles("customer"), getOrderById); // GET /api/customer/orders/:id - Get a single order
// Wishlist Management

router.route("/wishlist").post(protect, authorizeRoles("customer"), addToWishlist) // POST /api/customer/wishlist - Add to wishlist
.get(protect, authorizeRoles("customer"), getMyWishlist); // GET /api/customer/wishlist - Get customer's wishlist

router["delete"]("/wishlist/:id", protect, authorizeRoles("customer"), removeFromWishlist); // DELETE /api/customer/wishlist/:id - Remove from wishlist
// View History Management

router.route("/view-history").post(protect, authorizeRoles("customer"), recordProductView) // POST /api/customer/view-history - Record product view
.get(protect, authorizeRoles("customer"), getMyViewHistory); // GET /api/customer/view-history - Get customer's view history
// Support Request Management

router.route("/support-requests").post(protect, authorizeRoles("customer"), createSupportRequest) // POST /api/customer/support-requests - Submit new request
.get(protect, authorizeRoles("customer"), getMySupportRequests); // GET /api/customer/support-requests - Get customer's requests

module.exports = router;