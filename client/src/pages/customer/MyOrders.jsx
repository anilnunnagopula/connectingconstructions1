import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../layout/CustomerLayout";
import {
  Package,
  Calendar,
  MapPin,
  ChevronRight,
  Search,
  Filter,
  ArrowLeft,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ShoppingBag,
  Star,
} from "lucide-react";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("Please login to view your orders");
          setLoading(false);
          return;
        }

        const { token } = JSON.parse(storedUser);

        const res = await axios.get(`${API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Handle different response structures
        // Backend returns: { success: true, data: { orders: [], total: ... } }
        let ordersData = [];
        if (res.data && res.data.data && Array.isArray(res.data.data.orders)) {
            ordersData = res.data.data.orders;
        } else if (res.data && Array.isArray(res.data.orders)) {
            ordersData = res.data.orders;
        } else if (Array.isArray(res.data)) {
            ordersData = res.data;
        }
        
        setOrders(ordersData);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL]);

  // Filter orders based on tab and search
  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "all" ||
      order.orderStatus?.toLowerCase() === activeTab.toLowerCase();
    
    const searchString = searchTerm.toLowerCase();
    const orderId = order._id?.slice(-6) || "";
    // Check items safely
    const hasItemMatch = order.items?.some(item => {
        const name = item.productSnapshot?.name || item.product?.name || "";
        return name.toLowerCase().includes(searchString);
    });

    return matchesTab && (orderId.includes(searchString) || hasItemMatch);
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock size={14} />,
      processing: <Package size={14} />,
      shipped: <Truck size={14} />,
      delivered: <CheckCircle size={14} />,
      cancelled: <XCircle size={14} />,
    };
    return icons[status?.toLowerCase()] || <AlertCircle size={14} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAddress = (addr) => {
    if (!addr) return "Address not available";
    // Check if it's an object (schema structure) or string
    if (typeof addr === 'string') return addr;
    
    const parts = [
      addr.addressLine1,
      addr.addressLine2,
      addr.city,
      addr.state,
      addr.pincode
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-500">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/customer-dashboard")}
              className="flex items-center text-gray-500 hover:text-gray-700 mb-2 transition"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="text-blue-600" />
              My Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and manage your orders
            </p>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Order ID or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          {[
            "All",
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.toLowerCase()
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No orders found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
                {searchTerm
                  ? "We couldn't find any orders matching your search."
                  : "You haven't placed any orders yet. Start shopping to see your orders here."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/materials")}
                  className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition shadow-lg shadow-blue-600/20"
                >
                  Browse Materials
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 dark:text-white">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                          order.orderStatus,
                        )}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus?.charAt(0).toUpperCase() +
                          order.orderStatus?.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(order.createdAt)}
                      </span>
                      {order.deliverySlot && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Delivery: {order.deliverySlot.timeSlot}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/customer/orders/${order._id}`)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      title="View Details"
                    >
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6 grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div 
                          className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-600 cursor-pointer"
                          onClick={() => {
                            if (item.product?._id) {
                              navigate(`/customer/product/${item.product._id}`);
                            } else {
                              // Optional: toast("Product no longer available");
                            }
                          }}
                        >
                          {item.productSnapshot?.imageUrl ||
                          item.product?.imageUrls?.[0] ? (
                            <img
                              src={
                                item.productSnapshot?.imageUrl ||
                                item.product?.imageUrls?.[0]
                              }
                              alt={
                                item.productSnapshot?.name || item.product?.name
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 
                            className="font-medium text-gray-900 dark:text-white text-sm cursor-pointer hover:text-blue-600"
                            onClick={() => {
                              if (item.product?._id) {
                                navigate(`/customer/product/${item.product._id}`);
                              }
                            }}
                          >
                            {item.productSnapshot?.name ||
                              item.product?.name ||
                              "Product Name Unavailable"}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity}{" "}
                            {item.productSnapshot?.unit || item.product?.unit}
                          </p>
                          <p className="text-sm font-semibold text-blue-600 mt-1">
                            ₹
                            {item.priceAtOrder?.toLocaleString("en-IN") ||
                              item.totalPrice?.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Info */}
                  <div className="space-y-4 text-sm border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        Delivery Address
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                        {formatAddress(order.deliveryAddress)}
                      </p>
                    </div>

                    {order.trackingInfo?.trackingId && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Truck size={14} className="text-gray-400" />
                          Tracking
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                          ID: {order.trackingInfo.trackingId} <br />
                          Carrier: {order.trackingInfo.carrier}
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                        Payment: {order.paymentMethod?.toUpperCase()} (
                        {order.paymentStatus})
                      </span>
                    </div>
                    {/* ✅ ADD THIS ENTIRE BLOCK */}
                    {order.orderStatus === "delivered" && (
                      <button
                        onClick={() =>
                          navigate(`/customer/orders/${order._id}/review`)
                        }
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                      >
                        <Star size={14} />
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default MyOrders;
