// server/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    // Reference to the actual Product (ObjectId)
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String }, // Assuming main image URL
  price: { type: Number, required: true },
  // Crucially, store the supplier ID for this specific item at the time of order
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      // The customer who placed the order
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema], // Array of products in the order
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      // Details from payment gateway
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt`
  }
);

// Pre-save hook to calculate totalPrice if not provided or if items change
orderSchema.pre("save", function (next) {
  if (this.isModified("orderItems") || this.isNew) {
    let itemsTotalPrice = this.orderItems.reduce(
      (acc, item) => acc + item.qty * item.price,
      0
    );
    this.totalPrice = itemsTotalPrice + this.taxPrice + this.shippingPrice;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
