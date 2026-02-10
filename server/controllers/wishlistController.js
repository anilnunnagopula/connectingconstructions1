// server/controllers/wishlistController.js
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

/**
 * @desc    Get customer wishlist
 * @route   GET /api/wishlist
 * @access  Private (Customer)
 */
exports.getWishlist = async (req, res) => {
  try {
    const customerId = req.user._id;

    let wishlist = await Wishlist.findOne({ customer: customerId }).populate({
      path: "items.product",
      populate: {
        path: "supplier",
        select: "name email companyName profilePictureUrl averageRating",
      },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        customer: customerId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      data: {
        items: wishlist.items,
        totalItems: wishlist.items.length,
      },
    });
  } catch (error) {
    console.error("❌ Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist/add
 * @access  Private (Customer)
 */
exports.addToWishlist = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ customer: customerId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        customer: customerId,
        items: [],
      });
    }

    // Add item
    await wishlist.addItem(productId);

    // Populate and return
    wishlist = await Wishlist.findOne({ customer: customerId }).populate({
      path: "items.product",
      populate: {
        path: "supplier",
        select: "name email companyName",
      },
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: {
        items: wishlist.items,
        totalItems: wishlist.items.length,
      },
    });
  } catch (error) {
    console.error("❌ Add to wishlist error:", error);

    if (error.message === "Product already in wishlist") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
    });
  }
};

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/remove/:productId
 * @access  Private (Customer)
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ customer: customerId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    await wishlist.removeItem(productId);

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: {
        items: wishlist.items,
        totalItems: wishlist.items.length,
      },
    });
  } catch (error) {
    console.error("❌ Remove from wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
    });
  }
};

/**
 * @desc    Clear wishlist
 * @route   DELETE /api/wishlist/clear
 * @access  Private (Customer)
 */
exports.clearWishlist = async (req, res) => {
  try {
    const customerId = req.user._id;

    const wishlist = await Wishlist.findOne({ customer: customerId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    await wishlist.clearWishlist();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
      data: {
        items: [],
        totalItems: 0,
      },
    });
  } catch (error) {
    console.error("❌ Clear wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
    });
  }
};
