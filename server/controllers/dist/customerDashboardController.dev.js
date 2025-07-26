"use strict";

// server/controllers/customerDashboardController.js
var Order = require("../models/Order");

var Wishlist = require("../models/Wishlist");

var ViewHistory = require("../models/ViewHistory");

var SupportRequest = require("../models/SupportRequest");

var mongoose = require("mongoose"); // For ObjectId if needed for complex aggregations
// @desc    Get aggregated data for the customer dashboard
// @route   GET /api/customer/dashboard
// @access  Private (Customer only)


var getCustomerDashboardData = function getCustomerDashboardData(req, res) {
  var customerId, ordersMade, wishlistItems, historyViewed, supportRequests, recentOrders;
  return regeneratorRuntime.async(function getCustomerDashboardData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // CHANGED: from exports.getCustomerDashboardData to const getCustomerDashboardData
          // The 'authorizeRoles("customer")' middleware ensures only customers can hit this endpoint
          customerId = req.user.id; // Get the customer's ID from the authenticated user

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Order.countDocuments({
            user: customerId,
            isPaid: true
          }));

        case 4:
          ordersMade = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(Wishlist.countDocuments({
            user: customerId
          }));

        case 7:
          wishlistItems = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(ViewHistory.countDocuments({
            user: customerId
          }));

        case 10:
          historyViewed = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(SupportRequest.countDocuments({
            user: customerId
          }));

        case 13:
          supportRequests = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(Order.find({
            user: customerId,
            isPaid: true
          }).sort({
            createdAt: -1
          }) // Most recent first
          .limit(5) // Get top 5
          .populate("orderItems.product", "name price imageUrls") // Populate product details
          .select("orderItems totalPrice createdAt isPaid isDelivered"));

        case 16:
          recentOrders = _context.sent;
          // Select relevant fields
          res.json({
            ordersMade: ordersMade,
            wishlistItems: wishlistItems,
            historyViewed: historyViewed,
            supportRequests: supportRequests,
            recentOrders: recentOrders
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](1);
          console.error("Error fetching customer dashboard data:", _context.t0);
          res.status(500).json({
            message: "Failed to fetch dashboard data.",
            error: _context.t0.message
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 20]]);
}; // CRITICAL: This module.exports block MUST be at the very end


module.exports = {
  getCustomerDashboardData: getCustomerDashboardData
};