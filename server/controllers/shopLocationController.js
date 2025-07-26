// server/controllers/shopLocationController.js
const ShopLocation = require("../models/ShopLocation");
const mongoose = require("mongoose");

// @desc    Get all shop locations for the authenticated supplier
// @route   GET /api/supplier/shop-locations
// @access  Private (Supplier only)
const getShopLocations = async (req, res) => {
  // CHANGED: from exports.getShopLocations to const getShopLocations
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }
  try {
    const locations = await ShopLocation.find({ supplier: req.user.id }).sort({
      createdAt: 1,
    });
    res.json(locations);
  } catch (error) {
    console.error("Error fetching shop locations:", error);
    res.status(500).json({
      message: "Failed to fetch shop locations.",
      error: error.message,
    });
  }
};

// @desc    Add a new shop location
// @route   POST /api/supplier/shop-locations
// @access  Private (Supplier only)
const addShopLocation = async (req, res) => {
  // CHANGED: from exports.addShopLocation to const addShopLocation
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }
  const { name, address, lat, lng } = req.body;

  if (!name || !address) {
    return res
      .status(400)
      .json({ message: "Shop name and address are required." });
  }

  try {
    // Check for duplicate name for this supplier
    const existingLocation = await ShopLocation.findOne({
      supplier: req.user.id,
      name,
    });
    if (existingLocation) {
      return res.status(400).json({
        message: `You already have a shop named '${name}'. Please use a unique name.`,
      });
    }

    const newLocation = new ShopLocation({
      supplier: req.user.id,
      name,
      address,
      lat,
      lng,
    });

    const createdLocation = await newLocation.save();
    res.status(201).json({
      message: "Shop location added successfully!",
      location: createdLocation,
    });
  } catch (error) {
    console.error("Error adding shop location:", error);
    res
      .status(500)
      .json({ message: "Failed to add shop location.", error: error.message });
  }
};

// @desc    Update an existing shop location
// @route   PUT /api/supplier/shop-locations/:id
// @access  Private (Supplier only)
const updateShopLocation = async (req, res) => {
  // CHANGED: from exports.updateShopLocation to const updateShopLocation
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }
  const { id } = req.params;
  const { name, address, lat, lng } = req.body;

  if (!name || !address) {
    return res
      .status(400)
      .json({ message: "Shop name and address are required." });
  }

  try {
    const locationToUpdate = await ShopLocation.findOne({
      _id: id,
      supplier: req.user.id,
    });
    if (!locationToUpdate) {
      return res
        .status(404)
        .json({ message: "Shop location not found or you do not own it." });
    }

    // Check for duplicate name if name is changed and it conflicts with another existing location
    if (name !== locationToUpdate.name) {
      const existingWithName = await ShopLocation.findOne({
        supplier: req.user.id,
        name,
      });
      if (existingWithName && existingWithName._id.toString() !== id) {
        return res.status(400).json({
          message: `Another shop with name '${name}' already exists.`,
        });
      }
    }

    locationToUpdate.name = name;
    locationToUpdate.address = address;
    locationToUpdate.lat = lat;
    locationToUpdate.lng = lng;

    const updatedLocation = await locationToUpdate.save();
    res.json({
      message: "Shop location updated successfully!",
      location: updatedLocation,
    });
  } catch (error) {
    console.error("Error updating shop location:", error);
    res.status(500).json({
      message: "Failed to update shop location.",
      error: error.message,
    });
  }
};

// @desc    Delete a shop location
// @route   DELETE /api/supplier/shop-locations/:id
// @access  Private (Supplier only)
const deleteShopLocation = async (req, res) => {
  // CHANGED: from exports.deleteShopLocation to const deleteShopLocation
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Not authorized as a supplier." });
  }
  const { id } = req.params;

  try {
    const result = await ShopLocation.findOneAndDelete({
      _id: id,
      supplier: req.user.id,
    });
    if (!result) {
      return res
        .status(404)
        .json({ message: "Shop location not found or you do not own it." });
    }
    res.json({ message: "Shop location deleted successfully!" });
  } catch (error) {
    console.error("Error deleting shop location:", error);
    res.status(500).json({
      message: "Failed to delete shop location.",
      error: error.message,
    });
  }
};

// CRITICAL: This module.exports block MUST be at the very end
module.exports = {
  getShopLocations,
  addShopLocation,
  updateShopLocation,
  deleteShopLocation,
};
