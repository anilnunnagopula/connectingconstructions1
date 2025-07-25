// supplier/components/RatingsTable.jsx
import React from "react";
import { Star } from "lucide-react";

const RatingsTable = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No customer feedback yet.
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        Customer Feedback
      </h3>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review._id}
            className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
          >
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {review.user?.name || "Anonymous"}
              </span>
              <span className="ml-2 text-yellow-500 flex">
                {Array(Math.floor(review.rating))
                  .fill()
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                {review.rating % 1 !== 0 && (
                  <Star size={16} fill="url(#half)" strokeWidth={0} />
                )}{" "}
                {/* For half stars */}
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="gold" />
                    <stop offset="50%" stopColor="lightgray" />
                  </linearGradient>
                </defs>
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({review.rating}) on {review.product?.name || "a product"}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm italic">
              "{review.comment}"
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RatingsTable;
