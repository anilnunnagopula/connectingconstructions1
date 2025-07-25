// server/controllers/supplierDashboardController.js
const Product = require("../models/Product");
const Order = require("../models/Order"); // Corrected path based on previous discussion
const Review = require("../models/Review");
const User = require("../models/User"); // Required for user details in orders/reviews
const mongoose = require("mongoose");

// @desc    Get aggregated data for the supplier dashboard
// @route   GET /api/supplier/dashboard
// @access  Private (Supplier only)
exports.getSupplierDashboardData = async (req, res) => {
  const supplierId = req.user.id;

  try {
    // --- Existing Aggregations ---
    const totalProducts = await Product.countDocuments({
      supplier: supplierId,
    });

    const totalOrdersResult = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $match: {
          "orderItems.supplier": new mongoose.Types.ObjectId(supplierId),
          isPaid: true,
        },
      },
      { $group: { _id: "$user", count: { $addToSet: "$_id" } } },
      { $count: "totalOrders" },
    ]);
    const totalOrders =
      totalOrdersResult.length > 0 ? totalOrdersResult[0].totalOrders : 0;

    const earningsResult = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $match: {
          "orderItems.supplier": new mongoose.Types.ObjectId(supplierId),
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: {
            $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] },
          },
        },
      },
    ]);
    const totalEarnings =
      earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    const averageRatingResult = await Product.aggregate([
      {
        $match: {
          supplier: new mongoose.Types.ObjectId(supplierId),
          numReviews: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalRatingSum: {
            $sum: { $multiply: ["$averageRating", "$numReviews"] },
          },
          totalReviewsCount: { $sum: "$numReviews" },
        },
      },
      {
        $project: {
          _id: 0,
          overallAverageRating: {
            $divide: ["$totalRatingSum", "$totalReviewsCount"],
          },
        },
      },
    ]);
    const averageRating =
      averageRatingResult.length > 0
        ? parseFloat(averageRatingResult[0].overallAverageRating.toFixed(1))
        : 0;

    // --- NEW DATA FETCHES FOR DYNAMIC SECTIONS ---

    // 1. Recent Activity (Product Added, New Order, New Review, Stock Alert)
    // This is complex as it pulls from multiple collections. A simple approach is to fetch recent of each type.
    const recentProductAdds = await Product.find({ supplier: supplierId })
      .sort({ createdAt: -1 })
      .limit(3) // Fetch a few recent adds
      .select("name createdAt");

    const recentOrdersTimeline = await Order.find({
      "orderItems.supplier": supplierId,
      isPaid: true,
    })
      .sort({ createdAt: -1 })
      .limit(3) // Fetch a few recent orders
      .populate("user", "name") // Get customer name
      .select("orderItems createdAt");

    const recentReviews = await Review.find({
      product: {
        $in: await Product.find({ supplier: supplierId }).distinct("_id"),
      },
    })
      .sort({ createdAt: -1 })
      .limit(3) // Fetch a few recent reviews
      .populate("user", "name") // Get reviewer name
      .populate("product", "name") // Get product name
      .select("rating comment createdAt");

    // This section for recent activity will be an array of combined events sorted by date.
    // You'll need to combine and sort these on the frontend, or do a very complex server-side aggregation pipeline.
    // For now, let's just send these separate lists. Frontend will combine.

    // 2. Top-Selling Products
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $match: {
          "orderItems.supplier": new mongoose.Types.ObjectId(supplierId),
          isPaid: true,
        },
      },
      {
        $group: {
          _id: "$orderItems.product", // Group by product ID
          totalOrders: { $sum: 1 }, // Count how many times this product was in a paid order
          totalQuantitySold: { $sum: "$orderItems.qty" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] },
          },
        },
      },
      { $sort: { totalQuantitySold: -1 } }, // Sort by quantity sold descending
      { $limit: 5 }, // Get top 5
      {
        $lookup: {
          // Join with Product collection to get product details
          from: "products", // Collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Deconstruct productDetails array
      {
        $project: {
          // Shape the output
          _id: 0,
          productId: "$_id",
          name: "$productDetails.name",
          category: "$productDetails.category",
          orders: "$totalOrders",
          revenue: "$totalRevenue",
          stock: "$productDetails.quantity", // Get current stock from product
        },
      },
    ]);

    // 3. Customer Feedback (Recent Reviews)
    // This can be the same as recentReviews above, or filtered/paged differently
    const customerFeedback = recentReviews; // Reuse the already fetched reviews

    // 4. Delivery Status (Recent Orders with status)
    const deliveryStatusOrders = await Order.find({
      "orderItems.supplier": supplierId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name") // Get customer name
      .populate("orderItems.product", "name") // Get product name for order items
      .select("orderItems isPaid isDelivered deliveredAt createdAt");

    // Filter order items to only include those from the current supplier, and format for frontend
    const formattedDeliveryStatusOrders = deliveryStatusOrders.map((order) => ({
      orderId: order._id,
      buyerName: order.user ? order.user.name : "N/A",
      products: order.orderItems
        .filter((item) => item.supplier.equals(supplierId))
        .map((item) => ({
          name: item.product ? item.product.name : item.name,
          qty: item.qty,
        })),
      status: order.isDelivered
        ? "Delivered"
        : order.isPaid
        ? "Paid & Processing"
        : "Pending Payment",
      createdAt: order.createdAt, // For age/timeline
    }));

    // 5. Notifications (Combine recent activity and stock alerts)
    // This is a simplified approach; a real notification system would be more complex.
    const notifications = [];

    recentProductAdds.forEach((p) =>
      notifications.push({
        type: "Product Added",
        message: `You added '${p.name}'.`,
        timestamp: p.createdAt,
        read: false, // You'd store this in a real notification model
      })
    );

    recentOrdersTimeline.forEach((o) =>
      notifications.push({
        type: "New Order",
        message: `Order #${o._id.toString().slice(-6)} placed by ${
          o.user?.name || "a customer"
        } for ${o.orderItems
          .filter((item) => item.supplier.equals(supplierId))
          .map((item) => item.name)
          .join(", ")}.`,
        timestamp: o.createdAt,
        read: false,
      })
    );

    recentReviews.forEach((r) =>
      notifications.push({
        type: "New Review",
        message: `⭐️${r.rating} from ${r.user?.name || "a customer"} on '${
          r.product?.name || "your product"
        }'.`,
        timestamp: r.createdAt,
        read: false,
      })
    );

    // Example: Basic Stock Alert (You'd ideally check actual stock vs. a threshold in a scheduled task)
    const lowStockProducts = await Product.find({
      supplier: supplierId,
      quantity: { $lte: 10, $gt: 0 },
    }) // Quantity 1-10
      .select("name quantity createdAt");
    lowStockProducts.forEach((p) =>
      notifications.push({
        type: "Stock Alert",
        message: `'${p.name}' is low in stock (${p.quantity} left).`,
        timestamp: new Date(), // Use current time for alert generation
        read: false,
      })
    );
    const outOfStockProducts = await Product.find({
      supplier: supplierId,
      quantity: 0,
    }).select("name createdAt");
    outOfStockProducts.forEach((p) =>
      notifications.push({
        type: "Stock Alert",
        message: `'${p.name}' is out of stock!`,
        timestamp: new Date(),
        read: false,
      })
    );

    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by most recent

    // Combine all data into the response
    res.json({
      totalProducts,
      totalEarnings,
      totalOrders,
      averageRating,
      // recentOrders from the existing dashboardStat (can be reused if needed)
      // recentOrders (this is from the initial basic list, could be renamed to timelineRecentOrders)
      topSellingProducts,
      customerFeedback, // This is already reviews data
      deliveryStatusOrders: formattedDeliveryStatusOrders,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching supplier dashboard data:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch dashboard data.",
        error: error.message,
      });
  }
};
