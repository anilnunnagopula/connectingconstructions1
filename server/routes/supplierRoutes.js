// server/routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Import Product Controller functions
const {
  addProduct,
  getMyProducts,
  getProductById, // Corrected to match function name in productController.js
  updateProduct,
  deleteProduct,
  getAllProductsPublic, // For public product Browse
  getProductByIdPublic, // For public single product view
} = require("../controllers/productController");

// Import Supplier Dashboard Controller functions (for summary stats)
const {
  getSupplierDashboardData,
} = require("../controllers/supplierDashboardController");

// Import Shop Location Controller functions (for managing multiple shops)
const {
  getShopLocations,
  addShopLocation,
  updateShopLocation,
  deleteShopLocation,
} = require("../controllers/shopLocationController");

// Import Detailed Data Controller functions (for dedicated pages)
const {
  getAllActivityLogs,
  getDetailedTopProducts,
  getAllCustomerFeedback,
  getAllDeliveryStatuses,
  getAllNotifications,
} = require("../controllers/supplierDetailedDataController");

// --- Public Product Routes (Accessible by anyone) ---
// These are for general Browse of products, not specific to a logged-in supplier's management.
router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic);

// --- Supplier-specific Protected Routes (Require 'supplier' role for all) ---

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

// Shop Location Management (for the supplier's MULTIPLE shop locations)
router
  .route("/shop-locations")
  .get(protect, authorizeRoles("supplier"), getShopLocations) // Get all shop locations for this supplier
  .post(protect, authorizeRoles("supplier"), addShopLocation); // Add a new shop location

router
  .route("/shop-locations/:id")
  .get(protect, authorizeRoles("supplier"), getShopLocations) // Could add a get by ID if needed
  .put(protect, authorizeRoles("supplier"), updateShopLocation) // Update a specific shop location
  .delete(protect, authorizeRoles("supplier"), deleteShopLocation); // Delete a specific shop location

// --- NEW DETAILED DATA ROUTES (for pages linked from dashboard cards) ---
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
