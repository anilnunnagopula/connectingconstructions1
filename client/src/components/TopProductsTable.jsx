import React from "react";

const products = [
  {
    name: "Ultra Strong Cement",
    orders: 120,
    revenue: 36000,
    stock: "In Stock",
  },
  {
    name: "High Quality Iron Rods",
    orders: 95,
    revenue: 57000,
    stock: "Low Stock",
  },
  {
    name: "White Sand (1 Ton)",
    orders: 78,
    revenue: 31200,
    stock: "Out of Stock",
  },
];

const getStatusColor = (status) => {
  if (status === "In Stock") return "text-green-600";
  if (status === "Low Stock") return "text-yellow-500";
  return "text-red-500";
};

const TopProductsTable = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        🔥 Top-Selling Products
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300">
                Product
              </th>
              <th className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300">
                Orders
              </th>
              <th className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300">
                Revenue (₹)
              </th>
              <th className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="py-2 px-4 text-gray-800 dark:text-gray-100 font-medium">
                  {p.name}
                </td>
                <td className="py-2 px-4 text-gray-700 dark:text-gray-200">
                  {p.orders}
                </td>
                <td className="py-2 px-4 text-gray-700 dark:text-gray-200">
                  ₹ {p.revenue.toLocaleString()}
                </td>
                <td
                  className={`py-2 px-4 font-medium ${getStatusColor(p.stock)}`}
                >
                  {p.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProductsTable;
