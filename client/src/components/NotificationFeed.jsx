import React from "react";
import { Bell, Box, Star, AlertTriangle, Edit } from "lucide-react";

const notifications = [
  {
    icon: <Bell className="text-green-500" />,
    title: "New Order",
    message: "Order #102 placed by Rahul Infra",
    time: "2 mins ago",
  },
  {
    icon: <AlertTriangle className="text-yellow-600" />,
    title: "Stock Low",
    message: "Only 5 bags of Cement left",
    time: "10 mins ago",
  },
  {
    icon: <Star className="text-indigo-500" />,
    title: "Review Received",
    message: "5★ from CityBuilders on Iron Rods",
    time: "1 hour ago",
  },
  {
    icon: <Edit className="text-blue-500" />,
    title: "Product Updated",
    message: "White Cement details were updated",
    time: "2 hours ago",
  },
];

const NotificationFeed = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        🔔 Notifications
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((n, idx) => (
          <li key={idx} className="flex items-start py-4 gap-4">
            <div className="text-xl">{n.icon}</div>
            <div className="flex flex-col">
              <p className="font-medium text-gray-900 dark:text-white">
                {n.title}
              </p>
              <p className="text-gray-500 text-sm">{n.message}</p>
              <p className="text-xs text-gray-400">{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationFeed;
