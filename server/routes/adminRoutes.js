const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  verifySupplier,
  updateUserStatus,
  getAdminStats,
  deleteProduct,
  updateSupplierTier,
  getSystemHealth,
  exportData
} = require("../controllers/adminController");
const { getSettings, updateSettings } = require("../controllers/settingsController");

// Basic stats
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);
router.get("/health", protect, authorizeRoles("admin"), getSystemHealth);
router.get("/export/:type", protect, authorizeRoles("admin"), exportData);

// System Settings
router.get("/settings", protect, authorizeRoles("admin"), getSettings);
router.put("/settings", protect, authorizeRoles("admin"), updateSettings);

// User Management
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.patch("/users/:id/status", protect, authorizeRoles("admin"), updateUserStatus);

// Product Moderation
router.delete("/products/:id", protect, authorizeRoles("admin"), deleteProduct);

const { getContactMessages, updateContactStatus } = require("../controllers/contactController");

// Supplier Verification
router.patch("/suppliers/:id/verify", protect, authorizeRoles("admin"), verifySupplier);
router.patch("/suppliers/:id/tier", protect, authorizeRoles("admin"), updateSupplierTier);

// Contact Messages
router.get("/contacts", protect, authorizeRoles("admin"), getContactMessages);
router.patch("/contacts/:id", protect, authorizeRoles("admin"), updateContactStatus);

// Announcements
const { 
    createAnnouncement, 
    getAllAnnouncements, 
    deleteAnnouncement, 
    toggleAnnouncementStatus 
} = require("../controllers/announcementController");

router.post("/announcements", protect, authorizeRoles("admin"), createAnnouncement);
router.get("/announcements", protect, authorizeRoles("admin"), getAllAnnouncements);
router.delete("/announcements/:id", protect, authorizeRoles("admin"), deleteAnnouncement);
router.patch("/announcements/:id/toggle", protect, authorizeRoles("admin"), toggleAnnouncementStatus);

module.exports = router;
