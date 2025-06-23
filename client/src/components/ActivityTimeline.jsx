import React from "react";
import { Clock, Box, Star, ShoppingCart } from "lucide-react";

const activities = [
  {
    icon: <Box className="text-yellow-500" />,
    title: "Product Added",
    desc: "You added 'Ultra Strong Cement'.",
    time: "2 hours ago",
  },
  {
    icon: <ShoppingCart className="text-green-500" />,
    title: "New Order",
    desc: "Order placed for 50 units of Iron Rods.",
    time: "5 hours ago",
  },
  {
    icon: <Star className="text-indigo-500" />,
    title: "New Review",
    desc: "⭐️⭐️⭐️⭐️⭐️ from Rahul Constructions",
    time: "1 day ago",
  },
  {
    icon: <Box className="text-red-500" />,
    title: "Stock Alert",
    desc: "'White Sand' is low in stock.",
    time: "2 days ago",
  },
];

const ActivityTimeline = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        📜 Recent Activity
      </h2>
      <ul className="space-y-5">
        {activities.map((item, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="text-xl">{item.icon}</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-200">
                {item.title}
              </p>
              <p className="text-gray-500 text-sm">{item.desc}</p>
              <p className="text-xs text-gray-400">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityTimeline;
