// server/routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const { addProduct } = require("../controllers/productController"); // Import the controller

// In a real application, you would add authentication and authorization middleware here
// For example:
// const { protect, authorize } = require('../middleware/authMiddleware');
// router.post('/products', protect, authorize('supplier'), addProduct);

// For now, we'll keep it simple for testing to ensure the route works
router.post("/products", addProduct);

module.exports = router;
