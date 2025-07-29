import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// This component now accepts 'labels' and 'data' as props
const SalesChart = ({ labels, data }) => {
  // <--- MODIFIED: Accept props
  // Transform the separate labels and data arrays into the format Recharts expects
  // Recharts LineChart expects an array of objects like [{ day: 'Mon', sales: 3200 }, ...]
  const chartData = labels.map((label, index) => ({
    day: label,
    sales: data[index] || 0, // Ensure sales data is present, default to 0
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        📊 Weekly Earnings
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        {/* Pass the transformed chartData to LineChart */}
        <LineChart data={chartData}>
          {" "}
          {/* <--- MODIFIED: Use dynamic chartData */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* XAxis should use the 'day' key from the transformed data */}
          <XAxis dataKey="day" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />{" "}
          {/* Optional: Format tooltip for currency */}
          <Line
            type="monotone"
            dataKey="sales" // This key must match the key in transformed data objects
            stroke="#facc15"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
