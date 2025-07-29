"use strict";

// server/controllers/supplierDashboardController.js
var Product = require("../models/Product"); // Make sure this path is correct


var Order = require("../models/OrderModel"); // Make sure this path is correct


var User = require("../models/User"); // Make sure this path is correct (for supplier profile if needed)
// @desc    Get summary dashboard data for authenticated supplier
// @route   GET /api/supplier/dashboard
// @access  Private (Supplier only)


exports.getSupplierDashboardData = function _callee(req, res) {
  var supplierId, totalProducts, orderAggregationResult, dashboardSummary, averageRating, sevenDaysAgo, weeklySalesData, dailyEarningsMap, labels, data, i, date, dateString;
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
            $match: {
              "products.supplier": supplierId,
              // Match orders with products from this supplier
              orderStatus: "Delivered" // Consider only delivered orders for these metrics

            }
          }, {
            $unwind: "$products" // Deconstruct products array

          }, {
            $match: {
              "products.supplier": supplierId // Filter again for current supplier's products after unwind

            }
          }, {
            $group: {
              _id: null,
              // Group all
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
              totalOrders: {
                $size: "$orderIds"
              },
              // Count unique orders
              totalProductsSold: 1
            }
          }]));

        case 7:
          orderAggregationResult = _context.sent;
          dashboardSummary = orderAggregationResult.length > 0 ? orderAggregationResult[0] : {
            totalEarnings: 0,
            totalOrders: 0,
            totalProductsSold: 0
          }; // --- 3. Average Rating (requires Product model to store ratings or aggregate from Reviews) ---
          // This is a placeholder. If you have a separate Reviews model, you'd aggregate from there.
          // Assuming for now product model might have a simple average rating
          // const productsWithRatings = await Product.find({ supplier: supplierId, averageRating: { $exists: true } });
          // let totalRating = 0;
          // let ratedProductsCount = 0;
          // productsWithRatings.forEach(p => {
          //   totalRating += p.averageRating;
          //   ratedProductsCount++;
          // });
          // const averageRating = ratedProductsCount > 0 ? (totalRating / ratedProductsCount) : 0;
          // Using a dummy value for now if no concrete rating system is implemented.

          averageRating = 4.5; // Placeholder
          // --- 4. Weekly Earnings for Chart ---

          sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          sevenDaysAgo.setHours(0, 0, 0, 0); // Start from the beginning of the day

          _context.next = 14;
          return regeneratorRuntime.awrap(Order.aggregate([{
            $match: {
              "products.supplier": supplierId,
              orderStatus: "Delivered",
              // Only count delivered sales
              createdAt: {
                $gte: sevenDaysAgo
              }
            }
          }, {
            $unwind: "$products"
          }, {
            $match: {
              "products.supplier": supplierId // Match supplier's products after unwind

            }
          }, {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt"
                }
              },
              // Group by date string
              dailyEarnings: {
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

        case 14:
          weeklySalesData = _context.sent;
          // Format data for the last 7 days, including days with no sales
          dailyEarningsMap = new Map();
          weeklySalesData.forEach(function (item) {
            dailyEarningsMap.set(item._id, item.dailyEarnings);
          });
          labels = [];
          data = [];

          for (i = 0; i < 7; i++) {
            date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            dateString = date.toISOString().split("T")[0];
            labels.push(date.toLocaleDateString("en-US", {
              weekday: "short"
            })); // E.g., 'Mon', 'Tue'

            data.push(dailyEarningsMap.get(dateString) || 0); // Push 0 if no sales for that day
          }

          res.status(200).json({
            totalProducts: totalProducts,
            totalEarnings: dashboardSummary.totalEarnings,
            totalOrders: dashboardSummary.totalOrders,
            averageRating: averageRating,
            // Use calculated or placeholder
            weeklyEarnings: {
              // NEW: Data for the graph
              labels: labels,
              data: data
            }
          });
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching supplier dashboard data:", _context.t0);
          res.status(500).json({
            error: "Failed to fetch dashboard data",
            details: _context.t0.message
          });

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 23]]);
};