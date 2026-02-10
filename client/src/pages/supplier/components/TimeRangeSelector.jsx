// client/src/pages/supplier/components/TimeRangeSelector.jsx
import React from "react";

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
  const ranges = [
    { value: 7, label: "7 Days" },
    { value: 30, label: "30 Days" },
    { value: 90, label: "90 Days" },
  ];

  return (
    <div className="flex items-center gap-2">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition ${
            selectedRange === range.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
