// client/src/pages/supplier/components/ProfileCompletionWidget.jsx
import React from "react";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileCompletionWidget = ({ percentage = 0, missing = [] }) => {
  const navigate = useNavigate();

  if (percentage === 100) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-4 sm:p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle
            className="text-green-600 dark:text-green-400"
            size={24}
          />
          <h2 className="text-lg sm:text-xl font-bold text-green-900 dark:text-green-100">
            Profile Complete!
          </h2>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300">
          Your profile is fully set up and verified. Great job! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="text-orange-600" size={20} />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          Complete Your Profile
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {percentage}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Missing Items */}
      {missing.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Missing Information:
          </p>
          <ul className="space-y-1.5">
            {missing.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => navigate("/supplier/settings")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
      >
        Complete Now
        <ArrowRight size={18} />
      </button>

      {/* Info Text */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
        A complete profile improves customer trust by {100 - percentage}%
      </p>
    </div>
  );
};

export default ProfileCompletionWidget;
