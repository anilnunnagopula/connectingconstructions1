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
  getAllProductsPublic,
  getProductByIdPublic,
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

const {
  getSupplierOrders,
  updateOrderStatus,
} = require("../controllers/orderController"); // Import order controller functions

const {
    getLicenses,
    addLicense,
    deleteLicense,
} = require("../controllers/licenseController"); // Import license controller functions

const {
    getSupplierAnalytics, 
} = require("../controllers/analyticsController"); 

const {
    getPayoutMethods,
    addPayoutMethod,
    updatePayoutMethod,
    deletePayoutMethod,
    getPayoutHistory,
} = require("../controllers/paymentController"); // Import payment controller functions

// --- Public Routes (Accessible by anyone) ---
router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic);

// --- Supplier-specific Protected Routes (Require 'supplier' role) ---

// Dashboard Summary Data
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

// Category Management
router
  .route("/categories")
  .get(protect, authorizeRoles("supplier"), getCategories)
  .post(protect, authorizeRoles("supplier"), addCategory);

router
  .route("/categories/:id")
  .put(protect, authorizeRoles("supplier"), updateCategory)
  .delete(protect, authorizeRoles("supplier"), deleteCategory);

// Shop Location Management
router
  .route("/shop-locations")
  .get(protect, authorizeRoles("supplier"), getShopLocations)
  .post(protect, authorizeRoles("supplier"), addShopLocation);

router
  .route("/shop-locations/:id")
  .get(protect, authorizeRoles("supplier"), getShopLocations)
  .put(protect, authorizeRoles("supplier"), updateShopLocation)
  .delete(protect, authorizeRoles("supplier"), deleteShopLocation);

// Detailed Data Routes
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

// Order Management
router.get(
  "/orders",
  protect,
  authorizeRoles("supplier"),
  getSupplierOrders // Used here
);
router.put(
  "/orders/:id/status",
  protect,
  authorizeRoles("supplier"),
  updateOrderStatus // Used here
);

router.get(
  "/license-and-certificates",
  protect,
  authorizeRoles("supplier"),
  getLicenses
);
router.post(
  "/license-and-certificates",
  protect,
  authorizeRoles("supplier"),
  addLicense
);
router.delete(
  "/license-and-certificates/:id",
  protect,
  authorizeRoles("supplier"),
  deleteLicense
);

// Analytics Data
// Analytics Data
router.get(
    "/analytics",
    protect,
    authorizeRoles("supplier"),
    getSupplierAnalytics
);

// Payments Management
router.get(
  "/payout-methods",
  protect,
  authorizeRoles("supplier"),
  getPayoutMethods // This is for fetching methods, not a combined endpoint
);
router.get(
    "/payout-history", // Separate endpoint for history
    protect,
    authorizeRoles("supplier"),
    getPayoutHistory
);
router.post(
    "/payout-methods",
    protect,
    authorizeRoles("supplier"),
    addPayoutMethod
);
router.put(
    "/payout-methods/:id", // For updating a method (e.g., setting default)
    protect,
    authorizeRoles("supplier"),
    updatePayoutMethod
);
router.delete(
    "/payout-methods/:id",
    protect,
    authorizeRoles("supplier"),
    deletePayoutMethod
);


// Placeholder for License and Certificates route
// router.get('/license-and-certificates', protect, authorizeRoles('supplier'), getLicensesAndCertificates);

module.exports = router;
