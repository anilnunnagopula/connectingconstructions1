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

    const wishlist = await Wishlist.findOne({ customer: customerId })
      .populate({
        path: "items.product",
        select: "name price imageUrls category supplier availability unit productType isDeleted",
        populate: {
          path: "supplier",
          select: "name email companyName profilePictureUrl averageRating",
        },
      })
      .lean();

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: [], // Return empty array
      });
    }

    // Filter out items where product is null (deleted) or marked isDeleted
    const activeItems = wishlist.items.filter(
      (item) => item.product && !item.product.isDeleted
    );

    res.status(200).json({
      success: true,
      data: activeItems, // Return array directly
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
    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ customer: customerId });

    if (!wishlist) {
      wishlist = new Wishlist({
        customer: customerId,
        items: [],
      });
    }

    // Check if item exists
    const exists = wishlist.items.some(
      (item) => item.product.toString() === productId.toString()
    );

    if (exists) {
        return res.status(400).json({
            success: false,
            message: "Product already in wishlist",
        });
    }

    // Add item
    wishlist.items.push({ product: productId });
    await wishlist.save();

    // Populate for response
    // We fetch again to ensure clean state and populate
    const updatedWishlist = await Wishlist.findOne({ customer: customerId })
        .populate({
            path: "items.product",
            select: "name price imageUrls category supplier availability",
             populate: {
                path: "supplier",
                select: "name email companyName",
            },
        })
        .lean();
    
    const activeItems = updatedWishlist.items.filter(
      (item) => item.product && !item.product.isDeleted
    );

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: activeItems,
    });
  } catch (error) {
    console.error("❌ Add to wishlist error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add to wishlist",
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

    // Filter out the item
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      (item) => item.product && item.product.toString() !== productId.toString()
    );
    
    // Fallback: check if productId matches the ITEM _id (just in case frontend sends item ID)
    if (wishlist.items.length === initialLength) {
         wishlist.items = wishlist.items.filter(
            (item) => item._id && item._id.toString() !== productId.toString()
        );
    }

    if (wishlist.items.length === initialLength) {
         return res.status(404).json({
            success: false,
            message: "Item not found in wishlist",
        });
    }

    await wishlist.save();

    // Return updated list
    const updatedWishlist = await Wishlist.findOne({ customer: customerId })
        .populate({
            path: "items.product",
             select: "name price imageUrls category supplier availability",
        })
        .lean();
    
    const activeItems = updatedWishlist ? updatedWishlist.items.filter(
      (item) => item.product && !item.product.isDeleted
    ) : [];

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: activeItems,
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
