"use strict";

// server/controllers/supplierDashboardController.js
var Product = require("../models/Product");

var Order = require("../models/Order");

var Review = require("../models/Review");

var mongoose = require("mongoose"); // Needed for mongoose.Types.ObjectId in aggregation
// @desc    Get aggregated data for the supplier dashboard
// @route   GET /api/supplier/dashboard
// @access  Private (Supplier only)


exports.getSupplierDashboardData = function _callee(req, res) {
  var supplierId, totalProducts, totalOrdersResult, totalOrders, earningsResult, totalEarnings, averageRatingResult, averageRating, recentOrders, filteredRecentOrders;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // The 'authorizeRoles("supplier")' middleware ensures only suppliers can hit this endpoint
          supplierId = req.user.id; // Get the supplier's ID from the authenticated user

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Product.countDocuments({
            supplier: supplierId
          }));

        case 4:
          totalProducts = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(Order.aggregate([{
            $unwind: "$orderItems"
          }, // Deconstruct the orderItems array
          {
            $match: {
              "orderItems.supplier": new mongoose.Types.ObjectId(supplierId),
              // Match items belonging to this supplier
              isPaid: true // Only count paid orders

            }
          }, {
            $group: {
              _id: "$user",
              count: {
                $addToSet: "$_id"
              }
            }
          }, // Group by user to count unique orders they made
          {
            $count: "totalOrders"
          } // Count the final number of unique orders
          ]));

        case 7:
          totalOrdersResult = _context.sent;
          totalOrders = totalOrdersResult.length > 0 ? totalOrdersResult[0].totalOrders : 0; // 3. Earnings (sum of price*qty for items sold by this supplier)

          _context.next = 11;
          return regeneratorRuntime.awrap(Order.aggregate([{
            $unwind: "$orderItems"
          }, // Deconstruct the array
          {
            $match: {
              "orderItems.supplier": new mongoose.Types.ObjectId(supplierId),
              // Filter for this supplier's items
              isPaid: true // Only consider paid items

            }
          }, {
            $group: {
              _id: null,
              // Group all matching items together
              totalEarnings: {
                $sum: {
                  $multiply: ["$orderItems.qty", "$orderItems.price"]
                }
              } // Sum up qty * price

            }
          }]));

        case 11:
          earningsResult = _context.sent;
          totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0; // 4. Average Rating (overall average rating for this supplier's products)
          // This calculates the average of averageRating from all products owned by this supplier

          _context.next = 15;
          return regeneratorRuntime.awrap(Product.aggregate([{
            $match: {
              supplier: new mongoose.Types.ObjectId(supplierId),
              // Filter for this supplier's products
              numReviews: {
                $gt: 0
              } // Only consider products that actually have reviews

            }
          }, {
            $group: {
              _id: null,
              totalRatingSum: {
                $sum: {
                  $multiply: ["$averageRating", "$numReviews"]
                }
              },
              totalReviewsCount: {
                $sum: "$numReviews"
              }
            }
          }, {
            $project: {
              _id: 0,
              overallAverageRating: {
                $divide: ["$totalRatingSum", "$totalReviewsCount"]
              }
            }
          }]));

        case 15:
          averageRatingResult = _context.sent;
          averageRating = averageRatingResult.length > 0 ? parseFloat(averageRatingResult[0].overallAverageRating.toFixed(1)) : 0; // Format to one decimal place
          // 5. Recent Orders (e.g., top 5 most recent paid orders involving this supplier's products)
          // This query fetches orders and then filters their items for the specific supplier on the backend.

          _context.next = 19;
          return regeneratorRuntime.awrap(Order.find({
            "orderItems.supplier": supplierId,
            isPaid: true
          }).sort({
            createdAt: -1
          }) // Sort by most recent
          .limit(5) // Get top 5 orders
          .populate("user", "name email") // Populate customer's name and email
          .select("orderItems totalPrice createdAt"));

        case 19:
          recentOrders = _context.sent;
          // Select relevant order fields
          // Filter orderItems to only show those from the current supplier
          filteredRecentOrders = recentOrders.map(function (order) {
            return {
              _id: order._id,
              user: order.user,
              totalPrice: order.totalPrice,
              // This totalPrice is for the whole order, not just supplier's items
              createdAt: order.createdAt,
              orderItems: order.orderItems.filter(function (item) {
                return item.supplier.equals(supplierId);
              })
            };
          });
          res.json({
            totalProducts: totalProducts,
            totalEarnings: totalEarnings,
            totalOrders: totalOrders,
            averageRating: averageRating,
            recentOrders: filteredRecentOrders
          });
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](1);
          console.error("Error fetching supplier dashboard data:", _context.t0);
          res.status(500).json({
            message: "Failed to fetch dashboard data.",
            error: _context.t0.message
          });

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 24]]);
};