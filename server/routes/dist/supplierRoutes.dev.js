"use strict";

// server/routes/supplierRoutes.js
var express = require("express");

var router = express.Router();

var _require = require("../controllers/productController"),
    addProduct = _require.addProduct; // Import the controller
// In a real application, you would add authentication and authorization middleware here
// For example:
// const { protect, authorize } = require('../middleware/authMiddleware');
// router.post('/products', protect, authorize('supplier'), addProduct);
// For now, we'll keep it simple for testing to ensure the route works


router.post("/products", addProduct);
module.exports = router;