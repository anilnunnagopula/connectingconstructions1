// server/routes/generalRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios"); // For making HTTP requests to external APIs

// @desc    Proxy endpoint for Nominatim reverse geocoding
// @route   GET /geocode-proxy?lat=:lat&lon=:lon
// @access  Public
router.get("/geocode-proxy", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required." });
  }

  try {
    // Example using OpenStreetMap Nominatim API
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const response = await axios.get(nominatimUrl, {
      headers: {
        "User-Agent": "ConnectingConstructionsApp/1.0 (your-email@example.com)", // Required by Nominatim
      },
    });

    if (response.data && response.data.display_name) {
      res.json({ display_name: response.data.display_name }); // <-- Ensure this is consistent
    } else {
      res
        .status(404)
        .json({ message: "Address not found for these coordinates." });
    }
  } catch (error) {
    console.error(
      "Error with Nominatim API:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({
        message: "Failed to reverse geocode location. External API error.",
      });
  }
});

module.exports = router;
