// server/controllers/customerAddressController.js
const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * Customer Address Controller
 * Handles CRUD operations for customer delivery addresses
 */

// ==================== GET ALL ADDRESSES ====================
/**
 * Get all addresses for the logged-in customer
 * @route GET /api/customer/addresses
 * @access Private (Customer only)
 */
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.addresses || [],
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

// ==================== CREATE ADDRESS ====================
/**
 * Add a new delivery address
 * @route POST /api/customer/addresses
 * @access Private (Customer only)
 */
exports.createAddress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      landmark,
      isDefault,
    } = req.body;

    // Validate required fields
    if (!label || !fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If this is the first address OR user wants it as default, set it as default
    const shouldBeDefault = isDefault || !user.addresses || user.addresses.length === 0;

    // If setting as default, remove default from other addresses
    if (shouldBeDefault && user.addresses) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Create new address
    const newAddress = {
      label,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      landmark,
      isDefault: shouldBeDefault,
      createdAt: new Date(),
    };

    // Add to user's addresses
    if (!user.addresses) {
      user.addresses = [];
    }
    user.addresses.push(newAddress);

    await user.save();

    // Get the newly added address (last item in array)
    const addedAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: addedAddress,
    });
  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: error.message,
    });
  }
};

// ==================== UPDATE ADDRESS ====================
/**
 * Update an existing address
 * @route PUT /api/customer/addresses/:id
 * @access Private (Customer only)
 */
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find address by ID
    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Update address fields
    const allowedUpdates = [
      "label",
      "fullName",
      "phone",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "pincode",
      "landmark",
    ];

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        user.addresses[addressIndex][field] = updateData[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: user.addresses[addressIndex],
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

// ==================== DELETE ADDRESS ====================
/**
 * Delete an address
 * @route DELETE /api/customer/addresses/:id
 * @access Private (Customer only)
 */
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find address index
    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Check if deleting default address
    const wasDefault = user.addresses[addressIndex].isDefault;

    // Remove address
    user.addresses.splice(addressIndex, 1);

    // If we deleted the default address and there are still addresses left,
    // set the first one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};

// ==================== SET DEFAULT ADDRESS ====================
/**
 * Set an address as default
 * @route PUT /api/customer/addresses/:id/default
 * @access Private (Customer only)
 */
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find address by ID
    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Set all addresses to non-default
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });

    // Set this address as default
    user.addresses[addressIndex].isDefault = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: user.addresses[addressIndex],
    });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set default address",
      error: error.message,
    });
  }
};
