// SupplierDashboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import StatCard from "../../components/StatCard";
import { Box, DollarSign, ShoppingCart, Star } from "lucide-react";
import SalesChart from "./components/SalesChart";

// No longer importing these directly into SupplierDashboard.jsx's render
// import ActivityTimeline from "./components/ActivityTimeline";
// import TopProductsTable from "./components/TopProductsTable";
// import RatingsTable from "./components/RatingsTable";
// import DeliveryStatusTable from "./components/DeliveryStatusTable";
// import NotificationFeed from "./components/NotificationFeed";
// These remain as they are generic components
import ActionShortcuts from "../../components/ActionShortcuts";
import ProfileWidget from "../../components/ProfileWidget";

const baseURL = process.env.REACT_APP_API_URL;

const SupplierDashboard = () => {
  const navigate = useNavigate();

  // State for the authenticated supplier's data (from localStorage and API)
  const [supplierData, setSupplierData] = useState(null);

  // State for primary dynamic dashboard metrics
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    averageRating: 0,
  });

  // NEW: State for weekly earnings chart data
  const [weeklyEarningsChartData, setWeeklyEarningsChartData] = useState({
    labels: [],
    data: [],
  });

  // We no longer need separate states for these if they are not rendered directly on dashboard
  // const [recentActivity, setRecentActivity] = useState([]);
  // const [topSellingProducts, setTopSellingProducts] = useState([]);
  // const [customerFeedback, setCustomerFeedback] = useState([]);
  // const [deliveryStatus, setDeliveryStatus] = useState([]);
  // const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Render loading/error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg">
          <p className="text-xl font-semibold mb-2">Error Loading Dashboard</p>
          <p>{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!supplierData) {
    navigate("/login");
    return null;
  }

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
        {/* ⚡ Shortcuts */}
        <ActionShortcuts />
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
        {/* REMOVED direct rendering of the other components */}
        {/* <div className="my-10"><ActivityTimeline events={recentActivity} /></div> */}
        {/* <div className="my-10"><TopProductsTable products={topSellingProducts} /></div> */}
        {/* <div className="my-10"><RatingsTable reviews={customerFeedback} /></div> */}
        {/* <div className="my-10"><DeliveryStatusTable orders={deliveryStatus} /></div> */}
        {/* <div className="my-10"><NotificationFeed notifications={notifications} /></div> */}
      </div>
    </div>
  );
};

export default SupplierDashboard;
