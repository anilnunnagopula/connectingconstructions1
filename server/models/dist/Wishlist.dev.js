"use strict";

// server/models/Wishlist.js
var mongoose = require("mongoose");

var wishlistSchema = new mongoose.Schema({
  user: {
    // The customer who owns this wishlist item
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    // The product added to the wishlist
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  addedAt: {
    // Timestamp for when the item was added
    type: Date,
    "default": Date.now
  }
}); // Ensure a user can only add a specific product to their wishlist once

wishlistSchema.index({
  user: 1,
  product: 1
}, {
  unique: true
});
var Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;