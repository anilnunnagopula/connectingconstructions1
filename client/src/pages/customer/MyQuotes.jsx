// client/src/pages/customer/MyQuotes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";

const baseURL = process.env.REACT_APP_API_URL;

const MyQuotes = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadQuotes();
  }, [filter]);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `${baseURL}/api/quotes/request${filter !== "all" ? `?status=${filter}` : ""}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setQuotes(response.data.data.quoteRequests);
    } catch (error) {
      console.error("❌ Load quotes error:", error);
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-200",
        label: "Pending",
        icon: Clock,
      },
      quoted: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-200",
        label: "Quotes Received",
        icon: MessageSquare,
      },
      accepted: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-200",
        label: "Accepted",
        icon: CheckCircle,
      },
      rejected: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-200",
        label: "Rejected",
        icon: XCircle,
      },
      expired: {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-800 dark:text-gray-200",
        label: "Expired",
        icon: Clock,
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              My Quote Requests
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {quotes.length} quote{quotes.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={() => navigate("/customer/quotes/request")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            New Quote
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "quoted", label: "Quoted" },
            { value: "accepted", label: "Accepted" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Quotes List */}
        {quotes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
            <MessageSquare
              size={64}
              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No quote requests yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first quote request to get custom pricing from
              suppliers
            </p>
            <button
              onClick={() => navigate("/customer/quotes/request")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Quote Request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote._id}
                onClick={() => navigate(`/customer/quotes/${quote._id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {quote.quoteNumber}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Created {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>

                {/* Items Summary */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Items:
                  </p>
                  <div className="space-y-1">
                    {quote.items.slice(0, 2).map((item, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        • {item.quantity} {item.unit} of {item.name}
                      </p>
                    ))}
                    {quote.items.length > 2 && (
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        +{quote.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Deliver to:</span>{" "}
                    {quote.deliveryLocation.city},{" "}
                    {quote.deliveryLocation.state}
                  </div>
                  <div className="flex items-center gap-4">
                    {quote.responseCount > 0 && (
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {quote.responseCount} response
                        {quote.responseCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MyQuotes;
