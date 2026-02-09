// server/routes/orders.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createOrder,
  getCustomerOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

// All routes require customer authentication
router.use(protect);
router.use(authorizeRoles("customer"));

// Create order
router.post("/create", createOrder);

// Get customer orders
router.get("/", getCustomerOrders);

// Get single order
router.get("/:orderId", getOrderById);

// Cancel order
router.put("/:orderId/cancel", cancelOrder);

module.exports = router;
