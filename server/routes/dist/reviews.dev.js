"use strict";

// server/routes/reviews.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles;

var _require2 = require("../controllers/reviewController"),
    createReview = _require2.createReview,
    getProductReviews = _require2.getProductReviews,
    getCustomerReviews = _require2.getCustomerReviews,
    updateReview = _require2.updateReview,
    deleteReview = _require2.deleteReview,
    markReviewHelpful = _require2.markReviewHelpful,
    addSupplierResponse = _require2.addSupplierResponse; // Public routes


router.get("/product/:productId", getProductReviews); // Customer routes

router.post("/", protect, authorizeRoles("customer"), createReview);
router.get("/my-reviews", protect, authorizeRoles("customer"), getCustomerReviews);
router.put("/:reviewId", protect, authorizeRoles("customer"), updateReview);
router["delete"]("/:reviewId", protect, authorizeRoles("customer"), deleteReview); // Mark as helpful (any authenticated user)

router.put("/:reviewId/helpful", protect, markReviewHelpful); // Supplier routes

router.put("/:reviewId/response", protect, authorizeRoles("supplier"), addSupplierResponse);
module.exports = router;