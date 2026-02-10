// server/services/notificationService.js
const Notification = require("../models/Notification");

/**
 * Helper service to create notifications
 */
class NotificationService {
  /**
   * Create order notification
   */
  static async notifyOrderCreated(order) {
    try {
      await Notification.create({
        user: order.customer,
        type: "order",
        title: "Order Placed Successfully",
        message: `Your order ${order.orderNumber} has been placed successfully.`,
        relatedOrder: order._id,
        actionUrl: `/customer/orders/${order._id}`,
        icon: "package",
        iconColor: "green",
      });

      console.log(`✅ Notification sent: Order created ${order.orderNumber}`);
    } catch (error) {
      console.error("❌ Notification error:", error);
    }
  }

  /**
   * Create order status update notification
   */
  static async notifyOrderStatusUpdate(order, oldStatus, newStatus) {
    try {
      const messages = {
        confirmed: "Your order has been confirmed and is being processed.",
        processing: "Your order is now being processed.",
        shipped: "Your order has been shipped! Track your delivery.",
        delivered: "Your order has been delivered successfully!",
        cancelled: "Your order has been cancelled.",
      };

      await Notification.create({
        user: order.customer,
        type: "order",
        title: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        message: messages[newStatus] || `Order status updated to ${newStatus}`,
        relatedOrder: order._id,
        actionUrl: `/customer/orders/${order._id}`,
        icon: "truck",
        iconColor: newStatus === "delivered" ? "green" : "blue",
        priority: newStatus === "delivered" ? "high" : "medium",
      });

      console.log(
        `✅ Notification sent: Order ${order.orderNumber} → ${newStatus}`,
      );
    } catch (error) {
      console.error("❌ Notification error:", error);
    }
  }

  /**
   * Create quote request notification (to supplier)
   */
  static async notifyQuoteRequest(quoteRequest, supplierId) {
    try {
      await Notification.create({
        user: supplierId,
        type: "quote",
        title: "New Quote Request",
        message: `You have received a new quote request for ${quoteRequest.items.length} item(s).`,
        relatedQuote: quoteRequest._id,
        actionUrl: `/supplier/quotes/respond/${quoteRequest._id}`,
        icon: "message-square",
        iconColor: "purple",
        priority: "high",
      });

      console.log(
        `✅ Notification sent: Quote request ${quoteRequest.quoteNumber}`,
      );
    } catch (error) {
      console.error("❌ Notification error:", error);
    }
  }

  /**
   * Create quote response notification (to customer)
   */
  static async notifyQuoteResponse(quoteRequest, quoteResponse) {
    try {
      await Notification.create({
        user: quoteRequest.customer,
        type: "quote",
        title: "Quote Received",
        message: `You have received a quote response for ${quoteRequest.quoteNumber}.`,
        relatedQuote: quoteRequest._id,
        relatedQuoteResponse: quoteResponse._id,
        actionUrl: `/customer/quotes/${quoteRequest._id}`,
        icon: "dollar-sign",
        iconColor: "green",
        priority: "high",
      });

      console.log(
        `✅ Notification sent: Quote response ${quoteResponse.responseNumber}`,
      );
    } catch (error) {
      console.error("❌ Notification error:", error);
    }
  }

  /**
   * Create payment reminder notification
   */
  static async notifyPaymentPending(order) {
    try {
      await Notification.create({
        user: order.customer,
        type: "payment",
        title: "Payment Pending",
        message: `Payment is pending for order ${order.orderNumber}.`,
        relatedOrder: order._id,
        actionUrl: `/customer/orders/${order._id}`,
        icon: "alert-triangle",
        iconColor: "yellow",
        priority: "high",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      console.log(`✅ Notification sent: Payment pending ${order.orderNumber}`);
    } catch (error) {
      console.error("❌ Notification error:", error);
    }
  }

  /**
   * Create delivery notification
   */
  static async notifyDeliveryUpdate(order, message) {
    try {
      await Notification.create({
        user: order.customer,
        type: "delivery",
        title: "Delivery Update",
        message: message || `Update on your order ${order.orderNumber}`,
        relatedOrder: order._id,
        actionUrl: `/customer/orders/${order._id}`,
        icon: "truck",
        iconColor: "blue",
      });

      console.log(`✅ Notification sent: Delivery update ${order.orderNumber}`);
    } catch (error) {
      console.error("❌ Notification error:", error);
    }
  }

  /**
   * Create review request notification
   */
  static async notifyReviewRequest(order) {
    try {
      await Notification.create({
        user: order.customer,
        type: "review",
        title: "Rate Your Order",
        message: `How was your experience with order ${order.orderNumber}? Leave a review!`,
        relatedOrder: order._id,
        actionUrl: `/customer/orders/${order._id}/review`,
        icon: "star",
        iconColor: "yellow",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      console.log(`✅ Notification sent: Review request ${order.orderNumber}`);
    } catch (error) {
      console.error("❌ Notification error:", error);
    }
  }

  /**
   * Broadcast system notification to all users
   */
  static async notifySystemMessage(userIds, title, message) {
    try {
      const notifications = userIds.map((userId) => ({
        user: userId,
        type: "system",
        title,
        message,
        icon: "bell",
        iconColor: "blue",
        priority: "low",
      }));

      await Notification.insertMany(notifications);

      console.log(`✅ System notification sent to ${userIds.length} users`);
    } catch (error) {
      console.error("❌ Notification error:", error);
    }
  }
}

module.exports = NotificationService;
