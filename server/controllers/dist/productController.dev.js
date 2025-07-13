"use strict";

// server/controllers/productController.js
var Product = require("../models/Product");

var User = require("../models/User"); // --- New: Get Product by ID ---


var getProductById = function getProductById(req, res) {
  var productId, product;
  return regeneratorRuntime.async(function getProductById$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          productId = req.params.id; // Get product ID from URL parameters

          if (productId) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Product ID is required."
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 6:
          product = _context.sent;

          if (product) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Product not found."
          }));

        case 9:
          // Optional: Add authorization check here to ensure only the owner can view/edit
          // For example, if you have user authentication middleware:
          // if (product.supplierId.toString() !== req.user.id) {
          //     return res.status(403).json({ error: 'Unauthorized access to product.' });
          // }
          res.status(200).json({
            message: "Product fetched successfully!",
            product: product
          });
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching product by ID:", _context.t0);
          res.status(500).json({
            error: "Failed to fetch product",
            details: _context.t0.message
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}; // --- New: Update Product ---


var updateProduct = function updateProduct(req, res) {
  var productId, _req$body, supplierEmail, name, category, price, quantity, availability, location, contact, imageUrl, supplierUser, product, errors;

  return regeneratorRuntime.async(function updateProduct$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          productId = req.params.id; // Get product ID from URL parameters

          _req$body = req.body, supplierEmail = _req$body.supplierId, name = _req$body.name, category = _req$body.category, price = _req$body.price, quantity = _req$body.quantity, availability = _req$body.availability, location = _req$body.location, contact = _req$body.contact, imageUrl = _req$body.imageUrl;

          if (productId) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Product ID is required for update."
          }));

        case 5:
          if (!(!supplierEmail || !name || !category || !price || !quantity || !location || !location.text || !contact || !contact.mobile || !contact.email || !contact.address)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "All product and contact fields are required."
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            email: supplierEmail
          }));

        case 9:
          supplierUser = _context2.sent;

          if (supplierUser) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: "Supplier user not found in database."
          }));

        case 12:
          if (!(supplierUser.role !== "supplier")) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(403).json({
            error: "Unauthorized: User is not a supplier."
          }));

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 16:
          product = _context2.sent;

          if (product) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: "Product not found."
          }));

        case 19:
          // Optional: Authorization check - ensure the logged-in supplier owns this product
          // if (product.supplierId.toString() !== supplierUser._id.toString()) {
          //     return res.status(403).json({ error: 'Unauthorized: You do not own this product.' });
          // }
          product.name = name;
          product.category = category;
          product.price = parseFloat(price);
          product.quantity = parseInt(quantity, 10);
          product.availability = availability;
          product.location = location;
          product.contact = contact;
          product.imageUrl = imageUrl; // Update image URL/base64

          _context2.next = 29;
          return regeneratorRuntime.awrap(product.save());

        case 29:
          // Save the updated product
          res.status(200).json({
            message: "Product updated successfully!",
            product: product
          });
          _context2.next = 39;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t0 = _context2["catch"](0);
          console.error("Error updating product:", _context2.t0);

          if (!(_context2.t0.name === "ValidationError")) {
            _context2.next = 38;
            break;
          }

          errors = Object.values(_context2.t0.errors).map(function (err) {
            return err.message;
          });
          return _context2.abrupt("return", res.status(400).json({
            error: "Validation failed",
            details: errors
          }));

        case 38:
          res.status(500).json({
            error: "Failed to update product",
            details: _context2.t0.message
          });

        case 39:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 32]]);
}; // --- Existing: Add Product ---


var addProduct = function addProduct(req, res) {
  var _req$body2, supplierEmail, name, category, price, quantity, availability, location, contact, imageUrl, description, supplierUser, newProduct, errors;

  return regeneratorRuntime.async(function addProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("Received product data:", req.body);
          _req$body2 = req.body, supplierEmail = _req$body2.supplierId, name = _req$body2.name, category = _req$body2.category, price = _req$body2.price, quantity = _req$body2.quantity, availability = _req$body2.availability, location = _req$body2.location, contact = _req$body2.contact, imageUrl = _req$body2.imageUrl, description = _req$body2.description; // Added description here

          if (!(!supplierEmail || !name || !category || !price || !quantity || !location || !location.text || !contact || !contact.mobile || !contact.email || !contact.address || !description)) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "All product and contact fields are required."
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: supplierEmail
          }));

        case 7:
          supplierUser = _context3.sent;

          if (supplierUser) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Supplier user not found in database."
          }));

        case 10:
          if (!(supplierUser.role !== "supplier")) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            error: "Unauthorized: User is not a supplier."
          }));

        case 12:
          newProduct = new Product({
            supplierId: supplierUser._id,
            name: name,
            category: category,
            price: price,
            quantity: quantity,
            availability: availability,
            location: location,
            contact: contact,
            imageUrl: imageUrl,
            description: description // Save description

          });
          _context3.next = 15;
          return regeneratorRuntime.awrap(newProduct.save());

        case 15:
          res.status(201).json({
            message: "Product added successfully!",
            product: newProduct
          });
          _context3.next = 25;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](0);
          console.error("Error adding product:", _context3.t0);

          if (!(_context3.t0.name === "ValidationError")) {
            _context3.next = 24;
            break;
          }

          errors = Object.values(_context3.t0.errors).map(function (err) {
            return err.message;
          });
          return _context3.abrupt("return", res.status(400).json({
            error: "Validation failed",
            details: errors
          }));

        case 24:
          res.status(500).json({
            error: "Failed to add product",
            details: _context3.t0.message
          });

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

module.exports = {
  addProduct: addProduct,
  getProductById: getProductById,
  updateProduct: updateProduct
}; // Export new functions