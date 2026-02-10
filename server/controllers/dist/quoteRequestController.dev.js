"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// server/controllers/quoteRequestController.js
var QuoteRequest = require("../models/QuoteRequest");

var QuoteResponse = require("../models/QuoteResponse");

var Order = require("../models/Order");

var NotificationService = require("../services/notificationService");

var User = require("../models/User");
/**
 * @desc    Create new quote request
 * @route   POST /api/quotes/request
 * @access  Private (Customer)
 */


exports.createQuoteRequest = function _callee(req, res) {
  var customerId, _req$body, items, deliveryLocation, requiredBy, additionalNotes, targetSuppliers, broadcastToAll, reqDate, quoteRequest, suppliers, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, supplier, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, supplierId;

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

          if (!broadcastToAll) {
            _context.next = 47;
            break;
          }

          _context.next = 18;
          return regeneratorRuntime.awrap(User.find({
            role: "supplier"
          }).select("_id"));

        case 18:
          suppliers = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 22;
          _iterator = suppliers[Symbol.iterator]();

        case 24:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 31;
            break;
          }

          supplier = _step.value;
          _context.next = 28;
          return regeneratorRuntime.awrap(NotificationService.notifyQuoteRequest(quoteRequest, supplier._id));

        case 28:
          _iteratorNormalCompletion = true;
          _context.next = 24;
          break;

        case 31:
          _context.next = 37;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](22);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 37:
          _context.prev = 37;
          _context.prev = 38;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 40:
          _context.prev = 40;

          if (!_didIteratorError) {
            _context.next = 43;
            break;
          }

          throw _iteratorError;

        case 43:
          return _context.finish(40);

        case 44:
          return _context.finish(37);

        case 45:
          _context.next = 74;
          break;

        case 47:
          if (!(targetSuppliers && targetSuppliers.length > 0)) {
            _context.next = 74;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 51;
          _iterator2 = targetSuppliers[Symbol.iterator]();

        case 53:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 60;
            break;
          }

          supplierId = _step2.value;
          _context.next = 57;
          return regeneratorRuntime.awrap(NotificationService.notifyQuoteRequest(quoteRequest, supplierId));

        case 57:
          _iteratorNormalCompletion2 = true;
          _context.next = 53;
          break;

        case 60:
          _context.next = 66;
          break;

        case 62:
          _context.prev = 62;
          _context.t1 = _context["catch"](51);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 66:
          _context.prev = 66;
          _context.prev = 67;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 69:
          _context.prev = 69;

          if (!_didIteratorError2) {
            _context.next = 72;
            break;
          }

          throw _iteratorError2;

        case 72:
          return _context.finish(69);

        case 73:
          return _context.finish(66);

        case 74:
          console.log("\u2705 Quote request created: ".concat(quoteRequest.quoteNumber));
          res.status(201).json({
            success: true,
            message: "Quote request created successfully",
            data: quoteRequest
          });
          _context.next = 82;
          break;

        case 78:
          _context.prev = 78;
          _context.t2 = _context["catch"](0);
          console.error("❌ Create quote request error:", _context.t2);
          res.status(500).json({
            success: false,
            message: _context.t2.message || "Failed to create quote request"
          });

        case 82:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 78], [22, 33, 37, 45], [38,, 40, 44], [51, 62, 66, 74], [67,, 69, 73]]);
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
  var _req$params, id, responseId, customerId, quoteRequest, quoteResponse, orderItems, order;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$params = req.params, id = _req$params.id, responseId = _req$params.responseId;
          customerId = req.user._id;
          console.log("🎯 Accept quote:", {
            id: id,
            responseId: responseId,
            customerId: customerId
          }); // Get quote request

          _context5.next = 6;
          return regeneratorRuntime.awrap(QuoteRequest.findOne({
            _id: id,
            customer: customerId
          }));

        case 6:
          quoteRequest = _context5.sent;

          if (quoteRequest) {
            _context5.next = 10;
            break;
          }

          console.log("❌ Quote request not found");
          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: "Quote request not found"
          }));

        case 10:
          if (!(quoteRequest.status === "accepted")) {
            _context5.next = 13;
            break;
          }

          console.log("❌ Quote already accepted");
          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: "Quote already accepted"
          }));

        case 13:
          _context5.next = 15;
          return regeneratorRuntime.awrap(QuoteResponse.findOne({
            _id: responseId,
            quoteRequest: id
          }));

        case 15:
          quoteResponse = _context5.sent;

          if (quoteResponse) {
            _context5.next = 19;
            break;
          }

          console.log("❌ Quote response not found");
          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: "Quote response not found"
          }));

        case 19:
          if (!quoteResponse.isExpired) {
            _context5.next = 22;
            break;
          }

          console.log("❌ Quote expired");
          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: "Quote has expired"
          }));

        case 22:
          console.log("✅ Creating order from quote..."); // ✅ CREATE ORDER FROM QUOTE

          orderItems = quoteResponse.items.map(function (item) {
            return _objectSpread({}, item.productRef && {
              product: item.productRef
            }, {
              quantity: item.quantity,
              productSnapshot: {
                name: item.name,
                price: item.unitPrice,
                unit: item.unit,
                supplier: quoteResponse.supplier
              },
              priceAtOrder: item.unitPrice,
              totalPrice: item.totalPrice
            });
          });
          _context5.next = 26;
          return regeneratorRuntime.awrap(Order.create({
            customer: customerId,
            items: orderItems,
            subtotal: quoteResponse.totalAmount - (quoteResponse.deliveryCharges || 0),
            deliveryFee: quoteResponse.deliveryCharges || 0,
            tax: 0,
            // No tax on quote-based orders (already included)
            totalAmount: quoteResponse.totalAmount,
            deliveryAddress: quoteRequest.deliveryLocation,
            deliverySlot: {
              date: quoteRequest.requiredBy,
              timeSlot: "As per quote agreement"
            },
            paymentMethod: quoteResponse.paymentTerms === "cod" ? "cod" : "advance_50",
            paymentStatus: "pending",
            quoteReference: responseId,
            isFromQuote: true,
            customerNotes: quoteRequest.additionalNotes,
            supplierNotes: quoteResponse.terms
          }));

        case 26:
          order = _context5.sent;
          console.log("✅ Order created:", order._id); // Accept the quote

          _context5.next = 30;
          return regeneratorRuntime.awrap(quoteResponse.accept());

        case 30:
          _context5.next = 32;
          return regeneratorRuntime.awrap(quoteRequest.acceptQuote(responseId));

        case 32:
          _context5.next = 34;
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

        case 34:
          console.log("\u2705 Quote accepted: ".concat(quoteResponse.responseNumber, ", Order: ").concat(order.orderNumber)); // ✅ RETURN PROPER FORMAT

          res.status(200).json({
            success: true,
            message: "Quote accepted and order created successfully",
            data: {
              quoteRequest: quoteRequest,
              acceptedQuote: quoteResponse,
              order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                orderStatus: order.orderStatus
              }
            }
          });
          _context5.next = 42;
          break;

        case 38:
          _context5.prev = 38;
          _context5.t0 = _context5["catch"](0);
          console.error("❌ Accept quote error:", _context5.t0);
          res.status(500).json({
            success: false,
            message: _context5.t0.message || "Failed to accept quote"
          });

        case 42:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 38]]);
};