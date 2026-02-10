// client/src/pages/supplier/components/RevenueChart.jsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ labels, data }) => {
  // Format data for recharts
  const chartData = labels.map((label, index) => ({
    day: label,
    revenue: data[index] || 0,
  }));

  // Calculate stats
  const totalRevenue = data.reduce((sum, val) => sum + val, 0);
  const avgRevenue = totalRevenue / data.length || 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].payload.day}
          </p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            📈 Revenue Trend
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last 7 days performance
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" className="text-xs" stroke="#6b7280" />
            <YAxis
              className="text-xs"
              stroke="#6b7280"
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No revenue data available
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Avg Daily
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{Math.round(avgRevenue).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Peak Day
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{Math.max(...data, 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
