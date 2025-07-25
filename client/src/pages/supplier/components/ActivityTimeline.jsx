// src/pages/Supplier/components/ActivityTimeline.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate if you want to make it clickable
import { formatDistanceToNow } from "date-fns"; // You might need to install date-fns: npm install date-fns

const ActivityTimeline = ({ events }) => {
  // If you want the entire component to be clickable and navigate to a full activity log page:
  const navigate = useNavigate();

  if (!events || events.length === 0) {
    return (
      <div
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
        onClick={() => navigate("/supplier/activity-logs")} // Navigate to the detailed activity logs page
        aria-label="View all recent activity"
      >
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          📜 Recent Activity
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No recent activity to show.
        </p>
      </div>
    );
  }

  return (
    // Wrap the entire component in a clickable div
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={() => navigate("/supplier/activity-logs")} // Navigate to the detailed activity logs page
      aria-label="View all recent activity"
    >
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        📜 Recent Activity
      </h3>
      <ul className="space-y-4">
        {events.map((event, index) => (
          <li
            key={event.id || index}
            className="border-l-2 border-blue-500 pl-4 py-2"
          >
            <p className="font-semibold dark:text-white">{event.type}</p>
            <p className="text-gray-700 dark:text-gray-300">{event.message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {event.timestamp
                ? formatDistanceToNow(new Date(event.timestamp), {
                    addSuffix: true,
                  })
                : "N/A"}
            </p>
          </li>
        ))}
      </ul>
      {events.length > 0 && ( // Only show "View All" if there are events
        <p className="text-blue-600 text-sm mt-4 text-center">
          Click to view all activities
        </p>
      )}
    </div>
  );
};

export default ActivityTimeline;
