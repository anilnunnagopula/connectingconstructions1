// client/src/pages/supplier/components/BusinessStatusWidget.jsx
import React, { useState } from "react";
import { Store, Clock, Power } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const BusinessStatusWidget = ({
  isOpen = true,
  businessHours = "9:00 AM - 6:00 PM",
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(isOpen);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.put(
        `${baseURL}/api/supplier/business-status`,
        { isOpen: !status },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );

      if (response.data.success) {
        setStatus(!status);
        toast.success(`Store is now ${!status ? "OPEN" : "CLOSED"}`);
        onStatusChange?.(!status);
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Store size={20} className="text-blue-600" />
          Store Status
        </h2>
      </div>

      {/* Status Display */}
      <div className="text-center mb-4">
        <div
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
            status
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              status ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span
            className={`text-xl font-bold ${
              status
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {status ? "OPEN" : "CLOSED"}
          </span>
        </div>
      </div>

      {/* Business Hours */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <Clock size={16} />
        <span>Hours: {businessHours}</span>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggleStatus}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 ${
          status
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        <Power size={18} />
        {loading ? "Updating..." : status ? "Go Offline" : "Go Online"}
      </button>

      {/* Info Text */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
        {status ? "Customers can place orders" : "New orders are paused"}
      </p>
    </div>
  );
};

export default BusinessStatusWidget;
