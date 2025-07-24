// server/models/SupportRequest.js
const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    user: {
      // The customer who submitted the request
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      // e.g., 'open', 'in progress', 'closed', 'resolved'
      type: String,
      enum: ["open", "in progress", "closed", "resolved"],
      default: "open",
    },
    priority: {
      // e.g., 'low', 'medium', 'high', 'urgent'
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    response: {
      // Optional: Agent's response
      type: String,
      trim: true,
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds `createdAt` (request submission date) and `updatedAt`
  }
);

const SupportRequest = mongoose.model("SupportRequest", supportRequestSchema);

module.exports = SupportRequest;
