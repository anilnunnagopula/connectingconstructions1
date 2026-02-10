// client/src/components/StatCard.jsx
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = "blue",
  onClick,
  badge,
  badgeColor,
}) => {
  // Color variants
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  };

  const iconBgClass = colorClasses[color] || colorClasses.blue;

  // Determine if card is clickable
  const isClickable = typeof onClick === "function";

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl shadow-md 
        p-6 
        border border-gray-100 dark:border-gray-700
        transition-all duration-300
        ${isClickable ? "cursor-pointer hover:shadow-xl hover:-translate-y-1" : ""}
        relative
      `}
    >
      {/* Badge (if provided) */}
      {badge && (
        <span
          className={`
            absolute top-3 right-3 
            ${badgeColor || "bg-red-500"} 
            text-white text-xs font-bold 
            px-2 py-1 rounded-full
          `}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div
        className={`${iconBgClass} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {value}
        </p>

        {/* Trend Indicator */}
        {trend !== undefined && trend !== null && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{trend}%
                </span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  {trend}%
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">No change</span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              vs last period
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
