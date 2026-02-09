"use strict";

// server/routes/cart.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles;

var _require2 = require("../controllers/cartController"),
    getCart = _require2.getCart,
    addToCart = _require2.addToCart,
    updateCartItem = _require2.updateCartItem,
    removeFromCart = _require2.removeFromCart,
    clearCart = _require2.clearCart; // All routes require customer authentication


router.use(protect);
router.use(authorizeRoles("customer")); // Get cart

router.get("/", getCart); // Add to cart

router.post("/add", addToCart); // Update cart item quantity

router.put("/update/:productId", updateCartItem); // Remove from cart

router["delete"]("/remove/:productId", removeFromCart); // Clear cart

router["delete"]("/clear", clearCart);
module.exports = router;