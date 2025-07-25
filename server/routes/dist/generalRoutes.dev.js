"use strict";

// server/routes/generalRoutes.js
var express = require("express");

var router = express.Router();

var axios = require("axios"); // Ensure axios is installed in server directory (npm install axios)
// @desc    Proxy endpoint for Nominatim reverse geocoding
// @route   GET /geocode-proxy?lat=:lat&lon=:lon
// @access  Public


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
});
module.exports = router;