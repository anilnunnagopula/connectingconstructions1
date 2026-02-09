// server/controllers/orderController.js
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * @desc    Create new order from cart
 * @route   POST /api/orders/create
 * @access  Private (Customer)
 */
exports.createOrder = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { deliveryAddress, deliverySlot, paymentMethod, customerNotes } =
      req.body;

    // Validate required fields
    if (
      !deliveryAddress ||
      !deliveryAddress.phone ||
      !deliveryAddress.addressLine1
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // Get customer's cart
    const cart = await Cart.findOne({ customer: customerId }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Validate stock availability
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productSnapshot.name} not found`,
        });
      }

      if (!product.availability) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
        });
      }
    }

    // Calculate pricing
    const subtotal = cart.items.reduce((total, item) => {
      return total + item.productSnapshot.price * item.quantity;
    }, 0);

    const deliveryFee = subtotal > 10000 ? 0 : 100; // Free delivery above ₹10,000
    const tax = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + deliveryFee + tax;

    // Create order items with snapshots
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      productSnapshot: item.productSnapshot,
      priceAtOrder: item.productSnapshot.price,
      totalPrice: item.productSnapshot.price * item.quantity,
    }));

    // Create order
    const order = await Order.create({
      customer: customerId,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      deliveryAddress,
      deliverySlot,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      customerNotes,
    });

    // Decrease product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      await product.decreaseStock(item.quantity);
    }

    // Clear cart after successful order
    await cart.clearCart();

    console.log(`✅ Order created: ${order.orderNumber}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("❌ Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

/**
 * @desc    Get customer's orders
 * @route   GET /api/orders
 * @access  Private (Customer)
 */
exports.getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { customer: customerId };
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("items.product", "name imageUrls")
      .lean();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/**
 * @desc    Get single order details
 * @route   GET /api/orders/:orderId
 * @access  Private (Customer)
 */
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user._id;

    const order = await Order.findOne({
      _id: orderId,
      customer: customerId,
    }).populate("items.product", "name imageUrls category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:orderId/cancel
 * @access  Private (Customer)
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const customerId = req.user._id;

    const order = await Order.findOne({
      _id: orderId,
      customer: customerId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Can only cancel pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        await product.increaseStock(item.quantity);
      }
    }

    await order.cancel(reason);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("❌ Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};
// server/controllers/orderController.js
// ... (keep all existing code above)

/**
 * @desc    Get supplier's orders
 * @route   GET /api/supplier/orders
 * @access  Private (Supplier)
 */
exports.getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;

    // Find orders that contain products from this supplier
    const query = {
      "items.productSnapshot.supplier": supplierId,
    };

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("customer", "name email phone")
      .lean();

    // Filter items to only show this supplier's products
    const filteredOrders = orders.map((order) => ({
      ...order,
      items: order.items.filter(
        (item) => item.productSnapshot.supplier?.toString() === supplierId.toString()
      ),
    }));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders: filteredOrders,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Get supplier orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/**
 * @desc    Update order status (supplier)
 * @route   PUT /api/supplier/orders/:id/status
 * @access  Private (Supplier)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingInfo, supplierNotes } = req.body;
    const supplierId = req.user._id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify supplier owns products in this order
    const hasSupplierProducts = order.items.some(
      (item) => item.productSnapshot.supplier?.toString() === supplierId.toString()
    );

    if (!hasSupplierProducts) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    // Validate status transitions
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Update order
    order.orderStatus = status;
    
    if (trackingInfo) {
      order.trackingInfo = {
        ...order.trackingInfo,
        ...trackingInfo,
      };
    }

    if (supplierNotes) {
      order.supplierNotes = supplierNotes;
    }

    // Set timestamps based on status
    if (status === "confirmed" && !order.confirmedAt) {
      order.confirmedAt = new Date();
    } else if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    } else if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
      order.paymentStatus = "paid"; // Mark as paid on delivery (for COD)
    }

    await order.save();

    console.log(`✅ Order ${order.orderNumber} status updated to: ${status}`);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("❌ Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};