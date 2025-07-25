// server/routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Import existing controllers
const {
  addProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsPublic,
  getProductByIdPublic,
} = require("../controllers/productController");
const {
  getSupplierDashboardData,
} = require("../controllers/supplierDashboardController");
const {
  getShopLocations,
  addShopLocation,
  updateShopLocation,
  deleteShopLocation,
} = require("../controllers/shopLocationController");

// NEW: Import the detailed data controller functions
const {
  getAllActivityLogs,
  getDetailedTopProducts,
  getAllCustomerFeedback,
  getAllDeliveryStatuses,
  getAllNotifications,
} = require("../controllers/supplierDetailedDataController"); // Ensure path is correct

// --- Public Product Routes (Accessible by anyone) ---
router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic);

// --- Supplier-specific Protected Routes (Require 'supplier' role) ---

// Dashboard Data
router.get(
  "/dashboard",
  protect,
  authorizeRoles("supplier"),
  getSupplierDashboardData
);

// Product Management
router
  .route("/myproducts")
  .post(protect, authorizeRoles("supplier"), addProduct)
  .get(protect, authorizeRoles("supplier"), getMyProducts);

router
  .route("/myproducts/:id")
  .get(protect, authorizeRoles("supplier"), getProductById)
  .put(protect, authorizeRoles("supplier"), updateProduct)
  .delete(protect, authorizeRoles("supplier"), deleteProduct);

// Shop Location Management
router
  .route("/shop-locations")
  .get(protect, authorizeRoles("supplier"), getShopLocations)
  .post(protect, authorizeRoles("supplier"), addShopLocation);

router
  .route("/shop-locations/:id")
  .put(protect, authorizeRoles("supplier"), updateShopLocation)
  .delete(protect, authorizeRoles("supplier"), deleteShopLocation);

// --- NEW DETAILED DATA ROUTES ---
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

// Add route for License and Certificates here when its controller is ready
// router.get('/license-and-certificates', protect, authorizeRoles('supplier'), getLicensesAndCertificates);

module.exports = router;
