import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Star,
  Edit,
  CheckCircle,
  Truck,
  X,
} from "lucide-react";

// 📦 All notifications with type added
const initialNotifications = [
  {
    type: "order",
    icon: <Bell className="text-green-500" />,
    title: "New Order Placed",
    message: "Order #ORD128 for Bricks (10,000 units)",
    time: "Just now",
  },
  {
    type: "order",
    icon: <Truck className="text-blue-500" />,
    title: "Shipped",
    message: "Order #ORD125 - Wall Paint has been shipped.",
    time: "15 mins ago",
  },
  {
    type: "order",
    icon: <CheckCircle className="text-emerald-600" />,
    title: "Delivered",
    message: "Order #ORD126 - Sand delivered successfully.",
    time: "1 hour ago",
  },
  {
    type: "payment",
    icon: <AlertTriangle className="text-yellow-600" />,
    title: "Payment Alert",
    message: "Your invoice for #ORD127 is pending.",
    time: "Yesterday",
  },
  {
    type: "profile",
    icon: <Edit className="text-indigo-600" />,
    title: "Profile Updated",
    message: "Your contact information was updated.",
    time: "2 days ago",
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Orders", value: "order" },
  { label: "Payments", value: "payment" },
  { label: "Profile", value: "profile" },
];

const CustomerNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const handleDismiss = (index) => {
    const updated = [...notifications];
    updated.splice(index, 1);
    setNotifications(updated);
  };

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        🔔 Your Notifications
      </h1>

      {/* 🧭 Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === f.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 📨 Notification Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((n, index) => (
            <div
              key={index}
              className="relative flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="text-2xl">{n.icon}</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {n.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              <button
                onClick={() => handleDismiss(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-20">
          😶 No notifications under{" "}
          <b>{filters.find((f) => f.value === filter)?.label}</b>.
        </p>
      )}
    </div>
  );
};

export default CustomerNotifications;
