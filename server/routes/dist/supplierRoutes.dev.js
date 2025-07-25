"use strict";

// server/routes/supplierRoutes.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorizeRoles = _require.authorizeRoles; // Import existing controllers


var _require2 = require("../controllers/productController"),
    addProduct = _require2.addProduct,
    getMyProducts = _require2.getMyProducts,
    getProductById = _require2.getProductById,
    updateProduct = _require2.updateProduct,
    deleteProduct = _require2.deleteProduct,
    getAllProductsPublic = _require2.getAllProductsPublic,
    getProductByIdPublic = _require2.getProductByIdPublic;

var _require3 = require("../controllers/supplierDashboardController"),
    getSupplierDashboardData = _require3.getSupplierDashboardData;

var _require4 = require("../controllers/shopLocationController"),
    getShopLocations = _require4.getShopLocations,
    addShopLocation = _require4.addShopLocation,
    updateShopLocation = _require4.updateShopLocation,
    deleteShopLocation = _require4.deleteShopLocation; // NEW: Import the detailed data controller functions


var _require5 = require("../controllers/supplierDetailedDataController"),
    getAllActivityLogs = _require5.getAllActivityLogs,
    getDetailedTopProducts = _require5.getDetailedTopProducts,
    getAllCustomerFeedback = _require5.getAllCustomerFeedback,
    getAllDeliveryStatuses = _require5.getAllDeliveryStatuses,
    getAllNotifications = _require5.getAllNotifications; // Ensure path is correct
// --- Public Product Routes (Accessible by anyone) ---


router.get("/products", getAllProductsPublic);
router.get("/products/:id", getProductByIdPublic); // --- Supplier-specific Protected Routes (Require 'supplier' role) ---
// Dashboard Data

router.get("/dashboard", protect, authorizeRoles("supplier"), getSupplierDashboardData); // Product Management

router.route("/myproducts").post(protect, authorizeRoles("supplier"), addProduct).get(protect, authorizeRoles("supplier"), getMyProducts);
router.route("/myproducts/:id").get(protect, authorizeRoles("supplier"), getProductById).put(protect, authorizeRoles("supplier"), updateProduct)["delete"](protect, authorizeRoles("supplier"), deleteProduct); // Shop Location Management

router.route("/shop-locations").get(protect, authorizeRoles("supplier"), getShopLocations).post(protect, authorizeRoles("supplier"), addShopLocation);
router.route("/shop-locations/:id").put(protect, authorizeRoles("supplier"), updateShopLocation)["delete"](protect, authorizeRoles("supplier"), deleteShopLocation); // --- NEW DETAILED DATA ROUTES ---

router.get("/activity-logs", protect, authorizeRoles("supplier"), getAllActivityLogs);
router.get("/top-products", protect, authorizeRoles("supplier"), getDetailedTopProducts);
router.get("/customer-feedback", protect, authorizeRoles("supplier"), getAllCustomerFeedback);
router.get("/delivery-status", protect, authorizeRoles("supplier"), getAllDeliveryStatuses);
router.get("/notifications", protect, authorizeRoles("supplier"), getAllNotifications); // Add route for License and Certificates here when its controller is ready
// router.get('/license-and-certificates', protect, authorizeRoles('supplier'), getLicensesAndCertificates);

module.exports = router;