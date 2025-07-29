// server/models/PayoutHistoryModel.js
const mongoose = require("mongoose");

const PayoutHistorySchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR", // Or your primary currency
  },
  payoutMethod: {
    // Reference to the PayoutMethod used
    type: mongoose.Schema.ObjectId,
    ref: "PayoutMethod",
    required: false, // Could be null if method was deleted
  },
  payoutMethodDetailsSnapshot: {
    // Snapshot of details at time of payout
    type: Object, // Store non-sensitive details like type, last 4 digits of account, etc.
  },
  status: {
    // e.g., 'Processing', 'Completed', 'Failed', 'Reversed'
    type: String,
    enum: ["Processing", "Completed", "Failed", "Reversed"],
    default: "Processing",
  },
  transactionId: {
    // ID from the payment gateway
    type: String,
    unique: true,
    sparse: true, // Allow multiple nulls if not always present immediately
  },
  notes: String, // Any internal notes
  processedAt: {
    // When the payout actually occurred
    type: Date,
    default: Date.now,
  },
  // Optional: link to relevant orders/earnings period
  // earningsPeriod: { startDate: Date, endDate: Date }
});

module.exports = mongoose.model("PayoutHistory", PayoutHistorySchema);
