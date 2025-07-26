// server/routes/tempSupplierRoutes.js (Building up the real supplierRoutes.js)
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Import productController
const {
  addProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsPublic, // For public product Browse (e.g., customer side)
  getProductByIdPublic, // For public single product view (e.g., customer side)
} = require("../controllers/productController");

// --- Public Product Routes ---
router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic);

// --- Supplier-specific Protected Routes (Product Management) ---
router
  .route("/myproducts")
  .post(protect, authorizeRoles("supplier"), addProduct)
  .get(protect, authorizeRoles("supplier"), getMyProducts);

router
  .route("/myproducts/:id")
  .get(protect, authorizeRoles("supplier"), getProductById)
  .put(protect, authorizeRoles("supplier"), updateProduct)
  .delete(protect, authorizeRoles("supplier"), deleteProduct);

module.exports = router;
