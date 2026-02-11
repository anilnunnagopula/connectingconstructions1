const mongoose = require("mongoose");

const productAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    alertType: {
      type: String,
      enum: ["price_drop", "back_in_stock"],
      required: true,
    },
    targetPrice: {
      type: Number,
      // Only required if alertType is 'price_drop'
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate alerts
productAlertSchema.index({ user: 1, product: 1, alertType: 1 }, { unique: true });

module.exports = mongoose.model("ProductAlert", productAlertSchema);
