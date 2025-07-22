"use strict";

// server/routes/supplierRoutes.js (Example)
var express = require("express");

var router = express.Router();

var Product = require("../models/Product");

var User = require("../models/User"); // Assuming you have a User model
// GET /api/supplier/products - Fetch all products for a logged-in supplier


router.get("/products", function _callee(req, res) {
  var supplierEmail, user, products;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // In a real application, supplierId would come from an authenticated user's token
          // For now, we'll use a query parameter as discussed.
          supplierEmail = req.query.supplierEmail;

          if (supplierEmail) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Supplier email is required."
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: supplierEmail
          }));

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Supplier not found."
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(Product.find({
            supplierId: user._id
          }));

        case 11:
          products = _context.sent;
          res.status(200).json(products);
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching supplier products:", _context.t0);
          res.status(500).json({
            error: "Failed to fetch products."
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
module.exports = router;