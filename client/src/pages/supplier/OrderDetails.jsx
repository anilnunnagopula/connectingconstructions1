import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Printer,
  Clock,
} from "lucide-react";
import SupplierLayout from "../../layout/SupplierLayout";

import {
  fetchOrderDetails,
  updateOrderStatus,
  rejectOrder,
} from "../../services/dashboardService";

/**
 * Order Details Page
 * Full order view with customer info, products, and actions
 */
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Status update modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingInfo, setTrackingInfo] = useState({
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
  });

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetchOrderDetails(orderId);
      if (!response.success) {
        throw new Error(response.error);
      }
      setOrder(response.data);
    } catch (error) {
      console.error("Load order error:", error);
      toast.error(error.message || "Failed to load order details");
      navigate("/supplier/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    setUpdating(true);
    try {
      const response = await updateOrderStatus(
        orderId,
        newStatus,
        trackingInfo,
      );
      if (response.success) {
        toast.success("Order status updated!");
        setStatusModalOpen(false);
        loadOrderDetails();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      toast.error("Please select a reason");
      return;
    }

    setUpdating(true);
    try {
      const response = await rejectOrder(orderId, rejectReason);
      if (response.success) {
        toast.success("Order rejected");
        setRejectModalOpen(false);
        loadOrderDetails();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to reject order");
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-orange-100 text-orange-700",
      confirmed: "bg-blue-100 text-blue-700",
      processing: "bg-purple-100 text-purple-700",
      shipped: "bg-indigo-100 text-indigo-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      rejected: "bg-gray-100 text-gray-700",
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <SupplierLayout>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/supplier/orders")}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Order #{order.orderId || order._id?.slice(-6)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {order.status === "pending" && (
              <>
                <button
                  onClick={() => {
                    setNewStatus("confirmed");
                    setStatusModalOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept Order
                </button>
                <button
                  onClick={() => setRejectModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Order
                </button>
              </>
            )}

            {order.status === "confirmed" && (
              <button
                onClick={() => {
                  setNewStatus("shipped");
                  setStatusModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <Truck className="w-5 h-5" />
                Mark as Shipped
              </button>
            )}

            {order.status === "shipped" && (
              <button
                onClick={() => {
                  setNewStatus("delivered");
                  setStatusModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Delivered
              </button>
            )}

            <button
              onClick={handlePrintInvoice}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {order.customer?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {order.customer?.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {order.customer?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Address
            </h2>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900 dark:text-white">
                {order.deliveryAddress?.name || order.customer?.name}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {order.deliveryAddress?.street}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                PIN: {order.deliveryAddress?.pincode}
              </p>
              {order.deliveryAddress?.landmark && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Landmark: {order.deliveryAddress.landmark}
                </p>
              )}
              {order.deliveryInstructions && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Delivery Instructions:
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {order.deliveryInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items
          </h2>
          <div className="space-y-4">
            {order.products?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.product?.name || "Product"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    SKU: {item.product?.sku || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Price
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    ₹{item.price?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Subtotal: ₹{(item.quantity * item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span className="font-semibold">
                ₹{order.subtotal?.toLocaleString()}
              </span>
            </div>
            {order.deliveryCharges > 0 && (
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Delivery Charges</span>
                <span className="font-semibold">
                  ₹{order.deliveryCharges?.toLocaleString()}
                </span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax (GST)</span>
                <span className="font-semibold">
                  ₹{order.tax?.toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-green-600">
                  ₹{order.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Payment Method
                </span>
                <span className="font-semibold text-gray-900 dark:text-white uppercase">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Payment Status
                </span>
                <span
                  className={`font-semibold ${order.paymentStatus === "paid" ? "text-green-600" : "text-orange-600"}`}
                >
                  {order.paymentStatus?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Status History
            </h2>
            <div className="space-y-4">
              {order.statusHistory.map((history, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    {index < order.statusHistory.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {history.status}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(history.timestamp)}
                    </p>
                    {history.note && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {history.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Update Order Status
            </h3>

            {newStatus === "shipped" && (
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  placeholder="Vehicle Number (optional)"
                  value={trackingInfo.vehicleNumber}
                  onChange={(e) =>
                    setTrackingInfo({
                      ...trackingInfo,
                      vehicleNumber: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Driver Name (optional)"
                  value={trackingInfo.driverName}
                  onChange={(e) =>
                    setTrackingInfo({
                      ...trackingInfo,
                      driverName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Driver Phone (optional)"
                  value={trackingInfo.driverPhone}
                  onChange={(e) =>
                    setTrackingInfo({
                      ...trackingInfo,
                      driverPhone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStatusModalOpen(false);
                  setNewStatus("");
                  setTrackingInfo({
                    vehicleNumber: "",
                    driverName: "",
                    driverPhone: "",
                  });
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Reject Order
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please select a reason for rejecting this order:
            </p>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mb-4 text-gray-900 dark:text-white"
            >
              <option value="">Select reason...</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="outside_delivery_zone">
                Outside Delivery Zone
              </option>
              <option value="price_issue">Price Issue</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectReason("");
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || updating}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {updating ? "Processing..." : "Reject Order"}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </SupplierLayout>
  );
};

export default OrderDetails;
