"use strict";

// server/controllers/customerProfileController.js
var User = require("../models/User");

var PaymentMethod = require("../models/PaymentMethod"); // Assuming a PaymentMethod model


var asyncHandler = require("express-async-handler"); // @desc    Get customer profile
// @route   GET /api/customer/profile
// @access  Private (Customer only)


var getCustomerProfile = asyncHandler(function _callee(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id).select("-password"));

        case 2:
          user = _context.sent;

          if (user) {
            _context.next = 6;
            break;
          }

          res.status(404);
          throw new Error("User not found.");

        case 6:
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
            role: user.role
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Update customer profile
// @route   PUT /api/customer/profile
// @access  Private (Customer only)

var updateCustomerProfile = asyncHandler(function _callee2(req, res) {
  var user, updatedUser;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          res.status(404);
          throw new Error("User not found.");

        case 6:
          // Update profile fields
          user.name = req.body.name || user.name;
          user.username = req.body.username || user.username;
          user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
          user.profilePictureUrl = req.body.profilePictureUrl || user.profilePictureUrl;
          user.address = req.body.address || user.address;
          user.location = req.body.location || user.location; // Handle password change if requested

          if (!(req.body.newPassword && req.body.currentPassword)) {
            _context2.next = 21;
            break;
          }

          _context2.next = 15;
          return regeneratorRuntime.awrap(user.matchPassword(req.body.currentPassword));

        case 15:
          if (!_context2.sent) {
            _context2.next = 19;
            break;
          }

          user.password = req.body.newPassword; // Mongoose middleware should hash this

          _context2.next = 21;
          break;

        case 19:
          res.status(401);
          throw new Error("Current password is incorrect.");

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(user.save());

        case 23:
          updatedUser = _context2.sent;
          res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            profilePictureUrl: updatedUser.profilePictureUrl,
            address: updatedUser.address,
            location: updatedUser.location,
            role: updatedUser.role
          });

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    Get customer payment methods
// @route   GET /api/customer/payment-methods
// @access  Private (Customer only)

var getPaymentMethods = asyncHandler(function _callee3(req, res) {
  var methods;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(PaymentMethod.find({
            user: req.user.id
          }));

        case 2:
          methods = _context3.sent;
          res.status(200).json(methods);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc    Add a new payment method
// @route   POST /api/customer/payment-methods
// @access  Private (Customer only)

var addPaymentMethod = asyncHandler(function _callee4(req, res) {
  var _req$body, type, details, isDefault, newMethod, createdMethod;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, type = _req$body.type, details = _req$body.details, isDefault = _req$body.isDefault;

          if (!(!type || !details)) {
            _context4.next = 4;
            break;
          }

          res.status(400);
          throw new Error("Payment method type and details are required.");

        case 4:
          if (!isDefault) {
            _context4.next = 7;
            break;
          }

          _context4.next = 7;
          return regeneratorRuntime.awrap(PaymentMethod.updateMany({
            user: req.user.id
          }, {
            isDefault: false
          }));

        case 7:
          newMethod = new PaymentMethod({
            user: req.user.id,
            type: type,
            details: details,
            isDefault: isDefault
          });
          _context4.next = 10;
          return regeneratorRuntime.awrap(newMethod.save());

        case 10:
          createdMethod = _context4.sent;
          res.status(201).json(createdMethod);

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // @desc    Update a payment method (e.g., set as default)
// @route   PUT /api/customer/payment-methods/:id
// @access  Private (Customer only)

var updatePaymentMethod = asyncHandler(function _callee5(req, res) {
  var method, updatedMethod;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(PaymentMethod.findOne({
            _id: req.params.id,
            user: req.user.id
          }));

        case 2:
          method = _context5.sent;

          if (method) {
            _context5.next = 6;
            break;
          }

          res.status(404);
          throw new Error("Payment method not found or not owned by user.");

        case 6:
          if (!req.body.isDefault) {
            _context5.next = 10;
            break;
          }

          _context5.next = 9;
          return regeneratorRuntime.awrap(PaymentMethod.updateMany({
            user: req.user.id
          }, {
            isDefault: false
          }));

        case 9:
          method.isDefault = true;

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(method.save());

        case 12:
          updatedMethod = _context5.sent;
          res.status(200).json(updatedMethod);

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // @desc    Delete a payment method
// @route   DELETE /api/customer/payment-methods/:id
// @access  Private (Customer only)

var deletePaymentMethod = asyncHandler(function _callee6(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(PaymentMethod.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
          }));

        case 2:
          result = _context6.sent;

          if (result) {
            _context6.next = 6;
            break;
          }

          res.status(404);
          throw new Error("Payment method not found or not owned by user.");

        case 6:
          res.status(200).json({
            message: "Payment method deleted successfully."
          });

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
});
module.exports = {
  getCustomerProfile: getCustomerProfile,
  updateCustomerProfile: updateCustomerProfile,
  getPaymentMethods: getPaymentMethods,
  addPaymentMethod: addPaymentMethod,
  updatePaymentMethod: updatePaymentMethod,
  deletePaymentMethod: deletePaymentMethod
};