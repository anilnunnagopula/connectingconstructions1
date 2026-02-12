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
                {(order.products || []).map((p) => `${p.name} (x${p.quantity || p.qty || 0})`).join(", ")}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {order.buyerName}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                {(() => {
                  const status = order.orderStatus || order.status || "pending";
                  const colorMap = {
                    delivered: { text: "text-green-900", bg: "bg-green-200" },
                    shipped: { text: "text-blue-900", bg: "bg-blue-200" },
                    processing: { text: "text-purple-900", bg: "bg-purple-200" },
                    confirmed: { text: "text-cyan-900", bg: "bg-cyan-200" },
                    cancelled: { text: "text-red-900", bg: "bg-red-200" },
                    pending: { text: "text-orange-900", bg: "bg-orange-200" },
                  };
                  const colors = colorMap[status] || colorMap.pending;
                  return (
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${colors.text}`}>
                      <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${colors.bg}`}></span>
                      <span className="relative dark:text-white capitalize">{status}</span>
                    </span>
                  );
                })()}
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
