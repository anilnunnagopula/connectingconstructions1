import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Eye,
  MessageSquare,
  IndianRupee,
  Calendar,
  User,
  MapPin,
  Phone,
  CreditCard,
} from "lucide-react";
import {
  fetchOrders,
  updateOrderStatus,
} from "../../services/dashboardService";
import SupplierLayout from "../../layout/SupplierLayout";

// ==================== STATUS CONFIGURATION ====================
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    border: "border-l-yellow-500",
    icon: Clock,
    nextActions: ["confirmed", "cancelled"],
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    border: "border-l-blue-500",
    icon: CheckCircle,
    nextActions: ["processing", "cancelled"],
  },
  processing: {
    label: "Processing",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    border: "border-l-indigo-500",
    icon: Package,
    nextActions: ["shipped", "cancelled"],
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    border: "border-l-purple-500",
    icon: Truck,
    nextActions: ["delivered"],
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    border: "border-l-green-500",
    icon: CheckCircle,
    nextActions: [],
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    border: "border-l-red-500",
    icon: XCircle,
    nextActions: [],
  },
};

const DATE_FILTERS = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
];

const OrdersPage = () => {
  const navigate = useNavigate();

  // ==================== STATE ====================
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Expanded orders
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Bulk selection
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Individual update tracking
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // ==================== LOAD ORDERS ====================
  const loadOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetchOrders();
      if (!response.success) throw new Error(response.error);

      const ordersArray = Array.isArray(response.data)
        ? response.data
        : response.data?.orders || response.data?.data?.orders || [];

      setOrders(ordersArray);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ==================== COMPUTED VALUES ====================
  const statusCounts = useMemo(() => {
    const counts = { all: orders.length };
    Object.keys(STATUS_CONFIG).forEach((s) => {
      counts[s] = orders.filter((o) => o.orderStatus === s).length;
    });
    return counts;
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.orderStatus !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [orders]);

  // ==================== FILTERING ====================
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status filter
    if (activeStatus !== "all") {
      result = result.filter((o) => o.orderStatus === activeStatus);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let cutoff;
      switch (dateFilter) {
        case "today":
          cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "7days":
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30days":
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90days":
          cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoff = null;
      }
      if (cutoff) {
        result = result.filter((o) => new Date(o.createdAt) >= cutoff);
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) => {
        const orderId = (o._id || "").toLowerCase();
        const orderNumber = (o.orderNumber || "").toLowerCase();
        const customerName = (o.customer?.name || o.customer?.fullName || "").toLowerCase();
        const customerEmail = (o.customer?.email || "").toLowerCase();
        const itemNames = (o.items || [])
          .map((i) => (i.productSnapshot?.name || "").toLowerCase())
          .join(" ");
        return (
          orderId.includes(q) ||
          orderNumber.includes(q) ||
          customerName.includes(q) ||
          customerEmail.includes(q) ||
          itemNames.includes(q)
        );
      });
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [orders, activeStatus, dateFilter, searchQuery]);

  // ==================== ACTIONS ====================
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (!response.success) throw new Error(response.error);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
      toast.success(`Order updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
    } catch (error) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    if (!window.confirm(`Update ${selectedOrders.length} orders to "${STATUS_CONFIG[bulkAction]?.label}"?`)) return;

    setBulkUpdating(true);
    let successCount = 0;
    let failCount = 0;

    for (const orderId of selectedOrders) {
      try {
        const response = await updateOrderStatus(orderId, bulkAction);
        if (response.success) {
          successCount++;
          setOrders((prev) =>
            prev.map((o) =>
              o._id === orderId ? { ...o, orderStatus: bulkAction } : o
            )
          );
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setBulkUpdating(false);
    setSelectedOrders([]);
    setBulkAction("");

    if (successCount > 0) toast.success(`${successCount} orders updated`);
    if (failCount > 0) toast.error(`${failCount} orders failed to update`);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o._id));
    }
  };

  // ==================== HELPERS ====================
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`;
  };

  const getOrderNumber = (order) => {
    return order.orderNumber || `ORD-${(order._id || "").slice(-8).toUpperCase()}`;
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <SupplierLayout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
          <div className="max-w-7xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
            <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </SupplierLayout>
    );
  }

  return (
    <SupplierLayout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ==================== HEADER ==================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Manage Orders
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
                {activeStatus !== "all" && ` (${STATUS_CONFIG[activeStatus]?.label})`}
                {" | "}Total Revenue: <span className="font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
              </p>
            </div>
            <button
              onClick={() => loadOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* ==================== STATUS SUMMARY CARDS ==================== */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {/* All orders card */}
            <button
              onClick={() => setActiveStatus("all")}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeStatus === "all"
                  ? "border-gray-900 dark:border-white bg-white dark:bg-gray-800 shadow-lg"
                  : "border-transparent bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.all}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">All Orders</p>
            </button>

            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveStatus(key)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    activeStatus === key
                      ? `border-current ${config.color} shadow-lg`
                      : `border-transparent bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600`
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-2xl font-bold">{statusCounts[key] || 0}</span>
                  </div>
                  <p className="text-xs font-medium truncate">{config.label}</p>
                </button>
              );
            })}
          </div>

          {/* ==================== SEARCH & FILTERS ==================== */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, email, or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* Date filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
              >
                {DATE_FILTERS.map((df) => (
                  <option key={df.value} value={df.value}>{df.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ==================== BULK ACTIONS ==================== */}
          {selectedOrders.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 cursor-pointer"
                />
                <p className="text-blue-900 dark:text-blue-200 font-medium">
                  {selectedOrders.length} order{selectedOrders.length !== 1 ? "s" : ""} selected
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                >
                  <option value="">Select Action</option>
                  <option value="confirmed">Mark Confirmed</option>
                  <option value="processing">Mark Processing</option>
                  <option value="shipped">Mark Shipped</option>
                  <option value="delivered">Mark Delivered</option>
                  <option value="cancelled">Cancel Orders</option>
                </select>
                <button
                  onClick={handleBulkUpdate}
                  disabled={!bulkAction || bulkUpdating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {bulkUpdating ? "Updating..." : "Apply"}
                </button>
                <button
                  onClick={() => { setSelectedOrders([]); setBulkAction(""); }}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* ==================== ORDERS LIST ==================== */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || activeStatus !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters or search query"
                  : "Orders will appear here when customers place them"}
              </p>
              {(searchQuery || activeStatus !== "all" || dateFilter !== "all") && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveStatus("all"); setDateFilter("all"); }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Select all header */}
              <div className="flex items-center gap-3 px-2">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Select all</span>
              </div>

              {filteredOrders.map((order) => {
                const isExpanded = expandedOrders.has(order._id);
                const statusConfig = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
                const StatusIcon = statusConfig.icon;
                const items = order.items || order.products || [];
                const customerName = order.customer?.name || order.customer?.fullName || order.deliveryAddress?.fullName || "N/A";
                const customerEmail = order.customer?.email || "";

                return (
                  <div
                    key={order._id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden border-l-4 ${statusConfig.border} transition-all`}
                  >
                    {/* Order Header - Always Visible */}
                    <div className="p-4 md:p-5">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleSelectOrder(order._id)}
                          className="w-4 h-4 mt-1 cursor-pointer flex-shrink-0"
                        />

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            {/* Left: Order info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                  {getOrderNumber(order)}
                                </h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${statusConfig.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {statusConfig.label}
                                </span>
                                {order.paymentStatus === "paid" && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                    Paid
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <User className="w-3.5 h-3.5" />
                                  {customerName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(order.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Package className="w-3.5 h-3.5" />
                                  {items.length} item{items.length !== 1 ? "s" : ""}
                                </span>
                              </div>

                              {/* Items preview */}
                              <div className="mt-2 flex flex-wrap gap-1">
                                {items.slice(0, 3).map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                                  >
                                    {item.productSnapshot?.name || item.name || "Product"} x{item.quantity}
                                  </span>
                                ))}
                                {items.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5">
                                    +{items.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right: Amount & Actions */}
                            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 flex-shrink-0">
                              <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(order.totalAmount)}
                              </p>

                              {/* Quick status update */}
                              {statusConfig.nextActions.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  {statusConfig.nextActions.map((nextStatus) => {
                                    const nextConfig = STATUS_CONFIG[nextStatus];
                                    const isCancel = nextStatus === "cancelled";
                                    return (
                                      <button
                                        key={nextStatus}
                                        onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                        disabled={updatingOrderId === order._id}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                                          isCancel
                                            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                      >
                                        {updatingOrderId === order._id ? "..." : nextConfig.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expand button */}
                        <button
                          onClick={() => toggleExpand(order._id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex-shrink-0"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 p-4 md:p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Items Detail */}
                          <div className="md:col-span-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Order Items
                            </h4>
                            <div className="space-y-2">
                              {items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                                >
                                  {/* Item image */}
                                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                    {(item.productSnapshot?.imageUrl || item.imageUrl) ? (
                                      <img
                                        src={item.productSnapshot?.imageUrl || item.imageUrl}
                                        alt={item.productSnapshot?.name || item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full">
                                        <Package className="w-6 h-6 text-gray-400" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Item info */}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                      {item.productSnapshot?.name || item.name || "Product"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {formatCurrency(item.priceAtOrder || item.productSnapshot?.price || item.price)}
                                      {item.productSnapshot?.unit ? ` / ${item.productSnapshot.unit}` : ""}
                                      {" x "}{item.quantity}
                                    </p>
                                  </div>

                                  {/* Item total */}
                                  <p className="font-bold text-gray-900 dark:text-white flex-shrink-0">
                                    {formatCurrency(item.totalPrice || (item.priceAtOrder || item.price || 0) * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                              </div>
                              {order.deliveryFee > 0 && (
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  <span>Delivery Fee</span>
                                  <span>{formatCurrency(order.deliveryFee)}</span>
                                </div>
                              )}
                              {order.tax > 0 && (
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  <span>Tax</span>
                                  <span>{formatCurrency(order.tax)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span>Total</span>
                                <span className="text-green-600">{formatCurrency(order.totalAmount)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Customer & Delivery Info */}
                          <div className="space-y-4">
                            {/* Customer Info */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Customer
                              </h4>
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-sm space-y-1.5">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {customerName}
                                </p>
                                {customerEmail && (
                                  <p className="text-gray-600 dark:text-gray-400">{customerEmail}</p>
                                )}
                                {order.customer?.phone && (
                                  <p className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                    <Phone className="w-3 h-3" />
                                    {order.customer.phone}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Delivery Address */}
                            {order.deliveryAddress && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Delivery Address
                                </h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-sm space-y-1">
                                  {order.deliveryAddress.fullName && (
                                    <p className="font-medium text-gray-900 dark:text-white">{order.deliveryAddress.fullName}</p>
                                  )}
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {order.deliveryAddress.addressLine1}
                                  </p>
                                  {order.deliveryAddress.addressLine2 && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                      {order.deliveryAddress.addressLine2}
                                    </p>
                                  )}
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {[order.deliveryAddress.city, order.deliveryAddress.state, order.deliveryAddress.pincode]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                  {order.deliveryAddress.phone && (
                                    <p className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                      <Phone className="w-3 h-3" />
                                      {order.deliveryAddress.phone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Payment Info */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment
                              </h4>
                              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-sm space-y-1.5">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Method</span>
                                  <span className="font-medium text-gray-900 dark:text-white uppercase">
                                    {order.paymentMethod || "COD"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                                  <span className={`font-medium ${
                                    order.paymentStatus === "paid"
                                      ? "text-green-600"
                                      : order.paymentStatus === "failed"
                                      ? "text-red-600"
                                      : "text-yellow-600"
                                  }`}>
                                    {(order.paymentStatus || "pending").charAt(0).toUpperCase() + (order.paymentStatus || "pending").slice(1)}
                                  </span>
                                </div>
                                {order.paidAt && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Paid At</span>
                                    <span className="text-gray-900 dark:text-white">{formatDate(order.paidAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Notes */}
                            {(order.customerNotes || order.supplierNotes) && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  Notes
                                </h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-sm space-y-2">
                                  {order.customerNotes && (
                                    <div>
                                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Customer Note:</p>
                                      <p className="text-gray-700 dark:text-gray-300">{order.customerNotes}</p>
                                    </div>
                                  )}
                                  {order.supplierNotes && (
                                    <div>
                                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Your Note:</p>
                                      <p className="text-gray-700 dark:text-gray-300">{order.supplierNotes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Tracking Info */}
                            {order.trackingInfo?.trackingId && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  Tracking
                                </h4>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-sm space-y-1">
                                  <p className="text-gray-900 dark:text-white font-medium">{order.trackingInfo.trackingId}</p>
                                  {order.trackingInfo.carrier && (
                                    <p className="text-gray-600 dark:text-gray-400">Carrier: {order.trackingInfo.carrier}</p>
                                  )}
                                  {order.trackingInfo.estimatedDelivery && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                      ETA: {formatDate(order.trackingInfo.estimatedDelivery)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Timestamps */}
                            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-0.5">
                              <p>Created: {formatDateTime(order.createdAt)}</p>
                              {order.confirmedAt && <p>Confirmed: {formatDateTime(order.confirmedAt)}</p>}
                              {order.shippedAt && <p>Shipped: {formatDateTime(order.shippedAt)}</p>}
                              {order.deliveredAt && <p>Delivered: {formatDateTime(order.deliveredAt)}</p>}
                              {order.cancelledAt && <p>Cancelled: {formatDateTime(order.cancelledAt)}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
};

export default OrdersPage;
