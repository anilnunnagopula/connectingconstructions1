"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// server/controllers/orderController.js
var Order = require("../models/OrderModel");

var Product = require("../models/Product");

var _require = require("../utils/queryHelpers"),
    applyLean = _require.applyLean,
    buildBaseQuery = _require.buildBaseQuery,
    paginate = _require.paginate,
    getPaginationMeta = _require.getPaginationMeta;
/**
 * @desc    Get all orders for authenticated supplier (with pagination)
 * @route   GET /api/supplier/orders
 * @access  Private (Supplier only)
 */


exports.getSupplierOrders = function _callee(req, res) {
  var supplierId, _req$query, _req$query$page, page, _req$query$limit, limit, status, startDate, endDate, filters, query, paginatedQuery, orders, pagination, ordersWithSupplierData;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user._id;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 20 : _req$query$limit, status = _req$query.status, startDate = _req$query.startDate, endDate = _req$query.endDate; // Build filters

          filters = buildBaseQuery(); // { isDeleted: false }

          filters["products.supplier"] = supplierId; // Status filter

          if (status) {
            filters.orderStatus = status;
          } // Date range filter


          if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) filters.createdAt.$gte = new Date(startDate);
            if (endDate) filters.createdAt.$lte = new Date(endDate);
          } // ✨ Build query with pagination and lean()


          query = Order.find(filters).populate("customer", "name email phoneNumber").populate("products.productId", "name price imageUrls").sort({
            createdAt: -1
          }).select("-__v");
          paginatedQuery = paginate(query, parseInt(page), parseInt(limit));
          _context.next = 11;
          return regeneratorRuntime.awrap(applyLean(paginatedQuery));

        case 11:
          orders = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(getPaginationMeta(Order, filters, parseInt(page), parseInt(limit)));

        case 14:
          pagination = _context.sent;
          // ✨ Calculate supplier-specific totals for each order
          ordersWithSupplierData = orders.map(function (order) {
            var supplierProducts = order.products.filter(function (p) {
              return p.supplier && p.supplier.toString() === supplierId.toString();
            });
            var supplierSubtotal = supplierProducts.reduce(function (total, p) {
              return total + (p.price || 0) * (p.quantity || 0);
            }, 0);
            return _objectSpread({}, order, {
              supplierProducts: supplierProducts,
              supplierSubtotal: supplierSubtotal
            });
          });
          console.log("\uD83D\uDCE6 Fetched ".concat(orders.length, " orders for supplier: ").concat(supplierId));
          res.status(200).json({
            success: true,
            data: ordersWithSupplierData,
            pagination: pagination
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error fetching supplier orders:", _context.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: _context.t0.message
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
};
/**
 * @desc    Update order status
 * @route   PUT /api/supplier/orders/:id/status
 * @access  Private (Supplier only)
 */


exports.updateOrderStatus = function _callee2(req, res) {
  var orderId, supplierId, _req$body, status, notes, allowedStatuses, order, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, product;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          orderId = req.params.id;
          supplierId = req.user._id;
          _req$body = req.body, status = _req$body.status, notes = _req$body.notes;

          if (status) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "New status is required."
          }));

        case 6:
          // Validate status
          allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

          if (allowedStatuses.includes(status)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status. Allowed: ".concat(allowedStatuses.join(", "))
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: orderId,
            "products.supplier": supplierId,
            isDeleted: false
          }));

        case 11:
          order = _context2.sent;

          if (order) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "Order not found or you are not authorized to update it."
          }));

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(order.updateStatus(status, supplierId, notes));

        case 16:
          // ✨ If order is delivered, update product stock if needed
          if (status === "Delivered") {
            // Already handled in createOrder, but you could add confirmation logic here
            console.log("✅ Order delivered:", orderId);
          } // ✨ If order is cancelled, restore product stock


          if (!(status === "Cancelled")) {
            _context2.next = 50;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 21;
          _iterator = order.products[Symbol.iterator]();

        case 23:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 35;
            break;
          }

          item = _step.value;

          if (!(item.supplier.toString() === supplierId.toString())) {
            _context2.next = 32;
            break;
          }

          _context2.next = 28;
          return regeneratorRuntime.awrap(Product.findById(item.productId));

        case 28:
          product = _context2.sent;

          if (!product) {
            _context2.next = 32;
            break;
          }

          _context2.next = 32;
          return regeneratorRuntime.awrap(product.increaseStock(item.quantity));

        case 32:
          _iteratorNormalCompletion = true;
          _context2.next = 23;
          break;

        case 35:
          _context2.next = 41;
          break;

        case 37:
          _context2.prev = 37;
          _context2.t0 = _context2["catch"](21);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 41:
          _context2.prev = 41;
          _context2.prev = 42;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 44:
          _context2.prev = 44;

          if (!_didIteratorError) {
            _context2.next = 47;
            break;
          }

          throw _iteratorError;

        case 47:
          return _context2.finish(44);

        case 48:
          return _context2.finish(41);

        case 49:
          console.log("🔄 Stock restored for cancelled order:", orderId);

        case 50:
          console.log("\u2705 Order status updated: ".concat(orderId, " \u2192 ").concat(status));
          res.status(200).json({
            success: true,
            message: "Order status updated successfully!",
            order: order
          });
          _context2.next = 60;
          break;

        case 54:
          _context2.prev = 54;
          _context2.t1 = _context2["catch"](0);
          console.error("❌ Error updating order status:", _context2.t1);

          if (!(_context2.t1.name === "CastError")) {
            _context2.next = 59;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid order ID format."
          }));

        case 59:
          res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: _context2.t1.message
          });

        case 60:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 54], [21, 37, 41, 49], [42,, 44, 48]]);
};