// server/models/ShopLocation.js
const mongoose = require("mongoose");

const shopLocationSchema = new mongoose.Schema(
  {
    supplier: {
      // Link to the User model (the supplier who owns this location)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      // E.g., "Main Warehouse", "City Branch"
      type: String,
      required: true,
      trim: true,
    },
    address: {
      // Full text address
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      // Latitude from map/geolocation
      type: Number,
      required: false, // Can be null if only text address is given
    },
    lng: {
      // Longitude from map/geolocation
      type: Number,
      required: false, // Can be null if only text address is given
    },
    // You might add more fields like:
    // contactPhone: String,
    // contactEmail: String,
    // businessHours: [String], // Array of strings like "Mon-Fri: 9-5"
    // isPrimary: { type: Boolean, default: false }, // If one location is the 'main' one
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Ensure a supplier cannot have two shop locations with the exact same name
shopLocationSchema.index({ supplier: 1, name: 1 }, { unique: true });

const ShopLocation = mongoose.model("ShopLocation", shopLocationSchema);

module.exports = ShopLocation;
