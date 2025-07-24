// server/models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      // Link to the Product being reviewed
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      // Link to the User (customer) who wrote the review
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // Rating from 1 to 5
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds `createdAt` (review date) and `updatedAt`
  }
);

// Prevent a user from reviewing the same product multiple times
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Post-save hook to update product's average rating whenever a new review is added
reviewSchema.post("save", async function (doc) {
  // 'doc' refers to the review that was just saved
  const Product = mongoose.model("Product"); // Get the Product model

  // Find all reviews for this product
  const reviews = await doc.constructor.find({ product: doc.product });

  // Calculate the total rating and number of reviews
  const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
  const numReviews = reviews.length;

  // Calculate average rating
  const averageRating = numReviews > 0 ? totalRating / numReviews : 0;

  // Update the Product document
  await Product.findByIdAndUpdate(
    doc.product,
    {
      averageRating: parseFloat(averageRating.toFixed(1)), // Ensure one decimal place
      numReviews: numReviews,
    },
    { new: true, runValidators: true } // Return updated doc, run schema validators
  );
});

// Optional: If you want to recalculate rating when a review is deleted
reviewSchema.post("deleteOne", async function (doc) {
  const Product = mongoose.model("Product");
  const reviews = await doc.constructor.find({ product: doc.product });
  const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
  const numReviews = reviews.length;
  const averageRating = numReviews > 0 ? totalRating / numReviews : 0;

  await Product.findByIdAndUpdate(
    doc.product,
    {
      averageRating: parseFloat(averageRating.toFixed(1)),
      numReviews: numReviews,
    },
    { new: true, runValidators: true }
  );
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
