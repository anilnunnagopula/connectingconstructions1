// client/src/pages/supplier/components/EnhancedSalesChart.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

const EnhancedSalesChart = ({
  labels = [],
  earnings = [],
  orders = [],
  currentPeriod = 7,
  onPeriodChange,
}) => {
  const [chartType, setChartType] = useState("area"); // 'area' or 'line'

  // Format data for recharts
  const chartData = labels.map((label, index) => ({
    day: label,
    earnings: earnings[index] || 0,
    orders: orders[index] || 0,
  }));

  // Calculate stats
  const totalEarnings = earnings.reduce((sum, val) => sum + val, 0);
  const totalOrders = orders.reduce((sum, val) => sum + val, 0);
  const avgEarnings = totalEarnings / earnings.length || 0;
  const peakEarnings = Math.max(...earnings, 0);

  const periods = [
    { label: "7 Days", value: 7 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.day}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            💰 Revenue: ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            📦 Orders: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const Chart = chartType === "area" ? AreaChart : LineChart;
  const DataComponent = chartType === "area" ? Area : Line;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
            <TrendingUp className="text-blue-600" size={20} />
            Sales Performance
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Revenue and order trends
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => onPeriodChange?.(period.value)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition ${
                  currentPeriod === period.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <Chart data={chartData}>
            {chartType === "area" && (
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
            )}
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="day"
              className="text-xs"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              className="text-xs"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
            <DataComponent
              yAxisId="left"
              type="monotone"
              dataKey="earnings"
              stroke="#3b82f6"
              strokeWidth={chartType === "line" ? 3 : 2}
              fillOpacity={1}
              fill={chartType === "area" ? "url(#colorEarnings)" : undefined}
              name="Revenue (₹)"
            />
            <DataComponent
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#8b5cf6"
              strokeWidth={chartType === "line" ? 3 : 2}
              fillOpacity={1}
              fill={chartType === "area" ? "url(#colorOrders)" : undefined}
              name="Orders"
            />
          </Chart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No sales data available
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Avg/Day
          </p>
          <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            ₹{Math.round(avgEarnings).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Peak</p>
          <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            ₹{peakEarnings.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSalesChart;
