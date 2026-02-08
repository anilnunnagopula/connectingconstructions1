// server/controllers/customerController.js
const User = require("../models/User");
const Order = require("../models/OrderModel");
const Wishlist = require("../models/Wishlist");
const ViewHistory = require("../models/ViewHistory");
const SupportRequest = require("../models/SupportRequest");
const Product = require("../models/Product");
const {
  applyLean,
  buildBaseQuery,
  paginate,
  getPaginationMeta,
} = require("../utils/queryHelpers");

// ===== HELPER FUNCTIONS =====

const validateRequiredFields = (data, fields) => {
  for (const field of fields) {
    if (!data[field] || String(data[field]).trim() === "") {
      throw new Error(`${field} is required.`);
    }
  }
};

// ===== DASHBOARD =====

/**
 * @desc    Get customer dashboard summary data
 * @route   GET /api/customer/dashboard
 * @access  Private (Customer only)
 */
const getCustomerDashboardData = async (req, res) => {
  try {
    const customerId = req.user._id;

    // ✨ Use Promise.all for parallel queries (faster)
    const [
      totalOrders,
      totalSpentResult,
      recentOrders,
      wishlistItemsCount,
      user,
    ] = await Promise.all([
      // 1. Total Orders
      Order.countDocuments({
        customer: customerId,
        isDeleted: false,
      }),

      // 2. Total Spent (only delivered orders)
      Order.aggregate([
        {
          $match: {
            customer: customerId,
            orderStatus: { $in: ["Delivered"] },
            isDeleted: false,
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // 3. Recent Orders (top 5, use lean())
      Order.find({ customer: customerId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("products.productId", "name price imageUrls")
        .select("-__v")
        .lean(),

      // 4. Wishlist Count
      Wishlist.countDocuments({ user: customerId }),

      // 5. User data (cart, notifications, profile pic)
      User.findById(customerId)
        .select("cart notifications profilePictureUrl")
        .lean(),
    ]);

    const totalSpent =
      totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;
    const cartItemsCount = user?.cart?.length || 0;
    const unreadNotificationsCount =
      user?.notifications?.filter((n) => !n.read).length || 0;

    console.log(`📊 Dashboard data fetched for customer: ${customerId}`);

    res.status(200).json({
      success: true,
      message: "Customer dashboard data fetched successfully",
      data: {
        totalOrders,
        totalSpent,
        recentOrders,
        wishlistItemsCount,
        cartItemsCount,
        unreadNotificationsCount,
        profilePictureUrl: user?.profilePictureUrl || null,
        recommendedProducts: [], // TODO: Implement recommendation engine
        customerOffers: [], // TODO: Fetch active offers
      },
    });
  } catch (error) {
    console.error("❌ Error fetching customer dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer dashboard data",
      error: error.message,
    });
  }
};

// ===== ORDERS =====

/**
 * @desc    Create a new order
 * @route   POST /api/customer/orders
 * @access  Private (Customer only)
 */
const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    const { orderItems, shippingAddress, paymentMethod } = req.body;

    validateRequiredFields(req.body, [
      "orderItems",
      "shippingAddress",
      "paymentMethod",
    ]);
    validateRequiredFields(shippingAddress, [
      "address",
      "city",
      "state",
      "zipCode",
    ]);

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided.",
      });
    }

    // ✨ Process order items and update stock
    const processedItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findOne({
          _id: item.product,
          isDeleted: false,
        });

        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }

        if (product.quantity < item.qty) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
          );
        }

        // ✨ Use the product's decreaseStock method
        await product.decreaseStock(item.qty);

        return {
          productId: product._id,
          name: product.name,
          quantity: item.qty,
          price: product.price,
          supplier: product.supplier,
        };
      }),
    );

    // Calculate total
    const totalAmount = processedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // Create order
    const order = new Order({
      customer: req.user._id,
      products: processedItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const createdOrder = await order.save();

    console.log(`✅ Order created: ${createdOrder._id}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: createdOrder,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create order.",
    });
  }
};

/**
 * @desc    Get all customer's orders (with pagination)
 * @route   GET /api/customer/orders
 * @access  Private (Customer only)
 */
const getMyOrders = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    const { page = 1, limit = 20, status } = req.query;

    // Build filters
    const filters = buildBaseQuery();
    filters.customer = req.user._id;

    if (status) {
      filters.orderStatus = status;
    }

    // ✨ Query with pagination and lean()
    const query = Order.find(filters)
      .populate("products.productId", "name price imageUrls")
      .sort({ createdAt: -1 })
      .select("-__v");

    const paginatedQuery = paginate(query, parseInt(page), parseInt(limit));
    const orders = await applyLean(paginatedQuery);

    // Get pagination metadata
    const pagination = await getPaginationMeta(
      Order,
      filters,
      parseInt(page),
      parseInt(limit),
    );

    res.json({
      success: true,
      data: orders,
      pagination,
    });
  } catch (error) {
    console.error("❌ Error fetching customer orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/customer/orders/:id
 * @access  Private (Customer only)
 */
const getOrderById = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    // ✨ Use lean() for read-only
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
      isDeleted: false,
    })
      .populate("products.productId", "name price imageUrls")
      .populate("products.supplier", "name email phoneNumber")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you do not own this order.",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Error fetching single order:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
      error: error.message,
    });
  }
};

// ===== WISHLIST =====

/**
 * @desc    Add product to wishlist
 * @route   POST /api/customer/wishlist
 * @access  Private (Customer only)
 */
const addToWishlist = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    const { productId } = req.body;
    validateRequiredFields(req.body, ["productId"]);

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const existingWishlistItem = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingWishlistItem) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist.",
      });
    }

    const wishlistItem = new Wishlist({
      user: req.user._id,
      product: productId,
    });

    await wishlistItem.save();

    console.log(`❤️  Added to wishlist: ${productId}`);

    res.status(201).json({
      success: true,
      message: "Product added to wishlist.",
      wishlistItem,
    });
  } catch (error) {
    console.error("❌ Error adding to wishlist:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add to wishlist.",
    });
  }
};

/**
 * @desc    Get customer's wishlist
 * @route   GET /api/customer/wishlist
 * @access  Private (Customer only)
 */
const getMyWishlist = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    // ✨ Use lean() for read-only
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate(
        "product",
        "name price imageUrls category supplier availability",
      )
      .lean();

    // ✨ Filter out deleted products
    const activeWishlist = wishlist.filter(
      (item) => item.product && !item.product.isDeleted,
    );

    res.json({
      success: true,
      data: activeWishlist,
    });
  } catch (error) {
    console.error("❌ Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist.",
      error: error.message,
    });
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/customer/wishlist/:id
 * @access  Private (Customer only)
 */
const removeFromWishlist = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    const wishlistItemId = req.params.id;

    const result = await Wishlist.findOneAndDelete({
      _id: wishlistItemId,
      user: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found or you do not own it.",
      });
    }

    console.log(`💔 Removed from wishlist: ${wishlistItemId}`);

    res.json({
      success: true,
      message: "Product removed from wishlist.",
    });
  } catch (error) {
    console.error("❌ Error removing from wishlist:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid wishlist item ID format.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist.",
      error: error.message,
    });
  }
};

// ===== VIEW HISTORY =====

/**
 * @desc    Record product view
 * @route   POST /api/customer/view-history
 * @access  Private (Customer only)
 */
const recordProductView = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    const { productId } = req.body;
    validateRequiredFields(req.body, ["productId"]);

    const viewHistoryItem = await ViewHistory.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { $set: { viewedAt: Date.now() } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({
      success: true,
      message: "Product view recorded.",
      viewHistoryItem,
    });
  } catch (error) {
    console.error("❌ Error recording product view:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to record product view.",
    });
  }
};

/**
 * @desc    Get customer's view history
 * @route   GET /api/customer/view-history
 * @access  Private (Customer only)
 */
const getMyViewHistory = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    // ✨ Use lean() for read-only
    const viewHistory = await ViewHistory.find({ user: req.user._id })
      .populate("product", "name price imageUrls category availability")
      .sort({ viewedAt: -1 })
      .limit(50) // Limit to last 50 viewed
      .lean();

    // ✨ Filter out deleted products
    const activeHistory = viewHistory.filter(
      (item) => item.product && !item.product.isDeleted,
    );

    res.json({
      success: true,
      data: activeHistory,
    });
  } catch (error) {
    console.error("❌ Error fetching view history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch view history.",
      error: error.message,
    });
  }
};

// ===== SUPPORT REQUESTS =====

/**
 * @desc    Create support request
 * @route   POST /api/customer/support-requests
 * @access  Private (Customer only)
 */
const createSupportRequest = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    const { subject, message, priority } = req.body;
    validateRequiredFields(req.body, ["subject", "message"]);

    const supportRequest = new SupportRequest({
      user: req.user._id,
      subject,
      message,
      priority: priority || "medium",
    });

    await supportRequest.save();

    console.log(`📞 Support request created: ${supportRequest._id}`);

    res.status(201).json({
      success: true,
      message: "Support request submitted successfully!",
      supportRequest,
    });
  } catch (error) {
    console.error("❌ Error creating support request:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to submit support request.",
    });
  }
};

/**
 * @desc    Get customer's support requests
 * @route   GET /api/customer/support-requests
 * @access  Private (Customer only)
 */
const getMySupportRequests = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as a customer.",
      });
    }

    // ✨ Use lean() for read-only
    const supportRequests = await SupportRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: supportRequests,
    });
  } catch (error) {
    console.error("❌ Error fetching support requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch support requests.",
      error: error.message,
    });
  }
};

module.exports = {
  getCustomerDashboardData,
  createOrder,
  getMyOrders,
  getOrderById,
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
  recordProductView,
  getMyViewHistory,
  createSupportRequest,
  getMySupportRequests,
};
