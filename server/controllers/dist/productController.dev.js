"use strict";

// server/controllers/productController.js
var Product = require("../models/Product");

var User = require("../models/User");

var json2csv = require("json2csv").parse;

var _require = require("../utils/queryHelpers"),
    applyLean = _require.applyLean,
    buildBaseQuery = _require.buildBaseQuery,
    paginate = _require.paginate,
    getPaginationMeta = _require.getPaginationMeta; // ===== HELPER FUNCTIONS =====


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
}; // ===== SUPPLIER ROUTES (Protected) =====

/**
 * @desc    Add a new product
 * @route   POST /api/supplier/products
 * @access  Private (Supplier only)
 */


var addProduct = function addProduct(req, res) {
  var supplierId, supplierEmail, supplierName, _req$body, name, category, price, quantity, availability, location, contact, imageUrls, description, existingProduct, newProduct, errors;

  return regeneratorRuntime.async(function addProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user._id;
          supplierEmail = req.user.email;
          supplierName = req.user.name;
          console.log("📦 Adding product for supplier:", supplierId, supplierEmail);
          _req$body = req.body, name = _req$body.name, category = _req$body.category, price = _req$body.price, quantity = _req$body.quantity, availability = _req$body.availability, location = _req$body.location, contact = _req$body.contact, imageUrls = _req$body.imageUrls, description = _req$body.description; // Validate input

          validateProductInput(req.body); // Check for duplicate product name for this supplier

          _context.next = 9;
          return regeneratorRuntime.awrap(Product.findOne({
            name: name,
            supplier: supplierId,
            isDeleted: false // ✨ Only check active products

          }));

        case 9:
          existingProduct = _context.sent;

          if (!existingProduct) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            error: "You already have a product with this name."
          }));

        case 12:
          newProduct = new Product({
            supplier: supplierId,
            name: name,
            category: category,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            availability: availability !== undefined ? availability : true,
            location: location,
            contact: contact,
            imageUrls: imageUrls || [],
            description: description
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(newProduct.save());

        case 15:
          console.log("✅ Product added:", newProduct._id);
          res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: newProduct
          });
          _context.next = 28;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error adding product:", _context.t0);

          if (!(_context.t0.message.includes("required") || _context.t0.message.includes("number"))) {
            _context.next = 24;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            error: _context.t0.message
          }));

        case 24:
          if (!(_context.t0.name === "ValidationError")) {
            _context.next = 27;
            break;
          }

          errors = Object.values(_context.t0.errors).map(function (err) {
            return err.message;
          });
          return _context.abrupt("return", res.status(400).json({
            success: false,
            error: "Validation failed",
            details: errors
          }));

        case 27:
          res.status(500).json({
            success: false,
            error: "Failed to add product",
            details: _context.t0.message
          });

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
};
/**
 * @desc    Get a single product by ID (supplier's own)
 * @route   GET /api/supplier/myproducts/:id
 * @access  Private (Supplier only)
 */


var getProductById = function getProductById(req, res) {
  var productId, supplierId, product;
  return regeneratorRuntime.async(function getProductById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          productId = req.params.id;
          supplierId = req.user._id;

          if (productId) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            error: "Product ID is required."
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(Product.findOne({
            _id: productId,
            supplier: supplierId,
            isDeleted: false // ✨ Exclude deleted

          }).lean());

        case 7:
          product = _context2.sent;

          if (product) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            error: "Product not found or you do not own this product."
          }));

        case 10:
          res.status(200).json(product);
          _context2.next = 19;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Error fetching supplier's product by ID:", _context2.t0);

          if (!(_context2.t0.name === "CastError")) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            error: "Invalid product ID format."
          }));

        case 18:
          res.status(500).json({
            success: false,
            error: "Failed to fetch product",
            details: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};
/**
 * @desc    Update an existing product
 * @route   PUT /api/supplier/myproducts/:id
 * @access  Private (Supplier only)
 */


var updateProduct = function updateProduct(req, res) {
  var productId, supplierId, product, _req$body2, name, category, price, quantity, availability, location, contact, imageUrls, description, errors;

  return regeneratorRuntime.async(function updateProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          productId = req.params.id;
          supplierId = req.user._id;

          if (productId) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            error: "Product ID is required for update."
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(Product.findOne({
            _id: productId,
            supplier: supplierId,
            isDeleted: false // ✨ Can't update deleted products

          }));

        case 7:
          product = _context3.sent;

          if (product) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            success: false,
            error: "Product not found or you do not own this product."
          }));

        case 10:
          // Update fields
          _req$body2 = req.body, name = _req$body2.name, category = _req$body2.category, price = _req$body2.price, quantity = _req$body2.quantity, availability = _req$body2.availability, location = _req$body2.location, contact = _req$body2.contact, imageUrls = _req$body2.imageUrls, description = _req$body2.description;
          if (name !== undefined) product.name = name;
          if (category !== undefined) product.category = category;
          if (price !== undefined) product.price = parseFloat(price);
          if (quantity !== undefined) product.quantity = parseInt(quantity, 10);
          if (availability !== undefined) product.availability = availability;
          if (location !== undefined) product.location = location;
          if (contact !== undefined) product.contact = contact;
          if (imageUrls !== undefined) product.imageUrls = imageUrls;
          if (description !== undefined) product.description = description;
          _context3.next = 22;
          return regeneratorRuntime.awrap(product.save());

        case 22:
          console.log("✅ Product updated:", product._id);
          res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product: product
          });
          _context3.next = 35;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Error updating product:", _context3.t0);

          if (!(_context3.t0.name === "CastError")) {
            _context3.next = 31;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            success: false,
            error: "Invalid product ID format."
          }));

        case 31:
          if (!(_context3.t0.name === "ValidationError")) {
            _context3.next = 34;
            break;
          }

          errors = Object.values(_context3.t0.errors).map(function (err) {
            return err.message;
          });
          return _context3.abrupt("return", res.status(400).json({
            success: false,
            error: "Validation failed",
            details: errors
          }));

        case 34:
          res.status(500).json({
            success: false,
            error: "Failed to update product",
            details: _context3.t0.message
          });

        case 35:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 26]]);
};
/**
 * @desc    Delete a product (soft delete)
 * @route   DELETE /api/supplier/myproducts/:id
 * @access  Private (Supplier only)
 */


var deleteProduct = function deleteProduct(req, res) {
  var productId, supplierId, product;
  return regeneratorRuntime.async(function deleteProduct$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          productId = req.params.id;
          supplierId = req.user._id;

          if (productId) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            error: "Product ID is required for deletion."
          }));

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(Product.findOne({
            _id: productId,
            supplier: supplierId,
            isDeleted: false
          }));

        case 7:
          product = _context4.sent;

          if (product) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            error: "Product not found or you do not own this product."
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(product.softDelete());

        case 12:
          console.log("🗑️  Product soft-deleted:", product._id);
          res.status(200).json({
            success: true,
            message: "Product removed successfully!"
          });
          _context4.next = 22;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Error deleting product:", _context4.t0);

          if (!(_context4.t0.name === "CastError")) {
            _context4.next = 21;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            error: "Invalid product ID format."
          }));

        case 21:
          res.status(500).json({
            success: false,
            error: "Failed to delete product",
            details: _context4.t0.message
          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
};
/**
 * @desc    Get all products for authenticated supplier
 * @route   GET /api/supplier/myproducts
 * @access  Private (Supplier only)
 */


var getMyProducts = function getMyProducts(req, res) {
  var supplierId, products;
  return regeneratorRuntime.async(function getMyProducts$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          supplierId = req.user._id; // ✨ Use lean() for performance + exclude deleted

          _context5.next = 4;
          return regeneratorRuntime.awrap(Product.find({
            supplier: supplierId,
            isDeleted: false
          }).sort({
            createdAt: -1
          }).lean());

        case 4:
          products = _context5.sent;
          res.status(200).json({
            success: true,
            count: products.length,
            data: products
          });
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error("❌ Error fetching supplier's products:", _context5.t0);
          res.status(500).json({
            success: false,
            error: "Failed to fetch products.",
            details: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};
/**
 * @desc    Export products to CSV
 * @route   GET /api/supplier/products/export-csv
 * @access  Private (Supplier only)
 */


var exportProductsToCSV = function exportProductsToCSV(req, res) {
  var supplierId, products, fields, csv;
  return regeneratorRuntime.async(function exportProductsToCSV$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          supplierId = req.user._id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Product.find({
            supplier: supplierId,
            isDeleted: false // ✨ Only export active products

          }).select("-__v -supplier").lean());

        case 4:
          products = _context6.sent;

          if (!(!products || products.length === 0)) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            success: false,
            message: "No products found to export."
          }));

        case 7:
          fields = [{
            label: "Product ID",
            value: "_id"
          }, {
            label: "Name",
            value: "name"
          }, {
            label: "Category",
            value: "category"
          }, {
            label: "Description",
            value: "description"
          }, {
            label: "Price",
            value: "price"
          }, {
            label: "Quantity",
            value: "quantity"
          }, {
            label: "Availability",
            value: "availability"
          }, {
            label: "Location Text",
            value: "location.text"
          }, {
            label: "Location Lat",
            value: "location.lat"
          }, {
            label: "Location Lng",
            value: "location.lng"
          }, {
            label: "Contact Mobile",
            value: "contact.mobile"
          }, {
            label: "Contact Email",
            value: "contact.email"
          }, {
            label: "Contact Address",
            value: "contact.address"
          }, {
            label: "Created At",
            value: "createdAt"
          }];
          csv = json2csv(products, {
            fields: fields
          });
          res.header("Content-Type", "text/csv");
          res.attachment("my_products.csv");
          res.send(csv);
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          console.error("❌ Error exporting products to CSV:", _context6.t0);
          res.status(500).json({
            success: false,
            message: "Failed to export products to CSV",
            error: _context6.t0.message
          });

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // ===== PUBLIC ROUTES =====

/**
 * @desc    Get all products (public with pagination & filters)
 * @route   GET /api/products
 * @access  Public
 */


var getAllProductsPublic = function getAllProductsPublic(req, res) {
  var _req$query, category, minPrice, maxPrice, search, _req$query$page, page, _req$query$limit, limit, _req$query$sortBy, sortBy, _req$query$order, order, filters, sort, query, paginatedQuery, products, pagination;

  return regeneratorRuntime.async(function getAllProductsPublic$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$query = req.query, category = _req$query.category, minPrice = _req$query.minPrice, maxPrice = _req$query.maxPrice, search = _req$query.search, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 20 : _req$query$limit, _req$query$sortBy = _req$query.sortBy, sortBy = _req$query$sortBy === void 0 ? "createdAt" : _req$query$sortBy, _req$query$order = _req$query.order, order = _req$query$order === void 0 ? "desc" : _req$query$order; // Build query filters

          filters = buildBaseQuery(); // { isDeleted: false }
          // Category filter

          if (category) {
            filters.category = category;
          } // Price range filter


          if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = parseFloat(minPrice);
            if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
          } // Search filter (text search on name and description)


          if (search) {
            filters.$text = {
              $search: search
            };
          } // Only show available products


          filters.availability = true;
          filters.quantity = {
            $gt: 0
          }; // Build sort

          sort = {};
          sort[sortBy] = order === "asc" ? 1 : -1; // Execute query with pagination and lean()

          query = Product.find(filters).populate("supplier", "name username profilePictureUrl").sort(sort).select("-__v");
          paginatedQuery = paginate(query, parseInt(page), parseInt(limit));
          _context7.next = 14;
          return regeneratorRuntime.awrap(applyLean(paginatedQuery));

        case 14:
          products = _context7.sent;
          _context7.next = 17;
          return regeneratorRuntime.awrap(getPaginationMeta(Product, filters, parseInt(page), parseInt(limit)));

        case 17:
          pagination = _context7.sent;
          res.status(200).json({
            success: true,
            data: products,
            pagination: pagination
          });
          _context7.next = 25;
          break;

        case 21:
          _context7.prev = 21;
          _context7.t0 = _context7["catch"](0);
          console.error("❌ Error fetching all public products:", _context7.t0);
          res.status(500).json({
            success: false,
            error: "Failed to fetch products.",
            details: _context7.t0.message
          });

        case 25:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 21]]);
};
/**
 * @desc    Get single product by ID (public)
 * @route   GET /api/products/:id
 * @access  Public
 */


var getProductByIdPublic = function getProductByIdPublic(req, res) {
  var productId, product;
  return regeneratorRuntime.async(function getProductByIdPublic$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          productId = req.params.id;

          if (productId) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            success: false,
            error: "Product ID is required."
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(Product.findOne({
            _id: productId,
            isDeleted: false
          }).populate("supplier", "name username email phoneNumber location.text profilePictureUrl").lean());

        case 6:
          product = _context8.sent;

          if (product) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            success: false,
            error: "Product not found."
          }));

        case 9:
          res.status(200).json({
            success: true,
            data: product
          });
          _context8.next = 18;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          console.error("❌ Error fetching public product by ID:", _context8.t0);

          if (!(_context8.t0.name === "CastError")) {
            _context8.next = 17;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            success: false,
            error: "Invalid product ID format."
          }));

        case 17:
          res.status(500).json({
            success: false,
            error: "Failed to fetch product.",
            details: _context8.t0.message
          });

        case 18:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  addProduct: addProduct,
  getProductById: getProductById,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getMyProducts: getMyProducts,
  getAllProductsPublic: getAllProductsPublic,
  getProductByIdPublic: getProductByIdPublic,
  exportProductsToCSV: exportProductsToCSV
};