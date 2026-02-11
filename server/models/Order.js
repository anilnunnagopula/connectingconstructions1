// server/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  // Snapshot at time of order (in case product changes later)
  productSnapshot: {
    name: String,
    price: Number,
    unit: String,
    imageUrl: String,
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  priceAtOrder: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Order items
    items: [orderItemSchema],

    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // Delivery details
    deliveryAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },

    deliverySlot: {
      date: Date,
      timeSlot: String, // e.g., "9AM-12PM", "12PM-3PM"
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["cod", "upi", "card", "netbanking", "razorpay"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Razorpay payment fields
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
    paymentError: String,

    // Refund fields
    refundStatus: {
      type: String,
      enum: ["not_applicable", "initiated", "processing", "completed", "failed"],
      default: "not_applicable",
    },
    refundId: String,
    refundAmount: Number,

    // Order status
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Tracking
    trackingInfo: {
      trackingId: String,
      carrier: String,
      estimatedDelivery: Date,
    },

    // Notes
    customerNotes: String,
    supplierNotes: String,

    // Cancellation
    cancellationReason: String,
    cancelledAt: Date,

    // Timestamps for status changes
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,

    // ✅ ADD THIS - Quote reference
    quoteReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuoteResponse",
    },

    isFromQuote: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ===== INDEXES =====
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ "items.product": 1 });
orderSchema.index({ createdAt: -1 });

// ===== VIRTUALS =====
orderSchema.virtual("orderNumber").get(function () {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// ===== METHODS =====

// Update order status
orderSchema.methods.updateStatus = function (status) {
  this.orderStatus = status;

  // Set timestamps based on status
  if (status === "confirmed") {
    this.confirmedAt = new Date();
  } else if (status === "shipped") {
    this.shippedAt = new Date();
  } else if (status === "delivered") {
    this.deliveredAt = new Date();
  }

  return this.save();
};

// Cancel order
orderSchema.methods.cancel = function (reason) {
  this.orderStatus = "cancelled";
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  return this.save();
};

// ===== MIDDLEWARE =====

// Populate product and customer on find
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: "name email phone",
  });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
