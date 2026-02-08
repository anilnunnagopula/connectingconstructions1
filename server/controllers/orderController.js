// server/controllers/orderController.js
const Order = require("../models/OrderModel");
const Product = require("../models/Product");
const {
  applyLean,
  buildBaseQuery,
  paginate,
  getPaginationMeta,
} = require("../utils/queryHelpers");

/**
 * @desc    Get all orders for authenticated supplier (with pagination)
 * @route   GET /api/supplier/orders
 * @access  Private (Supplier only)
 */
exports.getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    // Build filters
    const filters = buildBaseQuery(); // { isDeleted: false }
    filters["products.supplier"] = supplierId;

    // Status filter
    if (status) {
      filters.orderStatus = status;
    }

    // Date range filter
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    // ✨ Build query with pagination and lean()
    const query = Order.find(filters)
      .populate("customer", "name email phoneNumber")
      .populate("products.productId", "name price imageUrls")
      .sort({ createdAt: -1 })
      .select("-__v");

    const paginatedQuery = paginate(query, parseInt(page), parseInt(limit));
    const orders = await applyLean(paginatedQuery);

    // Get pagination metadata
    const pagination = await getPaginationMeta(
      Order,
      filters,
      parseInt(page),
      parseInt(limit),
    );

    // ✨ Calculate supplier-specific totals for each order
    const ordersWithSupplierData = orders.map((order) => {
      const supplierProducts = order.products.filter(
        (p) => p.supplier && p.supplier.toString() === supplierId.toString(),
      );

      const supplierSubtotal = supplierProducts.reduce(
        (total, p) => total + (p.price || 0) * (p.quantity || 0),
        0,
      );

      return {
        ...order,
        supplierProducts,
        supplierSubtotal,
      };
    });

    console.log(
      `📦 Fetched ${orders.length} orders for supplier: ${supplierId}`,
    );

    res.status(200).json({
      success: true,
      data: ordersWithSupplierData,
      pagination,
    });
  } catch (error) {
    console.error("❌ Error fetching supplier orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/supplier/orders/:id/status
 * @access  Private (Supplier only)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const supplierId = req.user._id;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "New status is required.",
      });
    }

    // Validate status
    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Refunded",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    // Find order (need full Mongoose doc for method calls)
    const order = await Order.findOne({
      _id: orderId,
      "products.supplier": supplierId,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you are not authorized to update it.",
      });
    }

    // ✨ Use the model's updateStatus method (from refactored Order model)
    await order.updateStatus(status, supplierId, notes);

    // ✨ If order is delivered, update product stock if needed
    if (status === "Delivered") {
      // Already handled in createOrder, but you could add confirmation logic here
      console.log("✅ Order delivered:", orderId);
    }

    // ✨ If order is cancelled, restore product stock
    if (status === "Cancelled") {
      for (const item of order.products) {
        if (item.supplier.toString() === supplierId.toString()) {
          const product = await Product.findById(item.productId);
          if (product) {
            await product.increaseStock(item.quantity);
          }
        }
      }
      console.log("🔄 Stock restored for cancelled order:", orderId);
    }

    console.log(`✅ Order status updated: ${orderId} → ${status}`);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      order,
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
