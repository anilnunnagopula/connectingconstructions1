// server/routes/notifications.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
} = require("../controllers/notificationController");

// All routes require authentication
router.use(protect);

// Get notifications
router.get("/", getNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark all as read
router.put("/read-all", markAllAsRead);

// Mark single as read
router.put("/:id/read", markAsRead);

// Delete all
router.delete("/all", deleteAllNotifications);

// Delete single
router.delete("/:id", deleteNotification);

module.exports = router;
