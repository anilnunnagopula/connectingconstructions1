"use strict";

// server/models/PayoutMethodModel.js
var mongoose = require("mongoose");

var PayoutMethodSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // Link to the supplier's User document
    required: true
  },
  type: {
    // e.g., 'BANK_TRANSFER', 'UPI'
    type: String,
    "enum": ["BANK_TRANSFER", "UPI"],
    required: true
  },
  details: {
    // For BANK_TRANSFER
    accountNumber: {
      type: String,
      trim: true
    },
    // Encrypt this in real app
    ifscCode: {
      type: String,
      trim: true
    },
    // Encrypt this in real app
    bankName: {
      type: String,
      trim: true
    },
    accountHolderName: {
      type: String,
      trim: true
    },
    // For UPI
    upiId: {
      type: String,
      trim: true
    } // Encrypt this in real app

  },
  isDefault: {
    // Is this the primary payout method?
    type: Boolean,
    "default": false
  },
  status: {
    // e.g., 'Verified', 'Pending Verification', 'Active', 'Invalid'
    type: String,
    "enum": ["Active", "Pending Verification", "Verified", "Invalid"],
    "default": "Active"
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
}); // Optional: Ensure only one default payout method per supplier

PayoutMethodSchema.index({
  supplier: 1,
  isDefault: 1
}, {
  unique: true,
  partialFilterExpression: {
    isDefault: true
  }
});
module.exports = mongoose.model("PayoutMethod", PayoutMethodSchema);