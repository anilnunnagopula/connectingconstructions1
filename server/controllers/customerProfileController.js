// server/controllers/customerProfileController.js
const User = require("../models/User");
const PaymentMethod = require("../models/PaymentMethod"); // Assuming a PaymentMethod model
const asyncHandler = require("express-async-handler");

// @desc    Get customer profile
// @route   GET /api/customer/profile
// @access  Private (Customer only)
const getCustomerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // NOTE: You might want to combine user and profile data if they are separate
  res.status(200).json({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profilePictureUrl: user.profilePictureUrl,
    address: user.address,
    location: user.location,
    role: user.role,
  });
});

// @desc    Update customer profile
// @route   PUT /api/customer/profile
// @access  Private (Customer only)
const updateCustomerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Update profile fields
  user.name = req.body.name || user.name;
  user.username = req.body.username || user.username;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
  user.profilePictureUrl = req.body.profilePictureUrl || user.profilePictureUrl;
  user.address = req.body.address || user.address;
  user.location = req.body.location || user.location;

  // Handle password change if requested
  if (req.body.newPassword && req.body.currentPassword) {
    if (await user.matchPassword(req.body.currentPassword)) {
      user.password = req.body.newPassword; // Mongoose middleware should hash this
    } else {
      res.status(401);
      throw new Error("Current password is incorrect.");
    }
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    username: updatedUser.username,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber,
    profilePictureUrl: updatedUser.profilePictureUrl,
    address: updatedUser.address,
    location: updatedUser.location,
    role: updatedUser.role,
  });
});

// @desc    Get customer payment methods
// @route   GET /api/customer/payment-methods
// @access  Private (Customer only)
const getPaymentMethods = asyncHandler(async (req, res) => {
  const methods = await PaymentMethod.find({ user: req.user.id });
  res.status(200).json(methods);
});

// @desc    Add a new payment method
// @route   POST /api/customer/payment-methods
// @access  Private (Customer only)
const addPaymentMethod = asyncHandler(async (req, res) => {
  const { type, details, isDefault } = req.body;
  if (!type || !details) {
    res.status(400);
    throw new Error("Payment method type and details are required.");
  }

  // If new method is set as default, unset all others
  if (isDefault) {
    await PaymentMethod.updateMany({ user: req.user.id }, { isDefault: false });
  }

  const newMethod = new PaymentMethod({
    user: req.user.id,
    type,
    details,
    isDefault,
  });

  const createdMethod = await newMethod.save();
  res.status(201).json(createdMethod);
});

// @desc    Update a payment method (e.g., set as default)
// @route   PUT /api/customer/payment-methods/:id
// @access  Private (Customer only)
const updatePaymentMethod = asyncHandler(async (req, res) => {
  const method = await PaymentMethod.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!method) {
    res.status(404);
    throw new Error("Payment method not found or not owned by user.");
  }

  // Only allow setting default
  if (req.body.isDefault) {
    await PaymentMethod.updateMany({ user: req.user.id }, { isDefault: false });
    method.isDefault = true;
  }

  const updatedMethod = await method.save();
  res.status(200).json(updatedMethod);
});

// @desc    Delete a payment method
// @route   DELETE /api/customer/payment-methods/:id
// @access  Private (Customer only)
const deletePaymentMethod = asyncHandler(async (req, res) => {
  const result = await PaymentMethod.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!result) {
    res.status(404);
    throw new Error("Payment method not found or not owned by user.");
  }
  res.status(200).json({ message: "Payment method deleted successfully." });
});

module.exports = {
  getCustomerProfile,
  updateCustomerProfile,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
