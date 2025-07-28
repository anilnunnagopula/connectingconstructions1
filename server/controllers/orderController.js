// server/controllers/orderController.js
const Order = require("../models/OrderModel"); // Assuming your Mongoose Order model
// const Product = require('../models/ProductModel'); // Might need this if filtering by product.supplier

// @desc    Get all orders for the authenticated supplier
// @route   GET /api/supplier/orders
// @access  Private (Supplier only)
exports.getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.user.id; // From 'protect' middleware (assuming this is supplier's _id)

    // Find orders where at least one product in the order's items array belongs to this supplier
    // This assumes your Order model's 'products' array has a 'supplier' field for each item.
    const orders = await Order.find({ "products.supplier": supplierId })
      .populate("customer", "name email") // Populate customer details
      .sort({ createdAt: -1 }); // Sort by newest first

    // Optional: If you need to return only the items *from this supplier* within each order,
    // you might need to process the orders array after fetching.
    // For simplicity, this returns full orders that contain supplier's products.

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching supplier orders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

// @desc    Update order status for a specific order (supplier's own order)
// @route   PUT /api/supplier/orders/:id/status
// @access  Private (Supplier only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const supplierId = req.user.id;
    const { status } = req.body; // New status from frontend

    if (!status) {
      return res.status(400).json({ message: "New status is required." });
    }

    // Validate if the new status is one of your allowed statuses
    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Refunded",
    ];
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid order status provided." });
    }

    // Find the order and ensure it contains products from this supplier
    const order = await Order.findOne({
      _id: orderId,
      "products.supplier": supplierId, // Ensure this order is relevant to the supplier
    });

    if (!order) {
      return res
        .status(404)
        .json({
          message:
            "Order not found or you are not authorized to update this order.",
        });
    }

    // Update the order status
    order.orderStatus = status;
    // Optionally, add to an order history array in the model if you track status changes
    // order.statusHistory.push({ status: newStatus, timestamp: new Date() });

    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully!", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID format." });
    }
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};
