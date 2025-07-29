"use strict";

// server/controllers/offerController.js
var Offer = require("../models/OfferModel");

var Product = require("../models/Product"); // Needed for validation


var Category = require("../models/CategoryModel"); // Needed for validation
// @desc    Create a new offer
// @route   POST /api/supplier/offers
// @access  Private (Supplier only)


exports.createOffer = function _callee(req, res) {
  var supplierId, _req$body, name, description, type, value, startDate, endDate, applyTo, selectedProducts, selectedCategories, code, usageLimit, supplierOwnedProducts, supplierOwnedCategories, newOffer;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user.id;
          _req$body = req.body, name = _req$body.name, description = _req$body.description, type = _req$body.type, value = _req$body.value, startDate = _req$body.startDate, endDate = _req$body.endDate, applyTo = _req$body.applyTo, selectedProducts = _req$body.selectedProducts, selectedCategories = _req$body.selectedCategories, code = _req$body.code, usageLimit = _req$body.usageLimit; // Basic Validation

          if (!(!name || !type || value <= 0 || !startDate || !endDate || !applyTo)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Missing required offer fields."
          }));

        case 5:
          if (!(new Date(startDate) >= new Date(endDate))) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Start date must be before end date."
          }));

        case 7:
          if (!(applyTo === "SPECIFIC_PRODUCTS")) {
            _context.next = 17;
            break;
          }

          if (!(!selectedProducts || selectedProducts.length === 0)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Specific products must be selected."
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(Product.find({
            _id: {
              $in: selectedProducts
            },
            supplier: supplierId
          }));

        case 12:
          supplierOwnedProducts = _context.sent;

          if (!(supplierOwnedProducts.length !== selectedProducts.length)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Some selected products do not belong to you."
          }));

        case 15:
          _context.next = 25;
          break;

        case 17:
          if (!(applyTo === "SPECIFIC_CATEGORIES")) {
            _context.next = 25;
            break;
          }

          if (!(!selectedCategories || selectedCategories.length === 0)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Specific categories must be selected."
          }));

        case 20:
          _context.next = 22;
          return regeneratorRuntime.awrap(Category.find({
            _id: {
              $in: selectedCategories
            },
            supplier: supplierId
          }));

        case 22:
          supplierOwnedCategories = _context.sent;

          if (!(supplierOwnedCategories.length !== selectedCategories.length)) {
            _context.next = 25;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Some selected categories do not belong to you."
          }));

        case 25:
          newOffer = new Offer({
            supplier: supplierId,
            name: name,
            description: description,
            type: type,
            value: value,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            applyTo: applyTo,
            selectedProducts: applyTo === "SPECIFIC_PRODUCTS" ? selectedProducts : [],
            selectedCategories: applyTo === "SPECIFIC_CATEGORIES" ? selectedCategories : [],
            code: code,
            usageLimit: usageLimit,
            status: new Date(startDate) > Date.now() ? "Scheduled" : "Active" // Set initial status

          });
          _context.next = 28;
          return regeneratorRuntime.awrap(newOffer.save());

        case 28:
          res.status(201).json(newOffer);
          _context.next = 37;
          break;

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](0);
          console.error("Error creating offer:", _context.t0);

          if (!(_context.t0.code === 11000)) {
            _context.next = 36;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Offer code already exists. Please choose another."
          }));

        case 36:
          res.status(500).json({
            message: "Failed to create offer",
            error: _context.t0.message
          });

        case 37:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 31]]);
}; // --- NEW: Get a single offer by ID (for supplier to edit/view details) ---
// @desc    Get a single offer by ID
// @route   GET /api/supplier/offers/:id
// @access  Private (Supplier only, ensures they own the offer)


exports.getOfferById = function _callee2(req, res) {
  var offerId, supplierId, offer;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          offerId = req.params.id;
          supplierId = req.user.id;

          if (offerId) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Offer ID is required."
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(Offer.findOne({
            _id: offerId,
            supplier: supplierId
          }).populate('selectedProducts', 'name').populate('selectedCategories', 'name'));

        case 7:
          offer = _context2.sent;

          if (offer) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Offer not found or you do not own this offer."
          }));

        case 10:
          res.status(200).json(offer);
          _context2.next = 19;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching offer by ID:", _context2.t0);

          if (!(_context2.t0.name === 'CastError')) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid Offer ID format."
          }));

        case 18:
          res.status(500).json({
            message: "Failed to fetch offer",
            error: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // @desc    Get all offers for authenticated supplier
// @route   GET /api/supplier/offers
// @access  Private (Supplier only)


exports.getOffers = function _callee3(req, res) {
  var supplierId, offers;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          supplierId = req.user.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Offer.find({
            supplier: supplierId
          }).sort({
            createdAt: -1
          }));

        case 4:
          offers = _context3.sent;
          // <--- THIS LINE NEEDS TO BE MODIFIED
          res.status(200).json(offers);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error("Error fetching offers:", _context3.t0);
          res.status(500).json({
            message: "Failed to fetch offers",
            error: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // @desc    Update an offer
// @route   PUT /api/supplier/offers/:id
// @access  Private (Supplier only)


exports.updateOffer = function _callee4(req, res) {
  var offerId, supplierId, offer;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          offerId = req.params.id;
          supplierId = req.user.id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Offer.findOneAndUpdate({
            _id: offerId,
            supplier: supplierId
          }, req.body, // Update with new data from req.body
          {
            "new": true,
            runValidators: true
          }));

        case 5:
          offer = _context4.sent;

          if (offer) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Offer not found or unauthorized."
          }));

        case 8:
          res.status(200).json(offer);
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.error("Error updating offer:", _context4.t0);
          res.status(500).json({
            message: "Failed to update offer",
            error: _context4.t0.message
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // @desc    Delete an offer
// @route   DELETE /api/supplier/offers/:id
// @access  Private (Supplier only)


exports.deleteOffer = function _callee5(req, res) {
  var offerId, supplierId, offer;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          offerId = req.params.id;
          supplierId = req.user.id;
          _context5.next = 5;
          return regeneratorRuntime.awrap(Offer.findOneAndDelete({
            _id: offerId,
            supplier: supplierId
          }));

        case 5:
          offer = _context5.sent;

          if (offer) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "Offer not found or unauthorized."
          }));

        case 8:
          res.status(200).json({
            message: "Offer deleted successfully."
          });
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error("Error deleting offer:", _context5.t0);
          res.status(500).json({
            message: "Failed to delete offer",
            error: _context5.t0.message
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
};