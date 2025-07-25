// server/controllers/supplierDetailedDataController.js
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const User = require("../models/User"); // Needed for populating user details
const mongoose = require("mongoose"); // For ObjectId and aggregation

// Helper for pagination (reusable for all detailed lists)
const paginateResults = async (
  model,
  query,
  sort,
  page,
  limit,
  populateOptions = []
) => {
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
exports.getAllActivityLogs = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Default 10 items per page

  try {
    // Fetch recent product adds, orders, and reviews.
    // For a true "activity log," you might store these in a dedicated 'ActivityLog' model
    // or aggregate and combine them from various sources as done here.
    // For this example, we'll combine and sort by creation date.

    const productsAdded = await Product.find({ supplier: supplierId })
      .select("name createdAt")
      .lean(); // .lean() for plain JS objects

    const ordersReceived = await Order.find({
      "orderItems.supplier": supplierId,
    })
      .select("_id createdAt user orderItems")
      .populate("user", "name")
      .lean();

    const reviewsGivenToProducts = await Review.find({
      product: {
        $in: await Product.find({ supplier: supplierId }).distinct("_id"),
      },
    })
      .select("rating comment createdAt user product")
      .populate("user", "name")
      .populate("product", "name")
      .lean();

    const notifications = []; // Re-using notification structure for activity feed

    productsAdded.forEach((p) =>
      notifications.push({
        type: "Product Added",
        message: `You added '${p.name}'.`,
        timestamp: p.createdAt,
        id: p._id, // Use ID for unique key
      })
    );

    ordersReceived.forEach((o) => {
      const supplierItems = o.orderItems.filter((item) =>
        item.supplier.equals(supplierId)
      );
      if (supplierItems.length > 0) {
        // Only add if it contains supplier's items
        notifications.push({
          type: "New Order",
          message: `Order #${o._id.toString().slice(-6)} placed by ${
            o.user?.name || "a customer"
          } for: ${supplierItems.map((item) => item.name).join(", ")}.`,
          timestamp: o.createdAt,
          id: o._id,
        });
      }
    });

    reviewsGivenToProducts.forEach((r) =>
      notifications.push({
        type: "New Review",
        message: `⭐️${r.rating} from ${r.user?.name || "a customer"} on '${
          r.product?.name || "your product"
        }': "${r.comment.slice(0, 50)}..."`,
        timestamp: r.createdAt,
        id: r._id,
      })
    );

    // Combine and sort all activities by timestamp
    notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Implement manual pagination on the combined array
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
    res
      .status(500)
      .json({
        message: "Failed to fetch activity logs.",
        error: error.message,
      });
  }
};

// @desc    Get all top-selling products for the authenticated supplier (with more detail)
// @route   GET /api/supplier/top-products?page=<num>&limit=<num>&sort=<field>
// @access  Private (Supplier only)
exports.getDetailedTopProducts = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = new mongoose.Types.ObjectId(req.user.id);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sort || "totalQuantitySold"; // Default sort by sales volume
  const sortOrder = req.query.order === "asc" ? 1 : -1; // Default descending

  try {
    const pipeline = [
      { $unwind: "$orderItems" },
      {
        $match: {
          "orderItems.supplier": supplierId,
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
          averageRating: "$productDetails.averageRating",
          numReviews: "$productDetails.numReviews",
          createdAt: "$productDetails.createdAt",
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const products = await Order.aggregate(pipeline);

    // For total count, run a similar aggregation without skip/limit
    const countPipeline = [
      { $unwind: "$orderItems" },
      {
        $match: {
          "orderItems.supplier": supplierId,
          isPaid: true,
        },
      },
      {
        $group: {
          _id: "$orderItems.product", // Group by product to count unique products
        },
      },
      { $count: "totalProducts" },
    ];
    const countResult = await Order.aggregate(countPipeline);
    const totalCount =
      countResult.length > 0 ? countResult[0].totalProducts : 0;

    res.json({
      results: products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
    });
  } catch (error) {
    console.error("Error in getDetailedTopProducts:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch top products.", error: error.message });
  }
};

// @desc    Get all customer feedback (reviews) for the authenticated supplier's products
// @route   GET /api/supplier/customer-feedback?page=<num>&limit=<num>&sort=<field>
// @access  Private (Supplier only)
exports.getAllCustomerFeedback = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sort || "createdAt"; // Default sort by creation date
  const sortOrder = req.query.order === "asc" ? 1 : -1;

  try {
    // Find all product IDs belonging to this supplier
    const supplierProductIds = await Product.find({
      supplier: supplierId,
    }).distinct("_id");

    const query = { product: { $in: supplierProductIds } };
    const sort = { [sortField]: sortOrder };
    const populateOptions = [
      { path: "user", select: "name username" },
      { path: "product", select: "name imageUrls" },
    ];

    const {
      results,
      totalCount,
      currentPage,
      totalPages,
      limit: resLimit,
    } = await paginateResults(
      Review,
      query,
      sort,
      page,
      limit,
      populateOptions
    );

    res.json({ results, totalCount, currentPage, totalPages, limit: resLimit });
  } catch (error) {
    console.error("Error in getAllCustomerFeedback:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch customer feedback.",
        error: error.message,
      });
  }
};

// @desc    Get all delivery statuses for orders containing authenticated supplier's products
// @route   GET /api/supplier/delivery-status?page=<num>&limit=<num>&sort=<field>
// @access  Private (Supplier only)
exports.getAllDeliveryStatuses = async (req, res) => {
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
      { $unwind: "$orderItems" },
      {
        $match: {
          "orderItems.supplier": supplierId,
          // Optionally filter by payment status here: isPaid: true
        },
      },
      // Group back by order to get unique orders that contain this supplier's items
      {
        $group: {
          _id: "$_id", // Group by original order ID
          user: { $first: "$user" },
          totalPrice: { $first: "$totalPrice" },
          isPaid: { $first: "$isPaid" },
          isDelivered: { $first: "$isDelivered" },
          deliveredAt: { $first: "$deliveredAt" },
          createdAt: { $first: "$createdAt" },
          orderItems: {
            // Push only relevant order items to the array
            $push: {
              $cond: {
                if: { $eq: ["$orderItems.supplier", supplierId] },
                then: "$orderItems",
                else: "$$REMOVE", // Remove items not from this supplier
              },
            },
          },
        },
      },
      { $match: { orderItems: { $ne: [] } } }, // Ensure we only keep orders that actually had items from this supplier after filtering

      {
        $lookup: {
          // Populate user (customer) details
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: { path: "$customerDetails", preserveNullAndEmptyArrays: true },
      }, // Unwind customerDetails

      {
        $lookup: {
          // Populate product details for each item
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "itemProductDetails",
        },
      },
      // Merge product details into orderItems (complex, but provides full data)
      {
        $addFields: {
          orderItems: {
            $map: {
              input: "$orderItems",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  {
                    productDetails: {
                      $arrayElemAt: [
                        "$itemProductDetails",
                        {
                          $indexOfArray: [
                            "$itemProductDetails._id",
                            "$$item.product",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $project: { itemProductDetails: 0 } }, // Remove the temporary field

      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          // Reshape data for frontend
          orderId: "$_id",
          buyerName: "$customerDetails.name",
          buyerEmail: "$customerDetails.email",
          products: {
            $map: {
              input: "$orderItems",
              as: "item",
              in: {
                name: "$$item.productDetails.name",
                qty: "$$item.qty",
                price: "$$item.price",
                imageUrl: {
                  $arrayElemAt: ["$$item.productDetails.imageUrls", 0],
                },
              },
            },
          },
          status: {
            $cond: {
              if: "$isDelivered",
              then: "Delivered",
              else: {
                $cond: {
                  if: "$isPaid",
                  then: "Paid & Processing",
                  else: "Pending Payment",
                },
              },
            },
          },
          totalOrderValue: "$totalPrice", // Total value of the *whole* order
          orderCreatedAt: "$createdAt",
          deliveredAt: "$deliveredAt",
        },
      },
    ];

    const orders = await Order.aggregate(pipeline);

    const countPipeline = [
      { $unwind: "$orderItems" },
      { $match: { "orderItems.supplier": supplierId } },
      { $group: { _id: "$_id" } }, // Count unique orders
      { $count: "totalOrders" },
    ];
    const countResult = await Order.aggregate(countPipeline);
    const totalCount = countResult.length > 0 ? countResult[0].totalOrders : 0;

    res.json({
      results: orders,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
    });
  } catch (error) {
    console.error("Error in getAllDeliveryStatuses:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch delivery statuses.",
        error: error.message,
      });
  }
};

// @desc    Get all notifications for the authenticated supplier
// @route   GET /api/supplier/notifications?page=<num>&limit=<num>
// @access  Private (Supplier only)
exports.getAllNotifications = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }

  const supplierId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // This is the same logic as the notifications array built in supplierDashboardController,
    // but now it's intended for a dedicated page, so we fetch all relevant recent events
    // and apply pagination.

    const productsAdded = await Product.find({ supplier: supplierId })
      .select("name createdAt")
      .lean();

    const ordersReceived = await Order.find({
      "orderItems.supplier": supplierId,
      isPaid: true,
    })
      .select("_id createdAt user orderItems")
      .populate("user", "name")
      .lean();

    const reviewsGivenToProducts = await Review.find({
      product: {
        $in: await Product.find({ supplier: supplierId }).distinct("_id"),
      },
    })
      .select("rating comment createdAt user product")
      .populate("user", "name")
      .populate("product", "name")
      .lean();

    const lowStockProducts = await Product.find({
      supplier: supplierId,
      quantity: { $lte: 10, $gt: 0 },
    })
      .select("name quantity createdAt")
      .lean();

    const outOfStockProducts = await Product.find({
      supplier: supplierId,
      quantity: 0,
    })
      .select("name createdAt")
      .lean();

    const allNotifications = [];

    productsAdded.forEach((p) =>
      allNotifications.push({
        type: "Product Added",
        message: `You added '${p.name}'.`,
        timestamp: p.createdAt,
        id: `product-add-${p._id}`, // Unique ID for keying
      })
    );

    ordersReceived.forEach((o) => {
      const supplierItems = o.orderItems.filter((item) =>
        item.supplier.equals(supplierId)
      );
      if (supplierItems.length > 0) {
        allNotifications.push({
          type: "New Order",
          message: `Order #${o._id.toString().slice(-6)} placed by ${
            o.user?.name || "a customer"
          } for: ${supplierItems.map((item) => item.name).join(", ")}.`,
          timestamp: o.createdAt,
          id: `new-order-${o._id}`,
        });
      }
    });

    reviewsGivenToProducts.forEach((r) =>
      allNotifications.push({
        type: "New Review",
        message: `⭐️${r.rating} from ${r.user?.name || "a customer"} on '${
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

    allNotifications.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    // Implement pagination on the combined array
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
    console.error("Error in getAllNotifications:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch notifications.",
        error: error.message,
      });
  }
};
