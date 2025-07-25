// server/routes/generalRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios"); // Ensure axios is installed in server directory (npm install axios)

// @desc    Proxy endpoint for Nominatim reverse geocoding
// @route   GET /geocode-proxy?lat=:lat&lon=:lon
// @access  Public
router.get("/geocode-proxy", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat,
          lon,
          format: "json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error with Nominatim API:", error.message);
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});

module.exports = router;
