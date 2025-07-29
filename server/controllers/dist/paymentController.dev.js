"use strict";

// server/controllers/paymentController.js
var PayoutMethod = require("../models/PayoutMethodModel");

var PayoutHistory = require("../models/PayoutHistoryModel"); // @desc    Get all payout methods for authenticated supplier
// @route   GET /api/supplier/payout-methods
// @access  Private (Supplier only)


exports.getPayoutMethods = function _callee(req, res) {
  var supplierId, methods;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(PayoutMethod.find({
            supplier: supplierId
          }).sort({
            createdAt: -1
          }));

        case 4:
          methods = _context.sent;
          // In a real app, you might decrypt sensitive fields before sending
          res.status(200).json(methods);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching payout methods:", _context.t0);
          res.status(500).json({
            message: "Failed to fetch payout methods",
            error: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // @desc    Add a new payout method for authenticated supplier
// @route   POST /api/supplier/payout-methods
// @access  Private (Supplier only)


exports.addPayoutMethod = function _callee2(req, res) {
  var supplierId, _req$body, type, details, _req$body$isDefault, isDefault, newMethod, existingCount;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          supplierId = req.user.id;
          _req$body = req.body, type = _req$body.type, details = _req$body.details, _req$body$isDefault = _req$body.isDefault, isDefault = _req$body$isDefault === void 0 ? false : _req$body$isDefault;

          if (!(!type || !details)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Type and details are required."
          }));

        case 5:
          if (!(type === "BANK_TRANSFER")) {
            _context2.next = 10;
            break;
          }

          if (!(!details.accountNumber || !details.ifscCode || !details.accountHolderName || !details.bankName)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Bank transfer requires Account Number, IFSC, Account Holder Name, and Bank Name."
          }));

        case 8:
          _context2.next = 16;
          break;

        case 10:
          if (!(type === "UPI")) {
            _context2.next = 15;
            break;
          }

          if (details.upiId) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "UPI requires UPI ID."
          }));

        case 13:
          _context2.next = 16;
          break;

        case 15:
          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid payout method type."
          }));

        case 16:
          newMethod = new PayoutMethod({
            supplier: supplierId,
            type: type,
            details: details,
            // Assume details are appropriately handled/encrypted before this point
            isDefault: isDefault
          }); // If setting as default, ensure previous default is unset

          if (!isDefault) {
            _context2.next = 22;
            break;
          }

          _context2.next = 20;
          return regeneratorRuntime.awrap(PayoutMethod.updateMany({
            supplier: supplierId,
            isDefault: true
          }, {
            isDefault: false
          }));

        case 20:
          _context2.next = 26;
          break;

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(PayoutMethod.countDocuments({
            supplier: supplierId
          }));

        case 24:
          existingCount = _context2.sent;

          if (existingCount === 0) {
            newMethod.isDefault = true;
          }

        case 26:
          _context2.next = 28;
          return regeneratorRuntime.awrap(newMethod.save());

        case 28:
          res.status(201).json(newMethod);
          _context2.next = 35;
          break;

        case 31:
          _context2.prev = 31;
          _context2.t0 = _context2["catch"](0);
          console.error("Error adding payout method:", _context2.t0);
          res.status(500).json({
            message: "Failed to add payout method",
            error: _context2.t0.message
          });

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 31]]);
}; // @desc    Update a payout method (e.g., set as default, update details)
// @route   PUT /api/supplier/payout-methods/:id
// @access  Private (Supplier only)


exports.updatePayoutMethod = function _callee3(req, res) {
  var methodId, supplierId, _req$body2, isDefault, details, status, method;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          methodId = req.params.id;
          supplierId = req.user.id;
          _req$body2 = req.body, isDefault = _req$body2.isDefault, details = _req$body2.details, status = _req$body2.status;
          _context3.next = 6;
          return regeneratorRuntime.awrap(PayoutMethod.findOne({
            _id: methodId,
            supplier: supplierId
          }));

        case 6:
          method = _context3.sent;

          if (method) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Payout method not found or unauthorized."
          }));

        case 9:
          if (!(typeof isDefault === "boolean")) {
            _context3.next = 14;
            break;
          }

          if (!isDefault) {
            _context3.next = 13;
            break;
          }

          _context3.next = 13;
          return regeneratorRuntime.awrap(PayoutMethod.updateMany({
            supplier: supplierId,
            isDefault: true
          }, {
            isDefault: false
          }));

        case 13:
          method.isDefault = isDefault;

        case 14:
          if (details) {
            // Update specific details fields. Be careful not to expose sensitive encrypted data during update process.
            // In a real app, you'd have specific logic for updating bank/UPI details safely.
            Object.assign(method.details, details);
          }

          if (status) {
            method.status = status;
          }

          _context3.next = 18;
          return regeneratorRuntime.awrap(method.save());

        case 18:
          res.status(200).json({
            message: "Payout method updated successfully",
            method: method
          });
          _context3.next = 25;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          console.error("Error updating payout method:", _context3.t0);
          res.status(500).json({
            message: "Failed to update payout method",
            error: _context3.t0.message
          });

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
}; // @desc    Delete a payout method
// @route   DELETE /api/supplier/payout-methods/:id
// @access  Private (Supplier only)


exports.deletePayoutMethod = function _callee4(req, res) {
  var methodId, supplierId, method;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          methodId = req.params.id;
          supplierId = req.user.id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(PayoutMethod.findOneAndDelete({
            _id: methodId,
            supplier: supplierId
          }));

        case 5:
          method = _context4.sent;

          if (method) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Payout method not found or unauthorized."
          }));

        case 8:
          res.status(200).json({
            message: "Payout method deleted successfully."
          });
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.error("Error deleting payout method:", _context4.t0);
          res.status(500).json({
            message: "Failed to delete payout method",
            error: _context4.t0.message
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // @desc    Get payout history for authenticated supplier
// @route   GET /api/supplier/payout-history
// @access  Private (Supplier only)


exports.getPayoutHistory = function _callee5(req, res) {
  var supplierId, history;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          supplierId = req.user.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(PayoutHistory.find({
            supplier: supplierId
          }).sort({
            processedAt: -1
          }));

        case 4:
          history = _context5.sent;
          res.status(200).json(history);
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error("Error fetching payout history:", _context5.t0);
          res.status(500).json({
            message: "Failed to fetch payout history",
            error: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};