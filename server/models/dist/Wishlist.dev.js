"use strict";

// server/models/Wishlist.js
var mongoose = require("mongoose");

var wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  addedAt: {
    type: Date,
    "default": Date.now
  }
});
var wishlistSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [wishlistItemSchema]
}, {
  timestamps: true
}); // ===== INDEXES =====

wishlistSchema.index({
  customer: 1
});
wishlistSchema.index({
  "items.product": 1
}); // ===== METHODS =====
// Add item to wishlist

wishlistSchema.methods.addItem = function (productId) {
  var exists = this.items.some(function (item) {
    return item.product.toString() === productId.toString();
  });

  if (exists) {
    throw new Error("Product already in wishlist");
  }

  this.items.push({
    product: productId
  });
  return this.save();
}; // Remove item from wishlist


wishlistSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(function (item) {
    return item.product.toString() !== productId.toString();
  });
  return this.save();
}; // Clear wishlist


wishlistSchema.methods.clearWishlist = function () {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model("Wishlist", wishlistSchema);