"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// server/controllers/customerDashboardController.js
var Order = require("../models/Order");

var Wishlist = require("../models/Wishlist");

var ViewHistory = require("../models/ViewHistory");

var SupportRequest = require("../models/SupportRequest");
/**
 * @desc    Get aggregated data for customer dashboard
 * @route   GET /api/customer/dashboard
 * @access  Private (Customer only)
 */


var getCustomerDashboardData = function getCustomerDashboardData(req, res) {
  var customerId, _ref, _ref2, ordersMade, wishlistItems, historyViewed, supportRequests, recentOrders;

  return regeneratorRuntime.async(function getCustomerDashboardData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          customerId = req.user._id; // ✨ Use Promise.all for parallel execution (much faster)

          _context.next = 4;
          return regeneratorRuntime.awrap(Promise.all([// 1. Total orders
          Order.countDocuments({
            customer: customerId,
            // Updated field name
            isDeleted: false
          }), // 2. Wishlist count
          Wishlist.countDocuments({
            user: customerId
          }), // 3. View history count
          ViewHistory.countDocuments({
            user: customerId
          }), // 4. Support requests count
          SupportRequest.countDocuments({
            user: customerId
          }), // 5. Recent orders (top 5)
          Order.find({
            customer: customerId,
            isDeleted: false
          }).sort({
            createdAt: -1
          }).limit(5).populate("products.productId", "name price imageUrls").select("products totalAmount createdAt orderStatus").lean()]));

        case 4:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 5);
          ordersMade = _ref2[0];
          wishlistItems = _ref2[1];
          historyViewed = _ref2[2];
          supportRequests = _ref2[3];
          recentOrders = _ref2[4];
          console.log("\uD83D\uDCCA Customer dashboard data fetched: ".concat(customerId));
          res.json({
            success: true,
            data: {
              ordersMade: ordersMade,
              wishlistItems: wishlistItems,
              historyViewed: historyViewed,
              supportRequests: supportRequests,
              recentOrders: recentOrders
            }
          });
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error fetching customer dashboard data:", _context.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data.",
            error: _context.t0.message
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

module.exports = {
  getCustomerDashboardData: getCustomerDashboardData
};