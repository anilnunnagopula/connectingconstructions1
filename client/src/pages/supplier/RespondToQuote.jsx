// client/src/pages/supplier/RespondToQuote.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  DollarSign,
  Truck,
  Calendar,
  FileText,
  Send,
  Package,
  MapPin,
  User,
} from "lucide-react";

const baseURL = process.env.REACT_APP_API_URL;

const RespondToQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quoteRequest, setQuoteRequest] = useState(null);

  const [responseItems, setResponseItems] = useState([]);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(7);
  const [validityDays, setValidityDays] = useState(7);
  const [terms, setTerms] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("cod");

  useEffect(() => {
    loadQuoteRequest();
  }, [id]);

  const loadQuoteRequest = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      // Get all quote requests to find this one
      const response = await axios.get(
        `${baseURL}/api/quotes/response/requests`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      const quote = response.data.data.quoteRequests.find((q) => q._id === id);

      if (!quote) {
        throw new Error("Quote request not found");
      }

      setQuoteRequest(quote);

      // Initialize response items from request items
      setResponseItems(
        quote.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: 0,
          totalPrice: 0,
          deliveryTime: `${estimatedDeliveryDays} days`,
          notes: "",
        })),
      );
    } catch (error) {
      console.error("❌ Load quote request error:", error);
      toast.error("Failed to load quote request");
      navigate("/supplier/quotes");
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...responseItems];
    updated[index][field] = value;

    // Auto-calculate total price
    if (field === "unitPrice" || field === "quantity") {
      const unitPrice = parseFloat(updated[index].unitPrice) || 0;
      const quantity = parseFloat(updated[index].quantity) || 0;
      updated[index].totalPrice = unitPrice * quantity;
    }

    setResponseItems(updated);
  };

  const calculateTotalAmount = () => {
    const itemsTotal = responseItems.reduce(
      (sum, item) => sum + (parseFloat(item.totalPrice) || 0),
      0,
    );
    return itemsTotal + (parseFloat(deliveryCharges) || 0);
  };

  const getValidUntilDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + validityDays);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (responseItems.some((item) => !item.unitPrice || item.unitPrice <= 0)) {
      toast.error("Please provide unit price for all items");
      return;
    }

    if (!estimatedDeliveryDays || estimatedDeliveryDays <= 0) {
      toast.error("Please provide estimated delivery days");
      return;
    }

    setSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const payload = {
        quoteRequestId: id,
        items: responseItems,
        totalAmount: calculateTotalAmount(),
        deliveryCharges: parseFloat(deliveryCharges) || 0,
        estimatedDeliveryDays: parseInt(estimatedDeliveryDays),
        validUntil: getValidUntilDate(),
        terms,
        paymentTerms,
      };

      console.log("📤 Submitting quote response:", payload);

      const response = await axios.post(
        `${baseURL}/api/quotes/response`,
        payload,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      console.log("✅ Quote response submitted:", response.data);

      toast.success("Quote submitted successfully!");
      navigate("/supplier/quotes");
    } catch (error) {
      console.error("❌ Submit quote error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to submit quote";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!quoteRequest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 mb-4">Quote request not found</p>
          <button
            onClick={() => navigate("/supplier/quotes")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Quotes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/supplier/quotes")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Respond to Quote Request
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {quoteRequest.quoteNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quote Request Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} />
              Customer Details
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {quoteRequest.customer?.name}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {quoteRequest.customer?.email}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {quoteRequest.customer?.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Items Requested */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package size={20} />
              Items Requested
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
                      Specs: {item.specifications}
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
                Customer Notes
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {quoteRequest.additionalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Right: Quote Response Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign size={24} />
                Item-wise Pricing
              </h2>

              <div className="space-y-4">
                {responseItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="mb-3">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity} {item.unit}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Unit Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(index, "unitPrice", e.target.value)
                          }
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Total Price (₹)
                        </label>
                        <input
                          type="number"
                          value={item.totalPrice}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Delivery Time
                        </label>
                        <input
                          type="text"
                          value={item.deliveryTime}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "deliveryTime",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., 7 days"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Notes (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) =>
                            handleItemChange(index, "notes", e.target.value)
                          }
                          placeholder="Any specific details for this item"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Logistics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck size={24} />
                Delivery & Logistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={deliveryCharges}
                    onChange={(e) => setDeliveryCharges(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Delivery (days) *
                  </label>
                  <input
                    type="number"
                    value={estimatedDeliveryDays}
                    onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
                    placeholder="7"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Quote Validity & Terms */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={24} />
                Quote Validity & Terms
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quote Valid For (days) *
                  </label>
                  <input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    placeholder="7"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Valid until:{" "}
                    {new Date(getValidUntilDate()).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Terms *
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="advance_50">50% Advance</option>
                    <option value="advance_100">100% Advance</option>
                    <option value="credit_30">30 Days Credit</option>
                    <option value="custom">Custom Terms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Terms & Conditions (Optional)
                  </label>
                  <textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Any additional terms, conditions, or notes..."
                    rows={4}
                    maxLength={2000}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {terms.length}/2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quote Summary
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Items Total:</span>
                  <span className="font-medium">
                    ₹
                    {responseItems
                      .reduce((sum, item) => sum + (item.totalPrice || 0), 0)
                      .toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Delivery Charges:</span>
                  <span className="font-medium">
                    ₹{parseFloat(deliveryCharges || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total Amount:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      ₹{calculateTotalAmount().toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/supplier/quotes")}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {submitting ? "Submitting..." : "Submit Quote"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RespondToQuote;
