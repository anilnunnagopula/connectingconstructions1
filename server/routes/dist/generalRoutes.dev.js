"use strict";

// server/routes/generalRoutes.js
var express = require("express");

var router = express.Router();

var axios = require("axios"); // For making HTTP requests to external APIs
// @desc    Proxy endpoint for Nominatim reverse geocoding
// @route   GET /geocode-proxy?lat=:lat&lon=:lon
// @access  Public


router.get("/geocode-proxy", function _callee(req, res) {
  var _req$query, lat, lon, nominatimUrl, response;

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
            message: "Latitude and Longitude are required."
          }));

        case 3:
          _context.prev = 3;
          // Example using OpenStreetMap Nominatim API
          nominatimUrl = "https://nominatim.openstreetmap.org/reverse?format=json&lat=".concat(lat, "&lon=").concat(lon, "&zoom=18&addressdetails=1");
          _context.next = 7;
          return regeneratorRuntime.awrap(axios.get(nominatimUrl, {
            headers: {
              "User-Agent": "ConnectingConstructionsApp/1.0 (your-email@example.com)" // Required by Nominatim

            }
          }));

        case 7:
          response = _context.sent;

          if (response.data && response.data.display_name) {
            res.json({
              display_name: response.data.display_name
            }); // <-- Ensure this is consistent
          } else {
            res.status(404).json({
              message: "Address not found for these coordinates."
            });
          }

          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          console.error("Error with Nominatim API:", _context.t0.response ? _context.t0.response.data : _context.t0.message);
          res.status(500).json({
            message: "Failed to reverse geocode location. External API error."
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
module.exports = router;