// client/src/pages/supplier/components/QuoteManagementWidget.jsx
import React from "react";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

const QuoteManagementWidget = ({ quotes, onNavigate }) => {
  const pendingCount =
    quotes?.filter((q) => q.status === "pending")?.length || 0;
  const respondedCount =
    quotes?.filter((q) => q.status === "responded")?.length || 0;
  const acceptedCount =
    quotes?.filter((q) => q.status === "accepted")?.length || 0;

  const stats = [
    { label: "Pending", count: pendingCount, color: "orange", icon: Clock },
    {
      label: "Responded",
      count: respondedCount,
      color: "blue",
      icon: MessageSquare,
    },
    {
      label: "Accepted",
      count: acceptedCount,
      color: "green",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="text-purple-600" size={24} />
          Quote Requests
        </h2>
        {pendingCount > 0 && (
          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-bold px-3 py-1 rounded-full animate-pulse">
            {pendingCount} New
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            orange:
              "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30",
            blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30",
            green:
              "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30",
          };

          return (
            <div
              key={stat.label}
              className={`p-4 rounded-xl border ${colorClasses[stat.color]} text-center`}
            >
              <Icon className="w-5 h-5 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-xs font-medium mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Quotes */}
      {quotes && quotes.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Recent Requests
          </p>
          {quotes.slice(0, 3).map((quote, index) => (
            <div
              key={quote._id || index}
              className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              onClick={() =>
                onNavigate?.(`/supplier/quote-requests/${quote._id}`)
              }
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {quote.customerName || "Customer"}
                </p>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    quote.status === "pending"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : quote.status === "accepted"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {quote.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {quote.items?.length || 0} item
                {quote.items?.length !== 1 ? "s" : ""} •
                {quote.createdAt &&
                  ` ${new Date(quote.createdAt).toLocaleDateString()}`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No quote requests yet
          </p>
        </div>
      )}

      {/* View All Button */}
      <button
        onClick={() => onNavigate?.("/supplier/quote-requests")}
        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium transition"
      >
        View All Quote Requests →
      </button>
    </div>
  );
};

export default QuoteManagementWidget;
