"use strict";

// server/models/Product.js
var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: Boolean,
    "default": true
  },
  location: {
    text: {
      type: String,
      required: true
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  contact: {
    mobile: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  imageUrls: {
    type: [String],
    required: false,
    "default": []
  },
  averageRating: {
    type: Number,
    "default": 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    "default": 0,
    min: 0
  },
  // ✨ NEW: Soft delete
  isDeleted: {
    type: Boolean,
    "default": false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
}); // ===== INDEXES (CRITICAL FOR PERFORMANCE) =====
// Existing: Prevent duplicate product names per supplier

productSchema.index({
  name: 1,
  supplier: 1
}, {
  unique: true
}); // ✨ NEW: Performance indexes
// Category filtering (most common query)

productSchema.index({
  category: 1,
  isDeleted: 1,
  availability: 1
}); // Supplier products

productSchema.index({
  supplier: 1,
  isDeleted: 1
}); // Text search on name and description

productSchema.index({
  name: "text",
  description: "text"
}); // Price range queries

productSchema.index({
  price: 1
}); // Top-rated products

productSchema.index({
  averageRating: -1
}); // Compound index for category + price filtering

productSchema.index({
  category: 1,
  price: 1,
  isDeleted: 1
}); // Recent products

productSchema.index({
  createdAt: -1,
  isDeleted: 1
}); // Location-based queries (if you add geo features later)

productSchema.index({
  "location.lat": 1,
  "location.lng": 1
}); // ===== VIRTUALS =====
// Virtual to check if product is in stock

productSchema.virtual("inStock").get(function () {
  return this.quantity > 0 && this.availability && !this.isDeleted;
}); // ===== METHODS =====
// Soft delete method

productSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.availability = false; // Also mark as unavailable

  return this.save();
}; // Restore soft-deleted product


productSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
}; // Update stock after order


productSchema.methods.decreaseStock = function (quantity) {
  if (this.quantity >= quantity) {
    this.quantity -= quantity;

    if (this.quantity === 0) {
      this.availability = false;
    }

    return this.save();
  }

  throw new Error("Insufficient stock");
}; // Increase stock (for cancellations/returns)


productSchema.methods.increaseStock = function (quantity) {
  this.quantity += quantity;

  if (this.quantity > 0) {
    this.availability = true;
  }

  return this.save();
}; // Update rating (called when new review is added)


productSchema.methods.updateRating = function (newAverage, newCount) {
  this.averageRating = newAverage;
  this.numReviews = newCount;
  return this.save();
}; // ===== MIDDLEWARE =====
// Pre-save: Auto-update availability based on quantity


productSchema.pre("save", function (next) {
  if (this.isModified("quantity")) {
    if (this.quantity === 0) {
      this.availability = false;
    }
  }

  next();
}); // ===== QUERY HELPERS =====
// Helper to exclude deleted products by default

productSchema.query.notDeleted = function () {
  return this.where({
    isDeleted: false
  });
}; // Helper to get available products


productSchema.query.available = function () {
  return this.where({
    isDeleted: false,
    availability: true,
    quantity: {
      $gt: 0
    }
  });
};

module.exports = mongoose.model("Product", productSchema);