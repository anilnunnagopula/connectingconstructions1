"use strict";

// server/controllers/categoryController.js
var Category = require("../models/CategoryModel"); // Assuming you have a Mongoose Category model
// @desc    Get all categories for authenticated supplier
// @route   GET /api/supplier/categories
// @access  Private (Supplier only)


exports.getCategories = function _callee(req, res) {
  var supplierId, categories;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          supplierId = req.user.id; // From 'protect' middleware

          _context.next = 4;
          return regeneratorRuntime.awrap(Category.find({
            supplier: supplierId
          }));

        case 4:
          categories = _context.sent;
          res.status(200).json(categories);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching categories:", _context.t0);
          res.status(500).json({
            message: "Failed to fetch categories",
            error: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // @desc    Add a new category
// @route   POST /api/supplier/categories
// @access  Private (Supplier only)


exports.addCategory = function _callee2(req, res) {
  var supplierId, name, existingCategory, newCategory;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          supplierId = req.user.id;
          name = req.body.name;

          if (name) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Category name is required."
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(Category.findOne({
            name: name,
            supplier: supplierId
          }));

        case 7:
          existingCategory = _context2.sent;

          if (!existingCategory) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(409).json({
            message: "Category with this name already exists for this supplier."
          }));

        case 10:
          newCategory = new Category({
            name: name,
            supplier: supplierId
          });
          _context2.next = 13;
          return regeneratorRuntime.awrap(newCategory.save());

        case 13:
          res.status(201).json(newCategory);
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.error("Error adding category:", _context2.t0);
          res.status(500).json({
            message: "Failed to add category",
            error: _context2.t0.message
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // @desc    Update a category
// @route   PUT /api/supplier/categories/:id
// @access  Private (Supplier only)


exports.updateCategory = function _callee3(req, res) {
  var categoryId, supplierId, name, category;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          categoryId = req.params.id;
          supplierId = req.user.id;
          name = req.body.name;

          if (name) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Category name is required."
          }));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(Category.findOneAndUpdate({
            _id: categoryId,
            supplier: supplierId
          }, {
            name: name
          }, {
            "new": true,
            runValidators: true
          } // Return updated doc, run schema validators
          ));

        case 8:
          category = _context3.sent;

          if (category) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Category not found or you do not own it."
          }));

        case 11:
          res.status(200).json(category);
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error("Error updating category:", _context3.t0);
          res.status(500).json({
            message: "Failed to update category",
            error: _context3.t0.message
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // @desc    Delete a category
// @route   DELETE /api/supplier/categories/:id
// @access  Private (Supplier only)


exports.deleteCategory = function _callee4(req, res) {
  var categoryId, supplierId, category;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          categoryId = req.params.id;
          supplierId = req.user.id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Category.findOneAndDelete({
            _id: categoryId,
            supplier: supplierId
          }));

        case 5:
          category = _context4.sent;

          if (category) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Category not found or you do not own it."
          }));

        case 8:
          res.status(200).json({
            message: "Category deleted successfully."
          });
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.error("Error deleting category:", _context4.t0);
          res.status(500).json({
            message: "Failed to delete category",
            error: _context4.t0.message
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
};