// server/models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      required: true,
      maxlength: 100,
    },

    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    images: [
      {
        type: String,
      },
    ],

    // Quality ratings
    qualityRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    valueRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    deliveryRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    // Verified purchase
    verified: {
      type: Boolean,
      default: true,
    },

    // Helpful votes
    helpful: {
      type: Number,
      default: 0,
    },

    helpfulVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Supplier response
    supplierResponse: {
      text: String,
      respondedAt: Date,
    },

    // Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    moderationNotes: String,
  },
  {
    timestamps: true,
  },
);

// ===== INDEXES =====
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ order: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ customer: 1, product: 1 }, { unique: true });

// ===== METHODS =====

// Mark review as helpful
reviewSchema.methods.markHelpful = function (userId) {
  if (!this.helpfulVotes.includes(userId)) {
    this.helpfulVotes.push(userId);
    this.helpful += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Remove helpful vote
reviewSchema.methods.unmarkHelpful = function (userId) {
  const index = this.helpfulVotes.indexOf(userId);
  if (index > -1) {
    this.helpfulVotes.splice(index, 1);
    this.helpful = Math.max(0, this.helpful - 1);
    return this.save();
  }
  return Promise.resolve(this);
};

// Add supplier response
reviewSchema.methods.addSupplierResponse = function (responseText) {
  this.supplierResponse = {
    text: responseText,
    respondedAt: new Date(),
  };
  return this.save();
};

// ===== MIDDLEWARE =====

// Update product rating after save
reviewSchema.post("save", async function () {
  await this.constructor.updateProductRating(this.product);
});

// Update product rating after delete
reviewSchema.post("remove", async function () {
  await this.constructor.updateProductRating(this.product);
});

// ===== STATICS =====

// Calculate and update product average rating
reviewSchema.statics.updateProductRating = async function (productId) {
  const Product = require("./Product");

  const stats = await this.aggregate([
    { $match: { product: productId, status: "approved" } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0,
    });
  }
};

module.exports = mongoose.model("Review", reviewSchema);
