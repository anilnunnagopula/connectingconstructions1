"use strict";

// server/models/Review.js
var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  // Quality ratings
  qualityRating: {
    type: Number,
    min: 1,
    max: 5
  },
  valueRating: {
    type: Number,
    min: 1,
    max: 5
  },
  deliveryRating: {
    type: Number,
    min: 1,
    max: 5
  },
  // Verified purchase
  verified: {
    type: Boolean,
    "default": true
  },
  // Helpful votes
  helpful: {
    type: Number,
    "default": 0
  },
  helpfulVotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  // Supplier response
  supplierResponse: {
    text: String,
    respondedAt: Date
  },
  // Moderation
  status: {
    type: String,
    "enum": ["pending", "approved", "rejected"],
    "default": "approved"
  },
  moderationNotes: String
}, {
  timestamps: true
}); // ===== INDEXES =====

reviewSchema.index({
  product: 1,
  createdAt: -1
});
reviewSchema.index({
  customer: 1
});
reviewSchema.index({
  order: 1
});
reviewSchema.index({
  rating: 1
});
reviewSchema.index({
  customer: 1,
  product: 1
}, {
  unique: true
}); // ===== METHODS =====
// Mark review as helpful

reviewSchema.methods.markHelpful = function (userId) {
  if (!this.helpfulVotes.includes(userId)) {
    this.helpfulVotes.push(userId);
    this.helpful += 1;
    return this.save();
  }

  return Promise.resolve(this);
}; // Remove helpful vote


reviewSchema.methods.unmarkHelpful = function (userId) {
  var index = this.helpfulVotes.indexOf(userId);

  if (index > -1) {
    this.helpfulVotes.splice(index, 1);
    this.helpful = Math.max(0, this.helpful - 1);
    return this.save();
  }

  return Promise.resolve(this);
}; // Add supplier response


reviewSchema.methods.addSupplierResponse = function (responseText) {
  this.supplierResponse = {
    text: responseText,
    respondedAt: new Date()
  };
  return this.save();
}; // ===== MIDDLEWARE =====
// Update product rating after save


reviewSchema.post("save", function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(this.constructor.updateProductRating(this.product));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}); // Update product rating after delete

reviewSchema.post("remove", function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(this.constructor.updateProductRating(this.product));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
}); // ===== STATICS =====
// Calculate and update product average rating

reviewSchema.statics.updateProductRating = function _callee3(productId) {
  var Product, stats;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          Product = require("./Product");
          _context3.next = 3;
          return regeneratorRuntime.awrap(this.aggregate([{
            $match: {
              product: productId,
              status: "approved"
            }
          }, {
            $group: {
              _id: "$product",
              averageRating: {
                $avg: "$rating"
              },
              numReviews: {
                $sum: 1
              }
            }
          }]));

        case 3:
          stats = _context3.sent;

          if (!(stats.length > 0)) {
            _context3.next = 9;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(productId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            numReviews: stats[0].numReviews
          }));

        case 7:
          _context3.next = 11;
          break;

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(productId, {
            averageRating: 0,
            numReviews: 0
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, this);
};

module.exports = mongoose.model("Review", reviewSchema);