// server/controllers/supplierDashboardController.js
const Product = require("../models/Product");
const Order = require("../models/Order");
const QuoteRequest = require("../models/QuoteRequest");
const QuoteResponse = require("../models/QuoteResponse");
const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * Calculate profile completion percentage
 */
const calculateProfileCompletion = (supplier) => {
  const fields = {
    name: supplier.name,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    companyName: supplier.companyName,
    gstNumber: supplier.gstNumber,
    businessLicense: supplier.businessLicense,
    bankDetails: supplier.bankDetails?.accountNumber,
    profilePictureUrl: supplier.profilePictureUrl,
  };

  const completed = Object.values(fields).filter(Boolean).length;
  const total = Object.keys(fields).length;
  const percentage = Math.round((completed / total) * 100);

  const missing = [];
  if (!supplier.phone) missing.push("Phone Number");
  if (!supplier.address) missing.push("Business Address");
  if (!supplier.companyName) missing.push("Company Name");
  if (!supplier.gstNumber) missing.push("GST Number");
  if (!supplier.businessLicense) missing.push("Business License");
  if (!supplier.bankDetails?.accountNumber) missing.push("Bank Details");
  if (!supplier.profilePictureUrl) missing.push("Profile Picture");

  return { percentage, missing };
};

/**
 * @desc    Get comprehensive supplier dashboard data
 * @route   GET /api/supplier/dashboard
 * @access  Private (Supplier only)
 */
exports.getSupplierDashboardData = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const { period = 7 } = req.query;

    const now = new Date();
    const periodStart = new Date(now.getTime() - period * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(
      periodStart.getTime() - period * 24 * 60 * 60 * 1000,
    );

    const [
      productStats,
      currentOrderStats,
      previousOrderStats,
      orderStatusDistribution,
      periodSalesData,
      topProducts,
      recentOrders,
      lowStockProducts,
      quoteRequests,
      customerStats,
      supplierProfile,
    ] = await Promise.all([
      // 1. Product Stats
      Product.aggregate([
        { $match: { supplier: supplierId, isDeleted: false } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: {
              $sum: { $cond: [{ $eq: ["$availability", true] }, 1, 0] },
            },
            lowStockCount: {
              $sum: { $cond: [{ $lte: ["$quantity", 10] }, 1, 0] },
            },
            outOfStockCount: {
              $sum: { $cond: [{ $eq: ["$quantity", 0] }, 1, 0] },
            },
            totalInventoryValue: {
              $sum: { $multiply: ["$price", "$quantity"] },
            },
          },
        },
      ]),

      // 2. Current Period Orders (earnings only from paid or delivered-COD orders)
      Order.aggregate([
        {
          $match: {
            "items.productSnapshot.supplier": supplierId,
            orderStatus: {
              $in: ["delivered", "shipped", "processing", "confirmed"],
            },
            $or: [
              { paymentStatus: "paid" },
              { paymentMethod: "cod", orderStatus: "delivered" },
            ],
            createdAt: { $gte: periodStart },
          },
        },
        { $unwind: "$items" },
        { $match: { "items.productSnapshot.supplier": supplierId } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$items.totalPrice" },
            totalOrders: { $addToSet: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            totalEarnings: 1,
            totalOrders: { $size: "$totalOrders" },
          },
        },
      ]),

      // 3. Previous Period Orders
      Order.aggregate([
        {
          $match: {
            "items.productSnapshot.supplier": supplierId,
            orderStatus: {
              $in: ["delivered", "shipped", "processing", "confirmed"],
            },
            $or: [
              { paymentStatus: "paid" },
              { paymentMethod: "cod", orderStatus: "delivered" },
            ],
            createdAt: { $gte: previousPeriodStart, $lt: periodStart },
          },
        },
        { $unwind: "$items" },
        { $match: { "items.productSnapshot.supplier": supplierId } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$items.totalPrice" },
            totalOrders: { $addToSet: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            totalEarnings: 1,
            totalOrders: { $size: "$totalOrders" },
          },
        },
      ]),

      // 4. Order Status Distribution
      Order.aggregate([
        { $match: { "items.productSnapshot.supplier": supplierId } },
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),

      // 5. Period Sales Data (only confirmed revenue)
      Order.aggregate([
        {
          $match: {
            "items.productSnapshot.supplier": supplierId,
            orderStatus: {
              $in: ["delivered", "shipped", "processing", "confirmed"],
            },
            $or: [
              { paymentStatus: "paid" },
              { paymentMethod: "cod", orderStatus: { $in: ["confirmed", "processing", "shipped", "delivered"] } },
            ],
            createdAt: { $gte: periodStart },
          },
        },
        { $unwind: "$items" },
        { $match: { "items.productSnapshot.supplier": supplierId } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            dailyEarnings: { $sum: "$items.totalPrice" },
            dailyOrders: { $addToSet: "$_id" },
          },
        },
        {
          $project: {
            _id: 1,
            dailyEarnings: 1,
            dailyOrders: { $size: "$dailyOrders" },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // 6. Top Products (from confirmed/paid orders)
      Order.aggregate([
        {
          $match: {
            "items.productSnapshot.supplier": supplierId,
            orderStatus: {
              $in: ["delivered", "shipped", "processing", "confirmed"],
            },
            $or: [
              { paymentStatus: "paid" },
              { paymentMethod: "cod" },
            ],
          },
        },
        { $unwind: "$items" },
        { $match: { "items.productSnapshot.supplier": supplierId } },
        {
          $group: {
            _id: "$items.product",
            productName: { $first: "$items.productSnapshot.name" },
            totalQuantity: { $sum: "$items.quantity" },
            totalRevenue: { $sum: "$items.totalPrice" },
            unit: { $first: "$items.productSnapshot.unit" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
      ]),

      // 7. Recent Orders
      Order.find({ "items.productSnapshot.supplier": supplierId })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("_id orderNumber orderStatus totalAmount customer createdAt")
        .populate("customer", "name email")
        .lean(),

      // 8. Low Stock Products
      Product.find({
        supplier: supplierId,
        quantity: { $lte: 10, $gt: 0 },
        isDeleted: false,
      })
        .select("name quantity unit imageUrls")
        .sort({ quantity: 1 })
        .limit(10)
        .lean(),

      // 9. Quote Requests
      QuoteRequest.find({
        $or: [{ targetSuppliers: supplierId }, { broadcastToAll: true }],
        status: { $in: ["pending", "responded", "accepted"] },
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("customer items deliveryLocation requiredBy status createdAt")
        .populate("customer", "name email")
        .lean(),

      // 10. Customer Stats
      Order.aggregate([
        { $match: { "items.productSnapshot.supplier": supplierId } },
        { $group: { _id: "$customer", orderCount: { $sum: 1 } } },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            repeatCustomers: {
              $sum: { $cond: [{ $gt: ["$orderCount", 1] }, 1, 0] },
            },
          },
        },
      ]),

      // 11. Supplier Profile
      User.findById(supplierId).select("-password").lean(),
    ]);

    // Process data
    const productData = productStats[0] || {
      totalProducts: 0,
      activeProducts: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      totalInventoryValue: 0,
    };

    const currentStats = currentOrderStats[0] || {
      totalEarnings: 0,
      totalOrders: 0,
    };
    const previousStats = previousOrderStats[0] || {
      totalEarnings: 0,
      totalOrders: 0,
    };

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const earningsTrend = calculateTrend(
      currentStats.totalEarnings,
      previousStats.totalEarnings,
    );
    const ordersTrend = calculateTrend(
      currentStats.totalOrders,
      previousStats.totalOrders,
    );

    // Order Status Distribution
    const orderStats = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    let pendingOrdersCount = 0;
    orderStatusDistribution.forEach((item) => {
      orderStats[item._id] = item.count;
      if (item._id === "pending") pendingOrdersCount = item.count;
    });

    // Average Rating
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

    // Format Sales Data
    const dailyEarningsMap = new Map();
    const dailyOrdersMap = new Map();
    periodSalesData.forEach((item) => {
      dailyEarningsMap.set(item._id, item.dailyEarnings);
      dailyOrdersMap.set(item._id, item.dailyOrders);
    });

    const labels = [];
    const earningsData = [];
    const ordersData = [];

    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateString = date.toISOString().split("T")[0];

      const labelFormat =
        period <= 7 ? { weekday: "short" } : { month: "short", day: "numeric" };
      labels.push(date.toLocaleDateString("en-US", labelFormat));
      earningsData.push(dailyEarningsMap.get(dateString) || 0);
      ordersData.push(dailyOrdersMap.get(dateString) || 0);
    }

    // Format Recent Orders
    const formattedRecentOrders = recentOrders.map((order) => ({
      _id: order._id,
      orderId:
        order.orderNumber || order._id.toString().slice(-6).toUpperCase(),
      customerName: order.customer?.name || "Unknown",
      totalAmount: order.totalAmount,
      status: order.orderStatus,
      createdAt: order.createdAt,
    }));

    // Format Quotes
    const pendingQuotes = quoteRequests.filter((q) => q.status === "pending");
    const formattedQuotes = quoteRequests.map((quote) => ({
      _id: quote._id,
      customerName: quote.customer?.name || "Customer",
      customerEmail: quote.customer?.email,
      items: quote.items,
      deliveryLocation: quote.deliveryLocation,
      requiredBy: quote.requiredBy,
      status: quote.status,
      createdAt: quote.createdAt,
    }));

    // Profile Completion
    const profileCompletion = calculateProfileCompletion(supplierProfile);

    // Customer Stats
    const custStats = customerStats[0] || {
      totalCustomers: 0,
      repeatCustomers: 0,
    };

    // Alerts
    const alerts = [];
    if (pendingQuotes.length > 0) {
      alerts.push({
        type: "info",
        message: `${pendingQuotes.length} new quote request${pendingQuotes.length !== 1 ? "s" : ""} awaiting response`,
        action: "/supplier/quote-requests",
      });
    }
    if (productData.outOfStockCount > 0) {
      alerts.push({
        type: "critical",
        message: `${productData.outOfStockCount} product${productData.outOfStockCount !== 1 ? "s are" : " is"} out of stock`,
        action: "/supplier/myproducts?filter=out-of-stock",
      });
    }
    if (profileCompletion.percentage < 100) {
      alerts.push({
        type: "warning",
        message: `Complete your profile (${profileCompletion.percentage}% done) to improve visibility`,
        action: "/supplier/settings",
      });
    }

    console.log(`📊 Dashboard loaded: ${supplierId}`);

    // Send Response
    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProducts: productData.totalProducts,
          activeProducts: productData.activeProducts,
          totalEarnings: currentStats.totalEarnings,
          totalOrders: currentStats.totalOrders,
          pendingOrders: pendingOrdersCount,
          averageRating: parseFloat(averageRating.toFixed(1)),
          lowStockCount: productData.lowStockCount,
          totalInventoryValue: productData.totalInventoryValue,
          totalCustomers: custStats.totalCustomers,
          repeatCustomers: custStats.repeatCustomers,
          productsTrend: 0,
          earningsTrend,
          ordersTrend,
        },
        charts: {
          period: parseInt(period),
          salesChart: { labels, earnings: earningsData, orders: ordersData },
        },
        orderStatusDistribution: orderStats,
        topProducts: topProducts.map((p) => ({
          productId: p._id,
          name: p.productName,
          totalQuantity: p.totalQuantity,
          totalRevenue: p.totalRevenue,
          unit: p.unit,
        })),
        recentOrders: formattedRecentOrders,
        lowStockProducts,
        quoteRequests: formattedQuotes,
        pendingQuotesCount: pendingQuotes.length,
        profileCompletion,
        businessStatus: {
          isOpen: supplierProfile.businessStatus?.isOpen !== false,
          businessHours: supplierProfile.businessHours || "9:00 AM - 6:00 PM",
        },
        alerts,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard data",
      details: error.message,
    });
  }
};
