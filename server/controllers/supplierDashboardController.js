// server/controllers/supplierDashboardController.js
const Product = require("../models/Product"); // Make sure this path is correct
const Order = require("../models/OrderModel"); // Make sure this path is correct
const User = require("../models/User"); // Make sure this path is correct (for supplier profile if needed)

// @desc    Get summary dashboard data for authenticated supplier
// @route   GET /api/supplier/dashboard
// @access  Private (Supplier only)
exports.getSupplierDashboardData = async (req, res) => {
  try {
    const supplierId = req.user.id; // Get supplier's _id from authenticated user

    // --- 1. Total Products ---
    const totalProducts = await Product.countDocuments({
      supplier: supplierId,
    });

    // --- 2. Total Earnings, Total Orders, Average Rating (from delivered orders) ---
    const orderAggregationResult = await Order.aggregate([
      {
        $match: {
          "products.supplier": supplierId, // Match orders with products from this supplier
          orderStatus: "Delivered", // Consider only delivered orders for these metrics
        },
      },
      {
        $unwind: "$products", // Deconstruct products array
      },
      {
        $match: {
          "products.supplier": supplierId, // Filter again for current supplier's products after unwind
        },
      },
      {
        $group: {
          _id: null, // Group all
          totalEarnings: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
          totalProductsSold: { $sum: "$products.quantity" },
          orderIds: { $addToSet: "$_id" }, // Get unique order IDs
        },
      },
      {
        $project: {
          _id: 0,
          totalEarnings: 1,
          totalOrders: { $size: "$orderIds" }, // Count unique orders
          totalProductsSold: 1,
        },
      },
    ]);

    const dashboardSummary =
      orderAggregationResult.length > 0
        ? orderAggregationResult[0]
        : { totalEarnings: 0, totalOrders: 0, totalProductsSold: 0 };

    // --- 3. Average Rating (requires Product model to store ratings or aggregate from Reviews) ---
    // This is a placeholder. If you have a separate Reviews model, you'd aggregate from there.
    // Assuming for now product model might have a simple average rating
    // const productsWithRatings = await Product.find({ supplier: supplierId, averageRating: { $exists: true } });
    // let totalRating = 0;
    // let ratedProductsCount = 0;
    // productsWithRatings.forEach(p => {
    //   totalRating += p.averageRating;
    //   ratedProductsCount++;
    // });
    // const averageRating = ratedProductsCount > 0 ? (totalRating / ratedProductsCount) : 0;
    // Using a dummy value for now if no concrete rating system is implemented.
    const averageRating = 4.5; // Placeholder

    // --- 4. Weekly Earnings for Chart ---
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start from the beginning of the day

    const weeklySalesData = await Order.aggregate([
      {
        $match: {
          "products.supplier": supplierId,
          orderStatus: "Delivered", // Only count delivered sales
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.supplier": supplierId, // Match supplier's products after unwind
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date string
          dailyEarnings: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
    ]);

    // Format data for the last 7 days, including days with no sales
    const dailyEarningsMap = new Map();
    weeklySalesData.forEach((item) => {
      dailyEarningsMap.set(item._id, item.dailyEarnings);
    });

    const labels = [];
    const data = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      labels.push(date.toLocaleDateString("en-US", { weekday: "short" })); // E.g., 'Mon', 'Tue'
      data.push(dailyEarningsMap.get(dateString) || 0); // Push 0 if no sales for that day
    }

    res.status(200).json({
      totalProducts: totalProducts,
      totalEarnings: dashboardSummary.totalEarnings,
      totalOrders: dashboardSummary.totalOrders,
      averageRating: averageRating, // Use calculated or placeholder
      weeklyEarnings: {
        // NEW: Data for the graph
        labels: labels,
        data: data,
      },
    });
  } catch (error) {
    console.error("Error fetching supplier dashboard data:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch dashboard data",
        details: error.message,
      });
  }
};
