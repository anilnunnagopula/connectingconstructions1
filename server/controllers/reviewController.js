// server/controllers/reviewController.js
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

/**
 * @desc    Create a review
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
exports.createReview = async (req, res) => {
  try {
    const customerId = req.user._id;
    const {
      productId,
      orderId,
      rating,
      title,
      comment,
      qualityRating,
      valueRating,
      deliveryRating,
      images,
    } = req.body;

    // Validate required fields
    if (!productId || !orderId || !rating || !title || !comment) {
      console.log("❌ Missing fields:", { productId, orderId, rating, title, comment });
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if order exists and belongs to customer
    const order = await Order.findOne({
      _id: orderId,
      customer: customerId,
      orderStatus: "delivered",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not yet delivered",
      });
    }

    // Check if product is in the order
    const productInOrder = order.items.some(
      (item) =>
        (item.product?._id || item.product)?.toString() ===
        productId.toString(),
    );

    if (!productInOrder) {
      console.log("❌ Product not in order:", { productId, orderItems: order.items.map(i => i.product) });
      return res.status(400).json({
        success: false,
        message: "Product not found in this order",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      customer: customerId,
      product: productId,
    });

    if (existingReview) {
      console.log("❌ Existing review found:", existingReview._id);
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const review = await Review.create({
      customer: customerId,
      product: productId,
      order: orderId,
      rating,
      title,
      comment,
      qualityRating,
      valueRating,
      deliveryRating,
      images: images || [],
      verified: true,
    });

    console.log(`✅ Review created for product ${productId}`);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.error("❌ Create review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

/**
 * @desc    Get product reviews
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const reviews = await Review.find({
      product: productId,
      status: "approved",
    })
      .populate("customer", "name profilePictureUrl")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({
      product: productId,
      status: "approved",
    });

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      {
        $match: {
          product: mongoose.Types.ObjectId(productId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("❌ Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

/**
 * @desc    Get customer's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private (Customer)
 */
exports.getCustomerReviews = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ customer: customerId })
      .populate("product", "name imageUrls")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({ customer: customerId });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Get customer reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:reviewId
 * @access  Private (Customer)
 */
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const customerId = req.user._id;
    const {
      rating,
      title,
      comment,
      qualityRating,
      valueRating,
      deliveryRating,
    } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      customer: customerId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (qualityRating) review.qualityRating = qualityRating;
    if (valueRating) review.valueRating = valueRating;
    if (deliveryRating) review.deliveryRating = deliveryRating;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("❌ Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:reviewId
 * @access  Private (Customer)
 */
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const customerId = req.user._id;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      customer: customerId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update product rating
    await Review.updateProductRating(review.product);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

/**
 * @desc    Mark review as helpful
 * @route   PUT /api/reviews/:reviewId/helpful
 * @access  Private
 */
exports.markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.markHelpful(userId);

    res.status(200).json({
      success: true,
      message: "Marked as helpful",
      data: {
        helpful: review.helpful,
      },
    });
  } catch (error) {
    console.error("❌ Mark helpful error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark as helpful",
    });
  }
};

/**
 * @desc    Add supplier response to review
 * @route   PUT /api/reviews/:reviewId/response
 * @access  Private (Supplier)
 */
exports.addSupplierResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { responseText } = req.body;
    const supplierId = req.user._id;

    if (!responseText) {
      return res.status(400).json({
        success: false,
        message: "Response text is required",
      });
    }

    const review = await Review.findById(reviewId).populate("product");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if supplier owns the product
    if (review.product.supplier.toString() !== supplierId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to respond to this review",
      });
    }

    await review.addSupplierResponse(responseText);

    res.status(200).json({
      success: true,
      message: "Response added successfully",
      data: review,
    });
  } catch (error) {
    console.error("❌ Add response error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add response",
    });
  }
};
