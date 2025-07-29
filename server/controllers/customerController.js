// server/controllers/customerController.js
const User = require("../models/User");
const Order = require("../models/OrderModel");
// Ensure these are imported if you are using separate models for Wishlist, ViewHistory, SupportRequest
const Wishlist = require("../models/Wishlist"); // Assuming separate Wishlist model
const ViewHistory = require("../models/ViewHistory"); // Assuming separate ViewHistory model
const SupportRequest = require("../models/SupportRequest"); // Assuming separate SupportRequest model
const Product = require("../models/Product"); // Needed for populating cart/wishlist items

const mongoose = require("mongoose"); // For ObjectId if needed for complex aggregations

// Helper for basic input validation (can be reused)
const validateRequiredFields = (data, fields) => {
  for (const field of fields) {
    if (!data[field] || String(data[field]).trim() === "") {
      throw new Error(`${field} is required.`);
    }
  }
};

// @desc    Get customer dashboard summary data
// @route   GET /api/customer/dashboard
// @access  Private (Customer only)
const getCustomerDashboardData = async (req, res) => {
  try {
    const customerId = req.user.id; // ID of the authenticated customer

    // 1. Total Orders
    const totalOrders = await Order.countDocuments({
      user: customerId,
      isPaid: true,
    });

    // 2. Total Spent (Corrected using totalAmount from Order model)
    const totalSpentResult = await Order.aggregate([
      {
        $match: {
          user: customerId,
          isPaid: true,
          orderStatus: { $in: ["Delivered", "Completed"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }, // Sums the 'totalAmount' field from each matching order
    ]);
    const totalSpent =
      totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;

    // 3. Recent Orders (top 5 most recent paid orders)
    const recentOrders = await Order.find({ user: customerId, isPaid: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("products.productId", "name price imageUrls"); // Populate product details

    // 4. Wishlist Items Count, Cart Items Count, Unread Notifications Count
    // Assuming these are separate models or arrays on the User model.
    // If on User model: const user = await User.findById(customerId).select('cart wishlist notifications');
    // If separate models, use their respective counts:
    const wishlistItemsCount = await Wishlist.countDocuments({
      user: customerId,
    }); // Assuming separate Wishlist model
    const user = await User.findById(customerId).select(
      "cart notifications profilePictureUrl"
    ); // Fetch user for cart/notifications/profile pic
    const cartItemsCount = user?.cart?.length || 0; // Assuming cart is an array on User model
    const unreadNotificationsCount =
      user?.notifications?.filter((n) => !n.read).length || 0; // Assuming notifications array on User model with 'read' field
    const customerProfilePictureUrl = user?.profilePictureUrl || null; // Get profile picture URL from User model

    res.status(200).json({
      message: "Customer dashboard data fetched successfully",
      totalOrders: totalOrders,
      totalSpent: totalSpent,
      recentOrders: recentOrders,
      wishlistItemsCount: wishlistItemsCount,
      cartItemsCount: cartItemsCount,
      unreadNotificationsCount: unreadNotificationsCount,
      profilePictureUrl: customerProfilePictureUrl, // Include profile picture URL in response
      recommendedProducts: [], // Placeholder
      customerOffers: [], // Placeholder
    });
  } catch (error) {
    console.error("Error fetching customer dashboard data:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch customer dashboard data",
        error: error.message,
      });
  }
};

// @desc    Create a new order
// @route   POST /api/customer/orders
// @access  Private (Customer only)
const createOrder = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
  } = req.body;

  try {
    validateRequiredFields(req.body, [
      "orderItems",
      "shippingAddress",
      "paymentMethod",
    ]);
    validateRequiredFields(shippingAddress, [
      "address",
      "city",
      "postalCode",
      "country",
    ]);

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided." });
    }

    const itemsFromDb = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        if (product.quantity < item.qty) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.quantity}`
          );
        }

        product.quantity -= item.qty; // Decrement product stock
        await product.save();

        return {
          productId: product._id, // Use productId, not just product
          name: product.name,
          qty: item.qty, // Corrected from 'item.qty'
          image:
            product.imageUrls && product.imageUrls.length > 0
              ? product.imageUrls[0]
              : "",
          price: product.price,
          supplier: product.supplier,
        };
      })
    );

    // Calculate total amount based on itemsFromDb
    const calculatedTotalAmount = itemsFromDb.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    const order = new Order({
      user: req.user.id,
      orderItems: itemsFromDb, // Corrected from 'orderItems'
      shippingAddress,
      paymentMethod,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalAmount: calculatedTotalAmount, // Set totalAmount based on calculated value
    });

    const createdOrder = await order.save();
    res
      .status(201)
      .json({ message: "Order placed successfully!", order: createdOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(400)
      .json({ message: error.message || "Failed to create order." });
  }
};

const getMyOrders = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "products.productId", // Corrected to products.productId
      "name price imageUrls"
    );
    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders.", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("products.productId", "name price imageUrls"); // Corrected to products.productId

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or you do not own this order." });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching single order:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID format." });
    }
    res
      .status(500)
      .json({ message: "Failed to fetch order.", error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  const { productId } = req.body;

  try {
    validateRequiredFields(req.body, ["productId"]);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const existingWishlistItem = await Wishlist.findOne({
      user: req.user.id,
      product: productId,
    });
    if (existingWishlistItem) {
      return res.status(400).json({ message: "Product already in wishlist." });
    }

    const wishlistItem = new Wishlist({
      user: req.user.id,
      product: productId,
    });

    await wishlistItem.save();
    res
      .status(201)
      .json({ message: "Product added to wishlist.", wishlistItem });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res
      .status(400)
      .json({ message: error.message || "Failed to add to wishlist." });
  }
};

const getMyWishlist = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const wishlist = await Wishlist.find({ user: req.user.id }).populate(
      "product",
      "name price imageUrls category supplier"
    );
    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch wishlist.", error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  const wishlistItemId = req.params.id;

  try {
    const result = await Wishlist.findOneAndDelete({
      _id: wishlistItemId,
      user: req.user.id,
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Wishlist item not found or you do not own it." });
    }
    res.json({ message: "Product removed from wishlist." });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "Invalid wishlist item ID format." });
    }
    res.status(500).json({
      message: "Failed to remove from wishlist.",
      error: error.message,
    });
  }
};

const recordProductView = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  const { productId } = req.body;

  try {
    validateRequiredFields(req.body, ["productId"]);

    const viewHistoryItem = await ViewHistory.findOneAndUpdate(
      { user: req.user.id, product: productId },
      { $set: { viewedAt: Date.now() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res
      .status(200)
      .json({ message: "Product view recorded.", viewHistoryItem });
  } catch (error) {
    console.error("Error recording product view:", error);
    res
      .status(400)
      .json({ message: error.message || "Failed to record product view." });
  }
};

const getMyViewHistory = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const viewHistory = await ViewHistory.find({ user: req.user.id })
      .populate("product", "name price imageUrls category")
      .sort({ viewedAt: -1 });
    res.json(viewHistory);
  } catch (error) {
    console.error("Error fetching view history:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch view history.", error: error.message });
  }
};

const createSupportRequest = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  const { subject, message, priority } = req.body;

  try {
    validateRequiredFields(req.body, ["subject", "message"]);

    const supportRequest = new SupportRequest({
      user: req.user.id,
      subject,
      message,
      priority: priority || "medium",
    });

    await supportRequest.save();
    res
      .status(201)
      .json({
        message: "Support request submitted successfully!",
        supportRequest,
      });
  } catch (error) {
    console.error("Error creating support request:", error);
    res
      .status(400)
      .json({ message: error.message || "Failed to submit support request." });
  }
};

const getMySupportRequests = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const supportRequests = await SupportRequest.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });
    res.json(supportRequests);
  } catch (error) {
    console.error("Error fetching support requests:", error);
    res
      .status(500)
      .json({
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
