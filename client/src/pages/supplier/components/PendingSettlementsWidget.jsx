// client/src/pages/supplier/components/PendingSettlementsWidget.jsx
import React from "react";
import { DollarSign, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PendingSettlementsWidget = ({
  pendingAmount = 0,
  nextPayoutDate = null,
  lastPayoutAmount = 0,
}) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-4 sm:p-6 border border-green-200 dark:border-green-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="text-green-600" size={20} />
          Pending Payout
        </h2>
      </div>

      {/* Amount Display */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Amount to be paid
        </p>
        <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
          ₹{pendingAmount.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Next Payout Date */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <Calendar className="text-gray-600 dark:text-gray-400" size={18} />
        <div className="flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Next Payout
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatDate(nextPayoutDate)}
          </p>
        </div>
      </div>

      {/* Last Payout */}
      {lastPayoutAmount > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp size={16} className="text-green-600" />
          <span>
            Last payout:{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              ₹{lastPayoutAmount.toLocaleString("en-IN")}
            </span>
          </span>
        </div>
      )}

      {/* View Details Button */}
      <button
        onClick={() => navigate("/supplier/payments")}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        View Payment Details
        <ArrowRight size={18} />
      </button>

      {/* Info */}
      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
        Payouts are processed automatically
      </p>
    </div>
  );
};

export default PendingSettlementsWidget;
