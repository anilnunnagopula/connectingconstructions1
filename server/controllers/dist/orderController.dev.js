"use strict";

// server/controllers/orderController.js
var Order = require("../models/OrderModel"); // Assuming your Mongoose Order model
const Product = require('../models/Product'); // Might need this if filtering by product.supplier
// @desc    Get all orders for the authenticated supplier
// @route   GET /api/supplier/orders
// @access  Private (Supplier only)


exports.getSupplierOrders = function _callee(req, res) {
  var supplierId, orders;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user.id; // From 'protect' middleware (assuming this is supplier's _id)
          // Find orders where at least one product in the order's items array belongs to this supplier
          // This assumes your Order model's 'products' array has a 'supplier' field for each item.

          _context.next = 4;
          return regeneratorRuntime.awrap(Order.find({
            "products.supplier": supplierId
          }).populate("customer", "name email") // Populate customer details
          .sort({
            createdAt: -1
          }));

        case 4:
          orders = _context.sent;
          // Sort by newest first
          // Optional: If you need to return only the items *from this supplier* within each order,
          // you might need to process the orders array after fetching.
          // For simplicity, this returns full orders that contain supplier's products.
          res.status(200).json(orders);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching supplier orders:", _context.t0);
          res.status(500).json({
            message: "Failed to fetch orders",
            error: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // @desc    Update order status for a specific order (supplier's own order)
// @route   PUT /api/supplier/orders/:id/status
// @access  Private (Supplier only)


exports.updateOrderStatus = function _callee2(req, res) {
  var orderId, supplierId, status, allowedStatuses, order;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          orderId = req.params.id;
          supplierId = req.user.id;
          status = req.body.status; // New status from frontend

          if (status) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "New status is required."
          }));

        case 6:
          // Validate if the new status is one of your allowed statuses
          allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

          if (allowedStatuses.includes(status)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid order status provided."
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: orderId,
            "products.supplier": supplierId // Ensure this order is relevant to the supplier

          }));

        case 11:
          order = _context2.sent;

          if (order) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Order not found or you are not authorized to update this order."
          }));

        case 14:
          // Update the order status
          order.orderStatus = status; // Optionally, add to an order history array in the model if you track status changes
          // order.statusHistory.push({ status: newStatus, timestamp: new Date() });

          _context2.next = 17;
          return regeneratorRuntime.awrap(order.save());

        case 17:
          res.status(200).json({
            message: "Order status updated successfully!",
            order: order
          });
          _context2.next = 26;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](0);
          console.error("Error updating order status:", _context2.t0);

          if (!(_context2.t0.name === "CastError")) {
            _context2.next = 25;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid order ID format."
          }));

        case 25:
          res.status(500).json({
            message: "Failed to update order status",
            error: _context2.t0.message
          });

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 20]]);
};