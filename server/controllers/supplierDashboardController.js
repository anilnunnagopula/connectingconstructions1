// server/controllers/supplierDashboardController.js
const Product = require("../models/Product");
const Order = require("../models/OrderModel"); // Corrected path based on previous discussion
const Review = require("../models/Review");
const User = require("../models/User"); // Required for user details in orders/reviews
const mongoose = require("mongoose");

// @desc    Get aggregated data for the supplier dashboard
// @route   GET /api/supplier/dashboard
// @access  Private (Supplier only)
const getSupplierDashboardData = async (req, res) => {
  // CHANGED: from exports.getSupplierDashboardData to const getSupplierDashboardData
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

    const recentProductAdds = await Product.find({ supplier: supplierId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name createdAt");

    const recentOrdersTimeline = await Order.find({
      "orderItems.supplier": supplierId,
      isPaid: true,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("user", "name")
      .select("orderItems createdAt");

    const recentReviews = await Review.find({
      product: {
        $in: await Product.find({ supplier: supplierId }).distinct("_id"),
      },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("user", "name")
      .populate("product", "name")
      .select("rating comment createdAt");

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
          _id: "$orderItems.product",
          totalOrders: { $sum: 1 },
          totalQuantitySold: { $sum: "$orderItems.qty" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] },
          },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$productDetails.name",
          category: "$productDetails.category",
          orders: "$totalOrders",
          revenue: "$totalRevenue",
          stock: "$productDetails.quantity",
        },
      },
    ]);

    const customerFeedback = recentReviews;

    const deliveryStatusOrders = await Order.find({
      "orderItems.supplier": supplierId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("orderItems.product", "name")
      .select("orderItems isPaid isDelivered deliveredAt createdAt");

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
      createdAt: order.createdAt,
    }));

    const notifications = [];

    recentProductAdds.forEach((p) =>
      notifications.push({
        type: "Product Added",
        message: `You added '${p.name}'.`,
        timestamp: p.createdAt,
        read: false,
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

    const lowStockProducts = await Product.find({
      supplier: supplierId,
      quantity: { $lte: 10, $gt: 0 },
    }).select("name quantity createdAt");
    lowStockProducts.forEach((p) =>
      notifications.push({
        type: "Stock Alert",
        message: `'${p.name}' is low in stock (${p.quantity} left).`,
        timestamp: new Date(),
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

    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    res.json({
      totalProducts,
      totalEarnings,
      totalOrders,
      averageRating,
      topSellingProducts,
      customerFeedback,
      deliveryStatusOrders: formattedDeliveryStatusOrders,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching supplier dashboard data:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data.",
      error: error.message,
    });
  }
};

// CRITICAL: Add this module.exports block at the very end
module.exports = {
  getSupplierDashboardData,
};
