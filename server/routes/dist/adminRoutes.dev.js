"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect,
    authorize = _require.authorize;

var _require2 = require("../controllers/adminController"),
    getAllUsers = _require2.getAllUsers,
    verifySupplier = _require2.verifySupplier,
    updateUserStatus = _require2.updateUserStatus,
    getAdminStats = _require2.getAdminStats; // Basic stats


router.get("/stats", protect, authorize("admin"), getAdminStats); // User Management

router.get("/users", protect, authorize("admin"), getAllUsers);
router.patch("/users/:id/status", protect, authorize("admin"), updateUserStatus); // Supplier Verification

router.patch("/suppliers/:id/verify", protect, authorize("admin"), verifySupplier);
module.exports = router;