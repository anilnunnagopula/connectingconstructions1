// client/src/components/skeletons/OrderSkeleton.jsx
import React from "react";

/**
 * Order Skeleton Loader
 * Specifically for order list items
 */
const OrderSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            {/* Order ID and date */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>

            {/* Status badge */}
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>

          {/* Items and total */}
          <div className="flex items-center justify-between mt-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSkeleton;
