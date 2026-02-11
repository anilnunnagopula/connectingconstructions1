// client/src/components/skeletons/ListSkeleton.jsx
import React from "react";

/**
 * List Skeleton Loader
 * Used for loading states of list-based content
 */
const ListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <div className="flex items-start gap-4">
            {/* Image placeholder */}
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>

            {/* Content placeholder */}
            <div className="flex-1 space-y-2">
              {/* Title */}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

              {/* Subtitle */}
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>

              {/* Details */}
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>

            {/* Action placeholder */}
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListSkeleton;
