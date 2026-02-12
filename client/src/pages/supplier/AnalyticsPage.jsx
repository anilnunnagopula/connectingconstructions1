// pages/supplier/AnalyticsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import SupplierLayout from "../../layout/SupplierLayout";
import { fetchSalesAnalytics, fetchEnhancedDashboardData } from "../../services/dashboardService";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [analyticsRes, dashRes] = await Promise.all([
        fetchSalesAnalytics(),
        fetchEnhancedDashboardData(period),
      ]);

      if (analyticsRes.success) {
        setAnalyticsData(analyticsRes.data);
      }
      if (dashRes.success) {
        setDashboardData(dashRes.data);
      }

      if (!analyticsRes.success && !dashRes.success) {
        toast.error("Failed to load analytics data");
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      toast.error("Error loading analytics");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Skeleton card for loading state
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
    </div>
  );

  if (loading) {
    return (
      <SupplierLayout>
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse h-80"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse h-80"></div>
          </div>
        </div>
      </SupplierLayout>
    );
  }

  const stats = dashboardData?.stats || {};
  const charts = dashboardData?.charts || {};
  const salesChart = charts.salesChart || { labels: [], earnings: [], orders: [] };

  // Format sales chart data for recharts
  const salesChartData = salesChart.labels.map((label, i) => ({
    day: label,
    earnings: salesChart.earnings[i] || 0,
    orders: salesChart.orders[i] || 0,
  }));

  // Top products from analytics
  const topProducts = analyticsData?.topProducts || [];

  // Category distribution from top products
  const categoryMap = {};
  topProducts.forEach((p) => {
    const cat = p.name || "Unknown";
    categoryMap[cat] = (categoryMap[cat] || 0) + (p.sales || p.quantity || 0);
  });

  // Order status distribution
  const orderDist = dashboardData?.orderStatusDistribution || {};
  const orderStatusData = [
    { name: "Pending", value: orderDist.pending || 0, color: "#f59e0b" },
    { name: "Confirmed", value: orderDist.confirmed || 0, color: "#3b82f6" },
    { name: "Processing", value: orderDist.processing || 0, color: "#8b5cf6" },
    { name: "Shipped", value: orderDist.shipped || 0, color: "#06b6d4" },
    { name: "Delivered", value: orderDist.delivered || 0, color: "#10b981" },
    { name: "Cancelled", value: orderDist.cancelled || 0, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const totalOrders = analyticsData?.totalOrders || stats.totalOrders || 0;
  const totalSales = analyticsData?.totalSales || stats.totalEarnings || 0;
  const avgOrderValue = analyticsData?.averageOrderValue || (totalOrders > 0 ? totalSales / totalOrders : 0);
  const totalProductsSold = analyticsData?.totalProductsSold || 0;

  // Period options
  const periods = [
    { label: "7 Days", value: 7 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
  ];

  // Custom tooltip for charts
  const SalesTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {payload[0].payload.day}
          </p>
          <p className="text-sm text-blue-600">
            Revenue: {"\u20B9"}{payload[0].value?.toLocaleString("en-IN")}
          </p>
          {payload[1] && (
            <p className="text-sm text-purple-600">
              Orders: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const StatusTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = orderStatusData.reduce((s, i) => s + i.value, 0);
      const pct = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].value} orders ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <SupplierLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Performance Analytics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track your sales, orders, and product performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Period Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition ${
                    period === p.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <RefreshCw size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Sales"
            value={`\u20B9${totalSales.toLocaleString("en-IN")}`}
            icon={<DollarSign size={22} />}
            color="blue"
            trend={stats.earningsTrend}
          />
          <MetricCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            icon={<ShoppingBag size={22} />}
            color="green"
            trend={stats.ordersTrend}
          />
          <MetricCard
            title="Avg. Order Value"
            value={`\u20B9${avgOrderValue.toFixed(0).toLocaleString()}`}
            icon={<TrendingUp size={22} />}
            color="purple"
          />
          <MetricCard
            title="Products Sold"
            value={totalProductsSold.toLocaleString()}
            icon={<Package size={22} />}
            color="amber"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Sales Trend ({period} Days)
            </h2>
            {salesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    stroke="#6b7280"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `\u20B9${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <Tooltip content={<SalesTooltip />} />
                  <Area yAxisId="left" type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" name="Revenue" />
                  <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" name="Orders" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No sales data for this period
              </div>
            )}
          </div>

          {/* Order Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Order Distribution
            </h2>
            {orderStatusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<StatusTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {orderStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {item.name}: <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="text-green-600" size={20} />
            Top Selling Products (by Revenue)
          </h2>
          {topProducts.length > 0 ? (
            <>
              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topProducts.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tickFormatter={(v) => `\u20B9${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v.length > 18 ? v.slice(0, 18) + "..." : v}
                  />
                  <Tooltip
                    formatter={(value) => [`\u20B9${value.toLocaleString("en-IN")}`, "Revenue"]}
                    contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Table */}
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Product</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Qty Sold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          <span className="inline-flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-700" : "bg-gray-300"
                            }`}>
                              {index + 1}
                            </span>
                            {product.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-medium">
                          {"\u20B9"}{(product.sales || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                          {(product.quantity || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-400">
              No product sales data available yet
            </div>
          )}
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="text-indigo-600" size={20} />
              Customer Insights
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Customers</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {(stats.totalCustomers || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Repeat Customers</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {(stats.repeatCustomers || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalCustomers > 0
                    ? ((stats.repeatCustomers / stats.totalCustomers) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {stats.averageRating || 0} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="text-orange-600" size={20} />
              Inventory Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Products</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {(stats.totalProducts || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Products</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {(stats.activeProducts || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</span>
                <span className={`text-lg font-bold ${(stats.lowStockCount || 0) > 0 ? "text-amber-600" : "text-green-600"}`}>
                  {(stats.lowStockCount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Inventory Value</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {"\u20B9"}{(stats.totalInventoryValue || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      {trend !== undefined && trend !== null && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
          {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}% vs previous period
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
