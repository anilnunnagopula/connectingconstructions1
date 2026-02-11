const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createComplaint, getComplaints, updateComplaintStatus } = require("../controllers/complaintController");

// Public/User routes
router.post("/", protect, createComplaint);

// Admin routes
router.get("/", protect, authorizeRoles("admin"), getComplaints);
router.patch("/:id", protect, authorizeRoles("admin"), updateComplaintStatus);

module.exports = router;
