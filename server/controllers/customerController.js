// server/controllers/customerController.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");
const ViewHistory = require("../models/ViewHistory");
const SupportRequest = require("../models/SupportRequest");
const mongoose = require("mongoose"); // For ObjectId comparisons

// Helper for basic input validation (can be reused)
const validateRequiredFields = (data, fields) => {
  for (const field of fields) {
    if (!data[field] || String(data[field]).trim() === "") {
      throw new Error(`${field} is required.`);
    }
  }
};

// --- Order Management ---

// @desc    Create a new order
// @route   POST /api/customer/orders
// @access  Private (Customer only)
exports.createOrder = async (req, res) => {
  // req.user is populated by 'protect' middleware and 'authorizeRoles("customer")'
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

    // Validate order items and enrich with product details and supplier ID
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

        // Decrement product stock (important for inventory management)
        product.quantity -= item.qty;
        await product.save();

        return {
          product: product._id,
          name: product.name,
          qty: item.qty,
          image:
            product.imageUrls && product.imageUrls.length > 0
              ? product.imageUrls[0]
              : "",
          price: product.price,
          supplier: product.supplier, // Store supplier ID for each item
        };
      })
    );

    const order = new Order({
      user: req.user.id, // Assign to the authenticated customer
      orderItems: itemsFromDb,
      shippingAddress,
      paymentMethod,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      // totalPrice will be calculated by the pre-save hook in Order model
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

// @desc    Get all orders for the authenticated customer
// @route   GET /api/customer/orders/my
// @access  Private (Customer only)
exports.getMyOrders = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "orderItems.product",
      "name price imageUrls"
    ); // Populate product details
    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders.", error: error.message });
  }
};

// @desc    Get a single order by ID for the authenticated customer
// @route   GET /api/customer/orders/:id
// @access  Private (Customer only)
exports.getOrderById = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("orderItems.product", "name price imageUrls");

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

// --- Wishlist Management ---

// @desc    Add product to wishlist
// @route   POST /api/customer/wishlist
// @access  Private (Customer only)
exports.addToWishlist = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  const { productId } = req.body;

  try {
    validateRequiredFields(req.body, ["productId"]);

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if already in wishlist
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

// @desc    Get customer's wishlist
// @route   GET /api/customer/wishlist/my
// @access  Private (Customer only)
exports.getMyWishlist = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const wishlist = await Wishlist.find({ user: req.user.id }).populate(
      "product",
      "name price imageUrls category supplier"
    ); // Populate product details

    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch wishlist.", error: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/customer/wishlist/:id
// @access  Private (Customer only)
exports.removeFromWishlist = async (req, res) => {
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
    res
      .status(500)
      .json({
        message: "Failed to remove from wishlist.",
        error: error.message,
      });
  }
};

// --- View History Management ---

// @desc    Record a product view (or update existing view)
// @route   POST /api/customer/view-history
// @access  Private (Customer only) - this might be called on product page load
exports.recordProductView = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  const { productId } = req.body;

  try {
    validateRequiredFields(req.body, ["productId"]);

    // Find and update if exists, otherwise create new
    const viewHistoryItem = await ViewHistory.findOneAndUpdate(
      { user: req.user.id, product: productId },
      { $set: { viewedAt: Date.now() } }, // Update timestamp
      { upsert: true, new: true, setDefaultsOnInsert: true } // Create if not exists, return new doc
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

// @desc    Get customer's view history
// @route   GET /api/customer/view-history/my
// @access  Private (Customer only)
exports.getMyViewHistory = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const viewHistory = await ViewHistory.find({ user: req.user.id })
      .populate("product", "name price imageUrls category") // Populate product details
      .sort({ viewedAt: -1 }); // Most recent views first
    res.json(viewHistory);
  } catch (error) {
    console.error("Error fetching view history:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch view history.", error: error.message });
  }
};

// --- Support Request Management ---

// @desc    Create a new support request
// @route   POST /api/customer/support-requests
// @access  Private (Customer only)
exports.createSupportRequest = async (req, res) => {
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

// @desc    Get customer's support requests
// @route   GET /api/customer/support-requests/my
// @access  Private (Customer only)
exports.getMySupportRequests = async (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Not authorized as a customer." });
  }

  try {
    const supportRequests = await SupportRequest.find({
      user: req.user.id,
    }).sort({ createdAt: -1 }); // Most recent first
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
