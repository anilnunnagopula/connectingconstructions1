// src/pages/Supplier/components/DeliveryStatusTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { format } from "date-fns"; // You might need to install date-fns

const DeliveryStatusTable = ({ orders }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          🚚 Delivery Status
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No recent deliveries to track.
        </p>
      </div>
    );
  }

  return (
    // Wrap the entire component in a clickable div
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={() => navigate("/supplier/orders")} // Navigate to the supplier's orders page
      aria-label="View all order delivery statuses"
    >
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        🚚 Delivery Status
      </h3>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Product(s)
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Buyer
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Order Date
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.orderId}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {order.orderId.slice(-6)}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {order.products.map((p) => `${p.name} (x${p.qty})`).join(", ")}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {order.buyerName}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                <span
                  className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                    order.status === "Delivered"
                      ? "text-green-900"
                      : order.status.includes("Processing")
                      ? "text-blue-900"
                      : "text-orange-900"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-0 opacity-50 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-200"
                        : order.status.includes("Processing")
                        ? "bg-blue-200"
                        : "bg-orange-200"
                    }`}
                  ></span>
                  <span className="relative dark:text-white">
                    {order.status}
                  </span>
                </span>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {order.createdAt
                  ? format(new Date(order.createdAt), "yyyy-MM-dd")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length > 0 && (
        <p className="text-blue-600 text-sm mt-4 text-center">
          Click to view all orders
        </p>
      )}
    </div>
  );
};

export default DeliveryStatusTable;
