// client/src/pages/customer/QuoteDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Truck,
  DollarSign,
  FileText,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";

const baseURL = process.env.REACT_APP_API_URL;

const QuoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quoteRequest, setQuoteRequest] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    loadQuoteDetails();
  }, [id]);

  const loadQuoteDetails = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(`${baseURL}/api/quotes/request/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log("✅ Quote details:", response.data);

      setQuoteRequest(response.data.data.quoteRequest);
      setResponses(response.data.data.responses);
    } catch (error) {
      console.error("❌ Load quote error:", error);
      toast.error("Failed to load quote details");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (responseId) => {
    if (
      !window.confirm(
        "Are you sure you want to accept this quote? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setAccepting(responseId);
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        `${baseURL}/api/quotes/request/${id}/accept/${responseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      toast.success("Quote accepted successfully!");

      // TODO: Navigate to order/checkout
      setTimeout(() => {
        navigate("/customer/quotes");
      }, 1500);
    } catch (error) {
      console.error("❌ Accept quote error:", error);
      toast.error(error.response?.data?.message || "Failed to accept quote");
    } finally {
      setAccepting(null);
    }
  };

  const handleCancelQuote = async () => {
    const reason = window.prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        `${baseURL}/api/quotes/request/${id}/cancel`,
        { reason },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      toast.success("Quote request cancelled");
      navigate("/customer/quotes");
    } catch (error) {
      console.error("❌ Cancel quote error:", error);
      toast.error("Failed to cancel quote");
    }
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

  if (!quoteRequest) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quote Not Found
            </h2>
            <button
              onClick={() => navigate("/customer/quotes")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Quotes
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const bestQuote =
    responses.length > 0
      ? responses.reduce((prev, curr) =>
          curr.totalAmount < prev.totalAmount ? curr : prev,
        )
      : null;

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/customer/quotes")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {quoteRequest.quoteNumber}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created {new Date(quoteRequest.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Status Badge */}
          <div>
            {quoteRequest.status === "pending" && (
              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Clock size={16} />
                Pending
              </span>
            )}
            {quoteRequest.status === "quoted" && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Package size={16} />
                {responses.length} Quotes Received
              </span>
            )}
            {quoteRequest.status === "accepted" && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <CheckCircle size={16} />
                Accepted
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Quote Request Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Items */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package size={20} />
                Items Required
              </h2>
              <div className="space-y-3">
                {quoteRequest.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.quantity} {item.unit}
                    </p>
                    {item.specifications && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.specifications}
                      </p>
                    )}
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Location */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Delivery Location
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>{quoteRequest.deliveryLocation.address}</p>
                <p>
                  {quoteRequest.deliveryLocation.city},{" "}
                  {quoteRequest.deliveryLocation.state}
                </p>
                <p>{quoteRequest.deliveryLocation.pincode}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Timeline
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Required By:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(quoteRequest.requiredBy).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Days Left:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(quoteRequest.requiredBy) - new Date()) /
                          (1000 * 60 * 60 * 24),
                      ),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {quoteRequest.additionalNotes && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  Additional Notes
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {quoteRequest.additionalNotes}
                </p>
              </div>
            )}

            {/* Actions */}
            {quoteRequest.status !== "accepted" &&
              quoteRequest.status !== "cancelled" && (
                <button
                  onClick={handleCancelQuote}
                  className="w-full px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition"
                >
                  Cancel Quote Request
                </button>
              )}
          </div>

          {/* Right: Quote Responses */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Supplier Quotes
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {responses.length} supplier{responses.length !== 1 ? "s" : ""}{" "}
                responded
              </p>
            </div>

            {responses.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
                <Clock
                  size={64}
                  className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Waiting for Quotes
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Suppliers will respond with their quotes soon
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {responses.map((response, idx) => (
                  <div
                    key={response._id}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 transition ${
                      bestQuote?._id === response._id
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  >
                    {/* Best Price Badge */}
                    {bestQuote?._id === response._id && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-bold">
                          <TrendingDown size={16} />
                          Best Price
                        </span>
                      </div>
                    )}

                    {/* Supplier Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {response.supplier?.name?.[0] || "S"}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {response.supplier?.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            {response.supplier?.averageRating && (
                              <span className="flex items-center gap-1">
                                <Star
                                  size={14}
                                  className="text-yellow-500 fill-yellow-500"
                                />
                                {response.supplier.averageRating.toFixed(1)}
                              </span>
                            )}
                            <span>•</span>
                            <span>{response.responseNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      {response.status === "accepted" && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                          Accepted
                        </span>
                      )}
                    </div>

                    {/* Items Pricing */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Item-wise Pricing
                      </h4>
                      <div className="space-y-2">
                        {response.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.quantity} {item.unit} × ₹
                                {item.unitPrice.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              ₹{item.totalPrice.toLocaleString("en-IN")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                          <DollarSign size={16} />
                          <span className="text-xs font-medium">Total</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ₹{response.totalAmount.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                          <Truck size={16} />
                          <span className="text-xs font-medium">Delivery</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {response.estimatedDeliveryDays} days
                        </p>
                      </div>

                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                          <Clock size={16} />
                          <span className="text-xs font-medium">
                            Valid Until
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {new Date(response.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Terms */}
                    {response.terms && (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Terms & Conditions:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {response.terms}
                        </p>
                      </div>
                    )}

                    {/* Accept Button */}
                    {quoteRequest.status !== "accepted" &&
                      response.status === "pending" && (
                        <button
                          onClick={() => handleAcceptQuote(response._id)}
                          disabled={accepting === response._id}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={20} />
                          {accepting === response._id
                            ? "Accepting..."
                            : "Accept This Quote"}
                        </button>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default QuoteDetails;
