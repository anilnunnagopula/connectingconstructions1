// client/src/pages/supplier/components/TopProductsWidget.jsx
import React from "react";
import { TrendingUp } from "lucide-react";

const TopProductsWidget = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={24} />
          Top Selling Products
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No sales data available yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="text-green-600" size={24} />
        Top Selling Products
      </h2>

      {/* Products List */}
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.productId || index}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {/* Rank Badge */}
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0
                    ? "bg-yellow-500 text-white"
                    : index === 1
                      ? "bg-gray-400 text-white"
                      : index === 2
                        ? "bg-orange-600 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                {index + 1}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.totalQuantity} {product.unit} sold
                </p>
              </div>
            </div>

            {/* Revenue */}
            <div className="text-right">
              <p className="font-bold text-green-600 dark:text-green-400">
                ₹{product.totalRevenue.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Revenue
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <button
        onClick={() => (window.location.href = "/supplier/top-products")}
        className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
      >
        View All Products →
      </button>
    </div>
  );
};

export default TopProductsWidget;
