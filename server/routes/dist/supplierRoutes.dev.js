"use strict";

// server/routes/supplierRoutes.js
var express = require("express");

var router = express.Router();

var _require = require("../controllers/productController"),
    addProduct = _require.addProduct,
    getProductById = _require.getProductById,
    updateProduct = _require.updateProduct; // Import new functions
// Route to add a new product


router.post("/products", addProduct); // New: Route to get a single product by ID

router.get("/products/:id", getProductById); // :id is a URL parameter
// New: Route to update a product by ID

router.put("/products/:id", updateProduct); // :id is a URL parameter

module.exports = router;