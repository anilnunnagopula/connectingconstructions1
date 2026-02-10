// client/src/pages/supplier/components/LowStockWidget.jsx
import React from "react";
import { AlertTriangle, Package } from "lucide-react";

const LowStockWidget = ({ products, onNavigate }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="text-orange-600" size={24} />
          Low Stock Alerts
        </h2>
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <p className="text-green-600 dark:text-green-400 font-medium">
            All products are well stocked! 🎉
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="text-orange-600" size={24} />
          Low Stock Alerts
        </h2>
        <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-bold px-3 py-1 rounded-full">
          {products.length} Item{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Products List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {products.map((product, index) => (
          <div
            key={product._id || index}
            className="flex items-center gap-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition"
          >
            {/* Product Image */}
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              {product.imageUrls?.[0] ? (
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={20} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {product.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-sm font-bold ${
                    product.quantity === 0
                      ? "text-red-600 dark:text-red-400"
                      : product.quantity <= 5
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {product.quantity === 0
                    ? "OUT OF STOCK"
                    : `${product.quantity} ${product.unit || "units"} left`}
                </span>
              </div>
            </div>

            {/* Update Button */}
            <button
              onClick={() =>
                onNavigate?.(`/supplier/myproducts?edit=${product._id}`)
              }
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex-shrink-0"
            >
              Update
            </button>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button
        onClick={() => onNavigate?.("/supplier/myproducts?filter=low-stock")}
        className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
      >
        View All Low Stock Products →
      </button>
    </div>
  );
};

export default LowStockWidget;
