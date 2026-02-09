// server/controllers/supplierDashboardController.js
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

/**
 * @desc    Get supplier dashboard summary
 * @route   GET /api/supplier/dashboard
 * @access  Private (Supplier only)
 */
exports.getSupplierDashboardData = async (req, res) => {
  try {
    const supplierId = req.user._id;

    // ✨ Use Promise.all for parallel execution
    const [totalProducts, orderStats, weeklySalesData] = await Promise.all([
      // 1. Total Products
      Product.countDocuments({
        supplier: supplierId,
        isDeleted: false,
      }),

      // 2. Order Statistics (earnings, orders, products sold)
      Order.aggregate([
        {
          $match: {
            "products.supplier": supplierId,
            orderStatus: "Delivered",
            isDeleted: false,
          },
        },
        { $unwind: "$products" },
        {
          $match: {
            "products.supplier": supplierId,
          },
        },
        {
          $group: {
            _id: null,
            totalEarnings: {
              $sum: { $multiply: ["$products.price", "$products.quantity"] },
            },
            totalProductsSold: { $sum: "$products.quantity" },
            orderIds: { $addToSet: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            totalEarnings: 1,
            totalOrders: { $size: "$orderIds" },
            totalProductsSold: 1,
          },
        },
      ]),

      // 3. Weekly Sales Data
      Order.aggregate([
        {
          $match: {
            "products.supplier": supplierId,
            orderStatus: "Delivered",
            isDeleted: false,
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        { $unwind: "$products" },
        {
          $match: {
            "products.supplier": supplierId,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            dailyEarnings: {
              $sum: { $multiply: ["$products.price", "$products.quantity"] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const dashboardSummary =
      orderStats.length > 0
        ? orderStats[0]
        : { totalEarnings: 0, totalOrders: 0, totalProductsSold: 0 };

    // ✨ Calculate average rating from products
    const productsWithRatings = await Product.find({
      supplier: supplierId,
      isDeleted: false,
      numReviews: { $gt: 0 },
    })
      .select("averageRating numReviews")
      .lean();

    let averageRating = 0;
    if (productsWithRatings.length > 0) {
      const totalRating = productsWithRatings.reduce(
        (sum, p) => sum + p.averageRating * p.numReviews,
        0,
      );
      const totalReviews = productsWithRatings.reduce(
        (sum, p) => sum + p.numReviews,
        0,
      );
      averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    }

    // Format weekly data for chart
    const dailyEarningsMap = new Map();
    weeklySalesData.forEach((item) => {
      dailyEarningsMap.set(item._id, item.dailyEarnings);
    });

    const labels = [];
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateString = date.toISOString().split("T")[0];
      labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
      data.push(dailyEarningsMap.get(dateString) || 0);
    }

    console.log(`📊 Supplier dashboard data fetched: ${supplierId}`);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalEarnings: dashboardSummary.totalEarnings,
        totalOrders: dashboardSummary.totalOrders,
        averageRating: parseFloat(averageRating.toFixed(1)),
        weeklyEarnings: {
          labels,
          data,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching supplier dashboard data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard data",
      details: error.message,
    });
  }
};
