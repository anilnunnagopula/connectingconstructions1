"use strict";

// server/controllers/orderController.js
var Order = require("../models/Order");

var Cart = require("../models/Cart");

var Product = require("../models/Product");
/**
 * @desc    Create new order from cart
 * @route   POST /api/orders/create
 * @access  Private (Customer)
 */


exports.createOrder = function _callee(req, res) {
  var customerId, _req$body, deliveryAddress, deliverySlot, paymentMethod, customerNotes, cart, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, product, subtotal, deliveryFee, tax, totalAmount, orderItems, order, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _item, _product;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          customerId = req.user._id;
          _req$body = req.body, deliveryAddress = _req$body.deliveryAddress, deliverySlot = _req$body.deliverySlot, paymentMethod = _req$body.paymentMethod, customerNotes = _req$body.customerNotes; // Validate required fields

          if (!(!deliveryAddress || !deliveryAddress.phone || !deliveryAddress.addressLine1)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Delivery address is required"
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(Cart.findOne({
            customer: customerId
          }).populate("items.product"));

        case 7:
          cart = _context.sent;

          if (!(!cart || cart.items.length === 0)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Cart is empty"
          }));

        case 10:
          // Validate stock availability
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 13;
          _iterator = cart.items[Symbol.iterator]();

        case 15:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 29;
            break;
          }

          item = _step.value;
          _context.next = 19;
          return regeneratorRuntime.awrap(Product.findById(item.product._id));

        case 19:
          product = _context.sent;

          if (product) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Product ".concat(item.productSnapshot.name, " not found")
          }));

        case 22:
          if (product.availability) {
            _context.next = 24;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Product ".concat(product.name, " is not available")
          }));

        case 24:
          if (!(product.quantity < item.quantity)) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Insufficient stock for ".concat(product.name, ". Available: ").concat(product.quantity)
          }));

        case 26:
          _iteratorNormalCompletion = true;
          _context.next = 15;
          break;

        case 29:
          _context.next = 35;
          break;

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 35:
          _context.prev = 35;
          _context.prev = 36;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 38:
          _context.prev = 38;

          if (!_didIteratorError) {
            _context.next = 41;
            break;
          }

          throw _iteratorError;

        case 41:
          return _context.finish(38);

        case 42:
          return _context.finish(35);

        case 43:
          // Calculate pricing
          subtotal = cart.items.reduce(function (total, item) {
            return total + item.productSnapshot.price * item.quantity;
          }, 0);
          deliveryFee = subtotal > 10000 ? 0 : 100; // Free delivery above ₹10,000

          tax = subtotal * 0.18; // 18% GST

          totalAmount = subtotal + deliveryFee + tax; // Create order items with snapshots

          orderItems = cart.items.map(function (item) {
            return {
              product: item.product._id,
              quantity: item.quantity,
              productSnapshot: item.productSnapshot,
              priceAtOrder: item.productSnapshot.price,
              totalPrice: item.productSnapshot.price * item.quantity
            };
          }); // Create order

          _context.next = 50;
          return regeneratorRuntime.awrap(Order.create({
            customer: customerId,
            items: orderItems,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            tax: tax,
            totalAmount: totalAmount,
            deliveryAddress: deliveryAddress,
            deliverySlot: deliverySlot,
            paymentMethod: paymentMethod || "cod",
            paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
            customerNotes: customerNotes
          }));

        case 50:
          order = _context.sent;
          // Decrease product stock
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 54;
          _iterator2 = cart.items[Symbol.iterator]();

        case 56:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 66;
            break;
          }

          _item = _step2.value;
          _context.next = 60;
          return regeneratorRuntime.awrap(Product.findById(_item.product._id));

        case 60:
          _product = _context.sent;
          _context.next = 63;
          return regeneratorRuntime.awrap(_product.decreaseStock(_item.quantity));

        case 63:
          _iteratorNormalCompletion2 = true;
          _context.next = 56;
          break;

        case 66:
          _context.next = 72;
          break;

        case 68:
          _context.prev = 68;
          _context.t1 = _context["catch"](54);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 72:
          _context.prev = 72;
          _context.prev = 73;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 75:
          _context.prev = 75;

          if (!_didIteratorError2) {
            _context.next = 78;
            break;
          }

          throw _iteratorError2;

        case 78:
          return _context.finish(75);

        case 79:
          return _context.finish(72);

        case 80:
          _context.next = 82;
          return regeneratorRuntime.awrap(cart.clearCart());

        case 82:
          console.log("\u2705 Order created: ".concat(order.orderNumber));
          res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: {
              orderId: order._id,
              orderNumber: order.orderNumber,
              totalAmount: order.totalAmount,
              orderStatus: order.orderStatus
            }
          });
          _context.next = 90;
          break;

        case 86:
          _context.prev = 86;
          _context.t2 = _context["catch"](0);
          console.error("❌ Create order error:", _context.t2);
          res.status(500).json({
            success: false,
            message: _context.t2.message || "Failed to create order"
          });

        case 90:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 86], [13, 31, 35, 43], [36,, 38, 42], [54, 68, 72, 80], [73,, 75, 79]]);
};
/**
 * @desc    Get customer's orders
 * @route   GET /api/orders
 * @access  Private (Customer)
 */


exports.getCustomerOrders = function _callee2(req, res) {
  var customerId, _req$query, status, _req$query$page, page, _req$query$limit, limit, query, orders, total;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          customerId = req.user._id;
          _req$query = req.query, status = _req$query.status, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          query = {
            customer: customerId
          };

          if (status) {
            query.orderStatus = status;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(Order.find(query).sort({
            createdAt: -1
          }).limit(limit * 1).skip((page - 1) * limit).populate("items.product", "name imageUrls").lean());

        case 7:
          orders = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(Order.countDocuments(query));

        case 10:
          total = _context2.sent;
          res.status(200).json({
            success: true,
            data: {
              orders: orders,
              total: total,
              page: parseInt(page),
              pages: Math.ceil(total / limit)
            }
          });
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Get orders error:", _context2.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};
/**
 * @desc    Get single order details
 * @route   GET /api/orders/:orderId
 * @access  Private (Customer)
 */


exports.getOrderById = function _callee3(req, res) {
  var orderId, customerId, order;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          orderId = req.params.orderId;
          customerId = req.user._id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: orderId,
            customer: customerId
          }).populate("items.product", "name imageUrls category"));

        case 5:
          order = _context3.sent;

          if (order) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Order not found"
          }));

        case 8:
          res.status(200).json({
            success: true,
            data: order
          });
          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Get order error:", _context3.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch order"
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};
/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:orderId/cancel
 * @access  Private (Customer)
 */


exports.cancelOrder = function _callee4(req, res) {
  var orderId, reason, customerId, order, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, item, product;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          orderId = req.params.orderId;
          reason = req.body.reason;
          customerId = req.user._id;
          _context4.next = 6;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: orderId,
            customer: customerId
          }));

        case 6:
          order = _context4.sent;

          if (order) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Order not found"
          }));

        case 9:
          if (["pending", "confirmed"].includes(order.orderStatus)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Cannot cancel order with status: ".concat(order.orderStatus)
          }));

        case 11:
          // Restore stock
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context4.prev = 14;
          _iterator3 = order.items[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context4.next = 27;
            break;
          }

          item = _step3.value;
          _context4.next = 20;
          return regeneratorRuntime.awrap(Product.findById(item.product));

        case 20:
          product = _context4.sent;

          if (!product) {
            _context4.next = 24;
            break;
          }

          _context4.next = 24;
          return regeneratorRuntime.awrap(product.increaseStock(item.quantity));

        case 24:
          _iteratorNormalCompletion3 = true;
          _context4.next = 16;
          break;

        case 27:
          _context4.next = 33;
          break;

        case 29:
          _context4.prev = 29;
          _context4.t0 = _context4["catch"](14);
          _didIteratorError3 = true;
          _iteratorError3 = _context4.t0;

        case 33:
          _context4.prev = 33;
          _context4.prev = 34;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 36:
          _context4.prev = 36;

          if (!_didIteratorError3) {
            _context4.next = 39;
            break;
          }

          throw _iteratorError3;

        case 39:
          return _context4.finish(36);

        case 40:
          return _context4.finish(33);

        case 41:
          _context4.next = 43;
          return regeneratorRuntime.awrap(order.cancel(reason));

        case 43:
          res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
          });
          _context4.next = 50;
          break;

        case 46:
          _context4.prev = 46;
          _context4.t1 = _context4["catch"](0);
          console.error("❌ Cancel order error:", _context4.t1);
          res.status(500).json({
            success: false,
            message: "Failed to cancel order"
          });

        case 50:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 46], [14, 29, 33, 41], [34,, 36, 40]]);
};