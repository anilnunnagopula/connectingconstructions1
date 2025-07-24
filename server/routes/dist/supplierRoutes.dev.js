"use strict";

// server/routes/supplierRoutes.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles; // Import middlewares
// Import product controller functions


var _require2 = require("../controllers/productController"),
    addProduct = _require2.addProduct,
    getSupplierProductById = _require2.getSupplierProductById,
    updateProduct = _require2.updateProduct,
    deleteProduct = _require2.deleteProduct,
    getMyProducts = _require2.getMyProducts,
    getAllProductsPublic = _require2.getAllProductsPublic,
    getProductByIdPublic = _require2.getProductByIdPublic; // Import supplier dashboard controller function


var _require3 = require("../controllers/supplierDashboardController"),
    getSupplierDashboardData = _require3.getSupplierDashboardData; // --- Public Product Routes (Accessible by anyone, including customers Browse) ---


router.get("/products", getAllProductsPublic); // GET /api/supplier/products (All products)

router.get("/products/:id", getProductByIdPublic); // GET /api/supplier/products/:id (Single product by ID)
// --- Supplier-specific Protected Routes (Require authentication and 'supplier' role) ---
// Route for Supplier Dashboard Data

router.get("/dashboard", protect, authorizeRoles("supplier"), getSupplierDashboardData); // GET /api/supplier/dashboard
// Routes for managing supplier's own products

router.route("/myproducts").post(protect, authorizeRoles("supplier"), addProduct) // POST /api/supplier/myproducts - Add a new product
.get(protect, authorizeRoles("supplier"), getMyProducts); // GET /api/supplier/myproducts - Get all products by the authenticated supplier

router.route("/myproducts/:id").get(protect, authorizeRoles("supplier"), getSupplierProductById) // GET /api/supplier/myproducts/:id - Get specific product owned by supplier
.put(protect, authorizeRoles("supplier"), updateProduct) // PUT /api/supplier/myproducts/:id - Update specific product owned by supplier
["delete"](protect, authorizeRoles("supplier"), deleteProduct); // DELETE /api/supplier/myproducts/:id - Delete specific product owned by supplier
// The /suppliers/:id/location route you had here seemed to be for a separate 'Supplier' model.
// If suppliers are just 'User's with role 'supplier', then location updates should be handled via user profile updates,
// or specific routes on the product if a product has a different location than the supplier's profile.
// Assuming supplier location is part of the User model or product specific location:
// If supplier location is stored on User model, update it via /api/auth/profile PUT route.
// If it's on Product, it's handled by product update.
// Removing this specific route for now to avoid confusion. You can re-add if you have a separate Supplier model.
// router.put("/suppliers/:id/location", /* ... */);

module.exports = router;