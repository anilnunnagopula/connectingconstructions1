"use strict";

// server/routes/generalRoutes.js
var express = require("express");

var router = express.Router();

var axios = require("axios"); // --- Import Public Product Controller Functions ---


var _require = require("../controllers/productController"),
    getAllProductsPublic = _require.getAllProductsPublic,
    getProductByIdPublic = _require.getProductByIdPublic; // --- Public Routes ---
// Proxy endpoint for Nominatim reverse geocoding


router.get("/geocode-proxy", function _callee(req, res) {
  var _req$query, lat, lon, response;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, lat = _req$query.lat, lon = _req$query.lon;

          if (!(!lat || !lon)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Latitude and longitude are required"
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(axios.get("https://nominatim.openstreetmap.org/reverse", {
            params: {
              lat: lat,
              lon: lon,
              format: "json"
            },
            // Add a user-agent header as Nominatim requests it for non-trivial use
            headers: {
              "User-Agent": "YourAppName/1.0 (your-email@example.com)"
            }
          }));

        case 6:
          response = _context.sent;
          res.json(response.data);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);
          console.error("Error with Nominatim API:", _context.t0.message);
          res.status(500).json({
            error: "Reverse geocoding failed"
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10]]);
}); // NEW: Public route for fetching products

router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic);
module.exports = router;