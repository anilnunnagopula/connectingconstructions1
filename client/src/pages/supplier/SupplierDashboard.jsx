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
