// client/src/pages/customer/OrderTracking.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  Truck,
  Package,
  MapPin,
  Clock,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";

const baseURL = process.env.REACT_APP_API_URL;

const statusIcons = {
  pending: <Package className="text-blue-500" />,
  confirmed: <CheckCircle className="text-green-500" />,
  processing: <Package className="text-purple-500" />,
  shipped: <Truck className="text-yellow-500" />,
  delivered: <CheckCircle className="text-green-600" />,
  cancelled: <AlertCircle className="text-red-500" />,
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get("orderId");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInput, setTrackingInput] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.token) {
        toast.error("Please login to track orders");
        navigate("/login");
        return;
      }

      // Get recent orders
      const response = await axios.get(`${baseURL}/api/orders?limit=5`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log("✅ Orders loaded for tracking:", response.data);
      setOrders(response.data.data.orders || []);

      // If orderId in URL, scroll to that order
      if (orderIdFromUrl) {
        setTimeout(() => {
          const element = document.getElementById(`order-${orderIdFromUrl}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);
      }
    } catch (error) {
      console.error("❌ Load orders error:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingInput.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `${baseURL}/api/orders/${trackingInput}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      // Add to list if not already there
      const orderExists = orders.some((o) => o._id === response.data.data._id);
      if (!orderExists) {
        setOrders([response.data.data, ...orders]);
      }

      // Scroll to order
      setTimeout(() => {
        const element = document.getElementById(
          `order-${response.data.data._id}`,
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      setTrackingInput("");
    } catch (error) {
      console.error("❌ Track order error:", error);
      toast.error("Order not found or access denied");
    }
  };

  const getOrderStages = (order) => {
    const stages = [
      {
        key: "pending",
        label: "Order Placed",
        date: order.createdAt,
      },
      {
        key: "confirmed",
        label: "Confirmed",
        date: order.confirmedAt,
      },
      {
        key: "processing",
        label: "Processing",
        date: null,
      },
      {
        key: "shipped",
        label: "Shipped",
        date: order.shippedAt,
      },
      {
        key: "delivered",
        label: "Delivered",
        date: order.deliveredAt,
      },
    ];

    // Remove stages after current status for cancelled orders
    if (order.orderStatus === "cancelled") {
      return [
        {
          key: "pending",
          label: "Order Placed",
          date: order.createdAt,
        },
        {
          key: "cancelled",
          label: "Cancelled",
          date: order.cancelledAt,
        },
      ];
    }

    return stages;
  };

  const getCurrentStageIndex = (order) => {
    const stages = getOrderStages(order);
    return stages.findIndex((stage) => stage.key === order.orderStatus);
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
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/customer/orders")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Truck className="text-blue-600" />
              Order Tracking
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your recent orders
            </p>
          </div>
        </div>

        {/* Track by Order ID */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Track by Order ID
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
              placeholder="Enter Order ID (e.g., 698a1234...)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleTrackOrder}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Track
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
            <Truck
              size={64}
              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No orders to track
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Place an order to start tracking
            </p>
            <button
              onClick={() => navigate("/materials")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Browse Materials
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const stages = getOrderStages(order);
              const currentIndex = getCurrentStageIndex(order);

              return (
                <div
                  key={order._id}
                  id={`order-${order._id}`}
                  className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg ${
                    orderIdFromUrl === order._id ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Order ID
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </h3>
                    </div>

                    {/* Order Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Items
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.items?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Total
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Status
                        </p>
                        <p
                          className={`font-medium ${
                            order.orderStatus === "delivered"
                              ? "text-green-600"
                              : order.orderStatus === "cancelled"
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        >
                          {order.orderStatus?.charAt(0).toUpperCase() +
                            order.orderStatus?.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="relative mb-6">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{
                          width: `${
                            (currentIndex / (stages.length - 1)) * 100
                          }%`,
                        }}
                      />
                    </div>

                    {/* Stage Indicators */}
                    <div className="relative flex justify-between">
                      {stages.map((stage, index) => {
                        const isComplete = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                          <div
                            key={stage.key}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                isComplete
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                              } ${
                                isCurrent
                                  ? "ring-4 ring-blue-200 dark:ring-blue-900"
                                  : ""
                              }`}
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
                            {stage.date && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(stage.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.trackingInfo?.trackingId && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Truck className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">
                            Tracking Information
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tracking ID: {order.trackingInfo.trackingId}
                          </p>
                          {order.trackingInfo.carrier && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Carrier: {order.trackingInfo.carrier}
                            </p>
                          )}
                          {order.trackingInfo.estimatedDelivery && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Estimated Delivery:{" "}
                              {new Date(
                                order.trackingInfo.estimatedDelivery,
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">
                            Delivery Address
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.deliveryAddress.addressLine1}
                            {order.deliveryAddress.addressLine2 &&
                              `, ${order.deliveryAddress.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.deliveryAddress.city},{" "}
                            {order.deliveryAddress.state} -{" "}
                            {order.deliveryAddress.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <button
                    onClick={() => navigate(`/customer/orders/${order._id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                  >
                    View Full Order Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default OrderTracking;
