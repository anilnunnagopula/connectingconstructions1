// src/pages/Supplier/components/RatingsTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // Assuming you have date-fns installed

const RatingsTable = ({ reviews }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">
          ⭐ Customer Feedback
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No customer feedback yet.
        </p>
      </div>
    );
  }

  return (
    // Wrap the entire component in a clickable div
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={() => navigate("/supplier/customer-feedback")} // Navigate to a dedicated feedback page
      aria-label="View all customer feedback"
    >
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        ⭐ Customer Feedback
      </h3>
      <ul className="space-y-4">
        {reviews.slice(0, 3).map(
          (
            review // Display only top 3 for brevity
          ) => (
            <li
              key={review._id}
              className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
            >
              <div className="flex items-center mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {review.user?.name || "Anonymous"}
                </span>
                <span className="ml-2 text-yellow-500 flex">
                  {/* Render full stars */}
                  {Array(Math.floor(review.rating))
                    .fill()
                    .map((_, i) => (
                      <Star
                        key={`full-${i}`}
                        size={16}
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    ))}
                  {/* Render half star if applicable */}
                  {review.rating % 1 !== 0 && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="url(#half-gold)"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-yellow-500"
                    >
                      <defs>
                        <linearGradient id="half-gold">
                          <stop offset="50%" stopColor="gold" />
                          <stop offset="50%" stopColor="lightgray" />
                        </linearGradient>
                      </defs>
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.975 1.48-8.279L.001 9.306l8.332-1.151L12 .587z" />
                    </svg>
                  )}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({review.rating}) on {review.product?.name || "a product"}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                "{review.comment}"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {review.createdAt
                  ? formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </p>
            </li>
          )
        )}
      </ul>
      {reviews.length > 3 && (
        <p className="text-blue-600 text-sm mt-4 text-center">
          Click to view all feedback
        </p>
      )}
    </div>
  );
};

export default RatingsTable;
