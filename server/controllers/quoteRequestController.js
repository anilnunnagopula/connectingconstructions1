// server/controllers/quoteRequestController.js
const QuoteRequest = require("../models/QuoteRequest");
const QuoteResponse = require("../models/QuoteResponse");
const Order = require("../models/Order");
const NotificationService = require("../services/notificationService");
const User = require("../models/User");
/**
 * @desc    Create new quote request
 * @route   POST /api/quotes/request
 * @access  Private (Customer)
 */
exports.createQuoteRequest = async (req, res) => {
  try {
    const customerId = req.user._id;
    const {
      items,
      deliveryLocation,
      requiredBy,
      additionalNotes,
      targetSuppliers,
      broadcastToAll,
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required",
      });
    }

    // Validate delivery location
    if (!deliveryLocation || !deliveryLocation.address) {
      return res.status(400).json({
        success: false,
        message: "Delivery location is required",
      });
    }

    // Validate required date
    const reqDate = new Date(requiredBy);
    if (reqDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Required date must be in the future",
      });
    }

    // Validate target suppliers if not broadcasting
    if (!broadcastToAll && (!targetSuppliers || targetSuppliers.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Select suppliers or enable broadcast to all",
      });
    }

    // Create quote request
    const quoteRequest = await QuoteRequest.create({
      customer: customerId,
      items,
      deliveryLocation,
      requiredBy: reqDate,
      additionalNotes,
      targetSuppliers: broadcastToAll ? [] : targetSuppliers,
      broadcastToAll,
    });
    
    if (broadcastToAll) {
      // Get all suppliers
      const suppliers = await User.find({ role: "supplier" }).select("_id");
      for (const supplier of suppliers) {
        await NotificationService.notifyQuoteRequest(
          quoteRequest,
          supplier._id,
        );
      }
    } else if (targetSuppliers && targetSuppliers.length > 0) {
      for (const supplierId of targetSuppliers) {
        await NotificationService.notifyQuoteRequest(quoteRequest, supplierId);
      }
    }

    console.log(`✅ Quote request created: ${quoteRequest.quoteNumber}`);

    res.status(201).json({
      success: true,
      message: "Quote request created successfully",
      data: quoteRequest,
    });
  } catch (error) {
    console.error("❌ Create quote request error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create quote request",
    });
  }
};

/**
 * @desc    Get customer's quote requests
 * @route   GET /api/quotes/request
 * @access  Private (Customer)
 */
exports.getCustomerQuoteRequests = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { customer: customerId };
    if (status) {
      query.status = status;
    }

    const quoteRequests = await QuoteRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await QuoteRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        quoteRequests,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Get quote requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote requests",
    });
  }
};

/**
 * @desc    Get single quote request with responses
 * @route   GET /api/quotes/request/:id
 * @access  Private (Customer)
 */
exports.getQuoteRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user._id;

    const quoteRequest = await QuoteRequest.findOne({
      _id: id,
      customer: customerId,
    });

    if (!quoteRequest) {
      return res.status(404).json({
        success: false,
        message: "Quote request not found",
      });
    }

    // Get all responses for this quote
    const responses = await QuoteResponse.find({
      quoteRequest: id,
    }).sort({ totalAmount: 1 }); // Sort by price (lowest first)

    res.status(200).json({
      success: true,
      data: {
        quoteRequest,
        responses,
        responseCount: responses.length,
      },
    });
  } catch (error) {
    console.error("❌ Get quote request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote request",
    });
  }
};

/**
 * @desc    Cancel quote request
 * @route   PUT /api/quotes/request/:id/cancel
 * @access  Private (Customer)
 */
exports.cancelQuoteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const customerId = req.user._id;

    const quoteRequest = await QuoteRequest.findOne({
      _id: id,
      customer: customerId,
    });

    if (!quoteRequest) {
      return res.status(404).json({
        success: false,
        message: "Quote request not found",
      });
    }

    if (quoteRequest.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel accepted quote request",
      });
    }

    await quoteRequest.cancel(reason);

    res.status(200).json({
      success: true,
      message: "Quote request cancelled",
      data: quoteRequest,
    });
  } catch (error) {
    console.error("❌ Cancel quote request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel quote request",
    });
  }
};

/**
 * @desc    Accept a quote response
 * @route   PUT /api/quotes/request/:id/accept/:responseId
 * @access  Private (Customer)
 */

exports.acceptQuoteResponse = async (req, res) => {
  try {
    const { id, responseId } = req.params;
    const customerId = req.user._id;

    console.log("🎯 Accept quote:", { id, responseId, customerId });

    // Get quote request
    const quoteRequest = await QuoteRequest.findOne({
      _id: id,
      customer: customerId,
    });

    if (!quoteRequest) {
      console.log("❌ Quote request not found");
      return res.status(404).json({
        success: false,
        message: "Quote request not found",
      });
    }

    if (quoteRequest.status === "accepted") {
      console.log("❌ Quote already accepted");
      return res.status(400).json({
        success: false,
        message: "Quote already accepted",
      });
    }

    // Get quote response
    const quoteResponse = await QuoteResponse.findOne({
      _id: responseId,
      quoteRequest: id,
    });

    if (!quoteResponse) {
      console.log("❌ Quote response not found");
      return res.status(404).json({
        success: false,
        message: "Quote response not found",
      });
    }

    if (quoteResponse.isExpired) {
      console.log("❌ Quote expired");
      return res.status(400).json({
        success: false,
        message: "Quote has expired",
      });
    }

    console.log("✅ Creating order from quote...");

    // ✅ CREATE ORDER FROM QUOTE
    const orderItems = quoteResponse.items.map((item) => ({
      // Don't include product field if there's no productRef
      ...(item.productRef && { product: item.productRef }),
      quantity: item.quantity,
      productSnapshot: {
        name: item.name,
        price: item.unitPrice,
        unit: item.unit,
        supplier: quoteResponse.supplier,
      },
      priceAtOrder: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    const order = await Order.create({
      customer: customerId,
      items: orderItems,
      subtotal: quoteResponse.totalAmount - (quoteResponse.deliveryCharges || 0),
      deliveryFee: quoteResponse.deliveryCharges || 0,
      tax: 0, // No tax on quote-based orders (already included)
      totalAmount: quoteResponse.totalAmount,
      deliveryAddress: quoteRequest.deliveryLocation,
      deliverySlot: {
        date: quoteRequest.requiredBy,
        timeSlot: "As per quote agreement",
      },
      paymentMethod: quoteResponse.paymentTerms === "cod" ? "cod" : "advance_50",
      paymentStatus: "pending",
      quoteReference: responseId,
      isFromQuote: true,
      customerNotes: quoteRequest.additionalNotes,
      supplierNotes: quoteResponse.terms,
    });

    console.log("✅ Order created:", order._id);

    // Accept the quote
    await quoteResponse.accept();
    await quoteRequest.acceptQuote(responseId);

    // Reject all other responses
    await QuoteResponse.updateMany(
      {
        quoteRequest: id,
        _id: { $ne: responseId },
        status: "pending",
      },
      {
        status: "rejected",
        rejectedAt: new Date(),
        rejectionReason: "Customer accepted another quote",
      }
    );

    console.log(`✅ Quote accepted: ${quoteResponse.responseNumber}, Order: ${order.orderNumber}`);

    // ✅ RETURN PROPER FORMAT
    res.status(200).json({
      success: true,
      message: "Quote accepted and order created successfully",
      data: {
        quoteRequest,
        acceptedQuote: quoteResponse,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus,
        },
      },
    });
  } catch (error) {
    console.error("❌ Accept quote error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to accept quote",
    });
  }
};
