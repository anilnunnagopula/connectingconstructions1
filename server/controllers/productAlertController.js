const ProductAlert = require("../models/ProductAlert");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private
exports.createAlert = async (req, res) => {
  try {
    const { productId, alertType, targetPrice } = req.body;
    const userId = req.user.id; // Corrected: user.id from protect middleware

    // Validate inputs
    if (!productId || !alertType) {
      return res.status(400).json({ success: false, message: "Product ID and Alert Type are required" });
    }

    if (alertType === "price_drop" && !targetPrice) {
      return res.status(400).json({ success: false, message: "Target Price is required for Price Drop alerts" });
    }

    // Check if alert already exists
    const existingAlert = await ProductAlert.findOne({
      user: userId,
      product: productId,
      alertType,
    });

    if (existingAlert) {
      return res.status(400).json({ success: false, message: "Alert already exists for this product" });
    }

    const alert = await ProductAlert.create({
      user: userId,
      product: productId,
      alertType,
      targetPrice,
      isActive: true,
    });

    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get user's alerts
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const alerts = await ProductAlert.find({ user: userId }).populate("product", "name price imageUrls availability quantity");

    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete an alert
// @route   DELETE /api/alerts/:id
// @access  Private
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await ProductAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }

    // Verify ownership
    if (alert.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await alert.deleteOne(); // Use deleteOne() instead of remove()

    res.status(200).json({ success: true, message: "Alert removed" });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Internal function to check and trigger alerts
// @param   product - The updated product object
exports.checkAndTriggerAlerts = async (product) => {
  try {
    // 1. Check Price Drop Alerts
    const priceDropAlerts = await ProductAlert.find({
      product: product._id,
      alertType: "price_drop",
      isActive: true,
      targetPrice: { $gte: product.price }, // Trigger if current price is <= target price
    });

    for (const alert of priceDropAlerts) {
      // Create notification for user
      await Notification.create({
        user: alert.user, // Assuming Notification model has 'user' field
        message: `Price drop alert! ${product.name} is now available for ₹${product.price} (Target: ₹${alert.targetPrice})`,
        link: `/product/${product._id}`,
        read: false,
      });

      // Optionally deactivate the alert after triggering
      // await alert.updateOne({ isActive: false });
    }

    // 2. Check Back in Stock Alerts
    if (product.availability && product.quantity > 0) {
      const stockAlerts = await ProductAlert.find({
        product: product._id,
        alertType: "back_in_stock",
        isActive: true,
      });

      for (const alert of stockAlerts) {
        await Notification.create({
          user: alert.user,
          message: `${product.name} is back in stock!`,
          link: `/product/${product._id}`,
          read: false,
        });

        // Deactivate stock alert as it's a one-time event usually
        await alert.updateOne({ isActive: false });
      }
    }
  } catch (error) {
    console.error("Error checking alerts:", error);
  }
};
