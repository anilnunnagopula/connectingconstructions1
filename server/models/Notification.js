// server/models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "order",
        "quote",
        "payment",
        "delivery",
        "review",
        "system",
        "promotion",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    // Related entities
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    relatedQuote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuoteRequest",
    },

    relatedQuoteResponse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuoteResponse",
    },

    // Status
    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: Date,

    // Action link
    actionUrl: String,

    // Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Icon/visual
    icon: String,
    iconColor: String,

    // Expiry
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// ===== INDEXES =====
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 });

// ===== METHODS =====
notificationSchema.methods.markAsRead = function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// ===== STATICS =====
notificationSchema.statics.createNotification = async function (data) {
  return this.create(data);
};

notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

notificationSchema.statics.deleteExpired = async function () {
  return this.deleteMany({
    expiresAt: { $lte: new Date() },
  });
};

module.exports = mongoose.model("Notification", notificationSchema);