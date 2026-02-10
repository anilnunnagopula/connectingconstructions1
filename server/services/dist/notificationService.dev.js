"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// server/services/notificationService.js
var Notification = require("../models/Notification");
/**
 * Helper service to create notifications
 */


var NotificationService =
/*#__PURE__*/
function () {
  function NotificationService() {
    _classCallCheck(this, NotificationService);
  }

  _createClass(NotificationService, null, [{
    key: "notifyOrderCreated",

    /**
     * Create order notification
     */
    value: function notifyOrderCreated(order) {
      return regeneratorRuntime.async(function notifyOrderCreated$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(Notification.create({
                user: order.customer,
                type: "order",
                title: "Order Placed Successfully",
                message: "Your order ".concat(order.orderNumber, " has been placed successfully."),
                relatedOrder: order._id,
                actionUrl: "/customer/orders/".concat(order._id),
                icon: "package",
                iconColor: "green"
              }));

            case 3:
              console.log("\u2705 Notification sent: Order created ".concat(order.orderNumber));
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              console.error("❌ Notification error:", _context.t0);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
    /**
     * Create order status update notification
     */

  }, {
    key: "notifyOrderStatusUpdate",
    value: function notifyOrderStatusUpdate(order, oldStatus, newStatus) {
      var messages;
      return regeneratorRuntime.async(function notifyOrderStatusUpdate$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              messages = {
                confirmed: "Your order has been confirmed and is being processed.",
                processing: "Your order is now being processed.",
                shipped: "Your order has been shipped! Track your delivery.",
                delivered: "Your order has been delivered successfully!",
                cancelled: "Your order has been cancelled."
              };
              _context2.next = 4;
              return regeneratorRuntime.awrap(Notification.create({
                user: order.customer,
                type: "order",
                title: "Order ".concat(newStatus.charAt(0).toUpperCase() + newStatus.slice(1)),
                message: messages[newStatus] || "Order status updated to ".concat(newStatus),
                relatedOrder: order._id,
                actionUrl: "/customer/orders/".concat(order._id),
                icon: "truck",
                iconColor: newStatus === "delivered" ? "green" : "blue",
                priority: newStatus === "delivered" ? "high" : "medium"
              }));

            case 4:
              console.log("\u2705 Notification sent: Order ".concat(order.orderNumber, " \u2192 ").concat(newStatus));
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              console.error("❌ Notification error:", _context2.t0);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
    /**
     * Create quote request notification (to supplier)
     */

  }, {
    key: "notifyQuoteRequest",
    value: function notifyQuoteRequest(quoteRequest, supplierId) {
      return regeneratorRuntime.async(function notifyQuoteRequest$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(Notification.create({
                user: supplierId,
                type: "quote",
                title: "New Quote Request",
                message: "You have received a new quote request for ".concat(quoteRequest.items.length, " item(s)."),
                relatedQuote: quoteRequest._id,
                actionUrl: "/supplier/quotes/respond/".concat(quoteRequest._id),
                icon: "message-square",
                iconColor: "purple",
                priority: "high"
              }));

            case 3:
              console.log("\u2705 Notification sent: Quote request ".concat(quoteRequest.quoteNumber));
              _context3.next = 9;
              break;

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3["catch"](0);
              console.error("❌ Notification error:", _context3.t0);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
    /**
     * Create quote response notification (to customer)
     */

  }, {
    key: "notifyQuoteResponse",
    value: function notifyQuoteResponse(quoteRequest, quoteResponse) {
      return regeneratorRuntime.async(function notifyQuoteResponse$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(Notification.create({
                user: quoteRequest.customer,
                type: "quote",
                title: "Quote Received",
                message: "You have received a quote response for ".concat(quoteRequest.quoteNumber, "."),
                relatedQuote: quoteRequest._id,
                relatedQuoteResponse: quoteResponse._id,
                actionUrl: "/customer/quotes/".concat(quoteRequest._id),
                icon: "dollar-sign",
                iconColor: "green",
                priority: "high"
              }));

            case 3:
              console.log("\u2705 Notification sent: Quote response ".concat(quoteResponse.responseNumber));
              _context4.next = 9;
              break;

            case 6:
              _context4.prev = 6;
              _context4.t0 = _context4["catch"](0);
              console.error("❌ Notification error:", _context4.t0);

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
    /**
     * Create payment reminder notification
     */

  }, {
    key: "notifyPaymentPending",
    value: function notifyPaymentPending(order) {
      return regeneratorRuntime.async(function notifyPaymentPending$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(Notification.create({
                user: order.customer,
                type: "payment",
                title: "Payment Pending",
                message: "Payment is pending for order ".concat(order.orderNumber, "."),
                relatedOrder: order._id,
                actionUrl: "/customer/orders/".concat(order._id),
                icon: "alert-triangle",
                iconColor: "yellow",
                priority: "high",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

              }));

            case 3:
              console.log("\u2705 Notification sent: Payment pending ".concat(order.orderNumber));
              _context5.next = 9;
              break;

            case 6:
              _context5.prev = 6;
              _context5.t0 = _context5["catch"](0);
              console.error("❌ Notification error:", _context5.t0);

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
    /**
     * Create delivery notification
     */

  }, {
    key: "notifyDeliveryUpdate",
    value: function notifyDeliveryUpdate(order, message) {
      return regeneratorRuntime.async(function notifyDeliveryUpdate$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(Notification.create({
                user: order.customer,
                type: "delivery",
                title: "Delivery Update",
                message: message || "Update on your order ".concat(order.orderNumber),
                relatedOrder: order._id,
                actionUrl: "/customer/orders/".concat(order._id),
                icon: "truck",
                iconColor: "blue"
              }));

            case 3:
              console.log("\u2705 Notification sent: Delivery update ".concat(order.orderNumber));
              _context6.next = 9;
              break;

            case 6:
              _context6.prev = 6;
              _context6.t0 = _context6["catch"](0);
              console.error("❌ Notification error:", _context6.t0);

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
    /**
     * Create review request notification
     */

  }, {
    key: "notifyReviewRequest",
    value: function notifyReviewRequest(order) {
      return regeneratorRuntime.async(function notifyReviewRequest$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return regeneratorRuntime.awrap(Notification.create({
                user: order.customer,
                type: "review",
                title: "Rate Your Order",
                message: "How was your experience with order ".concat(order.orderNumber, "? Leave a review!"),
                relatedOrder: order._id,
                actionUrl: "/customer/orders/".concat(order._id, "/review"),
                icon: "star",
                iconColor: "yellow",
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

              }));

            case 3:
              console.log("\u2705 Notification sent: Review request ".concat(order.orderNumber));
              _context7.next = 9;
              break;

            case 6:
              _context7.prev = 6;
              _context7.t0 = _context7["catch"](0);
              console.error("❌ Notification error:", _context7.t0);

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
    /**
     * Broadcast system notification to all users
     */

  }, {
    key: "notifySystemMessage",
    value: function notifySystemMessage(userIds, title, message) {
      var notifications;
      return regeneratorRuntime.async(function notifySystemMessage$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              notifications = userIds.map(function (userId) {
                return {
                  user: userId,
                  type: "system",
                  title: title,
                  message: message,
                  icon: "bell",
                  iconColor: "blue",
                  priority: "low"
                };
              });
              _context8.next = 4;
              return regeneratorRuntime.awrap(Notification.insertMany(notifications));

            case 4:
              console.log("\u2705 System notification sent to ".concat(userIds.length, " users"));
              _context8.next = 10;
              break;

            case 7:
              _context8.prev = 7;
              _context8.t0 = _context8["catch"](0);
              console.error("❌ Notification error:", _context8.t0);

            case 10:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }]);

  return NotificationService;
}();

module.exports = NotificationService;