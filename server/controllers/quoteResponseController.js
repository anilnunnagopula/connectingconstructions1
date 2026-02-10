// server/controllers/quoteResponseController.js
const QuoteRequest = require("../models/QuoteRequest");
const QuoteResponse = require("../models/QuoteResponse");
const NotificationService = require("../services/notificationService");
/**
 * @desc    Get quote requests for supplier
 * @route   GET /api/quotes/response/requests
 * @access  Private (Supplier)
 */
exports.getQuoteRequestsForSupplier = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    // Find quotes where supplier is targeted OR broadcast is enabled
    const query = {
      $or: [{ targetSuppliers: supplierId }, { broadcastToAll: true }],
      status: { $in: ["pending", "quoted"] },
    };

    if (status) {
      query.status = status;
    }

    const quoteRequests = await QuoteRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Check which quotes supplier has already responded to
    const quoteIds = quoteRequests.map((q) => q._id);
    const existingResponses = await QuoteResponse.find({
      quoteRequest: { $in: quoteIds },
      supplier: supplierId,
    }).select("quoteRequest");

    const respondedQuoteIds = new Set(
      existingResponses.map((r) => r.quoteRequest.toString()),
    );

    // Mark quotes as responded
    const enrichedQuotes = quoteRequests.map((quote) => ({
      ...quote,
      hasResponded: respondedQuoteIds.has(quote._id.toString()),
    }));

    const total = await QuoteRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        quoteRequests: enrichedQuotes,
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
 * @desc    Create quote response
 * @route   POST /api/quotes/response
 * @access  Private (Supplier)
 */
exports.createQuoteResponse = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const {
      quoteRequestId,
      items,
      totalAmount,
      deliveryCharges,
      estimatedDeliveryDays,
      validUntil,
      terms,
      paymentTerms,
    } = req.body;

    // Validate quote request exists
    const quoteRequest = await QuoteRequest.findById(quoteRequestId);

    if (!quoteRequest) {
      return res.status(404).json({
        success: false,
        message: "Quote request not found",
      });
    }

    // Check if supplier is targeted
    const isTargeted =
      quoteRequest.broadcastToAll ||
      quoteRequest.targetSuppliers.some(
        (id) => id.toString() === supplierId.toString(),
      );

    if (!isTargeted) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to respond to this quote",
      });
    }

    // Check if already responded
    const existingResponse = await QuoteResponse.findOne({
      quoteRequest: quoteRequestId,
      supplier: supplierId,
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: "You have already responded to this quote",
      });
    }

    // Validate items count
    if (items.length !== quoteRequest.items.length) {
      return res.status(400).json({
        success: false,
        message: "Response items must match request items",
      });
    }

    // Validate validity date
    const validityDate = new Date(validUntil);
    if (validityDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Validity date must be in the future",
      });
    }

    // Create quote response
    const quoteResponse = await QuoteResponse.create({
      quoteRequest: quoteRequestId,
      supplier: supplierId,
      items,
      totalAmount,
      deliveryCharges: deliveryCharges || 0,
      estimatedDeliveryDays,
      validUntil: validityDate,
      terms,
      paymentTerms: paymentTerms || "cod",
    });
     await NotificationService.notifyQuoteResponse(quoteRequest, quoteResponse);


    // Increment response count on quote request
    await quoteRequest.incrementResponses();

    console.log(`✅ Quote response created: ${quoteResponse.responseNumber}`);

    res.status(201).json({
      success: true,
      message: "Quote response submitted successfully",
      data: quoteResponse,
    });
  } catch (error) {
    console.error("❌ Create quote response error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create quote response",
    });
  }
};

/**
 * @desc    Get supplier's quote responses
 * @route   GET /api/quotes/response
 * @access  Private (Supplier)
 */
exports.getSupplierQuoteResponses = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { supplier: supplierId };
    if (status) {
      query.status = status;
    }

    const responses = await QuoteResponse.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await QuoteResponse.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        responses,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Get quote responses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote responses",
    });
  }
};

/**
 * @desc    Withdraw quote response
 * @route   PUT /api/quotes/response/:id/withdraw
 * @access  Private (Supplier)
 */
exports.withdrawQuoteResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const supplierId = req.user._id;

    const quoteResponse = await QuoteResponse.findOne({
      _id: id,
      supplier: supplierId,
    });

    if (!quoteResponse) {
      return res.status(404).json({
        success: false,
        message: "Quote response not found",
      });
    }

    if (quoteResponse.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Cannot withdraw accepted quote",
      });
    }

    await quoteResponse.withdraw(reason);

    res.status(200).json({
      success: true,
      message: "Quote response withdrawn",
      data: quoteResponse,
    });
  } catch (error) {
    console.error("❌ Withdraw quote error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to withdraw quote",
    });
  }
};
