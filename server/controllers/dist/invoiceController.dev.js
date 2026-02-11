"use strict";

// server/controllers/invoiceController.js
var Order = require("../models/Order");

var _require = require("../utils/invoiceGenerator"),
    generateInvoicePDF = _require.generateInvoicePDF;
/**
 * Get all invoices (completed orders) for customer
 * @route GET /api/customer/invoices
 * @access Private (Customer only)
 */


exports.getInvoices = function _callee(req, res) {
  var customerId, _req$query, _req$query$page, page, _req$query$limit, limit, orders, totalOrders;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          customerId = req.user._id;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 20 : _req$query$limit; // Find all delivered orders for this customer

          _context.next = 5;
          return regeneratorRuntime.awrap(Order.find({
            customer: customerId,
            orderStatus: "delivered" // Fixed: lowercase to match Order model

          }).sort({
            createdAt: -1
          }).limit(parseInt(limit)).skip((parseInt(page) - 1) * parseInt(limit)).select("createdAt totalAmount items deliveryAddress paymentMethod paymentStatus"));

        case 5:
          orders = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(Order.countDocuments({
            customer: customerId,
            orderStatus: "delivered" // Fixed: lowercase to match Order model

          }));

        case 8:
          totalOrders = _context.sent;
          res.status(200).json({
            success: true,
            data: {
              orders: orders,
              pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalOrders / parseInt(limit)),
                totalOrders: totalOrders
              }
            }
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error("Get invoices error:", _context.t0);
          res.status(500).json({
            success: false,
            error: "Failed to fetch invoices"
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};
/**
 * Download invoice PDF for a specific order
 * @route GET /api/customer/invoices/:orderId/download
 * @access Private (Customer only)
 */


exports.downloadInvoice = function _callee2(req, res) {
  var customerId, orderId, order, invoiceStream, invoiceNumber;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          customerId = req.user._id;
          orderId = req.params.orderId; // Find the order and verify ownership

          _context2.next = 5;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: orderId,
            customer: customerId
          }).populate("customer", "name email phone"));

        case 5:
          order = _context2.sent;

          if (order) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            error: "Order not found or you don't have access to this order"
          }));

        case 8:
          if (!(order.orderStatus !== "delivered")) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            error: "Invoice is only available for delivered orders"
          }));

        case 10:
          // Generate PDF
          invoiceStream = generateInvoicePDF(order, {
            companyInfo: {
              name: "ConnectingConstructions",
              address: "Construction Materials Marketplace",
              city: "India",
              phone: "+91 9398828248",
              email: "support@connectingconstructions.com",
              website: "www.connectingconstructions.com",
              gstin: "29ABCDE1234F1Z5" // Replace with actual GSTIN

            }
          }); // Set response headers for PDF download

          invoiceNumber = order._id.toString().slice(-8).toUpperCase();
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "attachment; filename=Invoice-".concat(invoiceNumber, ".pdf")); // Pipe the PDF to response

          invoiceStream.pipe(res);
          _context2.next = 21;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](0);
          console.error("Download invoice error:", _context2.t0);
          res.status(500).json({
            success: false,
            error: "Failed to generate invoice"
          });

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 17]]);
};
/**
 * Preview invoice (view in browser without download)
 * @route GET /api/customer/invoices/:orderId/preview
 * @access Private (Customer only)
 */


exports.previewInvoice = function _callee3(req, res) {
  var customerId, orderId, order, invoiceStream;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          customerId = req.user._id;
          orderId = req.params.orderId; // Find the order and verify ownership

          _context3.next = 5;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: orderId,
            customer: customerId
          }).populate("customer", "name email phone"));

        case 5:
          order = _context3.sent;

          if (order) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            success: false,
            error: "Order not found or you don't have access to this order"
          }));

        case 8:
          if (!(order.orderStatus !== "Delivered")) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            error: "Invoice is only available for delivered orders"
          }));

        case 10:
          // Generate PDF
          invoiceStream = generateInvoicePDF(order); // Set response headers for inline viewing

          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "inline"); // Pipe the PDF to response

          invoiceStream.pipe(res);
          _context3.next = 20;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          console.error("Preview invoice error:", _context3.t0);
          res.status(500).json({
            success: false,
            error: "Failed to preview invoice"
          });

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 16]]);
};