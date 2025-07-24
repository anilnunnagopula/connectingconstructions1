"use strict";

// server/models/Product.js
var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  // Renamed from supplierId to supplier for consistency with ref: 'User'
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    // Use ObjectId to link to the User model
    required: true,
    ref: "User" // This creates a reference to your User model

  },
  name: {
    type: String,
    required: true,
    trim: true // Consider unique: true with supplier to allow different suppliers to have same product name
    // unique: true, // If product names must be globally unique

  },
  description: {
    // Added description field
    type: String,
    required: true,
    // Make description required
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
    // Renamed from 'stock' to 'quantity' to match your usage
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    // Based on quantity > 0, or manual override
    type: Boolean,
    "default": true
  },
  location: {
    // Supplier's default location for this product
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
    // Supplier's contact for this product (can be derived from supplier user)
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
    // This is now an array of strings as per your modification
    type: [String],
    required: false,
    // Set to true if at least one image is mandatory
    "default": []
  },
  // NEW: Fields for aggregated rating (from Review model)
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
  }
}, {
  timestamps: true
} // Automatically adds createdAt and updatedAt fields
); // Add an index to prevent a supplier from having two products with the exact same name

productSchema.index({
  name: 1,
  supplier: 1
}, {
  unique: true
});
module.exports = mongoose.model("Product", productSchema);