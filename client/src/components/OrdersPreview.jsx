import React from "react";

const dummyOrders = [
  {
    id: 1,
    product: "Cement UltraTech",
    date: "2025-06-15",
    status: "Delivered",
  },
  { id: 2, product: "TMT Steel Bars", date: "2025-06-10", status: "Shipped" },
];

const OrdersPreview = () => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Recent Orders
      </h2>
      <ul className="space-y-2">
        {dummyOrders.map((order) => (
          <li
            key={order.id}
            className="flex justify-between items-center text-sm border-b pb-1 dark:border-gray-700"
          >
            <span>{order.product}</span>
            <span className="text-gray-500 dark:text-gray-400">
              {order.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPreview;
