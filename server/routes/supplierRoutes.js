// server/routes/supplierRoutes.js (Example)
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User"); // Assuming you have a User model

// GET /api/supplier/products - Fetch all products for a logged-in supplier
router.get("/products", async (req, res) => {
  try {
    // In a real application, supplierId would come from an authenticated user's token
    // For now, we'll use a query parameter as discussed.
    const supplierEmail = req.query.supplierEmail;

    if (!supplierEmail) {
      return res.status(400).json({ error: "Supplier email is required." });
    }

    // Find the user by email to get their MongoDB _id
    const user = await User.findOne({ email: supplierEmail });

    if (!user) {
      return res.status(404).json({ error: "Supplier not found." });
    }

    // Find all products associated with this supplier's _id
    const products = await Product.find({ supplierId: user._id });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching supplier products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

module.exports = router;
