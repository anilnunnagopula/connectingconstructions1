"use strict";

// server/controllers/analyticsController.js
var Product = require("../models/Product");

var Order = require("../models/OrderModel"); // @desc    Get all analytics data for the authenticated supplier
// @route   GET /api/supplier/analytics
// @access  Private (Supplier only)


exports.getSupplierAnalytics = function _callee(req, res) {
  var supplierId, totalProducts, orderAnalytics, totalEarnings, totalOrders, totalProductsSold, averageOrderValue, topProducts, sevenDaysAgo, salesOverTime, formattedSalesOverTime, labels, _loop, i, analytics;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user.id; // Get supplier's _id from authenticated user
          // --- 1. Total Products ---

          _context.next = 4;
          return regeneratorRuntime.awrap(Product.countDocuments({
            supplier: supplierId
          }));

        case 4:
          totalProducts = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(Order.aggregate([{
            // Match orders that contain products from this specific supplier
            $match: {
              "products.supplier": supplierId,
              orderStatus: "Delivered" // Consider only delivered orders for earnings

            }
          }, {
            // Deconstruct the 'products' array to work with each item individually
            $unwind: "$products"
          }, {
            // Match only the products that belong to the current supplier
            $match: {
              "products.supplier": supplierId
            }
          }, {
            $group: {
              _id: null,
              // Group all matching items together
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
              } // Get unique order IDs

            }
          }, {
            $project: {
              _id: 0,
              totalEarnings: 1,
              totalProductsSold: 1,
              totalOrders: {
                $size: "$orderIds"
              } // Count unique order IDs

            }
          }]));

        case 7:
          orderAnalytics = _context.sent;
          totalEarnings = orderAnalytics.length > 0 ? orderAnalytics[0].totalEarnings : 0;
          totalOrders = orderAnalytics.length > 0 ? orderAnalytics[0].totalOrders : 0;
          totalProductsSold = orderAnalytics.length > 0 ? orderAnalytics[0].totalProductsSold : 0;
          averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0; // --- 3. Top-Selling Products (by revenue for this supplier) ---

          _context.next = 14;
          return regeneratorRuntime.awrap(Order.aggregate([{
            $match: {
              "products.supplier": supplierId,
              orderStatus: "Delivered"
            }
          }, {
            $unwind: "$products"
          }, {
            $match: {
              "products.supplier": supplierId // Match only products from this supplier after unwind

            }
          }, {
            $group: {
              _id: "$products.productId",
              // Group by individual product ID
              name: {
                $first: "$products.name"
              },
              totalSales: {
                $sum: {
                  $multiply: ["$products.price", "$products.quantity"]
                }
              },
              totalQuantitySold: {
                $sum: "$products.quantity"
              }
            }
          }, {
            $sort: {
              totalSales: -1
            } // Sort by highest sales

          }, {
            $limit: 5 // Top 5 products

          }, {
            $project: {
              _id: 0,
              name: 1,
              sales: "$totalSales",
              // Rename for frontend clarity
              quantity: "$totalQuantitySold" // Rename for frontend clarity

            }
          }]));

        case 14:
          topProducts = _context.sent;
          // --- 4. Sales Over Time (e.g., last 7 days) ---
          sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          _context.next = 18;
          return regeneratorRuntime.awrap(Order.aggregate([{
            $match: {
              "products.supplier": supplierId,
              orderStatus: "Delivered",
              createdAt: {
                $gte: sevenDaysAgo
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
                } // Group by date

              },
              dailySales: {
                $sum: {
                  $multiply: ["$products.price", "$products.quantity"]
                }
              }
            }
          }, {
            $sort: {
              _id: 1
            } // Sort by date ascending

          }]));

        case 18:
          salesOverTime = _context.sent;
          // Format salesOverTime for chart (e.g., fill in missing days)
          formattedSalesOverTime = Array(7).fill(0);
          labels = [];

          _loop = function _loop(i) {
            var date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            labels.push(date.toLocaleDateString("en-US", {
              weekday: "short"
            })); // e.g., 'Mon'

            var foundDay = salesOverTime.find(function (d) {
              return new Date(d._id).toDateString() === date.toDateString();
            });

            if (foundDay) {
              formattedSalesOverTime[i] = foundDay.dailySales;
            }
          };

          for (i = 0; i < 7; i++) {
            _loop(i);
          }

          analytics = {
            totalProducts: totalProducts,
            totalSales: totalEarnings,
            totalOrders: totalOrders,
            averageOrderValue: averageOrderValue,
            totalProductsSold: totalProductsSold,
            // conversionRate and customerReach might require more complex tracking (e.g., website traffic, unique visitors)
            // For now, these can be set to 0 or derived if you have other data.
            conversionRate: 0,
            // Placeholder, requires tracking views vs. sales
            customerReach: 0,
            // Placeholder, requires tracking unique customer interactions
            topProducts: topProducts,
            salesOverTime: {
              labels: labels,
              data: formattedSalesOverTime
            }
          };
          res.status(200).json(analytics);
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching supplier analytics:", _context.t0);
          res.status(500).json({
            message: "Failed to fetch analytics data",
            error: _context.t0.message
          });

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};