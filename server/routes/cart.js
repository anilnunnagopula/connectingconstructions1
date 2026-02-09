// server/routes/cart.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

// All routes require customer authentication
router.use(protect);
router.use(authorizeRoles("customer"));

// Get cart
router.get("/", getCart);

// Add to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/update/:productId", updateCartItem);

// Remove from cart
router.delete("/remove/:productId", removeFromCart);

// Clear cart
router.delete("/clear", clearCart);

module.exports = router;
