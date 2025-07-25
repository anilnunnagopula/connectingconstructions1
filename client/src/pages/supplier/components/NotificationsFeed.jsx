// src/pages/Supplier/components/NotificationFeed.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { formatDistanceToNow } from "date-fns"; // For "time ago" formatting (npm install date-fns)

const NotificationFeed = ({ notifications }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  if (!notifications || notifications.length === 0) {
    return (
      <div
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
        onClick={() => navigate("/supplier/notifications")} // Navigate to the full notifications page
        aria-label="View all notifications"
      >
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          🔔 Notifications
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No new notifications.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={() => navigate("/supplier/notifications")} // Navigate to the full notifications page
      aria-label="View all notifications"
    >
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        🔔 Notifications
      </h3>
      <ul className="space-y-4">
        {/* Display a limited number of notifications on the dashboard feed */}
        {notifications.slice(0, 5).map((notif, index) => (
          <li
            key={notif.id || index}
            className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className={`font-medium ${
                  notif.type === "New Order"
                    ? "text-blue-600"
                    : notif.type === "Stock Alert"
                    ? "text-red-600"
                    : notif.type === "New Review"
                    ? "text-yellow-600"
                    : "text-gray-600 dark:text-gray-300" // Default color
                }`}
              >
                {notif.type}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {notif.timestamp
                  ? formatDistanceToNow(new Date(notif.timestamp), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {notif.message}
            </p>
          </li>
        ))}
      </ul>
      {notifications.length > 5 && ( // Show "View All" if there are more than 5
        <p className="text-blue-600 text-sm mt-4 text-center">
          Click to view all notifications
        </p>
      )}
    </div>
  );
};

export default NotificationFeed;
