"use strict";

// server/routes/quotes.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles; // Import controllers


var _require2 = require("../controllers/quoteRequestController"),
    createQuoteRequest = _require2.createQuoteRequest,
    getCustomerQuoteRequests = _require2.getCustomerQuoteRequests,
    getQuoteRequestById = _require2.getQuoteRequestById,
    cancelQuoteRequest = _require2.cancelQuoteRequest,
    acceptQuoteResponse = _require2.acceptQuoteResponse;

var _require3 = require("../controllers/quoteResponseController"),
    getQuoteRequestsForSupplier = _require3.getQuoteRequestsForSupplier,
    createQuoteResponse = _require3.createQuoteResponse,
    getSupplierQuoteResponses = _require3.getSupplierQuoteResponses,
    withdrawQuoteResponse = _require3.withdrawQuoteResponse; // ===== CUSTOMER ROUTES =====
// Quote requests


router.post("/request", protect, authorizeRoles("customer"), createQuoteRequest);
router.get("/request", protect, authorizeRoles("customer"), getCustomerQuoteRequests);
router.get("/request/:id", protect, authorizeRoles("customer"), getQuoteRequestById);
router.put("/request/:id/cancel", protect, authorizeRoles("customer"), cancelQuoteRequest);
router.put("/request/:id/accept/:responseId", protect, authorizeRoles("customer"), acceptQuoteResponse); // ===== SUPPLIER ROUTES =====
// View quote requests

router.get("/response/requests", protect, authorizeRoles("supplier"), getQuoteRequestsForSupplier); // Submit quote response

router.post("/response", protect, authorizeRoles("supplier"), createQuoteResponse); // Get supplier's responses

router.get("/response", protect, authorizeRoles("supplier"), getSupplierQuoteResponses); // Withdraw quote response

router.put("/response/:id/withdraw", protect, authorizeRoles("supplier"), withdrawQuoteResponse);
module.exports = router;