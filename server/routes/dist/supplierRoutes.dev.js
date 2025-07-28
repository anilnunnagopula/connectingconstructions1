"use strict";

// server/routes/supplierRoutes.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles; // --- Import All Controller Functions ---
// Product Controllers


var _require2 = require("../controllers/productController"),
    addProduct = _require2.addProduct,
    getMyProducts = _require2.getMyProducts,
    getProductById = _require2.getProductById,
    updateProduct = _require2.updateProduct,
    deleteProduct = _require2.deleteProduct,
    getAllProductsPublic = _require2.getAllProductsPublic,
    getProductByIdPublic = _require2.getProductByIdPublic; // Category Controllers


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
    getSupplierAnalytics = _require9.getSupplierAnalytics; // --- Public Routes (Accessible by anyone) ---


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
// Analytics Data

router.get("/analytics", protect, authorizeRoles("supplier"), getSupplierAnalytics); // Placeholder for License and Certificates route
// router.get('/license-and-certificates', protect, authorizeRoles('supplier'), getLicensesAndCertificates);

module.exports = router;