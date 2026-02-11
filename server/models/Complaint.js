const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The entity being reported (Product, User, or Order)
    entityType: {
      type: String,
      enum: ["Product", "User", "Order", "Other"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'entityType' // Dynamic reference
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Incorrect Product Info",
        "Fake/Counterfeit",
        "Harassment",
        "Scam/Fraud",
        "Other"
      ]
    },
    description: {
      type: String,
      required: true, 
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "dismissed"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: ""
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resolvedAt: Date
  },
  {
    timestamps: true,
  }
);

// Indexes for faster filtering
complaintSchema.index({ status: 1 });
complaintSchema.index({ reportedBy: 1 });
complaintSchema.index({ entityId: 1 });

module.exports = mongoose.model("Complaint", complaintSchema);
