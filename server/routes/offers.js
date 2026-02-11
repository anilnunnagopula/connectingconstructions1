const express = require("express");
const router = express.Router();
const {
  getActiveOffers,
  validateOffer,
} = require("../controllers/offerController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/active", getActiveOffers);

// Protected routes
router.post("/validate", protect, validateOffer);

module.exports = router;
