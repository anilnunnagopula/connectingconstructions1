"use strict";

// server/routes/orders.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles;

var _require2 = require("../controllers/orderController"),
    createOrder = _require2.createOrder,
    getCustomerOrders = _require2.getCustomerOrders,
    getOrderById = _require2.getOrderById,
    cancelOrder = _require2.cancelOrder; // All routes require customer authentication


router.use(protect);
router.use(authorizeRoles("customer")); // Create order

router.post("/create", createOrder); // Get customer orders

router.get("/", getCustomerOrders); // Get single order

router.get("/:orderId", getOrderById); // Cancel order

router.put("/:orderId/cancel", cancelOrder);
module.exports = router;