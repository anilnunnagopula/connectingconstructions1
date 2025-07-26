"use strict";

// server/routes/tempSupplierRoutes.js (Building up the real supplierRoutes.js)
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles; // Import productController


var _require2 = require("../controllers/productController"),
    addProduct = _require2.addProduct,
    getMyProducts = _require2.getMyProducts,
    getProductById = _require2.getProductById,
    updateProduct = _require2.updateProduct,
    deleteProduct = _require2.deleteProduct,
    getAllProductsPublic = _require2.getAllProductsPublic,
    getProductByIdPublic = _require2.getProductByIdPublic; // --- Public Product Routes ---


router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic); // --- Supplier-specific Protected Routes (Product Management) ---

router.route("/myproducts").post(protect, authorizeRoles("supplier"), addProduct).get(protect, authorizeRoles("supplier"), getMyProducts);
router.route("/myproducts/:id").get(protect, authorizeRoles("supplier"), getProductById).put(protect, authorizeRoles("supplier"), updateProduct)["delete"](protect, authorizeRoles("supplier"), deleteProduct);
module.exports = router;