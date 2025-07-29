// server/controllers/paymentController.js
const PayoutMethod = require("../models/PayoutMethodModel");
const PayoutHistory = require("../models/PayoutHistoryModel");

// @desc    Get all payout methods for authenticated supplier
// @route   GET /api/supplier/payout-methods
// @access  Private (Supplier only)
exports.getPayoutMethods = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const methods = await PayoutMethod.find({ supplier: supplierId }).sort({
      createdAt: -1,
    });
    // In a real app, you might decrypt sensitive fields before sending
    res.status(200).json(methods);
  } catch (error) {
    console.error("Error fetching payout methods:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch payout methods",
        error: error.message,
      });
  }
};

// @desc    Add a new payout method for authenticated supplier
// @route   POST /api/supplier/payout-methods
// @access  Private (Supplier only)
exports.addPayoutMethod = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { type, details, isDefault = false } = req.body;

    if (!type || !details) {
      return res
        .status(400)
        .json({ message: "Type and details are required." });
    }

    if (type === "BANK_TRANSFER") {
      if (
        !details.accountNumber ||
        !details.ifscCode ||
        !details.accountHolderName ||
        !details.bankName
      ) {
        return res
          .status(400)
          .json({
            message:
              "Bank transfer requires Account Number, IFSC, Account Holder Name, and Bank Name.",
          });
      }
      // In a real app: Encrypt details.accountNumber and store.
    } else if (type === "UPI") {
      if (!details.upiId) {
        return res.status(400).json({ message: "UPI requires UPI ID." });
      }
      // In a real app: Encrypt details.upiId and store.
    } else {
      return res.status(400).json({ message: "Invalid payout method type." });
    }

    let newMethod = new PayoutMethod({
      supplier: supplierId,
      type,
      details, // Assume details are appropriately handled/encrypted before this point
      isDefault: isDefault,
    });

    // If setting as default, ensure previous default is unset
    if (isDefault) {
      await PayoutMethod.updateMany(
        { supplier: supplierId, isDefault: true },
        { isDefault: false }
      );
    } else {
      // If no existing methods and this is the first, make it default
      const existingCount = await PayoutMethod.countDocuments({
        supplier: supplierId,
      });
      if (existingCount === 0) {
        newMethod.isDefault = true;
      }
    }

    await newMethod.save();
    res.status(201).json(newMethod);
  } catch (error) {
    console.error("Error adding payout method:", error);
    res
      .status(500)
      .json({ message: "Failed to add payout method", error: error.message });
  }
};

// @desc    Update a payout method (e.g., set as default, update details)
// @route   PUT /api/supplier/payout-methods/:id
// @access  Private (Supplier only)
exports.updatePayoutMethod = async (req, res) => {
  try {
    const methodId = req.params.id;
    const supplierId = req.user.id;
    const { isDefault, details, status } = req.body;

    const method = await PayoutMethod.findOne({
      _id: methodId,
      supplier: supplierId,
    });
    if (!method) {
      return res
        .status(404)
        .json({ message: "Payout method not found or unauthorized." });
    }

    if (typeof isDefault === "boolean") {
      if (isDefault) {
        // Unset current default for this supplier
        await PayoutMethod.updateMany(
          { supplier: supplierId, isDefault: true },
          { isDefault: false }
        );
      }
      method.isDefault = isDefault;
    }

    if (details) {
      // Update specific details fields. Be careful not to expose sensitive encrypted data during update process.
      // In a real app, you'd have specific logic for updating bank/UPI details safely.
      Object.assign(method.details, details);
    }

    if (status) {
      method.status = status;
    }

    await method.save();
    res
      .status(200)
      .json({ message: "Payout method updated successfully", method });
  } catch (error) {
    console.error("Error updating payout method:", error);
    res
      .status(500)
      .json({
        message: "Failed to update payout method",
        error: error.message,
      });
  }
};

// @desc    Delete a payout method
// @route   DELETE /api/supplier/payout-methods/:id
// @access  Private (Supplier only)
exports.deletePayoutMethod = async (req, res) => {
  try {
    const methodId = req.params.id;
    const supplierId = req.user.id;

    const method = await PayoutMethod.findOneAndDelete({
      _id: methodId,
      supplier: supplierId,
    });

    if (!method) {
      return res
        .status(404)
        .json({ message: "Payout method not found or unauthorized." });
    }
    res.status(200).json({ message: "Payout method deleted successfully." });
  } catch (error) {
    console.error("Error deleting payout method:", error);
    res
      .status(500)
      .json({
        message: "Failed to delete payout method",
        error: error.message,
      });
  }
};

// @desc    Get payout history for authenticated supplier
// @route   GET /api/supplier/payout-history
// @access  Private (Supplier only)
exports.getPayoutHistory = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const history = await PayoutHistory.find({ supplier: supplierId }).sort({
      processedAt: -1,
    });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching payout history:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch payout history",
        error: error.message,
      });
  }
};
