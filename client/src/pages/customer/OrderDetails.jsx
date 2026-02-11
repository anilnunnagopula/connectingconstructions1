// client/src/pages/customer/OrderDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Phone,
  Mail,
  AlertCircle,
  Download,
  MessageSquare,
  FileText,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import ReportIssueModal from "../../components/ReportIssueModal";

const baseURL = process.env.REACT_APP_API_URL;

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(`${baseURL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log("✅ Order details:", response.data);
      setOrder(response.data.data);
    } catch (error) {
      console.error("❌ Load order error:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloadingInvoice(true);
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Use direct axios for blob response since we need it here
      const response = await axios.get(
        `${baseURL}/api/customer/invoices/${orderId}/download`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          responseType: "blob",
        }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${order.orderNumber || orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Download invoice error:", error);

      // Better error message based on status code
      if (error.response?.status === 400) {
        toast.error("Invoice is only available for delivered orders. This order hasn't been delivered yet.");
      } else if (error.response?.status === 404) {
        toast.error("Order not found");
      } else {
        toast.error("Failed to download invoice. Please try again later.");
      }
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const handleCancelOrder = async () => {
    const reason = window.prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    try {
      setCancelling(true);
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        `${baseURL}/api/orders/${orderId}/cancel`,
        { reason },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      toast.success("Order cancelled successfully");
      loadOrderDetails();
    } catch (error) {
      console.error("❌ Cancel order error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
      confirmed:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
      processing:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
      shipped:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200",
      delivered:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
      cancelled: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon size={18} />;
  };

  const orderStages = [
    { key: "pending", label: "Order Placed", dateField: "createdAt" },
    { key: "confirmed", label: "Confirmed", dateField: "confirmedAt" },
    { key: "processing", label: "Processing", dateField: null },
    { key: "shipped", label: "Shipped", dateField: "shippedAt" },
    { key: "delivered", label: "Delivered", dateField: "deliveredAt" },
  ];

  const getCurrentStageIndex = () => {
    if (!order) return 0;
    return orderStages.findIndex((stage) => stage.key === order.orderStatus);
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

  if (!order) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Order Not Found
            </h2>
            <button
              onClick={() => navigate("/customer/orders")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const currentStageIndex = getCurrentStageIndex();

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/customer/orders")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}
          >
            {getStatusIcon(order.orderStatus)}
            {order.orderStatus.charAt(0).toUpperCase() +
              order.orderStatus.slice(1)}
          </div>
        </div>

        {/* Order Tracking Timeline */}
        {order.orderStatus !== "cancelled" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Order Tracking
            </h2>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${(currentStageIndex / (orderStages.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Stage Indicators */}
              <div className="relative flex justify-between">
                {orderStages.map((stage, index) => {
                  const isComplete = index <= currentStageIndex;
                  const isCurrent = index === currentStageIndex;
                  const stageDate = stage.dateField
                    ? order[stage.dateField]
                    : null;

                  return (
                    <div key={stage.key} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                          isComplete
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-blue-200 dark:ring-blue-900" : ""}`}
                      >
                        {isComplete ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Clock size={20} />
                        )}
                      </div>
                      <p
                        className={`text-xs font-medium text-center ${
                          isComplete
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {stage.label}
                      </p>
                      {stageDate && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(stageDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package size={20} />
                Order Items ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                  >
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.productSnapshot?.imageUrl ||
                      item.product?.imageUrls?.[0] ? (
                        <img
                          src={
                            item.productSnapshot?.imageUrl ||
                            item.product?.imageUrls?.[0]
                          }
                          alt={item.productSnapshot?.name || item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.productSnapshot?.name || item.product?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}{" "}
                        {item.productSnapshot?.unit || item.product?.unit}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Price: ₹{item.priceAtOrder?.toLocaleString("en-IN")} /{" "}
                        {item.productSnapshot?.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{item.totalPrice?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Delivery Address
              </h2>
              <div className="text-gray-700 dark:text-gray-300">
                {order.deliveryAddress.fullName && (
                  <p className="font-medium">
                    {order.deliveryAddress.fullName}
                  </p>
                )}
                <p>{order.deliveryAddress.addressLine1}</p>
                {order.deliveryAddress.addressLine2 && (
                  <p>{order.deliveryAddress.addressLine2}</p>
                )}
                <p>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                </p>
                {order.deliveryAddress.phone && (
                  <p className="mt-2 flex items-center gap-2">
                    <Phone size={16} />
                    {order.deliveryAddress.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingInfo?.trackingId && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Truck size={20} />
                  Tracking Information
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tracking ID:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.trackingInfo.trackingId}
                    </span>
                  </div>
                  {order.trackingInfo.carrier && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Carrier:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {order.trackingInfo.carrier}
                      </span>
                    </div>
                  )}
                  {order.trackingInfo.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Estimated Delivery:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(
                          order.trackingInfo.estimatedDelivery,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary & Actions */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Delivery Fee</span>
                  <span>
                    {order.deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${order.deliveryFee?.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Tax (GST)</span>
                  <span>₹{order.tax?.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment Method:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment Status:
                  </span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === "paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quote Info */}
            {order.isFromQuote && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <MessageSquare size={18} />
                  Quote-Based Order
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  This order was created from an accepted quote.
                </p>
              </div>
            )}

            {/* Notes */}
            {order.customerNotes && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Your Notes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.customerNotes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {["pending", "confirmed"].includes(order.orderStatus) && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full px-6 py-3 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}

              {order.orderStatus === "delivered" && (
                <button
                  onClick={() => navigate(`/customer/orders/${orderId}/review`)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <MessageSquare size={20} />
                  Write a Review
                </button>
              )}

              {order.orderStatus === "delivered" && (
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloadingInvoice}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {downloadingInvoice ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      Download Invoice
                    </>
                  )}
                </button>
              )}

              <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={20} />
                  Report Issue
              </button>

              <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={20} />
                  Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>
      <ReportIssueModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        entityType="Order"
        entityId={orderId}
        entityName={`Order #${order.orderNumber}`}
      />
    </CustomerLayout>
  );
};

export default OrderDetails;
