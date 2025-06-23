import React from "react";

const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-10">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        📦 Recent Orders
      </h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.slice(0, 4).map((order) => (
            <div
              key={order.id}
              className="border-l-4 pl-4 border-blue-500 bg-gray-50 dark:bg-gray-700 p-3 rounded"
            >
              <p className="text-gray-900 dark:text-white font-medium">
                {order.item}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {order.date} • Status:{" "}
                <span
                  className={`font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>
          ))}
          <button
            onClick={() => (window.location.href = "/my-orders")}
            className="text-blue-600 hover:underline mt-2 text-sm"
          >
            ➕ View all orders
          </button>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">No orders found.</p>
      )}
    </div>
  );
};

export default RecentOrders;
