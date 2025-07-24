import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { toast } from "react-hot-toast";
import StatCard from "../../components/StatCard";
import RecentOrders from "../../components/RecentOrders";
import { ShoppingBag, Heart, History, Headset } from "lucide-react";
import CommonServices from "../../common-services/CommonServices";

// Base URL for API calls
const baseURL = process.env.REACT_APP_API_URL;

// ✅ Safe localStorage parse (already good)
function getUserSafely() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUserSafely()); // Initialize user state with data from localStorage
  const [dashboardStats, setDashboardStats] = useState({
    ordersMade: 0,
    wishlistItems: 0,
    historyViewed: 0,
    supportRequests: 0,
    recentOrders: [], // Initialize as an empty array
  });
  const [loading, setLoading] = useState(true); // Loading state for dashboard data
  const [error, setError] = useState(null); // Error state for API calls

  // Effect to fetch dynamic dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      // Re-check user data, especially if initial getUserSafely() returns null
      const currentUser = getUserSafely();
      if (
        !currentUser ||
        !currentUser.token ||
        currentUser.role !== "customer"
      ) {
        setError("Unauthorized: Please log in as a customer.");
        setLoading(false);
        navigate("/login"); // Redirect if not authorized
        toast.error("Please log in as a customer to view the dashboard.");
        // Clear potentially invalid user data
        if (currentUser) localStorage.removeItem("user");
        setUser(null);
        return;
      }

      // Set user state again to ensure it's up-to-date with any potential changes from localStorage
      setUser(currentUser);

      try {
        const response = await axios.get(`${baseURL}/api/customer/dashboard`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Send the JWT token
          },
        });

        const data = response.data;
        setDashboardStats({
          ordersMade: data.ordersMade,
          wishlistItems: data.wishlistItems,
          historyViewed: data.historyViewed,
          supportRequests: data.supportRequests,
          recentOrders: data.recentOrders,
        });
        toast.success("Customer dashboard data loaded!");
      } catch (err) {
        console.error("Error fetching customer dashboard data:", err);
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
  }, [navigate]); // Add navigate to dependency array

  // Display login prompt if user is not authenticated or not a customer
  if (!user || user.role !== "customer") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          ⚠️ Please Login as a Customer
        </h2>
        <p className="mb-6 text-center max-w-md">
          You're not logged in as a customer or your session has expired. To
          access your dashboard, please log in first.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          🔐 Login Now
        </button>
      </div>
    );
  }

  // Display loading message
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading customer dashboard data...</p>
      </div>
    );
  }

  // Display error message
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

  // Dynamic stats array using dashboardStats state
  const stats = [
    {
      title: "Orders Made",
      value: dashboardStats.ordersMade.toLocaleString(),
      icon: <ShoppingBag />,
    },
    {
      title: "Wishlist Items",
      value: dashboardStats.wishlistItems.toLocaleString(),
      icon: <Heart />,
    },
    {
      title: "History Viewed",
      value: dashboardStats.historyViewed.toLocaleString(),
      icon: <History />,
    },
    {
      title: "Support Requests",
      value: dashboardStats.supportRequests.toLocaleString(),
      icon: <Headset />,
    },
  ];

  // Card links - some may need adjustment based on your actual routes
  const cards = [
    {
      title: "🧱 Browse Materials",
      desc: "Explore Cement, Iron, Paints, etc.",
      link: "/materials",
    },
    {
      title: "📦 My Orders",
      desc: "Check your past & current orders.",
      link: "/customer/orders", // Updated link to match backend route
    },
    {
      title: "❤️ Saved Items",
      desc: "Access your wishlist anytime.",
      link: "/customer/wishlist", // Updated link to match backend route
    },
    {
      title: "📞 Help & Support",
      desc: "We’re here if you need anything.",
      link: "/customer/support-requests", // Updated link to match backend route
    },
    {
      title: "🔔 Notifications",
      desc: "See your latest updates and alerts.",
      link: "/notifications", // Assuming a separate notifications page/route
    },
    {
      title: "🛒 My Cart",
      desc: "View all your selected materials.",
      link: "/cart", // Assuming a separate cart page/route
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* 💬 Welcome Message */}
        <h1 className="text-3xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          👋 Welcome {user?.name || user?.username || "Customer"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          What are you building today? Explore materials and services tailored
          for you.
        </p>
        {/* 🔗 Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => card.link !== "#" && navigate(card.link)}
              className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition p-6 rounded-lg cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{card.desc}</p>
            </div>
          ))}
        </div>
        <hr className="border-gray-300 dark:border-gray-700" />
        {/* 📊 Dynamic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10 mt-10">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>
        <hr className="border-gray-300 dark:border-gray-700" />
        {/* 🧾 Recent Orders */}
        <div className="mb-10 mt-10">
          {/* Pass the dynamic recentOrders data to the RecentOrders component */}
          <RecentOrders orders={dashboardStats.recentOrders} />
        </div>
        {/* 🛒 Start Shopping */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/materials")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
          >
            🛒 Start Shopping Now
          </button>
        </div>

        {/* Public & Government Services 🏛️ */}
      </div>
      <hr />
      <CommonServices />
    </div>
  );
};

export default CustomerDashboard;
