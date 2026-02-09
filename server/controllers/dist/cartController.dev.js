"use strict";

// server/controllers/cartController.js
var Cart = require("../models/Cart");

var Product = require("../models/Product");
/**
 * @desc    Get customer's cart
 * @route   GET /api/cart
 * @access  Private (Customer)
 */


exports.getCart = function _callee(req, res) {
  var customerId, cart;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          customerId = req.user._id;
          _context.next = 4;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }).populate("items.product", "name price quantity unit imageUrls category supplier availability"));

        case 4:
          cart = _context.sent;

          if (cart) {
            _context.next = 9;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(Cart.create({
            customer: customerId,
            items: []
          }));

        case 8:
          cart = _context.sent;

        case 9:
          console.log("\uD83D\uDCE6 Cart fetched for customer: ".concat(customerId));
          res.status(200).json({
            success: true,
            data: {
              items: cart.items,
              totalItems: cart.totalItems,
              totalPrice: cart.totalPrice
            }
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error fetching cart:", _context.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: _context.t0.message
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};
/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private (Customer)
 */


exports.addToCart = function _callee2(req, res) {
  var customerId, _req$body, productId, _req$body$quantity, quantity, product, cart;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          customerId = req.user._id;
          _req$body = req.body, productId = _req$body.productId, _req$body$quantity = _req$body.quantity, quantity = _req$body$quantity === void 0 ? 1 : _req$body$quantity;

          if (productId) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Product ID is required"
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(Product.findOne({
            _id: productId,
            isDeleted: false
          }));

        case 7:
          product = _context2.sent;

          if (product) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "Product not found"
          }));

        case 10:
          if (product.availability) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Product is not available"
          }));

        case 12:
          if (!(product.productType === "service")) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Services cannot be added to cart. Please request a quote."
          }));

        case 14:
          if (!(product.quantity < quantity)) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Only ".concat(product.quantity, " units available")
          }));

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }));

        case 18:
          cart = _context2.sent;

          if (!cart) {
            cart = new Cart({
              customer: customerId,
              items: []
            });
          } // Add item


          _context2.next = 22;
          return regeneratorRuntime.awrap(cart.addItem(productId, quantity));

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }).populate("items.product", "name price quantity unit imageUrls category supplier"));

        case 24:
          cart = _context2.sent;
          console.log("\u2705 Item added to cart: ".concat(productId));
          res.status(200).json({
            success: true,
            message: "Item added to cart",
            data: {
              items: cart.items,
              totalItems: cart.totalItems,
              totalPrice: cart.totalPrice
            }
          });
          _context2.next = 33;
          break;

        case 29:
          _context2.prev = 29;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Error adding to cart:", _context2.t0);
          res.status(500).json({
            success: false,
            message: _context2.t0.message || "Failed to add item to cart"
          });

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 29]]);
};
/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update/:productId
 * @access  Private (Customer)
 */


exports.updateCartItem = function _callee3(req, res) {
  var customerId, productId, quantity, cart, product, updatedCart;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          customerId = req.user._id;
          productId = req.params.productId;
          quantity = req.body.quantity;

          if (!(!quantity || quantity < 0)) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Valid quantity is required"
          }));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }));

        case 8:
          cart = _context3.sent;

          if (cart) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Cart not found"
          }));

        case 11:
          _context3.next = 13;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 13:
          product = _context3.sent;

          if (!(product && quantity > product.quantity)) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Only ".concat(product.quantity, " units available")
          }));

        case 16:
          _context3.next = 18;
          return regeneratorRuntime.awrap(cart.updateItemQuantity(productId, quantity));

        case 18:
          _context3.next = 20;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }).populate("items.product", "name price quantity unit imageUrls category supplier"));

        case 20:
          updatedCart = _context3.sent;
          console.log("\u2705 Cart item updated: ".concat(productId, " \u2192 ").concat(quantity));
          res.status(200).json({
            success: true,
            message: "Cart updated",
            data: {
              items: updatedCart.items,
              totalItems: updatedCart.totalItems,
              totalPrice: updatedCart.totalPrice
            }
          });
          _context3.next = 29;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Error updating cart:", _context3.t0);
          res.status(500).json({
            success: false,
            message: _context3.t0.message || "Failed to update cart"
          });

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 25]]);
};
/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private (Customer)
 */


exports.removeFromCart = function _callee4(req, res) {
  var customerId, productId, cart, updatedCart;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          customerId = req.user._id;
          productId = req.params.productId;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }));

        case 5:
          cart = _context4.sent;

          if (cart) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Cart not found"
          }));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(cart.removeItem(productId));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }).populate("items.product", "name price quantity unit imageUrls category supplier"));

        case 12:
          updatedCart = _context4.sent;
          console.log("\uD83D\uDDD1\uFE0F  Item removed from cart: ".concat(productId));
          res.status(200).json({
            success: true,
            message: "Item removed from cart",
            data: {
              items: updatedCart.items,
              totalItems: updatedCart.totalItems,
              totalPrice: updatedCart.totalPrice
            }
          });
          _context4.next = 21;
          break;

        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Error removing from cart:", _context4.t0);
          res.status(500).json({
            success: false,
            message: _context4.t0.message || "Failed to remove item"
          });

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 17]]);
};
/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private (Customer)
 */


exports.clearCart = function _callee5(req, res) {
  var customerId, cart;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          customerId = req.user._id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }));

        case 4:
          cart = _context5.sent;

          if (cart) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: "Cart not found"
          }));

        case 7:
          _context5.next = 9;
          return regeneratorRuntime.awrap(cart.clearCart());

        case 9:
          console.log("\uD83E\uDDF9 Cart cleared for customer: ".concat(customerId));
          res.status(200).json({
            success: true,
            message: "Cart cleared",
            data: {
              items: [],
              totalItems: 0,
              totalPrice: 0
            }
          });
          _context5.next = 17;
          break;

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.error("❌ Error clearing cart:", _context5.t0);
          res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: _context5.t0.message
          });

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 13]]);
};