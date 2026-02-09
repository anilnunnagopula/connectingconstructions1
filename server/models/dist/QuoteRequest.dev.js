"use strict";

// server/models/QuoteRequest.js
var mongoose = require("mongoose"); // server/models/QuoteRequest.js
// Update the quoteItemSchema:


var quoteItemSchema = new mongoose.Schema({
  type: {
    type: String,
    "enum": ["product", "service", "logistics"],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true,
    "enum": ["bags", "kg", "tonnes", "liters", "cubic_ft", "sq_ft", "pieces", "units", "service", "hours", "days", "trips"]
  },
  specifications: {
    type: String,
    "default": ""
  },
  // Optional reference to existing product (if applicable)
  productRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    "default": null // ✅ ADD THIS

  }
});
var quoteRequestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Request items
  items: {
    type: [quoteItemSchema],
    required: true,
    validate: {
      validator: function validator(items) {
        return items.length > 0;
      },
      message: "Quote request must have at least one item"
    }
  },
  // Delivery details
  deliveryLocation: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  requiredBy: {
    type: Date,
    required: true,
    validate: {
      validator: function validator(date) {
        return date > new Date();
      },
      message: "Required date must be in the future"
    }
  },
  additionalNotes: {
    type: String,
    maxlength: 1000
  },
  // Status tracking
  status: {
    type: String,
    "enum": ["pending", "quoted", "accepted", "rejected", "expired", "cancelled"],
    "default": "pending"
  },
  // Target suppliers
  targetSuppliers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  broadcastToAll: {
    type: Boolean,
    "default": false
  },
  // Response tracking
  responseCount: {
    type: Number,
    "default": 0
  },
  acceptedQuote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuoteResponse"
  },
  // Metadata
  expiresAt: {
    type: Date
  },
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}); // ===== INDEXES =====

quoteRequestSchema.index({
  customer: 1,
  createdAt: -1
});
quoteRequestSchema.index({
  status: 1
});
quoteRequestSchema.index({
  targetSuppliers: 1
});
quoteRequestSchema.index({
  expiresAt: 1
});
quoteRequestSchema.index({
  broadcastToAll: 1,
  status: 1
}); // ===== VIRTUALS =====

quoteRequestSchema.virtual("quoteNumber").get(function () {
  return "QT-".concat(this._id.toString().slice(-8).toUpperCase());
});
quoteRequestSchema.virtual("isExpired").get(function () {
  return this.expiresAt && new Date() > this.expiresAt;
});
quoteRequestSchema.virtual("daysUntilRequired").get(function () {
  var diff = this.requiredBy - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}); // ===== METHODS =====
// Mark quote as expired

quoteRequestSchema.methods.markExpired = function () {
  this.status = "expired";
  return this.save();
}; // Cancel quote request


quoteRequestSchema.methods.cancel = function (reason) {
  this.status = "cancelled";
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  return this.save();
}; // Accept a specific quote response


quoteRequestSchema.methods.acceptQuote = function (quoteResponseId) {
  this.status = "accepted";
  this.acceptedQuote = quoteResponseId;
  return this.save();
}; // Increment response count


quoteRequestSchema.methods.incrementResponses = function () {
  this.responseCount += 1;

  if (this.status === "pending") {
    this.status = "quoted";
  }

  return this.save();
}; // ===== MIDDLEWARE =====
// Auto-set expiration (30 days from creation)


quoteRequestSchema.pre("save", function (next) {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  next();
}); // Populate customer on find

quoteRequestSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: "name email phone"
  });
  next();
});
module.exports = mongoose.model("QuoteRequest", quoteRequestSchema);