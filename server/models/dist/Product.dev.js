"use strict";

// server/models/Product.js
var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  // supplierId will be the MongoDB _id of the User who is the supplier
  // It's crucial to store the actual _id from your User collection.
  // The frontend currently sends email as supplierId, so we'll find the _id on the backend.
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    // Use ObjectId to link to the User model
    required: true,
    ref: "User" // This creates a reference to your User model

  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
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
  imageUrl: {
    // Stores the base64 string or a URL if you use cloud storage
    type: String
  }
}, {
  timestamps: true
}); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model("Product", productSchema);