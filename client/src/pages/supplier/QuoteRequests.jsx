// client/src/pages/supplier/QuoteRequests.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MessageSquare,
  MapPin,
  Calendar,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";
import SupplierLayout from "../../layout/SupplierLayout";

const baseURL = process.env.REACT_APP_API_URL;

const QuoteRequests = () => {
  const navigate = useNavigate();
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadQuoteRequests();
  }, [filter]);

  const loadQuoteRequests = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `${baseURL}/api/quotes/response/requests${filter !== "all" ? `?status=${filter}` : ""}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setQuoteRequests(response.data.data.quoteRequests);
    } catch (error) {
      console.error("❌ Load quote requests error:", error);
      toast.error("Failed to load quote requests");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SupplierLayout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quote Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {quoteRequests.length} request{quoteRequests.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: "all", label: "All" },
          { value: "pending", label: "New" },
          { value: "quoted", label: "Quoted" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === f.value
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Quote Requests List */}
      {quoteRequests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
          <MessageSquare
            size={64}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No quote requests yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Customers will send quote requests soon
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quoteRequests.map((quote) => (
            <div
              key={quote._id}
              onClick={() => navigate(`/supplier/quotes/respond/${quote._id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {quote.quoteNumber}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {quote.hasResponded ? (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle size={14} />
                    Responded
                  </span>
                ) : (
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock size={14} />
                    New
                  </span>
                )}
              </div>

              {/* Customer Info */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {quote.customer?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {quote.customer?.email}
                </p>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Package size={14} />
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
                      +{quote.items.length - 2} more
                    </p>
                  )}
                </div>
              </div>

              {/* Location & Date */}
              <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <MapPin size={14} />
                  {quote.deliveryLocation.city}
                </span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Calendar size={14} />
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(quote.requiredBy) - new Date()) /
                        (1000 * 60 * 60 * 24),
                    ),
                  )}{" "}
                  days
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </SupplierLayout>
  );
};

export default QuoteRequests;
