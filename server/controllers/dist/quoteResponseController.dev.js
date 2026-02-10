"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// server/controllers/quoteResponseController.js
var QuoteRequest = require("../models/QuoteRequest");

var QuoteResponse = require("../models/QuoteResponse");

var NotificationService = require("../services/notificationService");
/**
 * @desc    Get quote requests for supplier
 * @route   GET /api/quotes/response/requests
 * @access  Private (Supplier)
 */


exports.getQuoteRequestsForSupplier = function _callee(req, res) {
  var supplierId, _req$query, status, _req$query$page, page, _req$query$limit, limit, query, quoteRequests, quoteIds, existingResponses, respondedQuoteIds, enrichedQuotes, total;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user._id;
          _req$query = req.query, status = _req$query.status, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit; // Find quotes where supplier is targeted OR broadcast is enabled

          query = {
            $or: [{
              targetSuppliers: supplierId
            }, {
              broadcastToAll: true
            }],
            status: {
              $in: ["pending", "quoted"]
            }
          };

          if (status) {
            query.status = status;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(QuoteRequest.find(query).sort({
            createdAt: -1
          }).limit(limit * 1).skip((page - 1) * limit).lean());

        case 7:
          quoteRequests = _context.sent;
          // Check which quotes supplier has already responded to
          quoteIds = quoteRequests.map(function (q) {
            return q._id;
          });
          _context.next = 11;
          return regeneratorRuntime.awrap(QuoteResponse.find({
            quoteRequest: {
              $in: quoteIds
            },
            supplier: supplierId
          }).select("quoteRequest"));

        case 11:
          existingResponses = _context.sent;
          respondedQuoteIds = new Set(existingResponses.map(function (r) {
            return r.quoteRequest.toString();
          })); // Mark quotes as responded

          enrichedQuotes = quoteRequests.map(function (quote) {
            return _objectSpread({}, quote, {
              hasResponded: respondedQuoteIds.has(quote._id.toString())
            });
          });
          _context.next = 16;
          return regeneratorRuntime.awrap(QuoteRequest.countDocuments(query));

        case 16:
          total = _context.sent;
          res.status(200).json({
            success: true,
            data: {
              quoteRequests: enrichedQuotes,
              total: total,
              page: parseInt(page),
              pages: Math.ceil(total / limit)
            }
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          console.error("❌ Get quote requests error:", _context.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch quote requests"
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
};
/**
 * @desc    Create quote response
 * @route   POST /api/quotes/response
 * @access  Private (Supplier)
 */


exports.createQuoteResponse = function _callee2(req, res) {
  var supplierId, _req$body, quoteRequestId, items, totalAmount, deliveryCharges, estimatedDeliveryDays, validUntil, terms, paymentTerms, quoteRequest, isTargeted, existingResponse, validityDate, quoteResponse;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          supplierId = req.user._id;
          _req$body = req.body, quoteRequestId = _req$body.quoteRequestId, items = _req$body.items, totalAmount = _req$body.totalAmount, deliveryCharges = _req$body.deliveryCharges, estimatedDeliveryDays = _req$body.estimatedDeliveryDays, validUntil = _req$body.validUntil, terms = _req$body.terms, paymentTerms = _req$body.paymentTerms; // Validate quote request exists

          _context2.next = 5;
          return regeneratorRuntime.awrap(QuoteRequest.findById(quoteRequestId));

        case 5:
          quoteRequest = _context2.sent;

          if (quoteRequest) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "Quote request not found"
          }));

        case 8:
          // Check if supplier is targeted
          isTargeted = quoteRequest.broadcastToAll || quoteRequest.targetSuppliers.some(function (id) {
            return id.toString() === supplierId.toString();
          });

          if (isTargeted) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            success: false,
            message: "You are not authorized to respond to this quote"
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(QuoteResponse.findOne({
            quoteRequest: quoteRequestId,
            supplier: supplierId
          }));

        case 13:
          existingResponse = _context2.sent;

          if (!existingResponse) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "You have already responded to this quote"
          }));

        case 16:
          if (!(items.length !== quoteRequest.items.length)) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Response items must match request items"
          }));

        case 18:
          // Validate validity date
          validityDate = new Date(validUntil);

          if (!(validityDate <= new Date())) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Validity date must be in the future"
          }));

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(QuoteResponse.create({
            quoteRequest: quoteRequestId,
            supplier: supplierId,
            items: items,
            totalAmount: totalAmount,
            deliveryCharges: deliveryCharges || 0,
            estimatedDeliveryDays: estimatedDeliveryDays,
            validUntil: validityDate,
            terms: terms,
            paymentTerms: paymentTerms || "cod"
          }));

        case 23:
          quoteResponse = _context2.sent;
          _context2.next = 26;
          return regeneratorRuntime.awrap(NotificationService.notifyQuoteResponse(quoteRequest, quoteResponse));

        case 26:
          _context2.next = 28;
          return regeneratorRuntime.awrap(quoteRequest.incrementResponses());

        case 28:
          console.log("\u2705 Quote response created: ".concat(quoteResponse.responseNumber));
          res.status(201).json({
            success: true,
            message: "Quote response submitted successfully",
            data: quoteResponse
          });
          _context2.next = 36;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Create quote response error:", _context2.t0);
          res.status(500).json({
            success: false,
            message: _context2.t0.message || "Failed to create quote response"
          });

        case 36:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 32]]);
};
/**
 * @desc    Get supplier's quote responses
 * @route   GET /api/quotes/response
 * @access  Private (Supplier)
 */


exports.getSupplierQuoteResponses = function _callee3(req, res) {
  var supplierId, _req$query2, status, _req$query2$page, page, _req$query2$limit, limit, query, responses, total;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          supplierId = req.user._id;
          _req$query2 = req.query, status = _req$query2.status, _req$query2$page = _req$query2.page, page = _req$query2$page === void 0 ? 1 : _req$query2$page, _req$query2$limit = _req$query2.limit, limit = _req$query2$limit === void 0 ? 10 : _req$query2$limit;
          query = {
            supplier: supplierId
          };

          if (status) {
            query.status = status;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(QuoteResponse.find(query).sort({
            createdAt: -1
          }).limit(limit * 1).skip((page - 1) * limit).lean());

        case 7:
          responses = _context3.sent;
          _context3.next = 10;
          return regeneratorRuntime.awrap(QuoteResponse.countDocuments(query));

        case 10:
          total = _context3.sent;
          res.status(200).json({
            success: true,
            data: {
              responses: responses,
              total: total,
              page: parseInt(page),
              pages: Math.ceil(total / limit)
            }
          });
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Get quote responses error:", _context3.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch quote responses"
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
};
/**
 * @desc    Withdraw quote response
 * @route   PUT /api/quotes/response/:id/withdraw
 * @access  Private (Supplier)
 */


exports.withdrawQuoteResponse = function _callee4(req, res) {
  var id, reason, supplierId, quoteResponse;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          reason = req.body.reason;
          supplierId = req.user._id;
          _context4.next = 6;
          return regeneratorRuntime.awrap(QuoteResponse.findOne({
            _id: id,
            supplier: supplierId
          }));

        case 6:
          quoteResponse = _context4.sent;

          if (quoteResponse) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Quote response not found"
          }));

        case 9:
          if (!(quoteResponse.status === "accepted")) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Cannot withdraw accepted quote"
          }));

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(quoteResponse.withdraw(reason));

        case 13:
          res.status(200).json({
            success: true,
            message: "Quote response withdrawn",
            data: quoteResponse
          });
          _context4.next = 20;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Withdraw quote error:", _context4.t0);
          res.status(500).json({
            success: false,
            message: "Failed to withdraw quote"
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
};