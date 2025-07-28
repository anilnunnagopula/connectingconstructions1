"use strict";

// server/controllers/licenseController.js
var LicenseAndCertificate = require("../models/LicenseAndCertificateModel"); // Assuming your model
// @desc    Get all licenses/certificates for authenticated supplier
// @route   GET /api/supplier/license-and-certificates
// @access  Private (Supplier only)


exports.getLicenses = function _callee(req, res) {
  var supplierId, licenses;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(LicenseAndCertificate.find({
            supplier: supplierId
          }).sort({
            createdAt: -1
          }));

        case 4:
          licenses = _context.sent;
          res.status(200).json(licenses);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching licenses:", _context.t0);
          res.status(500).json({
            message: "Failed to fetch licenses",
            error: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // @desc    Add a new license/certificate
// @route   POST /api/supplier/license-and-certificates
// @access  Private (Supplier only)


exports.addLicense = function _callee2(req, res) {
  var supplierId, _req$body, name, issuingAuthority, issueDate, expiryDate, documentUrl, newLicense;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          supplierId = req.user.id;
          _req$body = req.body, name = _req$body.name, issuingAuthority = _req$body.issuingAuthority, issueDate = _req$body.issueDate, expiryDate = _req$body.expiryDate, documentUrl = _req$body.documentUrl;

          if (!(!name || !issuingAuthority || !documentUrl)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Name, Issuing Authority, and Document URL are required."
          }));

        case 5:
          newLicense = new LicenseAndCertificate({
            supplier: supplierId,
            name: name,
            issuingAuthority: issuingAuthority,
            issueDate: issueDate ? new Date(issueDate) : undefined,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            documentUrl: documentUrl
          });
          _context2.next = 8;
          return regeneratorRuntime.awrap(newLicense.save());

        case 8:
          res.status(201).json(newLicense);
          _context2.next = 17;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error("Error adding license:", _context2.t0);

          if (!(_context2.t0.name === "ValidationError")) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: _context2.t0.message
          }));

        case 16:
          res.status(500).json({
            message: "Failed to add license",
            error: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // @desc    Delete a license/certificate
// @route   DELETE /api/supplier/license-and-certificates/:id
// @access  Private (Supplier only)


exports.deleteLicense = function _callee3(req, res) {
  var licenseId, supplierId, license;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          licenseId = req.params.id;
          supplierId = req.user.id;
          _context3.next = 5;
          return regeneratorRuntime.awrap(LicenseAndCertificate.findOneAndDelete({
            _id: licenseId,
            supplier: supplierId
          }));

        case 5:
          license = _context3.sent;

          if (license) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "License not found or you do not own this license."
          }));

        case 8:
          res.status(200).json({
            message: "License deleted successfully."
          });
          _context3.next = 17;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error("Error deleting license:", _context3.t0);

          if (!(_context3.t0.name === "CastError")) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Invalid License ID format."
          }));

        case 16:
          res.status(500).json({
            message: "Failed to delete license",
            error: _context3.t0.message
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};