// client/src/pages/supplier/components/OrderStatusChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const OrderStatusChart = ({ orderStats }) => {
  // Format data for pie chart
  const data = [
    { name: "Pending", value: orderStats?.pending || 0, color: "#f59e0b" },
    { name: "Confirmed", value: orderStats?.confirmed || 0, color: "#3b82f6" },
    {
      name: "Processing",
      value: orderStats?.processing || 0,
      color: "#8b5cf6",
    },
    { name: "Shipped", value: orderStats?.shipped || 0, color: "#06b6d4" },
    { name: "Delivered", value: orderStats?.delivered || 0, color: "#10b981" },
    { name: "Cancelled", value: orderStats?.cancelled || 0, color: "#ef4444" },
  ].filter((item) => item.value > 0); // Only show statuses with orders

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].value} orders ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (total === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Order Distribution
        </h2>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No orders yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📊 Order Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.name}:{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {item.value}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusChart;
