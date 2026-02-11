// server/controllers/invoiceController.js
const Order = require("../models/Order");
const { generateInvoicePDF } = require("../utils/invoiceGenerator");

/**
 * Get all invoices (completed orders) for customer
 * @route GET /api/customer/invoices
 * @access Private (Customer only)
 */
exports.getInvoices = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    // Find all delivered orders for this customer
    const orders = await Order.find({
      customer: customerId,
      orderStatus: "Delivered",
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select(
        "createdAt totalAmount items deliveryAddress paymentMethod paymentStatus",
      );

    const totalOrders = await Order.countDocuments({
      customer: customerId,
      orderStatus: "Delivered",
    });

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalOrders / parseInt(limit)),
          totalOrders,
        },
      },
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch invoices",
    });
  }
};

/**
 * Download invoice PDF for a specific order
 * @route GET /api/customer/invoices/:orderId/download
 * @access Private (Customer only)
 */
exports.downloadInvoice = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { orderId } = req.params;

    // Find the order and verify ownership
    const order = await Order.findOne({
      _id: orderId,
      customer: customerId,
    }).populate("customer", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found or you don't have access to this order",
      });
    }

    // Check if order is completed (has invoice)
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        error: "Invoice is only available for delivered orders",
      });
    }

    // Generate PDF
    const invoiceStream = generateInvoicePDF(order, {
      companyInfo: {
        name: "ConnectConstructions",
        address: "Construction Materials Marketplace",
        city: "India",
        phone: "+91 1234567890",
        email: "support@connectconstructions.com",
        website: "www.connectconstructions.com",
        gstin: "29ABCDE1234F1Z5", // Replace with actual GSTIN
      },
    });

    // Set response headers for PDF download
    const invoiceNumber = order._id.toString().slice(-8).toUpperCase();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${invoiceNumber}.pdf`,
    );

    // Pipe the PDF to response
    invoiceStream.pipe(res);
  } catch (error) {
    console.error("Download invoice error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate invoice",
    });
  }
};

/**
 * Preview invoice (view in browser without download)
 * @route GET /api/customer/invoices/:orderId/preview
 * @access Private (Customer only)
 */
exports.previewInvoice = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { orderId } = req.params;

    // Find the order and verify ownership
    const order = await Order.findOne({
      _id: orderId,
      customer: customerId,
    }).populate("customer", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found or you don't have access to this order",
      });
    }

    // Check if order is completed
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        error: "Invoice is only available for delivered orders",
      });
    }

    // Generate PDF
    const invoiceStream = generateInvoicePDF(order);

    // Set response headers for inline viewing
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    // Pipe the PDF to response
    invoiceStream.pipe(res);
  } catch (error) {
    console.error("Preview invoice error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to preview invoice",
    });
  }
};
