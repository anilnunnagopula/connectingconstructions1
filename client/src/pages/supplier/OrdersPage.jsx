import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SupplierLayout from "../../layout/SupplierLayout"; // Import SupplierLayout

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null); // To track which order is being updated
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Define possible order statuses (adjust to match your backend model)
  // Define possible order statuses (must match backend validation)
  const orderStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // Helper to get token
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  // Fetch orders for the supplier
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      // Assuming endpoint to get orders for the logged-in supplier
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/orders`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to fetch orders."
        );
      }

      // Handle different response structures from backend
      const ordersArray = Array.isArray(data)
        ? data
        : data.orders || data.data?.orders || [];

      setOrders(ordersArray);
      setMessage("Orders loaded successfully.");
      setMessageType("success");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setMessage(err.message || "Error loading orders.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle message timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle Order Status Change
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId); // Set loading state for this specific order
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setUpdatingOrderId(null);
      navigate("/login");
      return;
    }

    try {
      // Assuming your backend has an endpoint like /api/supplier/orders/:id/status
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Failed to update order status to ${newStatus}.`
        );
      }

      // Update the order in local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      setMessage(`Order ${orderId} status updated to ${newStatus}.`);
      setMessageType("success");
    } catch (err) {
      console.error("Error updating order status:", err);
      setMessage(err.message || "Failed to update order status.");
      setMessageType("error");
    } finally {
      setUpdatingOrderId(null); // Clear loading state for the order
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <SupplierLayout>
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans p-6 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          🧾 Manage Orders
        </h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium shadow-md ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : messageType === "error"
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
            } transition-colors duration-300`}
          >
            {message}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-600 dark:text-gray-300">
            <p className="text-lg mb-4">
              No orders found. Keep an eye out for new customer purchases!
            </p>
            {/* Optional: Link back to dashboard or products page */}
            <button
              onClick={() => navigate("/supplier-dashboard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-4 border-gray-300 dark:border-gray-600">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Order ID: {order._id.slice(0, 8)}...
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Order Date: {formatDate(order.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Customer: {order.customerDetails?.name || "N/A"} (
                      {order.customerDetails?.email || "N/A"})
                    </p>
                  </div>
                  <div className="mt-3 md:mt-0 text-right">
                    <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                      ₹{parseFloat(order.totalAmount).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : order.orderStatus === "confirmed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : order.orderStatus === "processing"
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                          : order.orderStatus === "shipped"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          : order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Items:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {order.products &&
                      order.products.map((item) => (
                        <li
                          key={item.productId}
                          className="text-gray-700 dark:text-gray-300 text-sm"
                        >
                          {item.name} (x{item.quantity}) - ₹
                          {parseFloat(item.price).toLocaleString("en-IN")}
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Actions: Update Status */}
                <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <label
                    htmlFor={`status-${order._id}`}
                    className="text-gray-700 dark:text-gray-300 text-sm font-medium"
                  >
                    Update Status:
                  </label>
                  <select
                    id={`status-${order._id}`}
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={updatingOrderId === order._id}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {updatingOrderId === order._id && (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </SupplierLayout>
  );
};

export default OrdersPage;
