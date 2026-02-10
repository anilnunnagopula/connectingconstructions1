// client/src/pages/supplier/components/CustomerInsightsWidget.jsx
import React from "react";
import { Users, UserCheck, TrendingUp } from "lucide-react";

const CustomerInsightsWidget = ({
  totalCustomers = 0,
  repeatCustomers = 0,
}) => {
  const repeatRate =
    totalCustomers > 0
      ? Math.round((repeatCustomers / totalCustomers) * 100)
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Users className="text-purple-600" size={20} />
        Customer Insights
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Total Customers */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900/30">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalCustomers}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Total Customers
          </p>
        </div>

        {/* Repeat Customers */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900/30">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck
              size={18}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {repeatCustomers}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Repeat Buyers
          </p>
        </div>
      </div>

      {/* Repeat Rate */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp
              className="text-purple-600 dark:text-purple-400"
              size={18}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Repeat Rate
            </span>
          </div>
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {repeatRate}%
          </span>
        </div>
        <div className="mt-3 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${repeatRate}%` }}
          />
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
        {repeatRate >= 50
          ? "🎉 Excellent customer loyalty!"
          : repeatRate >= 30
            ? "👍 Good retention rate"
            : "💡 Focus on customer retention"}
      </p>
    </div>
  );
};

export default CustomerInsightsWidget;
