"use strict";

// server/models/ViewHistory.js
var mongoose = require("mongoose");

var viewHistorySchema = new mongoose.Schema({
  user: {
    // The customer who viewed the product
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    // The product that was viewed
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  viewedAt: {
    // Timestamp for when the product was viewed (will be updated on subsequent views)
    type: Date,
    "default": Date.now
  }
}); // Compound index to quickly find user's view history and update existing entries

viewHistorySchema.index({
  user: 1,
  product: 1
}, {
  unique: true
}); // Pre-save hook to update 'viewedAt' if an existing entry is being modified
// This keeps the 'viewedAt' timestamp current for repeat views

viewHistorySchema.pre("save", function (next) {
  if (this.isModified("viewedAt") || this.isNew) {
    this.viewedAt = Date.now();
  }

  next();
});
var ViewHistory = mongoose.model("ViewHistory", viewHistorySchema);
module.exports = ViewHistory;