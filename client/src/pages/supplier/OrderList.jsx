import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  fetchOrders,
  acceptOrder,
  rejectOrder,
} from "../../services/dashboardService";

/**
 * Production-Ready Order List Component
 * Features:
 * - Tabbed interface (Pending, Confirmed, Shipped, Delivered, Cancelled)
 * - Search and filters
 * - Quick actions (Accept/Reject)
 * - Real-time updates ready
 * - Mobile responsive
 */
const OrderList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ==================== STATE ====================
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filters
  const [activeTab, setActiveTab] = useState(
    searchParams.get("status") || "all",
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1,
  );
  const [dateFilter, setDateFilter] = useState(
    searchParams.get("date") || "all",
  );

  // Action states
  const [processingOrder, setProcessingOrder] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Tabs configuration
  const tabs = [
    { id: "all", label: "All Orders", color: "gray" },
    { id: "pending", label: "Pending", color: "orange", badge: true },
    { id: "confirmed", label: "Confirmed", color: "blue" },
    { id: "shipped", label: "Shipped", color: "purple" },
    { id: "delivered", label: "Delivered", color: "green" },
    { id: "cancelled", label: "Cancelled", color: "red" },
  ];

  // ==================== LOAD ORDERS ====================
  const loadOrders = useCallback(async () => {
    setLoading(true);

    try {
      const filters = {
        status: activeTab !== "all" ? activeTab : undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: 20,
        dateFilter: dateFilter !== "all" ? dateFilter : undefined,
      };

      // Update URL params
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("status", activeTab);
      if (searchQuery) params.set("search", searchQuery);
      if (currentPage > 1) params.set("page", currentPage.toString());
      if (dateFilter !== "all") params.set("date", dateFilter);
      setSearchParams(params);

      const response = await fetchOrders(filters);

      if (!response.success) {
        throw new Error(response.error);
      }

      setOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalOrders(response.data.total || 0);
    } catch (error) {
      console.error("Load orders error:", error);
      toast.error(error.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, currentPage, dateFilter, setSearchParams]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ==================== ACTIONS ====================
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAcceptOrder = async (orderId) => {
    setProcessingOrder(orderId);
    try {
      const response = await acceptOrder(orderId);
      if (response.success) {
        toast.success("Order accepted successfully!");
        loadOrders();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to accept order");
    } finally {
      setProcessingOrder(null);
    }
  };

  const openRejectModal = (orderId) => {
    setRejectOrderId(orderId);
    setRejectModalOpen(true);
  };

  const handleRejectOrder = async () => {
    if (!rejectReason) {
      toast.error("Please select a reason");
      return;
    }

    setProcessingOrder(rejectOrderId);
    try {
      const response = await rejectOrder(rejectOrderId, rejectReason);
      if (response.success) {
        toast.success("Order rejected");
        setRejectModalOpen(false);
        setRejectReason("");
        loadOrders();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to reject order");
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/supplier/orders/${orderId}`);
  };

  const handleRefresh = () => {
    loadOrders();
    toast.success("Orders refreshed");
  };

  // ==================== RENDER HELPERS ====================
  const getStatusBadge = (status) => {
    const configs = {
      pending: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Pending",
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Confirmed",
      },
      processing: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Processing",
      },
      shipped: {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        label: "Shipped",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Delivered",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
      rejected: { bg: "bg-gray-100", text: "text-gray-700", label: "Rejected" },
    };

    const config = configs[status] || configs.pending;

    return (
      <span
        className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Order #{order.orderId || order._id?.slice(-6)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
            <Clock className="w-4 h-4" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div>{getStatusBadge(order.status)}</div>
      </div>

      {/* Customer Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="font-medium">
            {order.customer?.name || "Unknown Customer"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          {order.customer?.phone || "N/A"}
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          {order.deliveryAddress?.city || "N/A"}
        </div>
      </div>

      {/* Order Details */}
      <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Amount
          </p>
          <p className="text-xl font-bold text-green-600">
            ₹{order.totalAmount?.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Items</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {order.products?.length || 0}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        {order.status === "pending" && (
          <>
            <button
              onClick={() => handleAcceptOrder(order._id || order.id)}
              disabled={processingOrder === order._id}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {processingOrder === order._id ? "Processing..." : "Accept"}
            </button>
            <button
              onClick={() => openRejectModal(order._id || order.id)}
              disabled={processingOrder === order._id}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        )}
        <button
          onClick={() => handleViewDetails(order._id || order.id)}
          className={`${
            order.status === "pending" ? "flex-none" : "flex-1"
          } bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2`}
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );

  // ==================== LOADING STATE ====================
  if (loading && orders.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl h-64"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {totalOrders} order{totalOrders !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const count = tab.badge
                ? orders.filter((o) => o.status === tab.id).length
                : null;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    px-6 py-4 font-semibold text-sm transition-colors relative
                    ${
                      activeTab === tab.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }
                  `}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || dateFilter !== "all" || activeTab !== "all"
                ? "Try adjusting your filters"
                : "You haven't received any orders yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard key={order._id || order.id} order={order} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

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
                onClick={handleRejectOrder}
                disabled={!rejectReason || processingOrder}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {processingOrder ? "Processing..." : "Reject Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
