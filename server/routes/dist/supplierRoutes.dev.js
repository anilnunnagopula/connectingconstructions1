"use strict";

// server/routes/supplierRoutes.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles;

var MAX_FILE_SIZE_MB = 10; // Max 10MB for the CSV/Excel file

var MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes
// NEW: Import multer for file uploads

var multer = require('multer');

var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  } // Use the same limit as frontend

}); // --- Import All Controller Functions ---
// Product Controllers

var _require2 = require("../controllers/productController"),
    addProduct = _require2.addProduct,
    getMyProducts = _require2.getMyProducts,
    getProductById = _require2.getProductById,
    updateProduct = _require2.updateProduct,
    deleteProduct = _require2.deleteProduct,
    getAllProductsPublic = _require2.getAllProductsPublic,
    getProductByIdPublic = _require2.getProductByIdPublic,
    exportProductsToCSV = _require2.exportProductsToCSV; // Category Controllers


var _require3 = require("../controllers/categoryController"),
    getCategories = _require3.getCategories,
    addCategory = _require3.addCategory,
    updateCategory = _require3.updateCategory,
    deleteCategory = _require3.deleteCategory; // Supplier Dashboard Controllers


var _require4 = require("../controllers/supplierDashboardController"),
    getSupplierDashboardData = _require4.getSupplierDashboardData; // Shop Location Controllers


var _require5 = require("../controllers/shopLocationController"),
    getShopLocations = _require5.getShopLocations,
    addShopLocation = _require5.addShopLocation,
    updateShopLocation = _require5.updateShopLocation,
    deleteShopLocation = _require5.deleteShopLocation; // Detailed Data Controllers (for sub-pages of dashboard)


var _require6 = require("../controllers/supplierDetailedDataController"),
    getAllActivityLogs = _require6.getAllActivityLogs,
    getDetailedTopProducts = _require6.getDetailedTopProducts,
    getAllCustomerFeedback = _require6.getAllCustomerFeedback,
    getAllDeliveryStatuses = _require6.getAllDeliveryStatuses,
    getAllNotifications = _require6.getAllNotifications;

var _require7 = require("../controllers/orderController"),
    getSupplierOrders = _require7.getSupplierOrders,
    updateOrderStatus = _require7.updateOrderStatus; // Import order controller functions


var _require8 = require("../controllers/licenseController"),
    getLicenses = _require8.getLicenses,
    addLicense = _require8.addLicense,
    deleteLicense = _require8.deleteLicense; // Import license controller functions


var _require9 = require("../controllers/analyticsController"),
    getSupplierAnalytics = _require9.getSupplierAnalytics;

var _require10 = require("../controllers/paymentController"),
    getPayoutMethods = _require10.getPayoutMethods,
    addPayoutMethod = _require10.addPayoutMethod,
    updatePayoutMethod = _require10.updatePayoutMethod,
    deletePayoutMethod = _require10.deletePayoutMethod,
    getPayoutHistory = _require10.getPayoutHistory; // Import payment controller functions


var _require11 = require("../controllers/syncInventoryController"),
    syncInventory = _require11.syncInventory;

var _require12 = require("../controllers/offerController"),
    createOffer = _require12.createOffer,
    getOffers = _require12.getOffers,
    getOfferById = _require12.getOfferById,
    updateOffer = _require12.updateOffer,
    deleteOffer = _require12.deleteOffer; // Import offer controller functions
// Export Products to CSV


router.get("/products/export-csv", // <--- NEW ROUTE
protect, authorizeRoles("supplier"), exportProductsToCSV); // --- Public Routes (Accessible by anyone) ---

router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic); // --- Supplier-specific Protected Routes (Require 'supplier' role) ---
// Dashboard Summary Data

router.get("/dashboard", protect, authorizeRoles("supplier"), getSupplierDashboardData); // Product Management

router.route("/myproducts").post(protect, authorizeRoles("supplier"), addProduct).get(protect, authorizeRoles("supplier"), getMyProducts);
router.route("/myproducts/:id").get(protect, authorizeRoles("supplier"), getProductById).put(protect, authorizeRoles("supplier"), updateProduct)["delete"](protect, authorizeRoles("supplier"), deleteProduct); // Category Management

router.route("/categories").get(protect, authorizeRoles("supplier"), getCategories).post(protect, authorizeRoles("supplier"), addCategory);
router.route("/categories/:id").put(protect, authorizeRoles("supplier"), updateCategory)["delete"](protect, authorizeRoles("supplier"), deleteCategory); // Shop Location Management

router.route("/shop-locations").get(protect, authorizeRoles("supplier"), getShopLocations).post(protect, authorizeRoles("supplier"), addShopLocation);
router.route("/shop-locations/:id").get(protect, authorizeRoles("supplier"), getShopLocations).put(protect, authorizeRoles("supplier"), updateShopLocation)["delete"](protect, authorizeRoles("supplier"), deleteShopLocation); // Detailed Data Routes

router.get("/activity-logs", protect, authorizeRoles("supplier"), getAllActivityLogs);
router.get("/top-products", protect, authorizeRoles("supplier"), getDetailedTopProducts);
router.get("/customer-feedback", protect, authorizeRoles("supplier"), getAllCustomerFeedback);
router.get("/delivery-status", protect, authorizeRoles("supplier"), getAllDeliveryStatuses);
router.get("/notifications", protect, authorizeRoles("supplier"), getAllNotifications); // Order Management

router.get("/orders", protect, authorizeRoles("supplier"), getSupplierOrders // Used here
);
router.put("/orders/:id/status", protect, authorizeRoles("supplier"), updateOrderStatus // Used here
);
router.get("/license-and-certificates", protect, authorizeRoles("supplier"), getLicenses);
router.post("/license-and-certificates", protect, authorizeRoles("supplier"), addLicense);
router["delete"]("/license-and-certificates/:id", protect, authorizeRoles("supplier"), deleteLicense); // Analytics Data

router.get("/analytics", protect, authorizeRoles("supplier"), getSupplierAnalytics); // Payments Management

router.get("/payout-methods", protect, authorizeRoles("supplier"), getPayoutMethods // This is for fetching methods, not a combined endpoint
);
router.get("/payout-history", // Separate endpoint for history
protect, authorizeRoles("supplier"), getPayoutHistory);
router.post("/payout-methods", protect, authorizeRoles("supplier"), addPayoutMethod);
router.put("/payout-methods/:id", // For updating a method (e.g., setting default)
protect, authorizeRoles("supplier"), updatePayoutMethod);
router["delete"]("/payout-methods/:id", protect, authorizeRoles("supplier"), deletePayoutMethod);
router.post("/inventory/sync", protect, authorizeRoles("supplier"), upload.single("inventoryFile"), syncInventory); // Offer Management

router.get("/offers", protect, authorizeRoles("supplier"), getOffers);
router.post("/offers", protect, authorizeRoles("supplier"), createOffer);
router.get("/offers/:id", protect, authorizeRoles("supplier"), getOfferById);
router.put("/offers/:id", protect, authorizeRoles("supplier"), updateOffer);
router["delete"]("/offers/:id", protect, authorizeRoles("supplier"), deleteOffer);
module.exports = router;