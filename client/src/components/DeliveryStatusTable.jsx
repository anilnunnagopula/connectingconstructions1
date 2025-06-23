import React, { useState } from "react";

const dummyOrders = [
  { id: 101, product: "Cement (50kg)", buyer: "Rahul Infra", status: "Packed" },
  {
    id: 102,
    product: "Iron Rods",
    buyer: "CityBuilders",
    status: "Out for Delivery",
  },
  {
    id: 103,
    product: "Concrete Mix",
    buyer: "HighRise Ltd.",
    status: "Delivered",
  },
];

const statusOptions = ["Packed", "Out for Delivery", "Delivered"];

const getStatusColor = (status) => {
  switch (status) {
    case "Packed":
      return "bg-yellow-500 text-white";
    case "Out for Delivery":
      return "bg-blue-500 text-white";
    case "Delivered":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-200";
  }
};

const DeliveryStatusTable = () => {
  const [orders, setOrders] = useState(dummyOrders);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...orders];
    updated[index].status = newStatus;
    setOrders(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        🚚 Delivery Status
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 px-4 text-gray-600 dark:text-gray-300">
                Order ID
              </th>
              <th className="py-2 px-4 text-gray-600 dark:text-gray-300">
                Product
              </th>
              <th className="py-2 px-4 text-gray-600 dark:text-gray-300">
                Buyer
              </th>
              <th className="py-2 px-4 text-gray-600 dark:text-gray-300">
                Status
              </th>
              <th className="py-2 px-4 text-gray-600 dark:text-gray-300">
                Update
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} className="border-b dark:border-gray-700">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.product}</td>
                <td className="py-2 px-4">{order.buyer}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(idx, e.target.value)}
                    className="rounded px-2 py-1 border dark:bg-gray-700 dark:text-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryStatusTable;
