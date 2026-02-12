// server/controllers/supplierDetailedDataController.js
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");

// Helper for pagination (reusable for all detailed lists)
const paginateResults = async (model, query, sort, page, limit, populateOptions = []) => {
  const skip = (page - 1) * limit;
  const totalCount = await model.countDocuments(query);
  const results = await model
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate(populateOptions);

  return {
    results,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    limit,
  };
};

// @desc    Get all activity logs for the authenticated supplier
// @route   GET /api/supplier/activity-logs?page=<num>&limit=<num>
// @access  Private (Supplier only)
const getAllActivityLogs = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const productsAdded = await Product.find({ supplier: supplierId })
      .select("name createdAt")
      .lean();

    // Use correct field: items.productSnapshot.supplier
    const ordersReceived = await Order.find({
      "items.productSnapshot.supplier": supplierId,
    })
      .select("_id createdAt customer items orderStatus")
      .populate("customer", "name")
      .lean();

    const reviewsGivenToProducts = await Review.find({
      product: {
        $in: await Product.find({ supplier: supplierId }).distinct("_id"),
      },
    })
      .select("rating comment createdAt customer product")
      .populate("customer", "name")
      .populate("product", "name")
      .lean();

    const notifications = [];

    productsAdded.forEach((p) =>
      notifications.push({
        type: "Product Added",
        message: `You added '${p.name}'.`,
        timestamp: p.createdAt,
        id: p._id,
      })
    );

    ordersReceived.forEach((o) => {
      // Filter to this supplier's items using productSnapshot.supplier
      const supplierItems = (o.items || []).filter(
        (item) => item.productSnapshot?.supplier?.toString() === supplierId.toString()
      );

      if (supplierItems.length > 0) {
        notifications.push({
          type: "New Order",
          message: `Order #${o._id.toString().slice(-6)} placed by ${
            o.customer?.name || "a customer"
          } for: ${supplierItems.map((item) => item.productSnapshot?.name || "Unknown").join(", ")}.`,
          timestamp: o.createdAt,
          id: o._id,
        });
      }
    });

    reviewsGivenToProducts.forEach((r) =>
      notifications.push({
        type: "New Review",
      message: `${r.rating} star from ${r.customer?.name || "a customer"} on '${
          r.product?.name || "your product"
        }': "${(r.comment || "").slice(0, 50)}${r.comment?.length > 50 ? "..." : ""}"`,
        timestamp: r.createdAt,
        id: r._id,
      })
    );

    // Combine and sort all activities by timestamp
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Manual pagination on the combined array
    const paginatedNotifications = notifications.slice(
      (page - 1) * limit,
      page * limit
    );

    const totalCount = notifications.length;

    res.json({
      results: paginatedNotifications,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
    });
  } catch (error) {
    console.error("Error in getAllActivityLogs:", error);
    res.status(500).json({
      message: "Failed to fetch activity logs.",
      error: error.message,
    });
  }
};

// @desc    Get all top-selling products for the authenticated supplier (with more detail)
// @route   GET /api/supplier/top-products?page=<num>&limit=<num>&sort=<field>
// @access  Private (Supplier only)
const getDetailedTopProducts = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = new mongoose.Types.ObjectId(req.user.id);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sort || "totalQuantitySold";
  const sortOrder = req.query.order === "asc" ? 1 : -1;

  try {
    const pipeline = [
      // Match orders containing this supplier's products
      {
        $match: {
          "items.productSnapshot.supplier": supplierId,
          orderStatus: { $in: ["confirmed", "processing", "shipped", "delivered"] },
        },
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.productSnapshot.supplier": supplierId,
        },
      },
      {
        $group: {
          _id: "$items.product",
          totalOrders: { $addToSet: "$_id" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
        },
      },
      {
        $project: {
          _id: 1,
          totalOrders: { $size: "$totalOrders" },
          totalQuantitySold: 1,
          totalRevenue: 1,
        },
      },
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
          quantitySold: "$totalQuantitySold",
          revenue: "$totalRevenue",
          stock: "$productDetails.quantity",
          unit: "$productDetails.unit",
          averageRating: "$productDetails.averageRating",
          numReviews: "$productDetails.numReviews",
          imageUrl: { $arrayElemAt: ["$productDetails.imageUrls", 0] },
          createdAt: "$productDetails.createdAt",
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const products = await Order.aggregate(pipeline);

    // Count pipeline
    const countPipeline = [
      {
        $match: {
          "items.productSnapshot.supplier": supplierId,
          orderStatus: { $in: ["confirmed", "processing", "shipped", "delivered"] },
        },
      },
      { $unwind: "$items" },
      { $match: { "items.productSnapshot.supplier": supplierId } },
      { $group: { _id: "$items.product" } },
      { $count: "totalProducts" },
    ];

    const countResult = await Order.aggregate(countPipeline);
    const totalCount = countResult.length > 0 ? countResult[0].totalProducts : 0;

    res.json({
      results: products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
    });
  } catch (error) {
    console.error("Error in getDetailedTopProducts:", error);
    res.status(500).json({ message: "Failed to fetch top products.", error: error.message });
  }
};

// @desc    Get all customer feedback (reviews) for the authenticated supplier's products
// @route   GET /api/supplier/customer-feedback?page=<num>&limit=<num>&sort=<field>
// @access  Private (Supplier only)
const getAllCustomerFeedback = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sort || "createdAt";
  const sortOrder = req.query.order === "asc" ? 1 : -1;

  try {
    const supplierProductIds = await Product.find({
      supplier: supplierId,
    }).distinct("_id");

    const query = { product: { $in: supplierProductIds } };
    const sort = { [sortField]: sortOrder };
    const populateOptions = [
      { path: "customer", select: "name username" },
      { path: "product", select: "name imageUrls" },
    ];

    const { results, totalCount, currentPage, totalPages, limit: resLimit } =
      await paginateResults(Review, query, sort, page, limit, populateOptions);

    res.json({ results, totalCount, currentPage, totalPages, limit: resLimit });
  } catch (error) {
    console.error("Error in getAllCustomerFeedback:", error);
    res.status(500).json({
      message: "Failed to fetch customer feedback.",
      error: error.message,
    });
  }
};

// @desc    Get all delivery statuses for orders containing authenticated supplier's products
// @route   GET /api/supplier/delivery-status?page=<num>&limit=<num>&sort=<field>
// @access  Private (Supplier only)
const getAllDeliveryStatuses = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = new mongoose.Types.ObjectId(req.user.id);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sort || "createdAt";
  const sortOrder = req.query.order === "asc" ? 1 : -1;

  try {
    const pipeline = [
      // Match orders with this supplier's products
      {
        $match: {
          "items.productSnapshot.supplier": supplierId,
        },
      },
      // Lookup customer details
      {
        $lookup: {
          from: "users",
          localField: "customer",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: { path: "$customerDetails", preserveNullAndEmptyArrays: true },
      },
      // Project relevant fields
      {
        $project: {
          orderId: "$_id",
          orderNumber: {
            $concat: ["ORD-", { $toUpper: { $substr: [{ $toString: "$_id" }, 16, 8] } }],
          },
          buyerName: "$customerDetails.name",
          buyerEmail: "$customerDetails.email",
          products: {
            $map: {
              input: {
                $filter: {
                  input: "$items",
                  as: "item",
                  cond: { $eq: ["$$item.productSnapshot.supplier", supplierId] },
                },
              },
              as: "item",
              in: {
                name: "$$item.productSnapshot.name",
                quantity: "$$item.quantity",
                price: "$$item.priceAtOrder",
                totalPrice: "$$item.totalPrice",
                imageUrl: "$$item.productSnapshot.imageUrl",
              },
            },
          },
          orderStatus: 1,
          paymentStatus: 1,
          paymentMethod: 1,
          totalAmount: 1,
          trackingInfo: 1,
          deliveryAddress: 1,
          createdAt: 1,
          confirmedAt: 1,
          shippedAt: 1,
          deliveredAt: 1,
          cancelledAt: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const orders = await Order.aggregate(pipeline);

    // Count pipeline
    const countResult = await Order.countDocuments({
      "items.productSnapshot.supplier": supplierId,
    });

    res.json({
      results: orders,
      totalCount: countResult,
      currentPage: page,
      totalPages: Math.ceil(countResult / limit),
      limit,
    });
  } catch (error) {
    console.error("Error in getAllDeliveryStatuses:", error);
    res.status(500).json({
      message: "Failed to fetch delivery statuses.",
      error: error.message,
    });
  }
};

// @desc    Get all notifications for the authenticated supplier
// @route   GET /api/supplier/notifications?page=<num>&limit=<num>
// @access  Private (Supplier only)
const getAllNotifications = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = new mongoose.Types.ObjectId(req.user._id);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;


  try {
    console.log(`🔔 Fetching notifications for supplier: ${supplierId}`);

    const productsAdded = await Product.find({ supplier: supplierId })
      .select("name createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    console.log(`  - Found ${productsAdded.length} products added`);

    // Use correct field paths
    const ordersReceived = await Order.find({
      "items.productSnapshot.supplier": supplierId,
    })
      .select("_id createdAt customer items orderStatus paymentStatus")
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    console.log(`  - Found ${ordersReceived.length} orders received`);

    const supplierProductIds = await Product.find({ supplier: supplierId }).distinct("_id");
    console.log(`  - Found ${supplierProductIds.length} supplier product IDs`);

    const reviewsGivenToProducts = await Review.find({
      product: { $in: supplierProductIds },
    })
      .select("rating comment createdAt customer product")
      .populate("customer", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    console.log(`  - Found ${reviewsGivenToProducts.length} reviews`);

    const lowStockProducts = await Product.find({
      supplier: supplierId,
      quantity: { $lte: 10, $gt: 0 },
      isDeleted: false,
    })
      .select("name quantity createdAt")
      .lean();
    console.log(`  - Found ${lowStockProducts.length} low stock products`);

    const outOfStockProducts = await Product.find({
      supplier: supplierId,
      quantity: 0,
      isDeleted: false,
    })
      .select("name createdAt")
      .lean();
      console.log(`  - Found ${outOfStockProducts.length} out of stock products`);

    const allNotifications = [];

    productsAdded.forEach((p) =>
      allNotifications.push({
        type: "Product Added",
        message: `You added '${p.name}'.`,
        timestamp: p.createdAt,
        id: `product-add-${p._id}`,
      })
    );

    ordersReceived.forEach((o) => {
      const supplierItems = (o.items || []).filter(
        (item) => item.productSnapshot?.supplier?.toString() === supplierId.toString()
      );

      if (supplierItems.length > 0) {
        allNotifications.push({
          type: "New Order",
          message: `Order #${o._id.toString().slice(-6)} placed by ${
            o.customer?.name || "a customer"
          } for: ${supplierItems.map((item) => item.productSnapshot?.name || "Unknown").join(", ")}.`,
          timestamp: o.createdAt,
          id: `new-order-${o._id}`,
        });
      }
    });

    reviewsGivenToProducts.forEach((r) =>
      allNotifications.push({
        type: "New Review",
        message: `${r.rating} star from ${r.customer?.name || "a customer"} on '${
          r.product?.name || "your product"
        }'.`,
        timestamp: r.createdAt,
        id: `review-${r._id}`,
      })
    );

    lowStockProducts.forEach((p) =>
      allNotifications.push({
        type: "Stock Alert",
        message: `'${p.name}' is low in stock (${p.quantity} left).`,
        timestamp: new Date(),
        id: `low-stock-${p._id}`,
      })
    );

    outOfStockProducts.forEach((p) =>
      allNotifications.push({
        type: "Stock Alert",
        message: `'${p.name}' is out of stock!`,
        timestamp: new Date(),
        id: `out-of-stock-${p._id}`,
      })
    );

    allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const paginatedNotifications = allNotifications.slice(
      (page - 1) * limit,
      page * limit
    );

    const totalCount = allNotifications.length;

    res.json({
      results: paginatedNotifications,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
    });
  } catch (error) {
    console.error("❌ Error in getAllNotifications:");
    console.error("  Message:", error.message);
    console.error("  Stack:", error.stack);
    
    res.status(500).json({
      message: "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllActivityLogs,
  getDetailedTopProducts,
  getAllCustomerFeedback,
  getAllDeliveryStatuses,
  getAllNotifications,
};
