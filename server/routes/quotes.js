// server/routes/quotes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Import controllers
const {
  createQuoteRequest,
  getCustomerQuoteRequests,
  getQuoteRequestById,
  cancelQuoteRequest,
  acceptQuoteResponse,
} = require("../controllers/quoteRequestController");

const {
  getQuoteRequestsForSupplier,
  createQuoteResponse,
  getSupplierQuoteResponses,
  withdrawQuoteResponse,
} = require("../controllers/quoteResponseController");

// ===== CUSTOMER ROUTES =====

// Quote requests
router.post(
  "/request",
  protect,
  authorizeRoles("customer"),
  createQuoteRequest,
);

router.get(
  "/request",
  protect,
  authorizeRoles("customer"),
  getCustomerQuoteRequests,
);

router.get(
  "/request/:id",
  protect,
  authorizeRoles("customer"),
  getQuoteRequestById,
);

router.put(
  "/request/:id/cancel",
  protect,
  authorizeRoles("customer"),
  cancelQuoteRequest,
);

router.put(
  "/request/:id/accept/:responseId",
  protect,
  authorizeRoles("customer"),
  acceptQuoteResponse,
);

// ===== SUPPLIER ROUTES =====

// View quote requests
router.get(
  "/response/requests",
  protect,
  authorizeRoles("supplier"),
  getQuoteRequestsForSupplier,
);

// Submit quote response
router.post(
  "/response",
  protect,
  authorizeRoles("supplier"),
  createQuoteResponse,
);

// Get supplier's responses
router.get(
  "/response",
  protect,
  authorizeRoles("supplier"),
  getSupplierQuoteResponses,
);

// Withdraw quote response
router.put(
  "/response/:id/withdraw",
  protect,
  authorizeRoles("supplier"),
  withdrawQuoteResponse,
);

module.exports = router;
