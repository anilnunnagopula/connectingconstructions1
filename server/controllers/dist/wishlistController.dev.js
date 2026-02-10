"use strict";

// server/controllers/wishlistController.js
var Wishlist = require("../models/Wishlist");

var Product = require("../models/Product");
/**
 * @desc    Get customer wishlist
 * @route   GET /api/wishlist
 * @access  Private (Customer)
 */


exports.getWishlist = function _callee(req, res) {
  var customerId, wishlist;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          customerId = req.user._id;
          _context.next = 4;
          return regeneratorRuntime.awrap(Wishlist.findOne({
            customer: customerId
          }).populate({
            path: "items.product",
            populate: {
              path: "supplier",
              select: "name email companyName profilePictureUrl averageRating"
            }
          }));

        case 4:
          wishlist = _context.sent;

          if (wishlist) {
            _context.next = 9;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(Wishlist.create({
            customer: customerId,
            items: []
          }));

        case 8:
          wishlist = _context.sent;

        case 9:
          res.status(200).json({
            success: true,
            data: {
              items: wishlist.items,
              totalItems: wishlist.items.length
            }
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error("❌ Get wishlist error:", _context.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist"
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};
/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist/add
 * @access  Private (Customer)
 */


exports.addToWishlist = function _callee2(req, res) {
  var customerId, productId, product, wishlist;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          customerId = req.user._id;
          productId = req.body.productId;

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
          return regeneratorRuntime.awrap(Product.findById(productId));

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
          _context2.next = 12;
          return regeneratorRuntime.awrap(Wishlist.findOne({
            customer: customerId
          }));

        case 12:
          wishlist = _context2.sent;

          if (wishlist) {
            _context2.next = 17;
            break;
          }

          _context2.next = 16;
          return regeneratorRuntime.awrap(Wishlist.create({
            customer: customerId,
            items: []
          }));

        case 16:
          wishlist = _context2.sent;

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(wishlist.addItem(productId));

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(Wishlist.findOne({
            customer: customerId
          }).populate({
            path: "items.product",
            populate: {
              path: "supplier",
              select: "name email companyName"
            }
          }));

        case 21:
          wishlist = _context2.sent;
          res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            data: {
              items: wishlist.items,
              totalItems: wishlist.items.length
            }
          });
          _context2.next = 31;
          break;

        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Add to wishlist error:", _context2.t0);

          if (!(_context2.t0.message === "Product already in wishlist")) {
            _context2.next = 30;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: _context2.t0.message
          }));

        case 30:
          res.status(500).json({
            success: false,
            message: "Failed to add to wishlist"
          });

        case 31:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 25]]);
};
/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/remove/:productId
 * @access  Private (Customer)
 */


exports.removeFromWishlist = function _callee3(req, res) {
  var customerId, productId, wishlist;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          customerId = req.user._id;
          productId = req.params.productId;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Wishlist.findOne({
            customer: customerId
          }));

        case 5:
          wishlist = _context3.sent;

          if (wishlist) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Wishlist not found"
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(wishlist.removeItem(productId));

        case 10:
          res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            data: {
              items: wishlist.items,
              totalItems: wishlist.items.length
            }
          });
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Remove from wishlist error:", _context3.t0);
          res.status(500).json({
            success: false,
            message: "Failed to remove from wishlist"
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
};
/**
 * @desc    Clear wishlist
 * @route   DELETE /api/wishlist/clear
 * @access  Private (Customer)
 */


exports.clearWishlist = function _callee4(req, res) {
  var customerId, wishlist;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          customerId = req.user._id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Wishlist.findOne({
            customer: customerId
          }));

        case 4:
          wishlist = _context4.sent;

          if (wishlist) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Wishlist not found"
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(wishlist.clearWishlist());

        case 9:
          res.status(200).json({
            success: true,
            message: "Wishlist cleared",
            data: {
              items: [],
              totalItems: 0
            }
          });
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Clear wishlist error:", _context4.t0);
          res.status(500).json({
            success: false,
            message: "Failed to clear wishlist"
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};