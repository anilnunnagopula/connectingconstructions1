// server/controllers/razorpayController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payment/razorpay/create-order
 * @access  Private (Customer)
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId, amount, currency = "INR" } = req.body;

    // Validate required fields
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Order ID and amount are required",
      });
    }

    // Verify the order exists and belongs to the customer
    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you don't have access",
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay amount is in paise (multiply by 100)
      currency: currency,
      receipt: `order_${orderId}`,
      payment_capture: 1, // Auto capture payment
      notes: {
        orderId: orderId,
        customerId: req.user._id.toString(),
        customerEmail: req.user.email,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    console.log(`✅ Razorpay order created: ${razorpayOrder.id}`);

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID, // Frontend needs this to initiate payment
      },
    });
  } catch (error) {
    console.error("❌ Create Razorpay order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/payment/razorpay/verify-payment
 * @access  Private (Customer)
 */
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body;

    // Validate required fields
    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "All payment verification fields are required",
      });
    }

    // Verify signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.error("❌ Payment signature verification failed");
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // Update order with payment details
    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order payment status
    order.paymentStatus = "paid";
    order.paymentMethod = "razorpay";
    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paidAt = new Date();

    // Update order status to confirmed if it was pending
    if (order.orderStatus === "pending") {
      order.orderStatus = "confirmed";
      order.confirmedAt = new Date();
    }

    await order.save();

    console.log(`✅ Payment verified for order: ${orderId}`);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};

/**
 * @desc    Handle Razorpay payment failure
 * @route   POST /api/payment/razorpay/payment-failed
 * @access  Private (Customer)
 */
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find and update order
    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order with failure details
    order.paymentStatus = "failed";
    order.orderStatus = "cancelled";
    order.paymentError = error || "Payment failed";
    order.cancellationReason = "Payment failed";
    order.cancelledAt = new Date();
    await order.save();

    // Restore stock for each item since payment failed
    const Product = require("../models/Product");
    for (const item of order.items) {
      try {
        const product = await Product.findById(item.product);
        if (product && typeof product.increaseStock === "function") {
          await product.increaseStock(item.quantity);
        }
      } catch (stockErr) {
        console.error(`Failed to restore stock for product ${item.product}:`, stockErr.message);
      }
    }

    console.log(`Payment failed for order: ${orderId} - stock restored`);

    res.status(200).json({
      success: true,
      message: "Payment failure recorded, stock restored",
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("❌ Handle payment failure error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to handle payment failure",
    });
  }
};

/**
 * @desc    Get Razorpay payment details
 * @route   GET /api/payment/razorpay/payment/:paymentId
 * @access  Private (Customer)
 */
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Fetch payment from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("❌ Get payment details error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payment details",
    });
  }
};

/**
 * @desc    Issue refund for a payment
 * @route   POST /api/payment/razorpay/refund
 * @access  Private (Customer - if order is cancelled)
 */
exports.issueRefund = async (req, res) => {
  try {
    const { paymentId, amount, orderId } = req.body;

    if (!paymentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and Order ID are required",
      });
    }

    // Verify order belongs to customer
    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is cancelled
    if (order.orderStatus !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled orders can be refunded",
      });
    }

    // Create refund
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined, // Full refund if amount not specified
      notes: {
        orderId: orderId,
        customerId: req.user._id.toString(),
      },
    });

    // Update order
    order.refundStatus = "initiated";
    order.refundId = refund.id;
    order.refundAmount = refund.amount / 100; // Convert paise to rupees
    await order.save();

    console.log(`✅ Refund initiated for order: ${orderId}`);

    res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error("❌ Refund error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process refund",
    });
  }
};
