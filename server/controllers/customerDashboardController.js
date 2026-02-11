// server/controllers/customerDashboardController.js
const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");
const ViewHistory = require("../models/ViewHistory");
const SupportRequest = require("../models/SupportRequest");
const Notification = require("../models/Notification");

/**
 * @desc    Get aggregated data for customer dashboard
 * @route   GET /api/customer/dashboard
 * @access  Private (Customer only)
 */
const getCustomerDashboardData = async (req, res) => {
  try {
    const customerId = req.user._id;

    // ✨ Use Promise.all for parallel execution (much faster)
    const [
      ordersMade,
      wishlistItems,
      historyViewed,
      supportRequests,
      unreadNotifications,
      recentOrders,
    ] = await Promise.all([
      // 1. Total orders
      Order.countDocuments({
        customer: customerId, // Updated field name
        isDeleted: false,
      }),

      // 2. Wishlist count
      Wishlist.countDocuments({ user: customerId }),

      // 3. View history count
      ViewHistory.countDocuments({ user: customerId }),

      // 4. Support requests count
      SupportRequest.countDocuments({ user: customerId }),

      // 5. Unread notifications count
      Notification.countDocuments({ recipient: customerId, read: false }),

      // 6. Recent orders (top 5)
      Order.find({ customer: customerId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("products.productId", "name price imageUrls")
        .select("products totalAmount createdAt orderStatus")
        .lean(),
    ]);

    console.log(`📊 Customer dashboard data fetched: ${customerId}`);

    res.json({
      success: true,
      data: {
        ordersMade,
        wishlistItems,
        historyViewed,
        supportRequests,
        unreadNotificationsCount: unreadNotifications,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching customer dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data.",
      error: error.message,
    });
  }
};

module.exports = {
  getCustomerDashboardData,
};
