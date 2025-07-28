// server/models/OrderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      // Link to Customer/User who placed the order
      type: mongoose.Schema.ObjectId,
      ref: "User", // Assuming your User model contains customer data
      required: true,
    },
    products: [
      // Array of products in this order
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product", // Link to the Product model
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        // Crucial: Add supplierId here so you can filter orders by supplier
        supplier: {
          type: mongoose.Schema.ObjectId,
          ref: "User", // Reference to the supplier user
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      // Add any other relevant address fields
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refunded",
      ],
      default: "Pending",
    },
    // Optionally, for tracking history
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

// Update updatedAt on save
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Order", orderSchema);
