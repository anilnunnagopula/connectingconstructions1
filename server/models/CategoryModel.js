// server/models/CategoryModel.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true, // Categories should be unique across ALL suppliers, or per supplier?
    trim: true,
    maxlength: [50, "Category name cannot exceed 50 characters"],
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Assuming your User model handles suppliers
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: Add a unique compound index if categories should be unique *per supplier*
categorySchema.index({ name: 1, supplier: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
