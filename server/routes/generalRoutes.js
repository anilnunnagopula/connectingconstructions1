// server/routes/generalRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// --- Import Public Product Controller Functions ---
const {
  getAllProductsPublic,
  getProductByIdPublic,
} = require("../controllers/productController");

// --- Public Routes ---

// Proxy endpoint for Nominatim reverse geocoding
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
        // Add a user-agent header as Nominatim requests it for non-trivial use
        headers: { "User-Agent": "YourAppName/1.0 (your-email@example.com)" },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error with Nominatim API:", error.message);
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});

// NEW: Public route for fetching products
router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic);

module.exports = router;
