"use strict";

// server/models/Review.js
var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
  product: {
    // Link to the Product being reviewed
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  user: {
    // Link to the User (customer) who wrote the review
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    // Rating from 1 to 5
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Adds `createdAt` (review date) and `updatedAt`

}); // Prevent a user from reviewing the same product multiple times

reviewSchema.index({
  product: 1,
  user: 1
}, {
  unique: true
}); // Post-save hook to update product's average rating whenever a new review is added

reviewSchema.post("save", function _callee(doc) {
  var Product, reviews, totalRating, numReviews, averageRating;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 'doc' refers to the review that was just saved
          Product = mongoose.model("Product"); // Get the Product model
          // Find all reviews for this product

          _context.next = 3;
          return regeneratorRuntime.awrap(doc.constructor.find({
            product: doc.product
          }));

        case 3:
          reviews = _context.sent;
          // Calculate the total rating and number of reviews
          totalRating = reviews.reduce(function (acc, item) {
            return item.rating + acc;
          }, 0);
          numReviews = reviews.length; // Calculate average rating

          averageRating = numReviews > 0 ? totalRating / numReviews : 0; // Update the Product document

          _context.next = 9;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(doc.product, {
            averageRating: parseFloat(averageRating.toFixed(1)),
            // Ensure one decimal place
            numReviews: numReviews
          }, {
            "new": true,
            runValidators: true
          } // Return updated doc, run schema validators
          ));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Optional: If you want to recalculate rating when a review is deleted

reviewSchema.post("deleteOne", function _callee2(doc) {
  var Product, reviews, totalRating, numReviews, averageRating;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          Product = mongoose.model("Product");
          _context2.next = 3;
          return regeneratorRuntime.awrap(doc.constructor.find({
            product: doc.product
          }));

        case 3:
          reviews = _context2.sent;
          totalRating = reviews.reduce(function (acc, item) {
            return item.rating + acc;
          }, 0);
          numReviews = reviews.length;
          averageRating = numReviews > 0 ? totalRating / numReviews : 0;
          _context2.next = 9;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(doc.product, {
            averageRating: parseFloat(averageRating.toFixed(1)),
            numReviews: numReviews
          }, {
            "new": true,
            runValidators: true
          }));

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var Review = mongoose.model("Review", reviewSchema);
module.exports = Review;