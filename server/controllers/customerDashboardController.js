// server/controllers/customerDashboardController.js
const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");
const ViewHistory = require("../models/ViewHistory");
const SupportRequest = require("../models/SupportRequest");
const mongoose = require("mongoose"); // For ObjectId if needed for complex aggregations

// @desc    Get aggregated data for the customer dashboard
// @route   GET /api/customer/dashboard
// @access  Private (Customer only)
const getCustomerDashboardData = async (req, res) => {
  // CHANGED: from exports.getCustomerDashboardData to const getCustomerDashboardData
  // The 'authorizeRoles("customer")' middleware ensures only customers can hit this endpoint
  const customerId = req.user.id; // Get the customer's ID from the authenticated user

  try {
    // 1. Orders Made (Total number of orders)
    const ordersMade = await Order.countDocuments({
      user: customerId,
      isPaid: true,
    });

    // 2. Wishlist Items (Total number of items in wishlist)
    const wishlistItems = await Wishlist.countDocuments({ user: customerId });

    // 3. History Viewed (Total number of unique products viewed)
    const historyViewed = await ViewHistory.countDocuments({
      user: customerId,
    });

    // 4. Support Requests (Total number of support requests submitted by customer)
    const supportRequests = await SupportRequest.countDocuments({
      user: customerId,
    });

    // 5. Recent Orders (e.g., top 5 most recent paid orders)
    const recentOrders = await Order.find({ user: customerId, isPaid: true })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(5) // Get top 5
      .populate("orderItems.product", "name price imageUrls") // Populate product details
      .select("orderItems totalPrice createdAt isPaid isDelivered"); // Select relevant fields

    res.json({
      ordersMade,
      wishlistItems,
      historyViewed,
      supportRequests,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching customer dashboard data:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data.",
      error: error.message,
    });
  }
};

// CRITICAL: This module.exports block MUST be at the very end
module.exports = {
  getCustomerDashboardData,
};
