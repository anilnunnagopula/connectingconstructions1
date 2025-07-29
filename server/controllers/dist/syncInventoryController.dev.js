"use strict";

// server/controllers/syncInventoryController.js
var Product = require("../models/ProductModel"); // Your Product model


var csv = require("csv-parser"); // For CSV parsing


var xlsx = require("xlsx"); // For Excel parsing


var stream = require("stream"); // Node.js stream module
// You'll need to install these:
// npm install csv-parser xlsx multer
// For file uploads, you'll need Multer middleware in your supplierRoutes.js
// Example:
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Temporary upload directory
// @desc    Sync inventory via file upload
// @route   POST /api/supplier/inventory/sync
// @access  Private (Supplier only)


exports.syncInventory = function _callee2(req, res) {
  var supplierId, fileBuffer, originalname, productsToUpdate, skippedRows, readableStream, workbook, sheetName, sheet, json;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          supplierId = req.user.id; // From 'protect' middleware

          if (req.file) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "No file uploaded."
          }));

        case 4:
          fileBuffer = req.file.buffer; // If using memoryStorage for multer

          originalname = req.file.originalname;
          productsToUpdate = [];
          skippedRows = [];

          if (!originalname.endsWith(".csv")) {
            _context2.next = 15;
            break;
          }

          readableStream = new stream.Readable();
          readableStream.push(fileBuffer);
          readableStream.push(null);
          readableStream.pipe(csv()).on("data", function (row) {
            // Expects columns like: ProductID,Quantity,Price
            if (row.ProductID && !isNaN(row.Quantity) && !isNaN(row.Price)) {
              productsToUpdate.push({
                _id: row.ProductID.trim(),
                quantity: parseInt(row.Quantity, 10),
                price: parseFloat(row.Price)
              });
            } else {
              skippedRows.push(row);
            }
          }).on("end", function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(processUpdates(productsToUpdate, supplierId, skippedRows, res));

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }).on("error", function (error) {
            console.error("CSV parsing error:", error);
            return res.status(400).json({
              message: "Error parsing CSV file."
            });
          });
          _context2.next = 26;
          break;

        case 15:
          if (!(originalname.endsWith(".xls") || originalname.endsWith(".xlsx"))) {
            _context2.next = 25;
            break;
          }

          workbook = xlsx.read(fileBuffer, {
            type: "buffer"
          });
          sheetName = workbook.SheetNames[0];
          sheet = workbook.Sheets[sheetName];
          json = xlsx.utils.sheet_to_json(sheet);
          json.forEach(function (row) {
            // Expects columns like: ProductID,Quantity,Price
            if (row.ProductID && !isNaN(row.Quantity) && !isNaN(row.Price)) {
              productsToUpdate.push({
                _id: row.ProductID.trim(),
                quantity: parseInt(row.Quantity, 10),
                price: parseFloat(row.Price)
              });
            } else {
              skippedRows.push(row);
            }
          });
          _context2.next = 23;
          return regeneratorRuntime.awrap(processUpdates(productsToUpdate, supplierId, skippedRows, res));

        case 23:
          _context2.next = 26;
          break;

        case 25:
          return _context2.abrupt("return", res.status(400).json({
            message: "Unsupported file type. Please upload a CSV, XLS, or XLSX file."
          }));

        case 26:
          _context2.next = 32;
          break;

        case 28:
          _context2.prev = 28;
          _context2.t0 = _context2["catch"](0);
          console.error("Error in syncInventory:", _context2.t0);
          res.status(500).json({
            message: "Failed to sync inventory.",
            error: _context2.t0.message
          });

        case 32:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 28]]);
}; // Helper function to process updates after parsing


var processUpdates = function processUpdates(productsToUpdate, supplierId, skippedRows, res) {
  var updatedCount, notFoundCount, unauthorizedCount, errorCount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, productData, updatedProduct, existingProduct, summaryMessage;

  return regeneratorRuntime.async(function processUpdates$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          updatedCount = 0;
          notFoundCount = 0;
          unauthorizedCount = 0;
          errorCount = 0;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 7;
          _iterator = productsToUpdate[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 32;
            break;
          }

          productData = _step.value;
          _context3.prev = 11;
          _context3.next = 14;
          return regeneratorRuntime.awrap(Product.findOneAndUpdate({
            _id: productData._id,
            supplier: supplierId
          }, // Find by ID AND ensure supplier owns it
          {
            quantity: productData.quantity,
            price: productData.price
          }, {
            "new": true,
            runValidators: true
          }));

        case 14:
          updatedProduct = _context3.sent;

          if (!updatedProduct) {
            _context3.next = 19;
            break;
          }

          updatedCount++;
          _context3.next = 23;
          break;

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(Product.findById(productData._id));

        case 21:
          existingProduct = _context3.sent;

          if (existingProduct) {
            // Product exists, but doesn't belong to supplier
            unauthorizedCount++;
          } else {
            // Product doesn't exist at all
            notFoundCount++;
          }

        case 23:
          _context3.next = 29;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](11);
          console.error("Error updating product ".concat(productData._id, ":"), _context3.t0);
          errorCount++;

        case 29:
          _iteratorNormalCompletion = true;
          _context3.next = 9;
          break;

        case 32:
          _context3.next = 38;
          break;

        case 34:
          _context3.prev = 34;
          _context3.t1 = _context3["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context3.t1;

        case 38:
          _context3.prev = 38;
          _context3.prev = 39;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 41:
          _context3.prev = 41;

          if (!_didIteratorError) {
            _context3.next = 44;
            break;
          }

          throw _iteratorError;

        case 44:
          return _context3.finish(41);

        case 45:
          return _context3.finish(38);

        case 46:
          summaryMessage = "Inventory sync complete. Updated: ".concat(updatedCount, " products.");
          if (notFoundCount > 0) summaryMessage += " Not found: ".concat(notFoundCount, ".");
          if (unauthorizedCount > 0) summaryMessage += " Not authorized (not your product): ".concat(unauthorizedCount, ".");
          if (errorCount > 0) summaryMessage += " Errors: ".concat(errorCount, ".");
          if (skippedRows.length > 0) summaryMessage += " Skipped invalid rows: ".concat(skippedRows.length, ".");
          res.status(200).json({
            message: summaryMessage,
            updatedCount: updatedCount,
            notFoundCount: notFoundCount,
            unauthorizedCount: unauthorizedCount,
            errorCount: errorCount,
            skippedRows: skippedRows
          });

        case 52:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 34, 38, 46], [11, 25], [39,, 41, 45]]);
};