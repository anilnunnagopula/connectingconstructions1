"use strict";

// server/controllers/quoteRequestController.js
var QuoteRequest = require("../models/QuoteRequest");

var QuoteResponse = require("../models/QuoteResponse");

var User = require("../models/User");
/**
 * @desc    Create new quote request
 * @route   POST /api/quotes/request
 * @access  Private (Customer)
 */


exports.createQuoteRequest = function _callee(req, res) {
  var customerId, _req$body, items, deliveryLocation, requiredBy, additionalNotes, targetSuppliers, broadcastToAll, reqDate, quoteRequest;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          customerId = req.user._id;
          _req$body = req.body, items = _req$body.items, deliveryLocation = _req$body.deliveryLocation, requiredBy = _req$body.requiredBy, additionalNotes = _req$body.additionalNotes, targetSuppliers = _req$body.targetSuppliers, broadcastToAll = _req$body.broadcastToAll; // Validate items

          if (!(!items || items.length === 0)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "At least one item is required"
          }));

        case 5:
          if (!(!deliveryLocation || !deliveryLocation.address)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Delivery location is required"
          }));

        case 7:
          // Validate required date
          reqDate = new Date(requiredBy);

          if (!(reqDate <= new Date())) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Required date must be in the future"
          }));

        case 10:
          if (!(!broadcastToAll && (!targetSuppliers || targetSuppliers.length === 0))) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Select suppliers or enable broadcast to all"
          }));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(QuoteRequest.create({
            customer: customerId,
            items: items,
            deliveryLocation: deliveryLocation,
            requiredBy: reqDate,
            additionalNotes: additionalNotes,
            targetSuppliers: broadcastToAll ? [] : targetSuppliers,
            broadcastToAll: broadcastToAll
          }));

        case 14:
          quoteRequest = _context.sent;
          console.log("\u2705 Quote request created: ".concat(quoteRequest.quoteNumber));
          res.status(201).json({
            success: true,
            message: "Quote request created successfully",
            data: quoteRequest
          });
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          console.error("❌ Create quote request error:", _context.t0);
          res.status(500).json({
            success: false,
            message: _context.t0.message || "Failed to create quote request"
          });

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
};
/**
 * @desc    Get customer's quote requests
 * @route   GET /api/quotes/request
 * @access  Private (Customer)
 */


exports.getCustomerQuoteRequests = function _callee2(req, res) {
  var customerId, _req$query, status, _req$query$page, page, _req$query$limit, limit, query, quoteRequests, total;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          customerId = req.user._id;
          _req$query = req.query, status = _req$query.status, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          query = {
            customer: customerId
          };

          if (status) {
            query.status = status;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(QuoteRequest.find(query).sort({
            createdAt: -1
          }).limit(limit * 1).skip((page - 1) * limit).lean());

        case 7:
          quoteRequests = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(QuoteRequest.countDocuments(query));

        case 10:
          total = _context2.sent;
          res.status(200).json({
            success: true,
            data: {
              quoteRequests: quoteRequests,
              total: total,
              page: parseInt(page),
              pages: Math.ceil(total / limit)
            }
          });
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Get quote requests error:", _context2.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch quote requests"
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};
/**
 * @desc    Get single quote request with responses
 * @route   GET /api/quotes/request/:id
 * @access  Private (Customer)
 */


exports.getQuoteRequestById = function _callee3(req, res) {
  var id, customerId, quoteRequest, responses;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          customerId = req.user._id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(QuoteRequest.findOne({
            _id: id,
            customer: customerId
          }));

        case 5:
          quoteRequest = _context3.sent;

          if (quoteRequest) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Quote request not found"
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(QuoteResponse.find({
            quoteRequest: id
          }).sort({
            totalAmount: 1
          }));

        case 10:
          responses = _context3.sent;
          // Sort by price (lowest first)
          res.status(200).json({
            success: true,
            data: {
              quoteRequest: quoteRequest,
              responses: responses,
              responseCount: responses.length
            }
          });
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Get quote request error:", _context3.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch quote request"
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
};
/**
 * @desc    Cancel quote request
 * @route   PUT /api/quotes/request/:id/cancel
 * @access  Private (Customer)
 */


exports.cancelQuoteRequest = function _callee4(req, res) {
  var id, reason, customerId, quoteRequest;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          reason = req.body.reason;
          customerId = req.user._id;
          _context4.next = 6;
          return regeneratorRuntime.awrap(QuoteRequest.findOne({
            _id: id,
            customer: customerId
          }));

        case 6:
          quoteRequest = _context4.sent;

          if (quoteRequest) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Quote request not found"
          }));

        case 9:
          if (!(quoteRequest.status === "accepted")) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Cannot cancel accepted quote request"
          }));

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(quoteRequest.cancel(reason));

        case 13:
          res.status(200).json({
            success: true,
            message: "Quote request cancelled",
            data: quoteRequest
          });
          _context4.next = 20;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Cancel quote request error:", _context4.t0);
          res.status(500).json({
            success: false,
            message: "Failed to cancel quote request"
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
};
/**
 * @desc    Accept a quote response
 * @route   PUT /api/quotes/request/:id/accept/:responseId
 * @access  Private (Customer)
 */


exports.acceptQuoteResponse = function _callee5(req, res) {
  var _req$params, id, responseId, customerId, quoteRequest, quoteResponse;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$params = req.params, id = _req$params.id, responseId = _req$params.responseId;
          customerId = req.user._id; // Get quote request

          _context5.next = 5;
          return regeneratorRuntime.awrap(QuoteRequest.findOne({
            _id: id,
            customer: customerId
          }));

        case 5:
          quoteRequest = _context5.sent;

          if (quoteRequest) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: "Quote request not found"
          }));

        case 8:
          if (!(quoteRequest.status === "accepted")) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: "Quote already accepted"
          }));

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(QuoteResponse.findOne({
            _id: responseId,
            quoteRequest: id
          }));

        case 12:
          quoteResponse = _context5.sent;

          if (quoteResponse) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: "Quote response not found"
          }));

        case 15:
          if (!quoteResponse.isExpired) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: "Quote has expired"
          }));

        case 17:
          _context5.next = 19;
          return regeneratorRuntime.awrap(quoteResponse.accept());

        case 19:
          _context5.next = 21;
          return regeneratorRuntime.awrap(quoteRequest.acceptQuote(responseId));

        case 21:
          _context5.next = 23;
          return regeneratorRuntime.awrap(QuoteResponse.updateMany({
            quoteRequest: id,
            _id: {
              $ne: responseId
            },
            status: "pending"
          }, {
            status: "rejected",
            rejectedAt: new Date(),
            rejectionReason: "Customer accepted another quote"
          }));

        case 23:
          console.log("\u2705 Quote accepted: ".concat(quoteResponse.responseNumber));
          res.status(200).json({
            success: true,
            message: "Quote accepted successfully",
            data: {
              quoteRequest: quoteRequest,
              acceptedQuote: quoteResponse
            }
          });
          _context5.next = 31;
          break;

        case 27:
          _context5.prev = 27;
          _context5.t0 = _context5["catch"](0);
          console.error("❌ Accept quote error:", _context5.t0);
          res.status(500).json({
            success: false,
            message: "Failed to accept quote"
          });

        case 31:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 27]]);
};