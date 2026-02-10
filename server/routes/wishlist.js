// server/routes/wishlist.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

// All routes require customer authentication
router.use(protect);
router.use(authorizeRoles("customer"));

// Get wishlist
router.get("/", getWishlist);

// Add to wishlist
router.post("/add", addToWishlist);

// Remove from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// Clear wishlist
router.delete("/clear", clearWishlist);

module.exports = router;
