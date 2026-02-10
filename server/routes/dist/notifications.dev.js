"use strict";

// server/routes/notifications.js
var express = require("express");

var router = express.Router();

var _require = require("../middleware/authMiddleware"),
    protect = _require.protect;

var _require2 = require("../controllers/notificationController"),
    getNotifications = _require2.getNotifications,
    markAsRead = _require2.markAsRead,
    markAllAsRead = _require2.markAllAsRead,
    deleteNotification = _require2.deleteNotification,
    deleteAllNotifications = _require2.deleteAllNotifications,
    getUnreadCount = _require2.getUnreadCount; // All routes require authentication


router.use(protect); // Get notifications

router.get("/", getNotifications); // Get unread count

router.get("/unread-count", getUnreadCount); // Mark all as read

router.put("/read-all", markAllAsRead); // Mark single as read

router.put("/:id/read", markAsRead); // Delete all

router["delete"]("/all", deleteAllNotifications); // Delete single

router["delete"]("/:id", deleteNotification);
module.exports = router;