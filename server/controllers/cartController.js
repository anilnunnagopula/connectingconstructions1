// server/controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * @desc    Get customer's cart
 * @route   GET /api/cart
 * @access  Private (Customer)
 */
exports.getCart = async (req, res) => {
  try {
    const customerId = req.user._id;

    let cart = await Cart.findOne({ customer: customerId }).populate(
      "items.product",
      "name price quantity unit imageUrls category supplier availability",
    );

    // Create cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({ customer: customerId, items: [] });
    }

    console.log(`📦 Cart fetched for customer: ${customerId}`);

    res.status(200).json({
      success: true,
      data: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private (Customer)
 */
exports.addToCart = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Verify product exists and is available
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.availability) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (product.productType === "service") {
      return res.status(400).json({
        success: false,
        message: "Services cannot be added to cart. Please request a quote.",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} units available`,
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      cart = new Cart({ customer: customerId, items: [] });
    }

    // Add item
    await cart.addItem(productId, quantity);

    // Populate and return
    cart = await Cart.findOne({ customer: customerId }).populate(
      "items.product",
      "name price quantity unit imageUrls category supplier",
    );

    console.log(`✅ Item added to cart: ${productId}`);

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add item to cart",
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update/:productId
 * @access  Private (Customer)
 */
exports.updateCartItem = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (product && quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} units available`,
      });
    }

    await cart.updateItemQuantity(productId, quantity);

    // Populate and return
    const updatedCart = await Cart.findOne({ customer: customerId }).populate(
      "items.product",
      "name price quantity unit imageUrls category supplier",
    );

    console.log(`✅ Cart item updated: ${productId} → ${quantity}`);

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: {
        items: updatedCart.items,
        totalItems: updatedCart.totalItems,
        totalPrice: updatedCart.totalPrice,
      },
    });
  } catch (error) {
    console.error("❌ Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update cart",
    });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private (Customer)
 */
exports.removeFromCart = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.removeItem(productId);

    // Populate and return
    const updatedCart = await Cart.findOne({ customer: customerId }).populate(
      "items.product",
      "name price quantity unit imageUrls category supplier",
    );

    console.log(`🗑️  Item removed from cart: ${productId}`);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: {
        items: updatedCart.items,
        totalItems: updatedCart.totalItems,
        totalPrice: updatedCart.totalPrice,
      },
    });
  } catch (error) {
    console.error("❌ Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove item",
    });
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private (Customer)
 */
exports.clearCart = async (req, res) => {
  try {
    const customerId = req.user._id;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    await cart.clearCart();

    console.log(`🧹 Cart cleared for customer: ${customerId}`);

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
    });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};
