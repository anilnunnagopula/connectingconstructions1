// client/src/pages/customer/CustomerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  ShoppingCart,
  Heart,
  Bell,
  TrendingUp,
  Layers,
  MessageSquare,
  MapPin,
  Clock,
  ChevronRight,
  Zap,
  Star,
  Settings,
  Headset,
  CreditCard,
  FileText,
  Repeat,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import StatCard from "../../components/StatCard";

const baseURL = process.env.REACT_APP_API_URL;

// ===== FEATURE CARD COMPONENT =====
const FeatureCard = ({ icon, title, description, color, badge, onClick }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30",
    yellow:
      "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
    gray: "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700",
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-xl transition-all duration-200
        hover:scale-105 hover:shadow-lg
        ${colorClasses[color]}
        text-left
      `}
    >
      {/* Badge */}
      {badge > 0 && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className="mb-3">{icon}</div>

      {/* Title */}
      <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </button>
  );
};

// ===== ORDER CARD COMPONENT =====
const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Shipped:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      Delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || colors.Pending;
  };

  return (
    <div
      onClick={() => navigate(`/customer/orders/${order._id}`)}
      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            Order #{order._id?.slice(-6)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            order.orderStatus,
          )}`}
        >
          {order.orderStatus}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {order.items?.length || 0} items
        </p>
        <p className="font-bold text-gray-900 dark:text-white">
          ₹{order.totalAmount?.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
};

// ===== QUOTE CARD COMPONENT =====
const QuoteCard = ({ quote }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-sm transition cursor-pointer">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
          {quote.quoteNumber || quote.items?.[0]?.name || "Quote Request"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
           {new Date(quote.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="text-right">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
            ${quote.responseCount > 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
            {quote.responseCount || 0} responses
        </span>
      </div>
    </div>
  </div>
);

// ===== PRODUCT CARD COMPONENT =====
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="flex gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition cursor-pointer"
    >
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
        {product.imageUrls?.[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Layers size={24} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {product.category}
        </p>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
          ₹{product.price?.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
};

// ===== EMPTY STATE COMPONENT =====
const EmptyState = ({ icon, message, action, onAction }) => (
  <div className="text-center py-12">
    <div className="text-gray-300 dark:text-gray-600 mb-4 flex justify-center">
      {icon}
    </div>
    <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>
    {action && (
      <button
        onClick={onAction}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
      >
        {action}
      </button>
    )}
  </div>
);

// ===== MAIN CUSTOMER DASHBOARD COMPONENT =====
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItemsCount: 0,
    cartItemsCount: 0,
    unreadNotificationsCount: 0,
    recentOrders: [],
    recommendedProducts: [],
    quoteRequests: [],
    profilePictureUrl: null,
  });

  const [user, setUser] = useState(null);

  // Fetch user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user:", error);
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.token) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${storedUser.token}` };

        // Parallel fetch: Dashboard, Orders, Quotes, Cart, Wishlist
        const [dashboardRes, ordersRes, quotesRes, cartRes, wishlistRes] = await Promise.all([
          axios.get(`${baseURL}/api/customer/dashboard`, { headers }).catch(err => ({ error: err })),
          axios.get(`${baseURL}/api/orders?limit=10`, { headers }).catch(err => ({ error: err })),
          axios.get(`${baseURL}/api/quotes/request?limit=10`, { headers }).catch(err => ({ error: err })),
          axios.get(`${baseURL}/api/cart`, { headers }).catch(err => ({ error: err })),
          axios.get(`${baseURL}/api/customer/wishlist`, { headers }).catch(err => ({ error: err }))
        ]);
        
        // Handle dashboard response
        let data = {};
        if (!dashboardRes.error) {
            data = dashboardRes.data.data || dashboardRes.data || {};
        }

        // Handle orders response
        if (!ordersRes.error && ordersRes.data) {
             const ordersData = ordersRes.data.data || {};
             data.recentOrders = ordersData.orders || [];
             data.totalOrders = ordersData.total || data.totalOrders || 0;
        }

        // Handle quotes response
        if (!quotesRes.error && quotesRes.data) {
            const quotesData = quotesRes.data.data || quotesRes.data || {};
            data.quoteRequests = quotesData.quoteRequests || [];
        }

        // Handle cart response
        if (!cartRes.error && cartRes.data) {
           // CartContext: const { totalItems } = response.data.data;
           const cartData = cartRes.data.data || {};
           data.cartItemsCount = cartData.totalItems || 0;
        }

        // Handle wishlist response
        if (!wishlistRes.error && wishlistRes.data) {
            // Wishlist returns { data: [items] }
            const wishlistData = wishlistRes.data.data || wishlistRes.data || [];
            data.wishlistItemsCount = Array.isArray(wishlistData) ? wishlistData.length : 0;
        }

        setDashboardData(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                👋 Welcome back, {user?.name || "Customer"}!
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                Ready to build something amazing today?
              </p>
            </div>
            {dashboardData.profilePictureUrl && (
              <img
                src={dashboardData.profilePictureUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg hidden md:block"
              />
            )}
          </div>

          {/* Quick Stats in Welcome Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">
                {dashboardData.totalOrders}
              </div>
              <div className="text-xs text-blue-100">Total Orders</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">
                {dashboardData.totalSpent > 0
                  ? `₹${(dashboardData.totalSpent / 1000).toFixed(1)}K`
                  : "₹0"}
              </div>
              <div className="text-xs text-blue-100">Total Spent</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">
                {dashboardData.cartItemsCount}
              </div>
              <div className="text-xs text-blue-100">In Cart</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl font-bold">
                {dashboardData.wishlistItemsCount}
              </div>
              <div className="text-xs text-blue-100">Wishlist</div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Orders"
            value={dashboardData.totalOrders}
            icon={<Package size={24} />}
            trend={12}
            trendLabel="vs last month"
            color="blue"
            onClick={() => navigate("/customer/orders")}
          />
          <StatCard
            title="Cart Items"
            value={dashboardData.cartItemsCount}
            icon={<ShoppingCart size={24} />}
            color="orange"
            onClick={() => navigate("/customer/cart")}
          />
          <StatCard
            title="Wishlist"
            value={dashboardData.wishlistItemsCount}
            icon={<Heart size={24} />}
            color="red"
            onClick={() => navigate("/customer/wishlist")}
          />
          <StatCard
            title="Notifications"
            value={dashboardData.unreadNotificationsCount}
            icon={<Bell size={24} />}
            color="purple"
            onClick={() => navigate("/customer/notifications")}
          />
        </div>

        {/* All Features - Comprehensive Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Zap className="text-yellow-500" size={24} />
            All Features
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Browse & Shop */}
            <FeatureCard
              icon={<Layers size={24} />}
              title="Browse Materials"
              description="Search construction materials"
              color="blue"
              onClick={() => navigate("/materials")}
            />

            {/* Orders & Tracking */}
            <FeatureCard
              icon={<Package size={24} />}
              title="My Orders"
              description="Past & current orders"
              color="blue"
              badge={dashboardData.totalOrders}
              onClick={() => navigate("/customer/orders")}
            />

            <FeatureCard
              icon={<Clock size={24} />}
              title="Track Order"
              description="Monitor delivery status"
              color="purple"
              onClick={() => navigate("/customer/order-tracking")}
            />

            {/* Cart & Wishlist */}
            <FeatureCard
              icon={<ShoppingCart size={24} />}
              title="My Cart"
              description="View selected materials"
              color="orange"
              badge={dashboardData.cartItemsCount}
              onClick={() => navigate("/customer/cart")}
            />

            <FeatureCard
              icon={<Heart size={24} />}
              title="Wishlist"
              description="Saved items"
              color="red"
              badge={dashboardData.wishlistItemsCount}
              onClick={() => navigate("/customer/wishlist")}
            />

            <FeatureCard
              icon={<Star size={24} />}
              title="Saved Items"
              description="Interested materials"
              color="yellow"
              onClick={() => navigate("/customer/wishlist")}
            />

            {/* Communication */}
            <FeatureCard
              icon={<MessageSquare size={24} />}
              title="Talk to Supplier"
              description="Direct communication"
              color="green"
              onClick={() => navigate("/customer/chat")}
            />

            <FeatureCard
              icon={<Bell size={24} />}
              title="Notifications"
              description="Latest updates & alerts"
              color="purple"
              badge={dashboardData.unreadNotificationsCount}
              onClick={() => navigate("/customer/notifications")}
            />

            <FeatureCard
              icon={<Bell size={24} />}
              title="Product Alerts"
              description="Watched item updates"
              color="blue"
              onClick={() => navigate("/customer/product-alerts")}
            />

            {/* Location & Suppliers */}
            <FeatureCard
              icon={<MapPin size={24} />}
              title="Nearby Suppliers"
              description="Find local suppliers"
              color="green"
              onClick={() => navigate("/customer/suppliers")}
            />

            <FeatureCard
              icon={<MapPin size={24} />}
              title="My Locations"
              description="Manage addresses"
              color="blue"
              onClick={() => navigate("/customer/addresses")}
            />

            {/* Offers & Deals */}
            <FeatureCard
              icon={<TrendingUp size={24} />}
              title="Offers & Deals"
              description="Exclusive discounts"
              color="red"
              onClick={() => navigate("/customer/offers")}
            />

            {/* Payments & Billing */}
            <FeatureCard
              icon={<CreditCard size={24} />}
              title="Payment Methods"
              description="Manage payment options"
              color="purple"
              onClick={() => navigate("/customer/payment-methods")}
            />

            <FeatureCard
              icon={<FileText size={24} />}
              title="Invoices"
              description="Billing history"
              color="gray"
              onClick={() => navigate("/customer/invoices")}
            />

            {/* Quick Actions */}
            <FeatureCard
              icon={<Repeat size={24} />}
              title="Quick Reorder"
              description="Reorder past items"
              color="orange"
              onClick={() => navigate("/customer/reorder")}
            />

            {/* Support */}
            <FeatureCard
              icon={<Headset size={24} />}
              title="Help & Support"
              description="Get assistance"
              color="blue"
              onClick={() => navigate("/support")}
            />

            {/* Settings */}
            <FeatureCard
              icon={<Settings size={24} />}
              title="Settings"
              description="Profile & preferences"
              color="gray"
              onClick={() => navigate("/customer/settings")}
            />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package size={24} className="text-blue-600" />
                  Recent Orders
                </h2>
                <button
                  onClick={() => navigate("/customer/orders")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>

              {dashboardData.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentOrders.slice(0, 3).map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Package size={48} />}
                  message="No orders yet"
                  action="Start Shopping"
                  onAction={() => navigate("/materials")}
                />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quote Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare size={20} className="text-purple-600" />
                  Quote Requests
                </h2>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full text-xs font-bold">
                  {dashboardData.quoteRequests?.length || 0}
                </span>
              </div>

              {dashboardData.quoteRequests?.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.quoteRequests.slice(0, 2).map((quote, idx) => (
                    <QuoteCard key={idx} quote={quote} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  No active quotes
                </p>
              )}

              <button
                onClick={() => navigate("/customer/quotes")}
                className="w-full mt-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 py-2 rounded-lg font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
              >
                Request New Quote
              </button>
            </div>

            {/* Recommended Products */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Star size={20} className="text-yellow-500" />
                Recommended
              </h2>

              {dashboardData.recommendedProducts?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recommendedProducts
                    .slice(0, 3)
                    .map((product, idx) => (
                      <ProductCard key={idx} product={product} />
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  Browse materials to get recommendations
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
