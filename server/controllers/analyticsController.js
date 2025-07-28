// server/controllers/analyticsController.js
const Product = require("../models/Product"); 
const Order = require("../models/OrderModel"); 
// @desc    Get all analytics data for the authenticated supplier
// @route   GET /api/supplier/analytics
// @access  Private (Supplier only)
exports.getSupplierAnalytics = async (req, res) => {
  try {
    const supplierId = req.user.id; // Get supplier's _id from authenticated user

    // --- 1. Total Products ---
    const totalProducts = await Product.countDocuments({
      supplier: supplierId,
    });

    // --- 2. Total Earnings, Total Orders, Average Order Value, Total Products Sold ---
    // Aggregate on Order model to sum up earnings and count orders for this supplier
    const orderAnalytics = await Order.aggregate([
      {
        // Match orders that contain products from this specific supplier
        $match: {
          "products.supplier": supplierId,
          orderStatus: "Delivered", // Consider only delivered orders for earnings
        },
      },
      {
        // Deconstruct the 'products' array to work with each item individually
        $unwind: "$products",
      },
      {
        // Match only the products that belong to the current supplier
        $match: {
          "products.supplier": supplierId,
        },
      },
      {
        $group: {
          _id: null, // Group all matching items together
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
          totalProductsSold: 1,
          totalOrders: { $size: "$orderIds" }, // Count unique order IDs
        },
      },
    ]);

    const totalEarnings =
      orderAnalytics.length > 0 ? orderAnalytics[0].totalEarnings : 0;
    const totalOrders =
      orderAnalytics.length > 0 ? orderAnalytics[0].totalOrders : 0;
    const totalProductsSold =
      orderAnalytics.length > 0 ? orderAnalytics[0].totalProductsSold : 0;
    const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

    // --- 3. Top-Selling Products (by revenue for this supplier) ---
    const topProducts = await Order.aggregate([
      {
        $match: {
          "products.supplier": supplierId,
          orderStatus: "Delivered",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.supplier": supplierId, // Match only products from this supplier after unwind
        },
      },
      {
        $group: {
          _id: "$products.productId", // Group by individual product ID
          name: { $first: "$products.name" },
          totalSales: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
          totalQuantitySold: { $sum: "$products.quantity" },
        },
      },
      {
        $sort: { totalSales: -1 }, // Sort by highest sales
      },
      {
        $limit: 5, // Top 5 products
      },
      {
        $project: {
          _id: 0,
          name: 1,
          sales: "$totalSales", // Rename for frontend clarity
          quantity: "$totalQuantitySold", // Rename for frontend clarity
        },
      },
    ]);

    // --- 4. Sales Over Time (e.g., last 7 days) ---
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const salesOverTime = await Order.aggregate([
      {
        $match: {
          "products.supplier": supplierId,
          orderStatus: "Delivered",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.supplier": supplierId,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Group by date
          },
          dailySales: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
    ]);

    // Format salesOverTime for chart (e.g., fill in missing days)
    const formattedSalesOverTime = Array(7).fill(0);
    const labels = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      labels.push(date.toLocaleDateString("en-US", { weekday: "short" })); // e.g., 'Mon'
      const foundDay = salesOverTime.find(
        (d) => new Date(d._id).toDateString() === date.toDateString()
      );
      if (foundDay) {
        formattedSalesOverTime[i] = foundDay.dailySales;
      }
    }

    const analytics = {
      totalProducts: totalProducts,
      totalSales: totalEarnings,
      totalOrders: totalOrders,
      averageOrderValue: averageOrderValue,
      totalProductsSold: totalProductsSold,
      // conversionRate and customerReach might require more complex tracking (e.g., website traffic, unique visitors)
      // For now, these can be set to 0 or derived if you have other data.
      conversionRate: 0, // Placeholder, requires tracking views vs. sales
      customerReach: 0, // Placeholder, requires tracking unique customer interactions

      topProducts: topProducts,
      salesOverTime: {
        labels: labels,
        data: formattedSalesOverTime,
      },
    };

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching supplier analytics:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch analytics data",
        error: error.message,
      });
  }
};
