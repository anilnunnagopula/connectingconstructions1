"use strict";

// server/routes/wishlist.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles;

var _require2 = require("../controllers/wishlistController"),
    getWishlist = _require2.getWishlist,
    addToWishlist = _require2.addToWishlist,
    removeFromWishlist = _require2.removeFromWishlist,
    clearWishlist = _require2.clearWishlist; // All routes require customer authentication


router.use(protect);
router.use(authorizeRoles("customer")); // Get wishlist

router.get("/", getWishlist); // Add to wishlist

router.post("/add", addToWishlist); // Remove from wishlist

router["delete"]("/remove/:productId", removeFromWishlist); // Clear wishlist

router["delete"]("/clear", clearWishlist);
module.exports = router;