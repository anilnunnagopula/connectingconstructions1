"use strict";

// server/controllers/shopLocationController.js
var ShopLocation = require("../models/ShopLocation");

var mongoose = require("mongoose"); // @desc    Get all shop locations for the authenticated supplier
// @route   GET /api/supplier/shop-locations
// @access  Private (Supplier only)


var getShopLocations = function getShopLocations(req, res) {
  var locations;
  return regeneratorRuntime.async(function getShopLocations$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.user.role !== "supplier")) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", res.status(403).json({
            message: "Not authorized as a supplier."
          }));

        case 2:
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(ShopLocation.find({
            supplier: req.user.id
          }).sort({
            createdAt: 1
          }));

        case 5:
          locations = _context.sent;
          res.json(locations);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          console.error("Error fetching shop locations:", _context.t0);
          res.status(500).json({
            message: "Failed to fetch shop locations.",
            error: _context.t0.message
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9]]);
}; // @desc    Add a new shop location
// @route   POST /api/supplier/shop-locations
// @access  Private (Supplier only)


var addShopLocation = function addShopLocation(req, res) {
  var _req$body, name, address, lat, lng, existingLocation, newLocation, createdLocation;

  return regeneratorRuntime.async(function addShopLocation$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(req.user.role !== "supplier")) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            message: "Not authorized as a supplier."
          }));

        case 2:
          _req$body = req.body, name = _req$body.name, address = _req$body.address, lat = _req$body.lat, lng = _req$body.lng;

          if (!(!name || !address)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Shop name and address are required."
          }));

        case 5:
          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(ShopLocation.findOne({
            supplier: req.user.id,
            name: name
          }));

        case 8:
          existingLocation = _context2.sent;

          if (!existingLocation) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "You already have a shop named '".concat(name, "'. Please use a unique name.")
          }));

        case 11:
          newLocation = new ShopLocation({
            supplier: req.user.id,
            name: name,
            address: address,
            lat: lat,
            lng: lng
          });
          _context2.next = 14;
          return regeneratorRuntime.awrap(newLocation.save());

        case 14:
          createdLocation = _context2.sent;
          res.status(201).json({
            message: "Shop location added successfully!",
            location: createdLocation
          });
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](5);
          console.error("Error adding shop location:", _context2.t0);
          res.status(500).json({
            message: "Failed to add shop location.",
            error: _context2.t0.message
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 18]]);
}; // @desc    Update an existing shop location
// @route   PUT /api/supplier/shop-locations/:id
// @access  Private (Supplier only)


var updateShopLocation = function updateShopLocation(req, res) {
  var id, _req$body2, name, address, lat, lng, locationToUpdate, existingWithName, updatedLocation;

  return regeneratorRuntime.async(function updateShopLocation$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(req.user.role !== "supplier")) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            message: "Not authorized as a supplier."
          }));

        case 2:
          id = req.params.id;
          _req$body2 = req.body, name = _req$body2.name, address = _req$body2.address, lat = _req$body2.lat, lng = _req$body2.lng;

          if (!(!name || !address)) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Shop name and address are required."
          }));

        case 6:
          _context3.prev = 6;
          _context3.next = 9;
          return regeneratorRuntime.awrap(ShopLocation.findOne({
            _id: id,
            supplier: req.user.id
          }));

        case 9:
          locationToUpdate = _context3.sent;

          if (locationToUpdate) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Shop location not found or you do not own it."
          }));

        case 12:
          if (!(name !== locationToUpdate.name)) {
            _context3.next = 18;
            break;
          }

          _context3.next = 15;
          return regeneratorRuntime.awrap(ShopLocation.findOne({
            supplier: req.user.id,
            name: name
          }));

        case 15:
          existingWithName = _context3.sent;

          if (!(existingWithName && existingWithName._id.toString() !== id)) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Another shop with name '".concat(name, "' already exists.")
          }));

        case 18:
          locationToUpdate.name = name;
          locationToUpdate.address = address;
          locationToUpdate.lat = lat;
          locationToUpdate.lng = lng;
          _context3.next = 24;
          return regeneratorRuntime.awrap(locationToUpdate.save());

        case 24:
          updatedLocation = _context3.sent;
          res.json({
            message: "Shop location updated successfully!",
            location: updatedLocation
          });
          _context3.next = 32;
          break;

        case 28:
          _context3.prev = 28;
          _context3.t0 = _context3["catch"](6);
          console.error("Error updating shop location:", _context3.t0);
          res.status(500).json({
            message: "Failed to update shop location.",
            error: _context3.t0.message
          });

        case 32:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[6, 28]]);
}; // @desc    Delete a shop location
// @route   DELETE /api/supplier/shop-locations/:id
// @access  Private (Supplier only)


var deleteShopLocation = function deleteShopLocation(req, res) {
  var id, result;
  return regeneratorRuntime.async(function deleteShopLocation$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.user.role !== "supplier")) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.status(403).json({
            message: "Not authorized as a supplier."
          }));

        case 2:
          id = req.params.id;
          _context4.prev = 3;
          _context4.next = 6;
          return regeneratorRuntime.awrap(ShopLocation.findOneAndDelete({
            _id: id,
            supplier: req.user.id
          }));

        case 6:
          result = _context4.sent;

          if (result) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Shop location not found or you do not own it."
          }));

        case 9:
          res.json({
            message: "Shop location deleted successfully!"
          });
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](3);
          console.error("Error deleting shop location:", _context4.t0);
          res.status(500).json({
            message: "Failed to delete shop location.",
            error: _context4.t0.message
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 12]]);
}; // CRITICAL: This module.exports block MUST be at the very end


module.exports = {
  getShopLocations: getShopLocations,
  addShopLocation: addShopLocation,
  updateShopLocation: updateShopLocation,
  deleteShopLocation: deleteShopLocation
};