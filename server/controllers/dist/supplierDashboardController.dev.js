"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// server/controllers/supplierDashboardController.js
var Product = require("../models/Product");

var Order = require("../models/Order");

var User = require("../models/User");
/**
 * @desc    Get supplier dashboard summary
 * @route   GET /api/supplier/dashboard
 * @access  Private (Supplier only)
 */


exports.getSupplierDashboardData = function _callee(req, res) {
  var supplierId, _ref, _ref2, totalProducts, orderStats, weeklySalesData, dashboardSummary, productsWithRatings, averageRating, totalRating, totalReviews, dailyEarningsMap, labels, data, today, i, date, dateString;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user._id; // ✨ Use Promise.all for parallel execution

          _context.next = 4;
          return regeneratorRuntime.awrap(Promise.all([// 1. Total Products
          Product.countDocuments({
            supplier: supplierId,
            isDeleted: false
          }), // 2. Order Statistics (earnings, orders, products sold)
          Order.aggregate([{
            $match: {
              "products.supplier": supplierId,
              orderStatus: "Delivered",
              isDeleted: false
            }
          }, {
            $unwind: "$products"
          }, {
            $match: {
              "products.supplier": supplierId
            }
          }, {
            $group: {
              _id: null,
              totalEarnings: {
                $sum: {
                  $multiply: ["$products.price", "$products.quantity"]
                }
              },
              totalProductsSold: {
                $sum: "$products.quantity"
              },
              orderIds: {
                $addToSet: "$_id"
              }
            }
          }, {
            $project: {
              _id: 0,
              totalEarnings: 1,
              totalOrders: {
                $size: "$orderIds"
              },
              totalProductsSold: 1
            }
          }]), // 3. Weekly Sales Data
          Order.aggregate([{
            $match: {
              "products.supplier": supplierId,
              orderStatus: "Delivered",
              isDeleted: false,
              createdAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            }
          }, {
            $unwind: "$products"
          }, {
            $match: {
              "products.supplier": supplierId
            }
          }, {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt"
                }
              },
              dailyEarnings: {
                $sum: {
                  $multiply: ["$products.price", "$products.quantity"]
                }
              }
            }
          }, {
            $sort: {
              _id: 1
            }
          }])]));

        case 4:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 3);
          totalProducts = _ref2[0];
          orderStats = _ref2[1];
          weeklySalesData = _ref2[2];
          dashboardSummary = orderStats.length > 0 ? orderStats[0] : {
            totalEarnings: 0,
            totalOrders: 0,
            totalProductsSold: 0
          }; // ✨ Calculate average rating from products

          _context.next = 12;
          return regeneratorRuntime.awrap(Product.find({
            supplier: supplierId,
            isDeleted: false,
            numReviews: {
              $gt: 0
            }
          }).select("averageRating numReviews").lean());

        case 12:
          productsWithRatings = _context.sent;
          averageRating = 0;

          if (productsWithRatings.length > 0) {
            totalRating = productsWithRatings.reduce(function (sum, p) {
              return sum + p.averageRating * p.numReviews;
            }, 0);
            totalReviews = productsWithRatings.reduce(function (sum, p) {
              return sum + p.numReviews;
            }, 0);
            averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
          } // Format weekly data for chart


          dailyEarningsMap = new Map();
          weeklySalesData.forEach(function (item) {
            dailyEarningsMap.set(item._id, item.dailyEarnings);
          });
          labels = [];
          data = [];
          today = new Date();

          for (i = 6; i >= 0; i--) {
            date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            dateString = date.toISOString().split("T")[0];
            labels.push(date.toLocaleDateString("en-US", {
              weekday: "short"
            }));
            data.push(dailyEarningsMap.get(dateString) || 0);
          }

          console.log("\uD83D\uDCCA Supplier dashboard data fetched: ".concat(supplierId));
          res.status(200).json({
            success: true,
            data: {
              totalProducts: totalProducts,
              totalEarnings: dashboardSummary.totalEarnings,
              totalOrders: dashboardSummary.totalOrders,
              averageRating: parseFloat(averageRating.toFixed(1)),
              weeklyEarnings: {
                labels: labels,
                data: data
              }
            }
          });
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error fetching supplier dashboard data:", _context.t0);
          res.status(500).json({
            success: false,
            error: "Failed to fetch dashboard data",
            details: _context.t0.message
          });

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 25]]);
};