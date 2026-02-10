// client/src/pages/customer/CustomerNotifications.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Bell,
  AlertTriangle,
  Star,
  Edit,
  CheckCircle,
  Truck,
  X,
  Package,
  MessageSquare,
  DollarSign,
  Trash2,
  Check,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";

const baseURL = process.env.REACT_APP_API_URL;

const CustomerNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  const filters = [
    { label: "All", value: "all" },
    { label: "Orders", value: "order" },
    { label: "Quotes", value: "quote" },
    { label: "Payments", value: "payment" },
    { label: "Delivery", value: "delivery" },
  ];

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const params = filter !== "all" ? `?type=${filter}` : "";
      const response = await axios.get(
        `${baseURL}/api/notifications${params}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      console.log("✅ Notifications loaded:", response.data);
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error("❌ Load notifications error:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        `${baseURL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("❌ Mark as read error:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        `${baseURL}/api/notifications/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      toast.success("All notifications marked as read");
      loadNotifications();
    } catch (error) {
      console.error("❌ Mark all as read error:", error);
      toast.error("Failed to update notifications");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.delete(`${baseURL}/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("❌ Delete notification error:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.delete(`${baseURL}/api/notifications/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success("All notifications deleted");
      loadNotifications();
    } catch (error) {
      console.error("❌ Delete all error:", error);
      toast.error("Failed to delete notifications");
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Navigate to action URL
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getIcon = (type, iconName) => {
    const icons = {
      order: <Package size={20} />,
      quote: <MessageSquare size={20} />,
      payment: <DollarSign size={20} />,
      delivery: <Truck size={20} />,
      review: <Star size={20} />,
      system: <Bell size={20} />,
    };
    return icons[type] || <Bell size={20} />;
  };

  const getIconColor = (color) => {
    const colors = {
      green: "text-green-500",
      blue: "text-blue-500",
      yellow: "text-yellow-500",
      red: "text-red-500",
      purple: "text-purple-500",
      indigo: "text-indigo-500",
    };
    return colors[color] || "text-gray-500";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="text-blue-600" size={32} />
              Notifications
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center gap-2"
                >
                  <Check size={16} />
                  Mark all read
                </button>
              )}
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Bell
              size={64}
              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "all"
                ? "You're all caught up!"
                : `No ${filter} notifications`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`relative flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border transition cursor-pointer ${
                  notification.isRead
                    ? "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    : "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.isRead
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "bg-blue-100 dark:bg-blue-900/30"
                  }`}
                >
                  <span className={getIconColor(notification.iconColor)}>
                    {getIcon(notification.type, notification.icon)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className={`font-semibold ${
                        notification.isRead
                          ? "text-gray-900 dark:text-white"
                          : "text-blue-900 dark:text-blue-100"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(notification.createdAt)}
                    </p>
                    {notification.priority === "high" && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-medium">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification._id);
                  }}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerNotifications;
