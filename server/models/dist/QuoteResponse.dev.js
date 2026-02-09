"use strict";

// server/models/QuoteResponse.js
var mongoose = require("mongoose");

var quoteResponseItemSchema = new mongoose.Schema({
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
    required: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryTime: {
    type: String,
    required: true
  },
  notes: String
});
var quoteResponseSchema = new mongoose.Schema({
  quoteRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuoteRequest",
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Response items (must match request items)
  items: {
    type: [quoteResponseItemSchema],
    required: true,
    validate: {
      validator: function validator(items) {
        return items.length > 0;
      },
      message: "Quote response must have at least one item"
    }
  },
  // Pricing
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  // Delivery & logistics
  deliveryCharges: {
    type: Number,
    "default": 0,
    min: 0
  },
  estimatedDeliveryDays: {
    type: Number,
    required: true,
    min: 1
  },
  // Validity
  validUntil: {
    type: Date,
    required: true,
    validate: {
      validator: function validator(date) {
        return date > new Date();
      },
      message: "Quote validity must be in the future"
    }
  },
  // Terms & Conditions
  terms: {
    type: String,
    maxlength: 2000
  },
  paymentTerms: {
    type: String,
    "enum": ["cod", "advance_50", "advance_100", "credit_30", "custom"],
    "default": "cod"
  },
  // Status
  status: {
    type: String,
    "enum": ["pending", "accepted", "rejected", "expired", "withdrawn"],
    "default": "pending"
  },
  // Customer interaction
  viewedByCustomer: {
    type: Boolean,
    "default": false
  },
  viewedAt: Date,
  acceptedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  withdrawnAt: Date,
  withdrawalReason: String
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}); // ===== INDEXES =====

quoteResponseSchema.index({
  quoteRequest: 1,
  supplier: 1
}, {
  unique: true
});
quoteResponseSchema.index({
  supplier: 1,
  createdAt: -1
});
quoteResponseSchema.index({
  status: 1
});
quoteResponseSchema.index({
  validUntil: 1
}); // ===== VIRTUALS =====

quoteResponseSchema.virtual("responseNumber").get(function () {
  return "QR-".concat(this._id.toString().slice(-8).toUpperCase());
});
quoteResponseSchema.virtual("isExpired").get(function () {
  return new Date() > this.validUntil;
});
quoteResponseSchema.virtual("daysUntilExpiry").get(function () {
  var diff = this.validUntil - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}); // ===== METHODS =====
// Mark as viewed

quoteResponseSchema.methods.markViewed = function () {
  if (!this.viewedByCustomer) {
    this.viewedByCustomer = true;
    this.viewedAt = new Date();
    return this.save();
  }

  return Promise.resolve(this);
}; // Accept quote


quoteResponseSchema.methods.accept = function () {
  this.status = "accepted";
  this.acceptedAt = new Date();
  return this.save();
}; // Reject quote


quoteResponseSchema.methods.reject = function (reason) {
  this.status = "rejected";
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
}; // Withdraw quote (supplier cancels)


quoteResponseSchema.methods.withdraw = function (reason) {
  this.status = "withdrawn";
  this.withdrawnAt = new Date();
  this.withdrawalReason = reason;
  return this.save();
}; // ===== MIDDLEWARE =====
// Populate supplier and quote request


quoteResponseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "supplier",
    select: "name email phone companyName profilePictureUrl averageRating"
  }).populate({
    path: "quoteRequest",
    select: "quoteNumber customer items deliveryLocation requiredBy"
  });
  next();
}); // Validate items count matches quote request

quoteResponseSchema.pre("save", function _callee(next) {
  var QuoteRequest, request;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!this.isNew) {
            _context.next = 7;
            break;
          }

          QuoteRequest = mongoose.model("QuoteRequest");
          _context.next = 4;
          return regeneratorRuntime.awrap(QuoteRequest.findById(this.quoteRequest));

        case 4:
          request = _context.sent;

          if (!(request && this.items.length !== request.items.length)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", next(new Error("Response items must match request items count")));

        case 7:
          next();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
module.exports = mongoose.model("QuoteResponse", quoteResponseSchema);