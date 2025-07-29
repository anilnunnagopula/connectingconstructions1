// server/models/OfferModel.js
const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Link to the supplier's User document
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    // PERCENTAGE, FIXED_AMOUNT
    type: String,
    enum: ["PERCENTAGE", "FIXED_AMOUNT"],
    required: true,
  },
  value: {
    // 10 (for 10%), 50 (for ₹50)
    type: Number,
    required: true,
    min: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  applyTo: {
    // ALL_PRODUCTS, SPECIFIC_PRODUCTS, SPECIFIC_CATEGORIES
    type: String,
    enum: ["ALL_PRODUCTS", "SPECIFIC_PRODUCTS", "SPECIFIC_CATEGORIES"],
    default: "ALL_PRODUCTS",
  },
  // If applyTo is SPECIFIC_PRODUCTS
  selectedProducts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
  // If applyTo is SPECIFIC_CATEGORIES
  selectedCategories: [
    {
      // Store category IDs if your Category model has _id, or names if you prefer
      type: mongoose.Schema.ObjectId, // Assuming Category model has ObjectIds
      ref: "Category", // Assuming a Category model for categories
    },
  ],
  // Optional: Coupon code
  code: {
    type: String,
    trim: true,
    uppercase: true,
    unique: true,
    sparse: true, // Allows multiple null values for non-code offers
  },
  // Optional: Usage limits
  usageLimit: {
    // Max times this offer can be used overall
    type: Number,
    min: 0,
    default: null,
  },
  usedCount: {
    // How many times it has been used
    type: Number,
    default: 0,
  },
  status: {
    // Active, Inactive, Scheduled, Expired, Draft
    type: String,
    enum: ["Active", "Inactive", "Scheduled", "Expired", "Draft"],
    default: "Draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Offer", OfferSchema);
