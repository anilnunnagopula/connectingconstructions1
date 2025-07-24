"use strict";

// server/controllers/productController.js
var Product = require("../models/Product");

var User = require("../models/User"); // To ensure the supplier exists and potentially get their details
// --- Helper for input validation (can be shared or put in utils) ---


var validateProductInput = function validateProductInput(data) {
  var name = data.name,
      category = data.category,
      price = data.price,
      quantity = data.quantity,
      location = data.location,
      contact = data.contact,
      description = data.description;

  if (!name || !category || !price || !quantity || !location || !location.text || !contact || !contact.mobile || !contact.email || !contact.address || !description) {
    throw new Error("All product and contact fields are required.");
  }

  if (isNaN(price) || parseFloat(price) < 0) {
    throw new Error("Price must be a non-negative number.");
  }

  if (isNaN(quantity) || parseInt(quantity, 10) < 0) {
    throw new Error("Quantity must be a non-negative integer.");
  }
}; // @desc    Add a new product
// @route   POST /api/supplier/products
// @access  Private (Supplier only)


var addProduct = function addProduct(req, res) {
  var supplierId, supplierEmail, supplierName, _req$body, name, category, price, quantity, availability, location, contact, imageUrls, description, existingProduct, newProduct, errors;

  return regeneratorRuntime.async(function addProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // req.user is populated by the 'protect' middleware and 'authorizeRoles("supplier")'
          // ensures only suppliers can reach this point.
          supplierId = req.user.id; // Get supplier's _id directly from authenticated user

          supplierEmail = req.user.email; // Get supplier's email (useful for contact info)

          supplierName = req.user.name; // Get supplier's name (useful for context)

          console.log("Adding product for supplier:", supplierId, supplierEmail);
          _req$body = req.body, name = _req$body.name, category = _req$body.category, price = _req$body.price, quantity = _req$body.quantity, availability = _req$body.availability, location = _req$body.location, contact = _req$body.contact, imageUrls = _req$body.imageUrls, description = _req$body.description; // Use the new validation helper

          validateProductInput(req.body); // Check for duplicate product name for this specific supplier

          _context.next = 9;
          return regeneratorRuntime.awrap(Product.findOne({
            name: name,
            supplier: supplierId
          }));

        case 9:
          existingProduct = _context.sent;

          if (!existingProduct) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "You already have a product with this name."
          }));

        case 12:
          newProduct = new Product({
            supplier: supplierId,
            // Use the authenticated supplier's _id
            name: name,
            category: category,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            availability: availability !== undefined ? availability : true,
            // Default to true if not provided
            location: location,
            contact: contact,
            imageUrls: imageUrls || [],
            // Ensure it's an array
            description: description
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(newProduct.save());

        case 15:
          res.status(201).json({
            message: "Product added successfully!",
            product: newProduct
          });
          _context.next = 27;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error("Error adding product:", _context.t0);

          if (!(_context.t0.message.includes("required") || _context.t0.message.includes("number"))) {
            _context.next = 23;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: _context.t0.message
          }));

        case 23:
          if (!(_context.t0.name === "ValidationError")) {
            _context.next = 26;
            break;
          }

          errors = Object.values(_context.t0.errors).map(function (err) {
            return err.message;
          });
          return _context.abrupt("return", res.status(400).json({
            error: "Validation failed",
            details: errors
          }));

        case 26:
          res.status(500).json({
            error: "Failed to add product",
            details: _context.t0.message
          });

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
}; // @desc    Get a single product by ID (for supplier to view their own product)
// @route   GET /api/supplier/myproducts/:id
// @access  Private (Supplier only, ensures they own the product)


var getSupplierProductById = function getSupplierProductById(req, res) {
  var productId, supplierId, product;
  return regeneratorRuntime.async(function getSupplierProductById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          productId = req.params.id;
          supplierId = req.user.id; // From authenticated user

          if (productId) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Product ID is required."
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(Product.findOne({
            _id: productId,
            supplier: supplierId
          }));

        case 7:
          product = _context2.sent;

          if (product) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: "Product not found or you do not own this product."
          }));

        case 10:
          res.status(200).json({
            message: "Product fetched successfully!",
            product: product
          });
          _context2.next = 19;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching supplier's product by ID:", _context2.t0);

          if (!(_context2.t0.name === "CastError")) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Invalid product ID format."
          }));

        case 18:
          res.status(500).json({
            error: "Failed to fetch product",
            details: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // @desc    Update an existing product (supplier's own product)
// @route   PUT /api/supplier/myproducts/:id
// @access  Private (Supplier only, ensures they own the product)


var updateProduct = function updateProduct(req, res) {
  var productId, supplierId, product, _req$body2, name, category, price, quantity, availability, location, contact, imageUrls, description, errors;

  return regeneratorRuntime.async(function updateProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          productId = req.params.id;
          supplierId = req.user.id; // From authenticated user

          if (productId) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Product ID is required for update."
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(Product.findOne({
            _id: productId,
            supplier: supplierId
          }));

        case 7:
          product = _context3.sent;

          if (product) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Product not found or you do not own this product."
          }));

        case 10:
          // Validate incoming data for updates (only if fields are present)
          // If a field is not provided, it won't be updated
          _req$body2 = req.body, name = _req$body2.name, category = _req$body2.category, price = _req$body2.price, quantity = _req$body2.quantity, availability = _req$body2.availability, location = _req$body2.location, contact = _req$body2.contact, imageUrls = _req$body2.imageUrls, description = _req$body2.description;
          if (name !== undefined) product.name = name;
          if (category !== undefined) product.category = category;
          if (price !== undefined) product.price = parseFloat(price);
          if (quantity !== undefined) product.quantity = parseInt(quantity, 10);
          if (availability !== undefined) product.availability = availability;
          if (location !== undefined) product.location = location;
          if (contact !== undefined) product.contact = contact;
          if (imageUrls !== undefined) product.imageUrls = imageUrls;
          if (description !== undefined) product.description = description; // Optional: Re-validate the whole product if you modify parts of it
          // product.markModified('location'); // Needed if location subdocument is modified directly
          // product.markModified('contact'); // Needed if contact subdocument is modified directly

          _context3.next = 22;
          return regeneratorRuntime.awrap(product.save());

        case 22:
          // Save the updated product
          res.status(200).json({
            message: "Product updated successfully!",
            product: product
          });
          _context3.next = 34;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](0);
          console.error("Error updating product:", _context3.t0);

          if (!(_context3.t0.name === "CastError")) {
            _context3.next = 30;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Invalid product ID format."
          }));

        case 30:
          if (!(_context3.t0.name === "ValidationError")) {
            _context3.next = 33;
            break;
          }

          errors = Object.values(_context3.t0.errors).map(function (err) {
            return err.message;
          });
          return _context3.abrupt("return", res.status(400).json({
            error: "Validation failed",
            details: errors
          }));

        case 33:
          res.status(500).json({
            error: "Failed to update product",
            details: _context3.t0.message
          });

        case 34:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 25]]);
}; // @desc    Delete a product (supplier's own product)
// @route   DELETE /api/supplier/myproducts/:id
// @access  Private (Supplier only, ensures they own the product)


var deleteProduct = function deleteProduct(req, res) {
  var productId, supplierId, product;
  return regeneratorRuntime.async(function deleteProduct$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          productId = req.params.id;
          supplierId = req.user.id; // From authenticated user

          if (productId) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: "Product ID is required for deletion."
          }));

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(Product.findOneAndDelete({
            _id: productId,
            supplier: supplierId
          }));

        case 7:
          product = _context4.sent;

          if (product) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "Product not found or you do not own this product."
          }));

        case 10:
          res.status(200).json({
            message: "Product removed successfully!"
          });
          _context4.next = 19;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error("Error deleting product:", _context4.t0);

          if (!(_context4.t0.name === "CastError")) {
            _context4.next = 18;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: "Invalid product ID format."
          }));

        case 18:
          res.status(500).json({
            error: "Failed to delete product",
            details: _context4.t0.message
          });

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // @desc    Get all products for the authenticated supplier (My Products)
// @route   GET /api/supplier/myproducts
// @access  Private (Supplier only)


var getMyProducts = function getMyProducts(req, res) {
  var supplierId, products;
  return regeneratorRuntime.async(function getMyProducts$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          supplierId = req.user.id; // Get supplier's _id directly from authenticated user

          _context5.next = 4;
          return regeneratorRuntime.awrap(Product.find({
            supplier: supplierId
          }));

        case 4:
          products = _context5.sent;
          res.status(200).json(products);
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error("Error fetching supplier's products:", _context5.t0);
          res.status(500).json({
            error: "Failed to fetch products.",
            details: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // --- NEW: Get ALL products (public, for customer Browse) ---
// @desc    Get all products (publicly visible)
// @route   GET /api/products (or a separate public API route)
// @access  Public


var getAllProductsPublic = function getAllProductsPublic(req, res) {
  var products;
  return regeneratorRuntime.async(function getAllProductsPublic$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Product.find({}));

        case 3:
          products = _context6.sent;
          res.status(200).json(products);
          _context6.next = 11;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.error("Error fetching all public products:", _context6.t0);
          res.status(500).json({
            error: "Failed to fetch products.",
            details: _context6.t0.message
          });

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // --- NEW: Get single product by ID (public, for customer Browse) ---
// @desc    Get a single product by ID (publicly visible)
// @route   GET /api/products/:id
// @access  Public


var getProductByIdPublic = function getProductByIdPublic(req, res) {
  var productId, product;
  return regeneratorRuntime.async(function getProductByIdPublic$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          productId = req.params.id;

          if (productId) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: "Product ID is required."
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(Product.findById(productId).populate("supplier", "name email phoneNumber location.text"));

        case 6:
          product = _context7.sent;

          if (product) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: "Product not found."
          }));

        case 9:
          res.status(200).json(product);
          _context7.next = 18;
          break;

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          console.error("Error fetching public product by ID:", _context7.t0);

          if (!(_context7.t0.name === "CastError")) {
            _context7.next = 17;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: "Invalid product ID format."
          }));

        case 17:
          res.status(500).json({
            error: "Failed to fetch product.",
            details: _context7.t0.message
          });

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  addProduct: addProduct,
  getSupplierProductById: getSupplierProductById,
  // Renamed for clarity in exports
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getMyProducts: getMyProducts,
  getAllProductsPublic: getAllProductsPublic,
  // Export new public function
  getProductByIdPublic: getProductByIdPublic // Export new public function

};