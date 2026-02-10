"use strict";

// server/controllers/notificationController.js
var Notification = require("../models/Notification");
/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */


exports.getNotifications = function _callee(req, res) {
  var userId, _req$query, type, isRead, _req$query$page, page, _req$query$limit, limit, query, notifications, total, unreadCount;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.user._id;
          _req$query = req.query, type = _req$query.type, isRead = _req$query.isRead, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 20 : _req$query$limit;
          query = {
            user: userId
          };

          if (type) {
            query.type = type;
          }

          if (isRead !== undefined) {
            query.isRead = isRead === "true";
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(Notification.find(query).sort({
            createdAt: -1
          }).limit(limit * 1).skip((page - 1) * limit).lean());

        case 8:
          notifications = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(Notification.countDocuments(query));

        case 11:
          total = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(Notification.countDocuments({
            user: userId,
            isRead: false
          }));

        case 14:
          unreadCount = _context.sent;
          res.status(200).json({
            success: true,
            data: {
              notifications: notifications,
              total: total,
              unreadCount: unreadCount,
              page: parseInt(page),
              pages: Math.ceil(total / limit)
            }
          });
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error("❌ Get notifications error:", _context.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
};
/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */


exports.markAsRead = function _callee2(req, res) {
  var id, userId, notification;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          userId = req.user._id;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Notification.findOne({
            _id: id,
            user: userId
          }));

        case 5:
          notification = _context2.sent;

          if (notification) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "Notification not found"
          }));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(notification.markAsRead());

        case 10:
          res.status(200).json({
            success: true,
            data: notification
          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Mark as read error:", _context2.t0);
          res.status(500).json({
            success: false,
            message: "Failed to update notification"
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};
/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */


exports.markAllAsRead = function _callee3(req, res) {
  var userId;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.user._id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Notification.markAllAsRead(userId));

        case 4:
          res.status(200).json({
            success: true,
            message: "All notifications marked as read"
          });
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error("❌ Mark all as read error:", _context3.t0);
          res.status(500).json({
            success: false,
            message: "Failed to update notifications"
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */


exports.deleteNotification = function _callee4(req, res) {
  var id, userId, notification;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          userId = req.user._id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Notification.findOneAndDelete({
            _id: id,
            user: userId
          }));

        case 5:
          notification = _context4.sent;

          if (notification) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Notification not found"
          }));

        case 8:
          res.status(200).json({
            success: true,
            message: "Notification deleted"
          });
          _context4.next = 15;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          console.error("❌ Delete notification error:", _context4.t0);
          res.status(500).json({
            success: false,
            message: "Failed to delete notification"
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
};
/**
 * @desc    Delete all notifications
 * @route   DELETE /api/notifications/all
 * @access  Private
 */


exports.deleteAllNotifications = function _callee5(req, res) {
  var userId;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.user._id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Notification.deleteMany({
            user: userId
          }));

        case 4:
          res.status(200).json({
            success: true,
            message: "All notifications deleted"
          });
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.error("❌ Delete all error:", _context5.t0);
          res.status(500).json({
            success: false,
            message: "Failed to delete notifications"
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
/**
 * @desc    Get unread count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */


exports.getUnreadCount = function _callee6(req, res) {
  var userId, count;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = req.user._id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Notification.countDocuments({
            user: userId,
            isRead: false
          }));

        case 4:
          count = _context6.sent;
          res.status(200).json({
            success: true,
            data: {
              count: count
            }
          });
          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error("❌ Get unread count error:", _context6.t0);
          res.status(500).json({
            success: false,
            message: "Failed to get unread count"
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};