"use strict";

// server/scripts/migrateProducts.js
require("dotenv").config();

var mongoose = require("mongoose");

var Product = require("../models/Product");

var MONGO_URI = process.env.MONGO_URI;

function migrateProducts() {
  var result, samples;
  return regeneratorRuntime.async(function migrateProducts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(MONGO_URI));

        case 3:
          console.log("✅ Connected to MongoDB"); // Update all existing products

          _context.next = 6;
          return regeneratorRuntime.awrap(Product.updateMany({
            $or: [{
              productType: {
                $exists: false
              }
            }, {
              productType: null
            }]
          }, {
            $set: {
              productType: "material",
              // Default to material
              unit: "bags",
              // Default unit
              minOrderQuantity: 1,
              stepSize: 1,
              isQuoteOnly: false
            }
          }));

        case 6:
          result = _context.sent;
          console.log("\u2705 Migrated ".concat(result.modifiedCount, " products")); // Log sample products

          _context.next = 10;
          return regeneratorRuntime.awrap(Product.find().limit(3));

        case 10:
          samples = _context.sent;
          console.log("\n📦 Sample products after migration:");
          samples.forEach(function (p) {
            console.log({
              name: p.name,
              productType: p.productType,
              unit: p.unit,
              isQuoteOnly: p.isQuoteOnly
            });
          });
          process.exit(0);
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error("❌ Migration failed:", _context.t0);
          process.exit(1);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
}

migrateProducts();