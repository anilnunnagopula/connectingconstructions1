const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    // Filter by role
    if (role) query.role = role;

    // Filter by status (active/suspended)
    if (status) {
      if (status === "active") query.isActive = true;
      if (status === "suspended") query.isActive = false;
      if (status === "pending") query.verificationStatus = "pending";
      if (status === "verified") query.verificationStatus = "verified";
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify or Reject Supplier
// @route   PATCH /api/admin/suppliers/:id/verify
// @access  Private/Admin
const verifySupplier = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(req.params.id);

    if (!user || user.role !== "supplier") {
      return res.status(404).json({ message: "Supplier not found" });
    }

    user.verificationStatus = status;
    user.isVerified = status === "verified";
    user.verifiedAt = status === "verified" ? new Date() : null;
    user.verifiedBy = req.user._id;

    await user.save();

    res.json({ message: `Supplier marked as ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Supplier Tier
// @route   PATCH /api/admin/suppliers/:id/tier
// @access  Private/Admin
const updateSupplierTier = async (req, res) => {
    try {
        const { tier } = req.body;
        constvalidTiers = ["standard", "silver", "gold", "platinum"];

        if (!validTiers.includes(tier)) {
            return res.status(400).json({ message: "Invalid tier" });
        }

        const user = await User.findById(req.params.id);

        if (!user || user.role !== "supplier") {
            return res.status(404).json({ message: "Supplier not found" });
        }

        user.supplierTier = tier;
        await user.save();

        res.json({ success: true, message: `Supplier tier updated to ${tier}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Suspend or Activate User
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent suspending self
    if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: "Cannot suspend yourself" });
    }

    user.isActive = isActive;
    await user.save();

    res.json({ message: `User ${isActive ? "activated" : "suspended"}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Platform Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "customer" });
        const totalSuppliers = await User.countDocuments({ role: "supplier" });
        const pendingVerifications = await User.countDocuments({ role: "supplier", verificationStatus: "pending" });
        const totalOrders = await Order.countDocuments();
        
        // Calculate total revenue
        const revenueAgg = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // 1. Revenue Trends (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueTrends = await Order.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: sixMonthsAgo },
                    paymentStatus: "paid"
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    total: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 2. Top Selling Categories
        const topCategories = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.category",
                    sales: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.totalPrice" }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            totalUsers,
            totalSuppliers,
            pendingVerifications,
            totalOrders,
            totalRevenue,
            revenueTrends,
            topCategories
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get System Health
// @route   GET /api/admin/health
// @access  Private/Admin
const getSystemHealth = async (req, res) => {
    try {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        
        // Check DB connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        
        res.json({
            status: 'ok',
            uptime,
            timestamp: new Date(),
            database: {
                status: dbStatus,
                host: mongoose.connection.host,
                name: mongoose.connection.name
            },
            memory: {
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB'
            },
            server: {
                nodeVersion: process.version,
                platform: process.platform,
                cpuArch: process.arch
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

/**
 * @desc    Delete a product (Soft delete)
 * @route   DELETE /api/admin/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        await product.softDelete();

        res.status(200).json({
            success: true,
            message: "Product removed successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Export Data to CSV
// @route   GET /api/admin/export/:type
// @access  Private/Admin
const exportData = async (req, res) => {
    try {
        const { type } = req.params;
        let data = [];
        let fields = [];

        if (type === 'users') {
            data = await User.find().select('-password').lean();
            fields = ['_id', 'name', 'email', 'role', 'isActive', 'supplierTier', 'createdAt'];
        } else if (type === 'orders') {
            data = await Order.find().lean();
            fields = ['_id', 'user', 'totalAmount', 'paymentStatus', 'orderStatus', 'createdAt'];
        } else {
            return res.status(400).json({ message: "Invalid export type" });
        }

        const csv = [
            fields.join(','),
            ...data.map(row => fields.map(field => JSON.stringify(row[field] || '')).join(','))
        ].join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment(`${type}_export.csv`);
        res.send(csv);

    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: "Export failed" });
    }
};

module.exports = {
  getAllUsers,
  verifySupplier,
  updateUserStatus,
  getAdminStats,
  deleteProduct,
  updateSupplierTier,
  getSystemHealth,
  exportData
};
