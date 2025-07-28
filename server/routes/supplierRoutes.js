// server/routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// --- Import All Controller Functions ---
// Product Controllers
const {
  addProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsPublic, // Note: This is a public route, could go in a public/productRoutes.js
  getProductByIdPublic, // Note: This is a public route, could go in a public/productRoutes.js
} = require("../controllers/productController");

// Category Controllers
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Supplier Dashboard Controllers
const {
  getSupplierDashboardData,
} = require("../controllers/supplierDashboardController");

// Shop Location Controllers
const {
  getShopLocations,
  addShopLocation,
  updateShopLocation,
  deleteShopLocation,
} = require("../controllers/shopLocationController");

// Detailed Data Controllers (for sub-pages of dashboard)
const {
  getAllActivityLogs,
  getDetailedTopProducts,
  getAllCustomerFeedback,
  getAllDeliveryStatuses,
  getAllNotifications,
} = require("../controllers/supplierDetailedDataController");

// --- Public Routes (Accessible by anyone) ---
// Note: It's common practice to put public routes in a separate router file (e.g., publicRoutes.js)
// and then import/mount them in your main app.js or server.js file.
// For now, keeping them here as they were, but separated for clarity.
router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic);

// --- Supplier-specific Protected Routes (Require 'supplier' role) ---
// All routes below will use 'protect' and 'authorizeRoles("supplier")' middleware

// Dashboard Summary Data
router.get(
  "/dashboard",
  protect,
  authorizeRoles("supplier"),
  getSupplierDashboardData
);

// Product Management (for the logged-in supplier's OWN products)
router
  .route("/myproducts")
  .post(protect, authorizeRoles("supplier"), addProduct) // Add a new product
  .get(protect, authorizeRoles("supplier"), getMyProducts); // Get all products by this supplier

router
  .route("/myproducts/:id")
  .get(protect, authorizeRoles("supplier"), getProductById) // Get a specific product by ID (owned by supplier)
  .put(protect, authorizeRoles("supplier"), updateProduct) // Update a specific product
  .delete(protect, authorizeRoles("supplier"), deleteProduct); // Delete a specific product

// Category Management (for the logged-in supplier's OWN categories)
router
  .route("/categories")
  .get(protect, authorizeRoles("supplier"), getCategories) // Get all categories for this supplier
  .post(protect, authorizeRoles("supplier"), addCategory); // Add a new category

router
  .route("/categories/:id")
  .put(protect, authorizeRoles("supplier"), updateCategory) // Update a specific category
  .delete(protect, authorizeRoles("supplier"), deleteCategory); // Delete a specific category

// Shop Location Management (for the supplier's MULTIPLE shop locations)
router
  .route("/shop-locations")
  .get(protect, authorizeRoles("supplier"), getShopLocations) // Get all shop locations for this supplier
  .post(protect, authorizeRoles("supplier"), addShopLocation); // Add a new shop location

router
  .route("/shop-locations/:id")
  .get(protect, authorizeRoles("supplier"), getShopLocations) // Could add a get by ID if needed (though current controller fetches all)
  .put(protect, authorizeRoles("supplier"), updateShopLocation) // Update a specific shop location
  .delete(protect, authorizeRoles("supplier"), deleteShopLocation); // Delete a specific shop location

// Detailed Data Routes (for pages linked from dashboard cards)
// These fetch comprehensive, paginated data for the dedicated detail pages.
router.get(
  "/activity-logs",
  protect,
  authorizeRoles("supplier"),
  getAllActivityLogs
);
router.get(
  "/top-products",
  protect,
  authorizeRoles("supplier"),
  getDetailedTopProducts
);
router.get(
  "/customer-feedback",
  protect,
  authorizeRoles("supplier"),
  getAllCustomerFeedback
);
router.get(
  "/delivery-status",
  protect,
  authorizeRoles("supplier"),
  getAllDeliveryStatuses
);
router.get(
  "/notifications",
  protect,
  authorizeRoles("supplier"),
  getAllNotifications
);

// Placeholder for License and Certificates route when its controller function is ready
// router.get('/license-and-certificates', protect, authorizeRoles('supplier'), getLicensesAndCertificates);

module.exports = router;
