// server/controllers/offerController.js
const Offer = require("../models/OfferModel");
const Product = require("../models/Product"); // Needed for validation
const Category = require("../models/CategoryModel"); // Needed for validation

// @desc    Create a new offer
// @route   POST /api/supplier/offers
// @access  Private (Supplier only)
exports.createOffer = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const {
      name,
      description,
      type,
      value,
      startDate,
      endDate,
      applyTo,
      selectedProducts,
      selectedCategories,
      code,
      usageLimit,
    } = req.body;

    // Basic Validation
    if (!name || !type || value <= 0 || !startDate || !endDate || !applyTo) {
      return res
        .status(400)
        .json({ message: "Missing required offer fields." });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date." });
    }

    // Validate products/categories if specific
    if (applyTo === "SPECIFIC_PRODUCTS") {
      if (!selectedProducts || selectedProducts.length === 0) {
        return res
          .status(400)
          .json({ message: "Specific products must be selected." });
      }
      // Optional: Verify that selectedProducts belong to this supplier
      const supplierOwnedProducts = await Product.find({
        _id: { $in: selectedProducts },
        supplier: supplierId,
      });
      if (supplierOwnedProducts.length !== selectedProducts.length) {
        return res
          .status(400)
          .json({ message: "Some selected products do not belong to you." });
      }
    } else if (applyTo === "SPECIFIC_CATEGORIES") {
      if (!selectedCategories || selectedCategories.length === 0) {
        return res
          .status(400)
          .json({ message: "Specific categories must be selected." });
      }
      // Optional: Verify that selectedCategories belong to this supplier
      const supplierOwnedCategories = await Category.find({
        _id: { $in: selectedCategories },
        supplier: supplierId,
      });
      if (supplierOwnedCategories.length !== selectedCategories.length) {
        return res
          .status(400)
          .json({ message: "Some selected categories do not belong to you." });
      }
    }

    const newOffer = new Offer({
      supplier: supplierId,
      name,
      description,
      type,
      value,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applyTo,
      selectedProducts: applyTo === "SPECIFIC_PRODUCTS" ? selectedProducts : [],
      selectedCategories:
        applyTo === "SPECIFIC_CATEGORIES" ? selectedCategories : [],
      code,
      usageLimit,
      status: new Date(startDate) > Date.now() ? "Scheduled" : "Active", // Set initial status
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    console.error("Error creating offer:", error);
    if (error.code === 11000) {
      // Duplicate key error (for unique code)
      return res
        .status(400)
        .json({ message: "Offer code already exists. Please choose another." });
    }
    res
      .status(500)
      .json({ message: "Failed to create offer", error: error.message });
  }
};

// --- NEW: Get a single offer by ID (for supplier to edit/view details) ---
// @desc    Get a single offer by ID
// @route   GET /api/supplier/offers/:id
// @access  Private (Supplier only, ensures they own the offer)
exports.getOfferById = async (req, res) => {
    try {
        const offerId = req.params.id;
        const supplierId = req.user.id;

        if (!offerId) {
            return res.status(400).json({ message: "Offer ID is required." });
        }

        const offer = await Offer.findOne({ _id: offerId, supplier: supplierId })
                                 .populate('selectedProducts', 'name')
                                 .populate('selectedCategories', 'name');

        if (!offer) {
            return res.status(404).json({ message: "Offer not found or you do not own this offer." });
        }

        res.status(200).json(offer);

    } catch (error) {
        console.error("Error fetching offer by ID:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid Offer ID format." });
        }
        res.status(500).json({ message: "Failed to fetch offer", error: error.message });
    }
};

// @desc    Get all offers for authenticated supplier
// @route   GET /api/supplier/offers
// @access  Private (Supplier only)
exports.getOffers = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const offers = await Offer.find({ supplier: supplierId }).sort({
      createdAt: -1,
    }); // <--- THIS LINE NEEDS TO BE MODIFIED
    res.status(200).json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch offers", error: error.message });
  }
};

// @desc    Update an offer
// @route   PUT /api/supplier/offers/:id
// @access  Private (Supplier only)
exports.updateOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const supplierId = req.user.id;

    const offer = await Offer.findOneAndUpdate(
      { _id: offerId, supplier: supplierId },
      req.body, // Update with new data from req.body
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res
        .status(404)
        .json({ message: "Offer not found or unauthorized." });
    }
    res.status(200).json(offer);
  } catch (error) {
    console.error("Error updating offer:", error);
    res
      .status(500)
      .json({ message: "Failed to update offer", error: error.message });
  }
};

// @desc    Delete an offer
// @route   DELETE /api/supplier/offers/:id
// @access  Private (Supplier only)
exports.deleteOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const supplierId = req.user.id;

    const offer = await Offer.findOneAndDelete({
      _id: offerId,
      supplier: supplierId,
    });

    if (!offer) {
      return res
        .status(404)
        .json({ message: "Offer not found or unauthorized." });
    }
    res.status(200).json({ message: "Offer deleted successfully." });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res
      .status(500)
      .json({ message: "Failed to delete offer", error: error.message });
  }
};
// @desc    Get all active offers (Customer)
// @route   GET /api/offers/active
// @access  Public
exports.getActiveOffers = async (req, res) => {
  try {
    const today = new Date();
    
    // Find offers that are active, started before today, and end after today
    // And status is Active
    const offers = await Offer.find({
      status: "Active",
      startDate: { $lte: today },
      endDate: { $gte: today },
    })
    .select("-supplier") // Hide supplier details if not needed
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error) {
    console.error("Get active offers error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Validate an offer code (Customer)
// @route   POST /api/offers/validate
// @access  Private (Customer usually)
exports.validateOffer = async (req, res) => {
  try {
    const { code, cartAmount, cartItems } = req.body; // cartItems for product-specific checks

    if (!code) {
        return res.status(400).json({ success: false, error: "Code is required" });
    }

    const offer = await Offer.findOne({ 
      code: code.toUpperCase(),
      status: "Active",
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: "Invalid or inactive offer code",
      });
    }

    const today = new Date();
    if (today < new Date(offer.startDate) || today > new Date(offer.offerEndDate)) {
         // Note: OfferModel has endDate, checking strictly
         if (today > new Date(offer.endDate)) {
            return res.status(400).json({
                success: false,
                error: "Offer expired",
            });
         }
    }

    // Usage limit check
    if (offer.usageLimit !== null && offer.usedCount >= offer.usageLimit) {
        return res.status(400).json({
            success: false,
            error: "Offer usage limit exceeded",
        });
    }

    // Validate based on applyTo
    // Simplified validation for now
    let isValid = true;
    let applicableAmount = cartAmount; // Default to full amount

    // Logic for specific products/categories can be added here
    // For now, assuming granular checks are done or it applies to total

    if (isValid) {
        let discount = 0;
        if (offer.type === "PERCENTAGE") {
            discount = (applicableAmount * offer.value) / 100;
            // Max discount check if implemented
        } else {
            discount = offer.value;
        }
        
        // Ensure discount doesn't exceed total
        discount = Math.min(discount, cartAmount);

        res.status(200).json({
            success: true,
            data: {
                offer,
                discountAmount: discount
            }
        });
    } else {
         res.status(400).json({
            success: false,
            error: "Offer not applicable to these items",
        });
    }

  } catch (error) {
    console.error("Validate offer error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
