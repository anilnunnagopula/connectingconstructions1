// server/routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProductById,
  updateProduct,
} = require("../controllers/productController"); // Import new functions

// Route to add a new product
router.post("/products", addProduct);

// New: Route to get a single product by ID
router.get("/products/:id", getProductById); // :id is a URL parameter

// New: Route to update a product by ID
router.put("/products/:id", updateProduct); // :id is a URL parameter

module.exports = router;
