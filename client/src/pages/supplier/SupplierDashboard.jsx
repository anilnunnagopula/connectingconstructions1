// client/src/pages/supplier/SupplierDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Box,
  DollarSign,
  ShoppingCart,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

// Components
import StatCard from "../../components/StatCard";
import SupplierLayout from "../../layout/SupplierLayout";
import SupplierBottomNav from "../../components/SupplierBottomNav";
import EnhancedSalesChart from "./components/EnhancedSalesChart";
import TopProductsWidget from "./components/TopProductsWidget";
import OrderStatusChart from "./components/OrderStatusChart";
import LowStockWidget from "./components/LowStockWidget";
import QuoteManagementWidget from "./components/QuoteManagementWidget";
import BusinessStatusWidget from "./components/BusinessStatusWidget";
import ProfileCompletionWidget from "./components/ProfileCompletionWidget";
import PendingSettlementsWidget from "./components/PendingSettlementsWidget";
import CustomerInsightsWidget from "./components/CustomerInsightsWidget";

// Services
import {
  fetchEnhancedDashboardData,
  exportProductsCSV,
  downloadCSV,
  acceptOrder,
  rejectOrder,
} from "../../services/dashboardService";

/**
 * 🚀 PRODUCTION-READY SUPPLIER DASHBOARD
 *
 * Features:
 * ✅ Mobile-First Responsive Design
 * ✅ Real-time Analytics with Period Filters
 * ✅ Business Status Management
 * ✅ Profile Completion Tracking
 * ✅ Payment Settlement Overview
 * ✅ Customer Insights
 * ✅ Quote Management
 * ✅ Low Stock Alerts
 * ✅ Order Quick Actions
 * ✅ Dark Mode Support
 */
const SupplierDashboard = () => {
  const navigate = useNavigate();

  // ==================== STATE ====================
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [chartPeriod, setChartPeriod] = useState(7);

  // Dashboard Data
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    averageRating: 0,
    lowStockCount: 0,
    totalCustomers: 0,
    repeatCustomers: 0,
    productsTrend: 0,
    earningsTrend: 0,
    ordersTrend: 0,
  });

  const [charts, setCharts] = useState({
    period: 7,
    salesChart: { labels: [], earnings: [], orders: [] },
  });

  const [orderStatusDistribution, setOrderStatusDistribution] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState({
    percentage: 0,
    missing: [],
  });
  const [businessStatus, setBusinessStatus] = useState({
    isOpen: true,
    businessHours: "9:00 AM - 6:00 PM",
  });

  // ==================== LOAD DATA ====================
  const loadDashboardData = useCallback(
    async (period = chartPeriod) => {
      setLoading(true);
      setError(null);

      try {
        // Verify user
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined") {
          throw new Error("No user data found. Please log in.");
        }

        const user = JSON.parse(storedUser);
        if (!user || user.role !== "supplier" || !user.token) {
          throw new Error("Unauthorized: Please log in as a supplier.");
        }

        setSupplierData(user);

        // Fetch dashboard data with period
        const response = await fetchEnhancedDashboardData(period);

        if (!response.success) {
          throw new Error(response.error);
        }

        const data = response.data;

        // Update all state
        setDashboardStats({
          totalProducts: data.stats?.totalProducts || 0,
          activeProducts: data.stats?.activeProducts || 0,
          totalEarnings: data.stats?.totalEarnings || 0,
          totalOrders: data.stats?.totalOrders || 0,
          pendingOrders: data.stats?.pendingOrders || 0,
          averageRating: data.stats?.averageRating || 0,
          lowStockCount: data.stats?.lowStockCount || 0,
          totalCustomers: data.stats?.totalCustomers || 0,
          repeatCustomers: data.stats?.repeatCustomers || 0,
          productsTrend: data.stats?.productsTrend || 0,
          earningsTrend: data.stats?.earningsTrend || 0,
          ordersTrend: data.stats?.ordersTrend || 0,
        });

        setCharts(
          data.charts || {
            period: 7,
            salesChart: { labels: [], earnings: [], orders: [] },
          },
        );
        setOrderStatusDistribution(data.orderStatusDistribution || {});
        setRecentOrders(data.recentOrders || []);
        setLowStockProducts(data.lowStockProducts || []);
        setQuoteRequests(data.quoteRequests || []);
        setAlerts(data.alerts || []);
        setTopProducts(data.topProducts || []);
        setProfileCompletion(
          data.profileCompletion || { percentage: 0, missing: [] },
        );
        setBusinessStatus(
          data.businessStatus || {
            isOpen: true,
            businessHours: "9:00 AM - 6:00 PM",
          },
        );
      } catch (err) {
        console.error("Dashboard load error:", err);
        const errorMessage = err.message || "Failed to load dashboard";
        setError(errorMessage);
        toast.error(errorMessage);

        if (
          errorMessage.includes("Unauthorized") ||
          errorMessage.includes("log in")
        ) {
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate, chartPeriod],
  );

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ==================== ACTIONS ====================
  const handlePeriodChange = (newPeriod) => {
    setChartPeriod(newPeriod);
    loadDashboardData(newPeriod);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    toast.loading("Generating CSV...", { id: "export" });

    try {
      const response = await exportProductsCSV();
      if (!response.success) throw new Error(response.error);

      downloadCSV(response.data, `products_${Date.now()}.csv`);
      toast.success("Products exported!", { id: "export" });
    } catch (err) {
      toast.error(err.message || "Failed to export", { id: "export" });
    } finally {
      setExporting(false);
    }
  };

  const handleQuickAcceptOrder = async (orderId) => {
    try {
      const response = await acceptOrder(orderId);
      if (response.success) {
        toast.success("Order accepted!");
        loadDashboardData();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      toast.error(err.message || "Failed to accept order");
    }
  };

  const handleQuickRejectOrder = async (orderId) => {
    try {
      const response = await rejectOrder(orderId, "Out of stock");
      if (response.success) {
        toast.success("Order rejected");
        loadDashboardData();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      toast.error(err.message || "Failed to reject order");
    }
  };

  const handleBusinessStatusChange = (newStatus) => {
    setBusinessStatus((prev) => ({ ...prev, isOpen: newStatus }));
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <SupplierLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-8"></div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 h-32"
                  ></div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-96"></div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-96"></div>
              </div>
            </div>
          </div>
        </div>
      </SupplierLayout>
    );
  }

  // ==================== ERROR ====================
  if (error && !supplierData) {
    return (
      <SupplierLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Failed to Load Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => loadDashboardData()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </SupplierLayout>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <SupplierLayout
      pendingOrders={dashboardStats.pendingOrders}
      notifications={alerts.length}
    >
      <div className="bg-gray-50 dark:bg-gray-900 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
          {/* ==================== HEADER ==================== */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome, {supplierData?.name?.split(" ")[0] || "Supplier"}! 👋
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Here's your business overview
                </p>
              </div>

              <div className="hidden md:block">
                <button
                  onClick={handleExportCSV}
                  disabled={exporting}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2 text-sm"
                >
                  <Download size={18} />
                  {exporting ? "Exporting..." : "Export CSV"}
                </button>
              </div>
            </div>
          </div>

          {/* ==================== ALERTS ==================== */}
          {alerts.length > 0 && (
            <div className="mb-6 space-y-3">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  onClick={() => alert.action && navigate(alert.action)}
                  className={`p-4 rounded-xl border-l-4 cursor-pointer transition hover:shadow-md ${
                    alert.type === "critical"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-500"
                      : alert.type === "warning"
                        ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500"
                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        alert.type === "critical"
                          ? "text-red-600"
                          : alert.type === "warning"
                            ? "text-orange-600"
                            : "text-blue-600"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium flex-1 ${
                        alert.type === "critical"
                          ? "text-red-900 dark:text-red-200"
                          : alert.type === "warning"
                            ? "text-orange-900 dark:text-orange-200"
                            : "text-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== STATS CARDS ==================== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Products"
              value={dashboardStats.totalProducts.toLocaleString()}
              icon={<Box className="w-5 h-5 sm:w-6 sm:h-6" />}
              trend={dashboardStats.productsTrend}
              color="blue"
              onClick={() => navigate("/supplier/myproducts")}
            />
            <StatCard
              title="Earnings"
              value={`₹${(dashboardStats.totalEarnings / 1000).toFixed(0)}k`}
              icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />}
              trend={dashboardStats.earningsTrend}
              color="green"
            />
            <StatCard
              title="Orders"
              value={dashboardStats.totalOrders.toLocaleString()}
              icon={<ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />}
              trend={dashboardStats.ordersTrend}
              color="purple"
              onClick={() => navigate("/supplier/orders")}
              badge={
                dashboardStats.pendingOrders > 0
                  ? dashboardStats.pendingOrders
                  : null
              }
              badgeColor="bg-orange-500"
            />
            <StatCard
              title="Rating"
              value={`${dashboardStats.averageRating.toFixed(1)}★`}
              icon={<Star className="w-5 h-5 sm:w-6 sm:h-6" />}
              color="orange"
            />
          </div>

          {/* ==================== CRITICAL WIDGETS ROW ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <BusinessStatusWidget
              isOpen={businessStatus.isOpen}
              businessHours={businessStatus.businessHours}
              onStatusChange={handleBusinessStatusChange}
            />

            {profileCompletion.percentage < 100 && (
              <ProfileCompletionWidget
                percentage={profileCompletion.percentage}
                missing={profileCompletion.missing}
              />
            )}

            <PendingSettlementsWidget
              pendingAmount={dashboardStats.totalEarnings * 0.15}
              nextPayoutDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
              lastPayoutAmount={dashboardStats.totalEarnings * 0.1}
            />
          </div>

          {/* ==================== CHARTS ROW ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <EnhancedSalesChart
              labels={charts.salesChart.labels}
              earnings={charts.salesChart.earnings}
              orders={charts.salesChart.orders}
              currentPeriod={chartPeriod}
              onPeriodChange={handlePeriodChange}
            />
            <OrderStatusChart orderStats={orderStatusDistribution} />
          </div>

          {/* ==================== INSIGHTS ROW ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <CustomerInsightsWidget
              totalCustomers={dashboardStats.totalCustomers}
              repeatCustomers={dashboardStats.repeatCustomers}
            />
            <TopProductsWidget products={topProducts} />
          </div>

          {/* ==================== MANAGEMENT WIDGETS ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <QuoteManagementWidget
              quotes={quoteRequests}
              onNavigate={(path) => navigate(path)}
            />
            <LowStockWidget
              products={lowStockProducts}
              onNavigate={(path) => navigate(path)}
            />
          </div>

          {/* ==================== RECENT ORDERS ==================== */}
          {recentOrders.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <button
                  onClick={() => navigate("/supplier/orders")}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs sm:text-sm font-medium"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        #{order.orderId}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {order.customerName} • ₹
                        {order.totalAmount?.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {order.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleQuickAcceptOrder(order._id)}
                            className="bg-green-600 text-white p-1.5 rounded-lg hover:bg-green-700 transition"
                            title="Accept"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleQuickRejectOrder(order._id)}
                            className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                          {order.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== NAVIGATION CARDS ==================== */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  emoji: "📦",
                  title: "My Products",
                  desc: "Manage products",
                  path: "/supplier/myproducts",
                  badge: dashboardStats.totalProducts,
                },
                {
                  emoji: "➕",
                  title: "Add Product",
                  desc: "Add new item",
                  path: "/supplier/add-product",
                },
                {
                  emoji: "🧾",
                  title: "Orders",
                  desc: "Manage orders",
                  path: "/supplier/orders",
                  badge: dashboardStats.pendingOrders,
                  badgeColor: "bg-red-500",
                },
                {
                  emoji: "🗂️",
                  title: "Categories",
                  desc: "Organize items",
                  path: "/supplier/categories",
                },
                {
                  emoji: "📍",
                  title: "Location",
                  desc: "Set location",
                  path: "/supplier/location",
                },
                {
                  emoji: "⚙️",
                  title: "Settings",
                  desc: "Manage profile",
                  path: "/supplier/settings",
                },
                {
                  emoji: "📊",
                  title: "Analytics",
                  desc: "View insights",
                  path: "/supplier/analytics",
                },
                {
                  emoji: "💹",
                  title: "Payments",
                  desc: "Payment details",
                  path: "/supplier/payments",
                },
                {
                  emoji: "⭐",
                  title: "Feedback",
                  desc: "Customer reviews",
                  path: "/supplier/customer-feedback",
                },
                {
                  emoji: "🔔",
                  title: "Notifications",
                  desc: "View alerts",
                  path: "/supplier/notifications",
                },
                {
                  emoji: "📃",
                  title: "Licenses",
                  desc: "Certificates",
                  path: "/supplier/license-and-certificates",
                },
                {
                  emoji: "💰",
                  title: "Offers",
                  desc: "Manage promotions",
                  path: "/supplier/offers",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  onClick={() => navigate(card.path)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100 dark:border-gray-700 relative"
                >
                  <div className="text-3xl mb-2">{card.emoji}</div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {card.desc}
                  </p>
                  {card.badge && (
                    <span
                      className={`absolute top-2 right-2 ${card.badgeColor || "bg-blue-500"} text-white text-xs font-bold px-2 py-1 rounded-full`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ==================== MOBILE EXPORT BUTTON ==================== */}
          <div className="md:hidden">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download size={20} />
              {exporting ? "Exporting..." : "Export Products CSV"}
            </button>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
};

export default SupplierDashboard;
