// server/routes/reviews.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createReview,
  getProductReviews,
  getCustomerReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  addSupplierResponse,
} = require("../controllers/reviewController");

// Public routes
router.get("/product/:productId", getProductReviews);

// Customer routes
router.post("/", protect, authorizeRoles("customer"), createReview);
router.get(
  "/my-reviews",
  protect,
  authorizeRoles("customer"),
  getCustomerReviews,
);
router.put("/:reviewId", protect, authorizeRoles("customer"), updateReview);
router.delete("/:reviewId", protect, authorizeRoles("customer"), deleteReview);

// Mark as helpful (any authenticated user)
router.put("/:reviewId/helpful", protect, markReviewHelpful);

// Supplier routes
router.put(
  "/:reviewId/response",
  protect,
  authorizeRoles("supplier"),
  addSupplierResponse,
);

module.exports = router;
