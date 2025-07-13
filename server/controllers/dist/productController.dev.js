"use strict";

// server/controllers/productController.js
var Product = require("../models/Product");

var User = require("../models/User"); // Import your User model to find supplier's _id


var addProduct = function addProduct(req, res) {
  var _req$body, supplierEmail, name, category, price, quantity, availability, location, contact, imageUrl, supplierUser, newProduct, errors;

  return regeneratorRuntime.async(function addProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Received product data:", req.body); // Log incoming data for debugging
          // Destructure all expected fields from the request body

          _req$body = req.body, supplierEmail = _req$body.supplierId, name = _req$body.name, category = _req$body.category, price = _req$body.price, quantity = _req$body.quantity, availability = _req$body.availability, location = _req$body.location, contact = _req$body.contact, imageUrl = _req$body.imageUrl; // Basic server-side validation

          if (!(!supplierEmail || !name || !category || !price || !quantity || !location || !location.text || !contact || !contact.mobile || !contact.email || !contact.address)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "All product and contact fields are required."
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: supplierEmail
          }));

        case 7:
          supplierUser = _context.sent;

          if (supplierUser) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Supplier user not found in database."
          }));

        case 10:
          if (!(supplierUser.role !== "supplier")) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(403).json({
            error: "Unauthorized: User is not a supplier."
          }));

        case 12:
          // Create a new Product instance
          newProduct = new Product({
            supplierId: supplierUser._id,
            // Store the actual MongoDB _id of the supplier
            name: name,
            category: category,
            price: price,
            quantity: quantity,
            availability: availability,
            location: location,
            contact: contact,
            imageUrl: imageUrl
          }); // Save the new product to the database

          _context.next = 15;
          return regeneratorRuntime.awrap(newProduct.save());

        case 15:
          // Respond with success message and the created product
          res.status(201).json({
            message: "Product added successfully!",
            product: newProduct
          });
          _context.next = 25;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error("Error adding product:", _context.t0); // Handle Mongoose validation errors specifically

          if (!(_context.t0.name === "ValidationError")) {
            _context.next = 24;
            break;
          }

          errors = Object.values(_context.t0.errors).map(function (err) {
            return err.message;
          });
          return _context.abrupt("return", res.status(400).json({
            error: "Validation failed",
            details: errors
          }));

        case 24:
          res.status(500).json({
            error: "Failed to add product",
            details: _context.t0.message
          });

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

module.exports = {
  addProduct: addProduct
};