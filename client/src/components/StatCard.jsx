import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * Enhanced StatCard Component
 * Production-ready stat card with trend indicators, loading states, and animations
 *
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {ReactElement} icon - Icon component (from lucide-react)
 * @param {number} trend - Percentage change (optional)
 * @param {string} trendLabel - Label for trend (e.g., "vs last week")
 * @param {boolean} loading - Loading state
 * @param {string} color - Accent color (blue, green, purple, orange, red)
 */
const StatCard = ({
  title,
  value,
  icon,
  trend = null,
  trendLabel = "vs last week",
  loading = false,
  color = "blue",
  onClick = null,
}) => {
  // Color mapping for different card types
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-800/50",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-800/50",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-800/50",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      icon: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-800/50",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-800/50",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  // Determine trend direction
  const getTrendIcon = () => {
    if (trend === null || trend === 0) return <Minus className="w-4 h-4" />;
    return trend > 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  const getTrendColor = () => {
    if (trend === null || trend === 0) return "text-gray-500";
    return trend > 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 
        transition-all duration-300 
        hover:shadow-xl hover:-translate-y-1
        ${onClick ? "cursor-pointer" : ""}
        border border-gray-100 dark:border-gray-700
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            {title}
          </p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </h2>

          {/* Trend Indicator */}
          {trend !== null && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}
            >
              {getTrendIcon()}
              <span>{Math.abs(trend)}%</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                {trendLabel}
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`${colors.iconBg} p-3 rounded-lg`}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
