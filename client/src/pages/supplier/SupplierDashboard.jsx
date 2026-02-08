// SupplierDashboard.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import StatCard from "../../components/StatCard";
import { Box, DollarSign, ShoppingCart, Star } from "lucide-react";
import SalesChart from "./components/SalesChart"
// No longer importing these directly into SupplierDashboard.jsx's render
// import ActivityTimeline from "./components/ActivityTimeline";
// import TopProductsTable from "./components/TopProductsTable";
// import RatingsTable from "./components/RatingsTable";
// import DeliveryStatusTable from "./components/DeliveryStatusTable";
// import NotificationFeed from "./components/NotificationFeed";
// These remain as they are generic components
import ProfileWidget from "../../components/ProfileWidget";

const baseURL = process.env.REACT_APP_API_URL;

const SupplierDashboard = () => {
  // 1. --- ALL useState HOOKS FIRST (Strict Order) ---
  const navigate = useNavigate(); // useNavigate is also a hook
  const [supplierData, setSupplierData] = useState(null); // Moved up
  const [dashboardStats, setDashboardStats] = useState({
    // Moved up
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    averageRating: 0,
  });
  const [weeklyEarningsChartData, setWeeklyEarningsChartData] = useState({
    // Moved up
    labels: [],
    data: [],
  });
  const [loading, setLoading] = useState(true); // Moved up
  const [error, setError] = useState(null); // Moved up
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // 2. --- ALL useCallback HOOKS SECOND (after all useState hooks) ---
  // Ensure getToken is defined BEFORE handleExportCSV, as handleExportCSV uses getToken
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  // --- MODIFIED: Wrap handleExportCSV in useCallback ---
  const handleExportCSV = useCallback(async () => {
    setMessage("Generating CSV... Please wait.");
    setMessageType("info");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required to export data.");
      setMessageType("error");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/api/supplier/products/export-csv`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "my_products.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage("Products exported successfully to CSV!");
      setMessageType("success");
    } catch (err) {
      console.error("Error exporting CSV:", err);
      let errorMessage = "Failed to export data.";
      if (err.response && err.response.data instanceof Blob) {
        const errorText = await err.response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (parseErr) {
          // If not JSON, use generic message
        }
      } else if (err.response) {
        errorMessage =
          err.response.data.message || err.response.data.error || errorMessage;
      } else {
        errorMessage = err.message;
      }
      setMessage(errorMessage);
      setMessageType("error");
    }
  }, [getToken, navigate, setMessage, setMessageType]); // Dependencies are correct

  // 3. --- ALL useEffect HOOKS LAST (after useCallback hooks) ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      let user = null;

      try {
        const rawUser = localStorage.getItem("user");
        if (rawUser && rawUser !== "undefined") {
          user = JSON.parse(rawUser);

          // Check if the user is actually a supplier and has a token
          if (!user || user.role !== "supplier" || !user.token) {
            setError("Unauthorized: Please log in as a supplier.");
            setLoading(false);
            navigate("/login");
            toast.error("Please log in as a supplier to view the dashboard.");
            return;
          }
          setSupplierData(user); // Set the basic user data initially

          // Fetch ONLY the primary dynamic dashboard stats from the backend
          // We don't need to fetch all detailed lists if they are on separate pages
          const response = await axios.get(
            `${baseURL}/api/supplier/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          const data = response.data;

          // Update primary dashboard stats
          setDashboardStats({
            totalProducts: data.totalProducts,
            totalEarnings: data.totalEarnings,
            totalOrders: data.totalOrders,
            averageRating: data.averageRating,
          });

          // NEW: Set weekly earnings chart data
          setWeeklyEarningsChartData(
            data.weeklyEarnings || { labels: [], data: [] }
          );

          // We no longer need to set states for:
          // setRecentActivity(data.notifications || []);
          // setTopSellingProducts(data.topSellingProducts || []);
          // setCustomerFeedback(data.customerFeedback || []);
          // setDeliveryStatus(data.deliveryStatusOrders || []);
          // setNotifications(data.notifications || []);

          toast.success("Dashboard summary loaded!");
        } else {
          setError("No user data found. Please log in.");
          navigate("/login");
          toast.error("Please log in to view the dashboard.");
        }
      } catch (err) {
        console.error("Error fetching supplier dashboard data:", err);
        let errorMessage = "Failed to load dashboard data.";
        if (err.response) {
          errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            errorMessage;
          if (err.response.status === 401 || err.response.status === 403) {
            localStorage.removeItem("user");
            navigate("/login");
            toast.error(
              "Session expired or unauthorized. Please log in again."
            );
          }
        } else if (err.request) {
          errorMessage = "Network error or server is down.";
        } else {
          errorMessage = err.message;
        }
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // useEffect for message timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // UPDATED `cards` array with new entries and their respective links
  const cards = [
    {
      title: "📦 My Products",
      desc: "Manage, edit and update your products.",
      link: "/supplier/myproducts",
    },
    {
      title: "➕ Add Product",
      desc: "Add new materials with details.",
      link: "/supplier/add-product",
    },
    {
      title: "✏️ Edit Product",
      desc: "Update info of existing products.",
      link: "/supplier/myproducts", // 1st navigate to my products and then we need to click on edit option in that page
    },
    {
      title: "🗂️ Categories",
      desc: "Organize your product categories.",
      link: "/supplier/categories",
    },
    {
      title: "📍 Location",
      desc: "Set your shop/delivery location.",
      link: "/supplier/location",
    },
    {
      title: "🧾 Orders",
      desc: "Check and manage customer orders.",
      link: "/supplier/orders",
    },
    {
      title: "⚙️ Settings",
      desc: "Manage your supplier profile.",
      link: "/supplier/settings",
    },
    // --- NEW CARDS FOR DETAILED VIEWS ---
    {
      title: "📜 Recent Activity", // Corresponds to ActivityTimeline
      desc: "Review recent product changes, orders, and alerts.",
      link: "/supplier/activity-logs", // New route for detailed activity
    },
    {
      title: "🔥 Top-Selling Products", // Corresponds to TopProductsTable
      desc: "See your best-performing products by sales.",
      link: "/supplier/top-products", // New route for detailed top products
    },
    {
      title: "⭐ Customer Feedback", // Corresponds to RatingsTable
      desc: "View detailed product reviews and ratings.",
      link: "/supplier/customer-feedback", // New route for detailed feedback
    },
    {
      title: "🚚 Delivery Status", // Corresponds to DeliveryStatusTable
      desc: "Track the status of recent customer deliveries.",
      link: "/supplier/delivery-status", // New route for detailed delivery status
    },
    {
      title: "🔔 Notifications", // Corresponds to NotificationFeed
      desc: "View all your system notifications and alerts.",
      link: "/supplier/notifications", // New route for detailed notifications
    },
    {
      title: "📃 License And Certificates",
      desc: "view and add all your license and certificates",
      link: "/supplier/license-and-certificates",
    },
    {
      title: "📊 Analytics",
      desc: "Monitor your shop performance.",
      link: "/supplier/analytics",
    },
    {
      title: "💹 Payments ",
      desc: "Payment methods and Details.",
      link: "/supplier/payments",
    },
    {
      title: "💰 Manage Offers",
      desc: "View, edit, and manage your active promotions.",
      link: "/supplier/offers",
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          🛠️ Welcome,{" "}
          {supplierData?.name || supplierData?.username || "Supplier"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Manage your products, categories, orders, and performance.
        </p>
        {/* 🔗 Dashboard Links (including the new ones) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.link)}
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-xl transition p-6 rounded-lg cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{card.desc}</p>
            </div>
          ))}
        </div>
        {/* ⚡ Shortcuts (updated buttons) */}
        <div className="flex justify-center flex-wrap gap-5 my-8">
          {/* <button
            onClick={() => navigate("/supplier/sync-inventory")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
          >
            🔄 Sync Inventory
          </button> */}
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
          >
            ⬇️ Export Products CSV
          </button>
          <button
            onClick={() =>navigate("/supplier/create-offer")}
            className="bg-yellow-600 text-white px-12 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-semibold disabled:opacity-50"
          >
            ✨ Create Offer
          </button>
        </div>

        {/* 📊 Dynamic Stats (remain on dashboard summary) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Products"
            value={dashboardStats.totalProducts.toLocaleString()}
            icon={<Box />}
          />
          <StatCard
            title="Earnings (₹)"
            value={dashboardStats.totalEarnings.toLocaleString()}
            icon={<DollarSign />}
          />
          <StatCard
            title="Orders"
            value={dashboardStats.totalOrders.toLocaleString()}
            icon={<ShoppingCart />}
          />
          <StatCard
            title="Average Rating"
            value={dashboardStats.averageRating.toFixed(1) + "★"}
            icon={<Star />}
          />
        </div>
        {/* 👤 Supplier Profile Box (remains on dashboard) */}
        <div className="flex justify-center my-10">
          <div className="bg-blue-50 dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-200 dark:bg-blue-600 flex items-center justify-center text-3xl font-bold text-white uppercase">
                {supplierData?.name?.[0] || "S"}
              </div>
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white mt-4">
                {supplierData?.name || supplierData?.username || "Supplier"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                📍 {supplierData?.address || "Location not set"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                📧 {supplierData?.email || "supplier@example.com"}
              </p>

              <button
                onClick={() => navigate("/supplier/settings")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        </div>
        {/* 📈 Graphs, Tables & More (SalesChart remains, others are now cards) */}
        <div className="my-10">
          {/* Pass the dynamic weeklyEarningsChartData to SalesChart */}
          <SalesChart
            labels={weeklyEarningsChartData.labels}
            data={weeklyEarningsChartData.data}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;



// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   Box,
//   DollarSign,
//   ShoppingCart,
//   Star,
//   AlertTriangle,
//   Package,
//   Clock,
//   TrendingUp,
//   CheckCircle,
//   XCircle,
//   Download,
// } from "lucide-react";

// // Components
// import StatCard from "../../components/StatCard";
// import SalesChart from "./components/SalesChart";

// // Services
// import {
//   fetchEnhancedDashboardData,
//   exportProductsCSV,
//   downloadCSV,
//   acceptOrder,
//   rejectOrder,
// } from "../../services/dashboardService";

// /**
//  * Production-Ready Supplier Dashboard - Phase 1
//  * Features:
//  * - Enhanced stats with trends
//  * - Recent orders widget with quick actions
//  * - Alerts & reminders
//  * - Low stock warnings
//  * - Optimized loading & error states
//  * - Mobile-first responsive design
//  */
// const SupplierDashboard = () => {
//   const navigate = useNavigate();

//   // ==================== STATE MANAGEMENT ====================
//   const [supplierData, setSupplierData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [exporting, setExporting] = useState(false);

//   // Dashboard Stats
//   const [dashboardStats, setDashboardStats] = useState({
//     totalProducts: 0,
//     activeProducts: 0,
//     totalEarnings: 0,
//     totalOrders: 0,
//     pendingOrders: 0,
//     averageRating: 0,
//     lowStockCount: 0,
//     // Trends (vs last period)
//     productsTrend: 0,
//     earningsTrend: 0,
//     ordersTrend: 0,
//   });

//   // Additional Data
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [lowStockProducts, setLowStockProducts] = useState([]);
//   const [alerts, setAlerts] = useState([]);
//   const [weeklyEarningsChartData, setWeeklyEarningsChartData] = useState({
//     labels: [],
//     data: [],
//   });

//   // ==================== LOAD DASHBOARD DATA ====================
//   const loadDashboardData = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Get user from localStorage
//       const storedUser = localStorage.getItem("user");
//       if (!storedUser || storedUser === "undefined") {
//         throw new Error("No user data found. Please log in.");
//       }

//       const user = JSON.parse(storedUser);

//       // Verify supplier role
//       if (!user || user.role !== "supplier" || !user.token) {
//         throw new Error("Unauthorized: Please log in as a supplier.");
//       }

//       setSupplierData(user);

//       // Fetch dashboard data
//       const response = await fetchEnhancedDashboardData();

//       if (!response.success) {
//         throw new Error(response.error);
//       }

//       const data = response.data;

//       // Update stats
//       setDashboardStats({
//         totalProducts: data.stats?.totalProducts || 0,
//         activeProducts: data.stats?.activeProducts || 0,
//         totalEarnings: data.stats?.totalEarnings || 0,
//         totalOrders: data.stats?.totalOrders || 0,
//         pendingOrders: data.stats?.pendingOrders || 0,
//         averageRating: data.stats?.averageRating || 0,
//         lowStockCount: data.stats?.lowStockCount || 0,
//         productsTrend: data.stats?.productsTrend || 0,
//         earningsTrend: data.stats?.earningsTrend || 0,
//         ordersTrend: data.stats?.ordersTrend || 0,
//       });

//       // Update additional data
//       setRecentOrders(data.recentOrders || []);
//       setLowStockProducts(data.lowStockProducts || []);
//       setAlerts(data.alerts || []);
//       setWeeklyEarningsChartData(
//         data.weeklyEarnings || { labels: [], data: [] },
//       );

//       toast.success("Dashboard loaded successfully!");
//     } catch (err) {
//       console.error("Dashboard load error:", err);
//       const errorMessage = err.message || "Failed to load dashboard";
//       setError(errorMessage);
//       toast.error(errorMessage);

//       // Redirect to login if unauthorized
//       if (
//         errorMessage.includes("Unauthorized") ||
//         errorMessage.includes("log in")
//       ) {
//         localStorage.removeItem("user");
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Load data on mount
//   useEffect(() => {
//     loadDashboardData();
//   }, [loadDashboardData]);

//   // ==================== ACTION HANDLERS ====================

//   /**
//    * Export products to CSV
//    */
//   const handleExportCSV = async () => {
//     setExporting(true);
//     toast.loading("Generating CSV...", { id: "export" });

//     try {
//       const response = await exportProductsCSV();

//       if (!response.success) {
//         throw new Error(response.error);
//       }

//       downloadCSV(response.data, `my_products_${Date.now()}.csv`);
//       toast.success("Products exported successfully!", { id: "export" });
//     } catch (err) {
//       console.error("Export error:", err);
//       toast.error(err.message || "Failed to export products", { id: "export" });
//     } finally {
//       setExporting(false);
//     }
//   };

//   /**
//    * Quick accept order from dashboard
//    */
//   const handleQuickAcceptOrder = async (orderId) => {
//     try {
//       const response = await acceptOrder(orderId);
//       if (response.success) {
//         toast.success("Order accepted!");
//         // Refresh orders
//         loadDashboardData();
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to accept order");
//     }
//   };

//   /**
//    * Quick reject order from dashboard
//    */
//   const handleQuickRejectOrder = async (orderId, reason = "Out of stock") => {
//     try {
//       const response = await rejectOrder(orderId, reason);
//       if (response.success) {
//         toast.success("Order rejected");
//         loadDashboardData();
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to reject order");
//     }
//   };

//   // ==================== NAVIGATION CARDS ====================
//   const navigationCards = [
//     {
//       title: "📦 My Products",
//       desc: "Manage, edit and update your products.",
//       link: "/supplier/myproducts",
//       badge: dashboardStats.totalProducts,
//     },
//     {
//       title: "➕ Add Product",
//       desc: "Add new materials with details.",
//       link: "/supplier/add-product",
//     },
//     {
//       title: "🧾 Orders",
//       desc: "Check and manage customer orders.",
//       link: "/supplier/orders",
//       badge:
//         dashboardStats.pendingOrders > 0 ? dashboardStats.pendingOrders : null,
//       badgeColor: "bg-red-500",
//     },
//     {
//       title: "🗂️ Categories",
//       desc: "Organize your product categories.",
//       link: "/supplier/categories",
//     },
//     {
//       title: "📍 Location",
//       desc: "Set your shop/delivery location.",
//       link: "/supplier/location",
//     },
//     {
//       title: "⚙️ Settings",
//       desc: "Manage your supplier profile.",
//       link: "/supplier/settings",
//     },
//     {
//       title: "📊 Analytics",
//       desc: "Monitor your shop performance.",
//       link: "/supplier/analytics",
//     },
//     {
//       title: "💹 Payments",
//       desc: "Payment methods and Details.",
//       link: "/supplier/payments",
//     },
//     {
//       title: "⭐ Customer Feedback",
//       desc: "View detailed product reviews and ratings.",
//       link: "/supplier/customer-feedback",
//     },
//     {
//       title: "🔔 Notifications",
//       desc: "View all your system notifications.",
//       link: "/supplier/notifications",
//     },
//     {
//       title: "📃 Licenses & Certificates",
//       desc: "View and add all your licenses.",
//       link: "/supplier/license-and-certificates",
//     },
//     {
//       title: "💰 Manage Offers",
//       desc: "View, edit, and manage promotions.",
//       link: "/supplier/offers",
//     },
//   ];

//   // ==================== LOADING STATE ====================
//   if (loading) {
//     return (
//       <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
//         <div className="max-w-7xl mx-auto py-10 px-4">
//           {/* Loading skeleton */}
//           <div className="animate-pulse">
//             <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
//             <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-8"></div>

//             {/* Stats skeleton */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="bg-white dark:bg-gray-800 rounded-xl p-6 h-32"
//                 ></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==================== ERROR STATE ====================
//   if (error && !supplierData) {
//     return (
//       <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Failed to Load Dashboard
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
//           <button
//             onClick={loadDashboardData}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ==================== MAIN RENDER ====================
//   return (
//     <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
//       <div className="max-w-7xl mx-auto py-6 px-4 sm:py-10">
//         {/* ==================== HEADER ==================== */}
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
//             🛠️ Welcome back,{" "}
//             {supplierData?.name || supplierData?.username || "Supplier"}!
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 text-lg">
//             Here's what's happening with your business today.
//           </p>
//         </div>

//         {/* ==================== ALERTS & REMINDERS ==================== */}
//         {(alerts.length > 0 ||
//           dashboardStats.pendingOrders > 0 ||
//           dashboardStats.lowStockCount > 0) && (
//           <div className="mb-8 space-y-3">
//             {/* Pending Orders Alert */}
//             {dashboardStats.pendingOrders > 0 && (
//               <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-lg">
//                 <div className="flex items-center">
//                   <Clock className="w-5 h-5 text-orange-500 mr-3" />
//                   <div className="flex-1">
//                     <p className="font-semibold text-orange-900 dark:text-orange-200">
//                       You have {dashboardStats.pendingOrders} pending order
//                       {dashboardStats.pendingOrders !== 1 ? "s" : ""} waiting
//                       for approval
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => navigate("/supplier/orders")}
//                     className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
//                   >
//                     View Orders →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Low Stock Alert */}
//             {dashboardStats.lowStockCount > 0 && (
//               <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
//                 <div className="flex items-center">
//                   <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
//                   <div className="flex-1">
//                     <p className="font-semibold text-red-900 dark:text-red-200">
//                       {dashboardStats.lowStockCount} product
//                       {dashboardStats.lowStockCount !== 1 ? "s are" : " is"}{" "}
//                       running low on stock
//                     </p>
//                   </div>
//                   <button
//                     onClick={() =>
//                       navigate("/supplier/myproducts?filter=low-stock")
//                     }
//                     className="text-red-600 dark:text-red-400 font-medium hover:underline"
//                   >
//                     Manage Stock →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Custom Alerts */}
//             {alerts.map((alert, index) => (
//               <div
//                 key={index}
//                 className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg"
//               >
//                 <p className="text-blue-900 dark:text-blue-200">
//                   {alert.message}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ==================== STATS CARDS ==================== */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <StatCard
//             title="Total Products"
//             value={dashboardStats.totalProducts.toLocaleString()}
//             icon={<Box className="w-6 h-6" />}
//             trend={dashboardStats.productsTrend}
//             color="blue"
//             onClick={() => navigate("/supplier/myproducts")}
//           />
//           <StatCard
//             title="Total Earnings"
//             value={`₹${dashboardStats.totalEarnings.toLocaleString()}`}
//             icon={<DollarSign className="w-6 h-6" />}
//             trend={dashboardStats.earningsTrend}
//             color="green"
//             onClick={() => navigate("/supplier/payments")}
//           />
//           <StatCard
//             title="Total Orders"
//             value={dashboardStats.totalOrders.toLocaleString()}
//             icon={<ShoppingCart className="w-6 h-6" />}
//             trend={dashboardStats.ordersTrend}
//             color="purple"
//             onClick={() => navigate("/supplier/orders")}
//           />
//           <StatCard
//             title="Average Rating"
//             value={`${dashboardStats.averageRating.toFixed(1)}★`}
//             icon={<Star className="w-6 h-6" />}
//             color="orange"
//             onClick={() => navigate("/supplier/customer-feedback")}
//           />
//         </div>

//         {/* ==================== RECENT ORDERS WIDGET ==================== */}
//         {recentOrders.length > 0 && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                 Recent Orders
//               </h2>
//               <button
//                 onClick={() => navigate("/supplier/orders")}
//                 className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
//               >
//                 View All →
//               </button>
//             </div>

//             <div className="space-y-3">
//               {recentOrders.slice(0, 5).map((order) => (
//                 <div
//                   key={order._id || order.id}
//                   className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                 >
//                   <div className="flex-1">
//                     <p className="font-semibold text-gray-900 dark:text-white">
//                       Order #{order.orderId || order._id?.slice(-6)}
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       {order.customerName} • ₹
//                       {order.totalAmount?.toLocaleString()}
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {order.status === "pending" && (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleQuickAcceptOrder(order._id || order.id)
//                           }
//                           className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
//                         >
//                           <CheckCircle className="w-4 h-4" />
//                           Accept
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleQuickRejectOrder(order._id || order.id)
//                           }
//                           className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm flex items-center gap-1"
//                         >
//                           <XCircle className="w-4 h-4" />
//                           Reject
//                         </button>
//                       </>
//                     )}
//                     {order.status !== "pending" && (
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           order.status === "confirmed"
//                             ? "bg-blue-100 text-blue-700"
//                             : order.status === "delivered"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         {order.status}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ==================== ACTION BUTTONS ==================== */}
//         <div className="flex justify-center flex-wrap gap-4 mb-8">
//           <button
//             onClick={handleExportCSV}
//             disabled={exporting}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             <Download className="w-5 h-5" />
//             {exporting ? "Exporting..." : "Export Products CSV"}
//           </button>
//           <button
//             onClick={() => navigate("/supplier/create-offer")}
//             className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-semibold flex items-center gap-2"
//           >
//             <TrendingUp className="w-5 h-5" />
//             Create Offer
//           </button>
//         </div>

//         {/* ==================== NAVIGATION CARDS ==================== */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//           {navigationCards.map((card, index) => (
//             <div
//               key={index}
//               onClick={() => navigate(card.link)}
//               className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6 rounded-xl cursor-pointer border border-gray-100 dark:border-gray-700 hover:-translate-y-1 relative"
//             >
//               {card.badge && (
//                 <span
//                   className={`absolute top-3 right-3 ${card.badgeColor || "bg-blue-500"} text-white text-xs font-bold px-2 py-1 rounded-full`}
//                 >
//                   {card.badge}
//                 </span>
//               )}
//               <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
//                 {card.title}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-300 text-sm">
//                 {card.desc}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* ==================== SALES CHART ==================== */}
//         <div className="mb-10">
//           <SalesChart
//             labels={weeklyEarningsChartData.labels}
//             data={weeklyEarningsChartData.data}
//           />
//         </div>

//         {/* ==================== PROFILE WIDGET ==================== */}
//         <div className="flex justify-center">
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-2xl p-8 w-full max-w-md text-center border border-blue-100 dark:border-gray-600">
//             <div className="flex flex-col items-center">
//               <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white uppercase shadow-lg mb-4">
//                 {supplierData?.name?.[0] || "S"}
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//                 {supplierData?.name || supplierData?.username || "Supplier"}
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
//                 📍 {supplierData?.address || "Location not set"}
//               </p>
//               <p className="text-gray-600 dark:text-gray-300 mb-6 flex items-center gap-1">
//                 📧 {supplierData?.email || "supplier@example.com"}
//               </p>

//               <button
//                 onClick={() => navigate("/supplier/settings")}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md"
//               >
//                 ✏️ Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupplierDashboard;