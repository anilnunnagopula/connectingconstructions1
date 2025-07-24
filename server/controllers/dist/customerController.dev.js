"use strict";

// server/controllers/customerController.js
var Order = require("../models/Order");

var Product = require("../models/Product");

var Wishlist = require("../models/Wishlist");

var ViewHistory = require("../models/ViewHistory");

var SupportRequest = require("../models/SupportRequest");

var mongoose = require("mongoose"); // For ObjectId comparisons
// Helper for basic input validation (can be reused)


var validateRequiredFields = function validateRequiredFields(data, fields) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      if (!data[field] || String(data[field]).trim() === "") {
        throw new Error("".concat(field, " is required."));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}; // --- Order Management ---
// @desc    Create a new order
// @route   POST /api/customer/orders
// @access  Private (Customer only)


exports.createOrder = function _callee2(req, res) {
  var _req$body, orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, itemsFromDb, order, createdOrder;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          _req$body = req.body, orderItems = _req$body.orderItems, shippingAddress = _req$body.shippingAddress, paymentMethod = _req$body.paymentMethod, taxPrice = _req$body.taxPrice, shippingPrice = _req$body.shippingPrice;
          _context2.prev = 3;
          validateRequiredFields(req.body, ["orderItems", "shippingAddress", "paymentMethod"]);
          validateRequiredFields(shippingAddress, ["address", "city", "postalCode", "country"]);

          if (!(!orderItems || orderItems.length === 0)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "No order items provided."
          }));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(Promise.all(orderItems.map(function _callee(item) {
            var product;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(Product.findById(item.product));

                  case 2:
                    product = _context.sent;

                    if (product) {
                      _context.next = 5;
                      break;
                    }

                    throw new Error("Product not found: ".concat(item.product));

                  case 5:
                    if (!(product.quantity < item.qty)) {
                      _context.next = 7;
                      break;
                    }

                    throw new Error("Insufficient stock for ".concat(product.name, ". Available: ").concat(product.quantity));

                  case 7:
                    // Decrement product stock (important for inventory management)
                    product.quantity -= item.qty;
                    _context.next = 10;
                    return regeneratorRuntime.awrap(product.save());

                  case 10:
                    return _context.abrupt("return", {
                      product: product._id,
                      name: product.name,
                      qty: item.qty,
                      image: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : "",
                      price: product.price,
                      supplier: product.supplier // Store supplier ID for each item

                    });

                  case 11:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 10:
          itemsFromDb = _context2.sent;
          order = new Order({
            user: req.user.id,
            // Assign to the authenticated customer
            orderItems: itemsFromDb,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            taxPrice: taxPrice || 0,
            shippingPrice: shippingPrice || 0 // totalPrice will be calculated by the pre-save hook in Order model

          });
          _context2.next = 14;
          return regeneratorRuntime.awrap(order.save());

        case 14:
          createdOrder = _context2.sent;
          res.status(201).json({
            message: "Order placed successfully!",
            order: createdOrder
          });
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](3);
          console.error("Error creating order:", _context2.t0);
          res.status(400).json({
            message: _context2.t0.message || "Failed to create order."
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 18]]);
}; // @desc    Get all orders for the authenticated customer
// @route   GET /api/customer/orders/my
// @access  Private (Customer only)


exports.getMyOrders = function _callee3(req, res) {
  var orders;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Order.find({
            user: req.user.id
          }).populate("orderItems.product", "name price imageUrls"));

        case 5:
          orders = _context3.sent;
          // Populate product details
          res.json(orders);
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](2);
          console.error("Error fetching customer orders:", _context3.t0);
          res.status(500).json({
            message: "Failed to fetch orders.",
            error: _context3.t0.message
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; // @desc    Get a single order by ID for the authenticated customer
// @route   GET /api/customer/orders/:id
// @access  Private (Customer only)


exports.getOrderById = function _callee4(req, res) {
  var order;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: req.params.id,
            user: req.user.id
          }).populate("orderItems.product", "name price imageUrls"));

        case 5:
          order = _context4.sent;

          if (order) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Order not found or you do not own this order."
          }));

        case 8:
          res.json(order);
          _context4.next = 17;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](2);
          console.error("Error fetching single order:", _context4.t0);

          if (!(_context4.t0.name === "CastError")) {
            _context4.next = 16;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "Invalid order ID format."
          }));

        case 16:
          res.status(500).json({
            message: "Failed to fetch order.",
            error: _context4.t0.message
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 11]]);
}; // --- Wishlist Management ---
// @desc    Add product to wishlist
// @route   POST /api/customer/wishlist
// @access  Private (Customer only)


exports.addToWishlist = function _callee5(req, res) {
  var productId, product, existingWishlistItem, wishlistItem;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          productId = req.body.productId;
          _context5.prev = 3;
          validateRequiredFields(req.body, ["productId"]); // Check if product exists

          _context5.next = 7;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 7:
          product = _context5.sent;

          if (product) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "Product not found."
          }));

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(Wishlist.findOne({
            user: req.user.id,
            product: productId
          }));

        case 12:
          existingWishlistItem = _context5.sent;

          if (!existingWishlistItem) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: "Product already in wishlist."
          }));

        case 15:
          wishlistItem = new Wishlist({
            user: req.user.id,
            product: productId
          });
          _context5.next = 18;
          return regeneratorRuntime.awrap(wishlistItem.save());

        case 18:
          res.status(201).json({
            message: "Product added to wishlist.",
            wishlistItem: wishlistItem
          });
          _context5.next = 25;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](3);
          console.error("Error adding to wishlist:", _context5.t0);
          res.status(400).json({
            message: _context5.t0.message || "Failed to add to wishlist."
          });

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 21]]);
}; // @desc    Get customer's wishlist
// @route   GET /api/customer/wishlist/my
// @access  Private (Customer only)


exports.getMyWishlist = function _callee6(req, res) {
  var wishlist;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context6.next = 2;
            break;
          }

          return _context6.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          _context6.prev = 2;
          _context6.next = 5;
          return regeneratorRuntime.awrap(Wishlist.find({
            user: req.user.id
          }).populate("product", "name price imageUrls category supplier"));

        case 5:
          wishlist = _context6.sent;
          // Populate product details
          res.json(wishlist);
          _context6.next = 13;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](2);
          console.error("Error fetching wishlist:", _context6.t0);
          res.status(500).json({
            message: "Failed to fetch wishlist.",
            error: _context6.t0.message
          });

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; // @desc    Remove product from wishlist
// @route   DELETE /api/customer/wishlist/:id
// @access  Private (Customer only)


exports.removeFromWishlist = function _callee7(req, res) {
  var wishlistItemId, result;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context7.next = 2;
            break;
          }

          return _context7.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          wishlistItemId = req.params.id;
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(Wishlist.findOneAndDelete({
            _id: wishlistItemId,
            user: req.user.id
          }));

        case 6:
          result = _context7.sent;

          if (result) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "Wishlist item not found or you do not own it."
          }));

        case 9:
          res.json({
            message: "Product removed from wishlist."
          });
          _context7.next = 18;
          break;

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](3);
          console.error("Error removing from wishlist:", _context7.t0);

          if (!(_context7.t0.name === "CastError")) {
            _context7.next = 17;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: "Invalid wishlist item ID format."
          }));

        case 17:
          res.status(500).json({
            message: "Failed to remove from wishlist.",
            error: _context7.t0.message
          });

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 12]]);
}; // --- View History Management ---
// @desc    Record a product view (or update existing view)
// @route   POST /api/customer/view-history
// @access  Private (Customer only) - this might be called on product page load


exports.recordProductView = function _callee8(req, res) {
  var productId, viewHistoryItem;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context8.next = 2;
            break;
          }

          return _context8.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          productId = req.body.productId;
          _context8.prev = 3;
          validateRequiredFields(req.body, ["productId"]); // Find and update if exists, otherwise create new

          _context8.next = 7;
          return regeneratorRuntime.awrap(ViewHistory.findOneAndUpdate({
            user: req.user.id,
            product: productId
          }, {
            $set: {
              viewedAt: Date.now()
            }
          }, // Update timestamp
          {
            upsert: true,
            "new": true,
            setDefaultsOnInsert: true
          } // Create if not exists, return new doc
          ));

        case 7:
          viewHistoryItem = _context8.sent;
          res.status(200).json({
            message: "Product view recorded.",
            viewHistoryItem: viewHistoryItem
          });
          _context8.next = 15;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](3);
          console.error("Error recording product view:", _context8.t0);
          res.status(400).json({
            message: _context8.t0.message || "Failed to record product view."
          });

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 11]]);
}; // @desc    Get customer's view history
// @route   GET /api/customer/view-history/my
// @access  Private (Customer only)


exports.getMyViewHistory = function _callee9(req, res) {
  var viewHistory;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context9.next = 2;
            break;
          }

          return _context9.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          _context9.prev = 2;
          _context9.next = 5;
          return regeneratorRuntime.awrap(ViewHistory.find({
            user: req.user.id
          }).populate("product", "name price imageUrls category") // Populate product details
          .sort({
            viewedAt: -1
          }));

        case 5:
          viewHistory = _context9.sent;
          // Most recent views first
          res.json(viewHistory);
          _context9.next = 13;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](2);
          console.error("Error fetching view history:", _context9.t0);
          res.status(500).json({
            message: "Failed to fetch view history.",
            error: _context9.t0.message
          });

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; // --- Support Request Management ---
// @desc    Create a new support request
// @route   POST /api/customer/support-requests
// @access  Private (Customer only)


exports.createSupportRequest = function _callee10(req, res) {
  var _req$body2, subject, message, priority, supportRequest;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context10.next = 2;
            break;
          }

          return _context10.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          _req$body2 = req.body, subject = _req$body2.subject, message = _req$body2.message, priority = _req$body2.priority;
          _context10.prev = 3;
          validateRequiredFields(req.body, ["subject", "message"]);
          supportRequest = new SupportRequest({
            user: req.user.id,
            subject: subject,
            message: message,
            priority: priority || "medium"
          });
          _context10.next = 8;
          return regeneratorRuntime.awrap(supportRequest.save());

        case 8:
          res.status(201).json({
            message: "Support request submitted successfully!",
            supportRequest: supportRequest
          });
          _context10.next = 15;
          break;

        case 11:
          _context10.prev = 11;
          _context10.t0 = _context10["catch"](3);
          console.error("Error creating support request:", _context10.t0);
          res.status(400).json({
            message: _context10.t0.message || "Failed to submit support request."
          });

        case 15:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[3, 11]]);
}; // @desc    Get customer's support requests
// @route   GET /api/customer/support-requests/my
// @access  Private (Customer only)


exports.getMySupportRequests = function _callee11(req, res) {
  var supportRequests;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          if (!(req.user.role !== "customer")) {
            _context11.next = 2;
            break;
          }

          return _context11.abrupt("return", res.status(403).json({
            message: "Not authorized as a customer."
          }));

        case 2:
          _context11.prev = 2;
          _context11.next = 5;
          return regeneratorRuntime.awrap(SupportRequest.find({
            user: req.user.id
          }).sort({
            createdAt: -1
          }));

        case 5:
          supportRequests = _context11.sent;
          // Most recent first
          res.json(supportRequests);
          _context11.next = 13;
          break;

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](2);
          console.error("Error fetching support requests:", _context11.t0);
          res.status(500).json({
            message: "Failed to fetch support requests.",
            error: _context11.t0.message
          });

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[2, 9]]);
};