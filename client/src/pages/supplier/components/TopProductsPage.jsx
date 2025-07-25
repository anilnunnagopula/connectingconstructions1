// src/pages/Supplier/components/TopProductsTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TopProductsTable = ({ products }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          🔥 Top-Selling Products
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No top-selling products to display yet.
        </p>
      </div>
    );
  }

  return (
    // Wrap the entire component in a clickable div
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={() => navigate("/supplier/myproducts?sort=sales")} // Navigate to My Products, potentially sorted by sales
      aria-label="View all my products sorted by sales"
    >
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        🔥 Top-Selling Products
      </h3>
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Product
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Orders
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Revenue (₹)
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
              Stock
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.productId}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {product.name}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {product.orders}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {product.revenue.toLocaleString()}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm dark:text-white">
                {product.stock > 0
                  ? `${product.stock} In Stock`
                  : "Out of Stock"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length > 0 && ( // Only show "View All" if there are products
        <p className="text-blue-600 text-sm mt-4 text-center">
          Click to view all products
        </p>
      )}
    </div>
  );
};

export default TopProductsTable;
