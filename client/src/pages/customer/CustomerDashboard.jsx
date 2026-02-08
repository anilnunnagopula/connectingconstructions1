// pages/customer/CustomerDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import StatCard from "../../components/StatCard";
import RecentOrders from "../../components/RecentOrders";
//  import CommonServices from "../../common-services/CommonServices";
import {
  ShoppingBag,
  Heart,
  History,
  Headset,
  MapPin,
  CreditCard,
  UserCircle,
  Bell,
  ShoppingCart,
  Truck,
  Star,
  Settings, // NEW: Added Settings icon
  FileText, // NEW: Added FileText icon
  Repeat, // NEW: Added Repeat icon
  MessageSquare, // NEW: Added MessageSquare icon
} from "lucide-react"; // Added all new icons

// Base URL for API calls
const baseURL = process.env.REACT_APP_API_URL;

// Safe localStorage parse (already good)
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

  // User data state (reactive to localStorage)
  const [currentUser, setCurrentUser] = useState(() => getUserSafely());

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getUserSafely());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Dashboard Data States
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItemsCount: 0,
    cartItemsCount: 0,
    unreadNotificationsCount: 0,
    recentOrders: [],
    recommendedProducts: [],
    customerOffers: [],
    profilePictureUrl: null, // Initialize it here for profile pic in Welcome section
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const user = getUserSafely();
    if (!user || !user.token || user.role !== "customer") {
      setError("Unauthorized: Please log in as a customer.");
      setLoading(false);
      navigate("/login");
      toast.error("Please log in as a customer to view the dashboard.");
      if (user) localStorage.removeItem("user");
      setCurrentUser(null);
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/api/customer/dashboard`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = response.data;
      setDashboardData({
        totalOrders: data.totalOrders || 0,
        totalSpent: data.totalSpent || 0,
        wishlistItemsCount: data.wishlistItemsCount || 0,
        cartItemsCount: data.cartItemsCount || 0,
        unreadNotificationsCount: data.unreadNotificationsCount || 0,
        recentOrders: data.recentOrders || [],
        recommendedProducts: data.recommendedProducts || [],
        customerOffers: data.customerOffers || [],
        profilePictureUrl: data.profilePictureUrl || null, // Populate this from backend
      });
      toast.success("Customer dashboard data loaded!");
    } catch (err) {
      console.error("Error fetching customer dashboard data:", err);
      let errorMessage = "Failed to load dashboard data.";
      if (err.response) {
        errorMessage =
          err.response.data.message || err.response.data.error || errorMessage;
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.removeItem("user");
          navigate("/login");
          toast.error("Session expired or unauthorized. Please log in again.");
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
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Conditional Rendering for Auth/Loading/Error
  if (!currentUser || currentUser.role !== "customer") {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading customer dashboard data...</p>
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

  const actionCards = [
    {
      title: "💡 Browse Materials",
      desc: "Search and shop for construction materials.",
      icon: <ShoppingBag size={32} />,
      link: "/materials",
    },
    {
      title: "📦 My Orders",
      desc: "Check your past & current orders.",
      icon: <History size={32} />,
      link: "/customer/orders", // CHANGED LINK
    },
    {
      title: "❤️ My Wishlist",
      desc: "Access your saved items anytime.",
      icon: <Heart size={32} />,
      link: "/customer/wishlist", // CHANGED LINK
    },
    {
      title: "🛒 My Cart",
      desc: "View all your selected materials.",
      icon: <ShoppingCart size={32} />,
      link: "/customer/cart", // CHANGED LINK
    },
    {
      title: "⭐ Saved Items",
      desc: "View all your interested materials.",
      icon: <Star size={32} />,
      link: "/customer/wishlist", // CHANGED LINK (duplicates My Wishlist - might want to remove one later)
    },
    {
      title: "📍 Nearby Suppliers",
      desc: "Find material suppliers near your location.",
      icon: <MapPin size={32} />,
      link: "/customer/nearby-suppliers",
    },
    {
      title: "🔔 Notifications",
      desc: "See your latest updates and alerts.",
      icon: <Bell size={32} />,
      link: "/customer/notifications",
    },
    {
      title: "📞 Help & Support",
      desc: "Get assistance and answers to your questions.",
      icon: <Headset size={32} />,
      link: "/support",
    },
    {
      title: "🚚 Track My Order",
      desc: "Monitor the delivery status of your purchases.",
      icon: <Truck size={32} />,
      link: "/customer/track-order",
    },
    {
      title: "🎁 Offers & Deals",
      desc: "View exclusive discounts and promotions.",
      icon: <ShoppingBag size={32} />,
      link: "/customer/offers",
    },
    {
      title: "🏠 My Locations",
      desc: "Add and manage your delivery addresses.",
      icon: <MapPin size={32} />,
      link: "/customer/location",
    },
    {
      title: "💳 Payment Methods",
      desc: "Manage your payment options for seamless checkout.",
      icon: <CreditCard size={32} />,
      link: "/customer/payments",
    },
    {
      title: "⚙️ Settings",
      desc: "Update your profile and account preferences.",
      icon: <Settings size={32} />,
      link: "/customer/settings",
    },
    {
      title: "🧾 Invoices / Billing",
      desc: "Access your purchase invoices and billing history.",
      icon: <FileText size={32} />,
      link: "/customer/invoice",
    },
    {
      title: "🔁 Quick Reorder",
      desc: "Easily reorder items from your past purchases.",
      icon: <Repeat size={32} />,
      link: "/customer/reorder",
    },
    {
      title: "🔔 Product Alerts",
      desc: "Items you're watching or interested in have updates.",
      icon: <Bell size={32} />,
      link: "/customer/product-alerts",
    },
    {
      title: "💬 Talk to Supplier",
      desc: "Directly communicate with your material suppliers.",
      icon: <MessageSquare size={32} />,
      link: "/customer/chat-with-supplier",
    },
  ];

  const summaryStats = [
    {
      title: "Total Orders",
      value: dashboardData.totalOrders.toLocaleString(),
      icon: <ShoppingBag />,
      link: "/customer/orders", // CHANGED LINK
    },
    {
      title: "Total Spent",
      value: `₹${dashboardData.totalSpent.toLocaleString("en-IN")}`,
      icon: <ShoppingCart />,
      link: "/customer/orders", // CHANGED LINK
    },
    {
      title: "Wishlist Items",
      value: dashboardData.wishlistItemsCount.toLocaleString(),
      icon: <Heart />,
      link: "/customer/wishlist", // CHANGED LINK
    },
    {
      title: "Items in Cart",
      value: dashboardData.cartItemsCount.toLocaleString(),
      icon: <ShoppingCart />,
      link: "/customer/cart", // CHANGED LINK
    },
    {
      title: "Unread Notifications",
      value: dashboardData.unreadNotificationsCount.toLocaleString(),
      icon: <Bell />,
      link: "/customer/notifications", // CHANGED LINK
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* 💬 Welcome Message & Profile Snapshot */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-4">
          {dashboardData.profilePictureUrl ? (
            <img
              src={dashboardData.profilePictureUrl}
              alt="Customer Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
            />
          ) : (
            <UserCircle
              size={64}
              className="text-blue-500 dark:text-blue-400"
            />
          )}
          <div className="flex-grow text-center sm:text-left">
            {/* Original Welcome line as requested */}
            <h1 className="text-3xl md:text-3xl font-bold text-gray-900 dark:text-white">
              👋 Welcome{" "}
              {currentUser?.name || currentUser?.username || "Customer"}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
              What are you building today? Explore materials and services
              tailored for you.
            </p>
          </div>
        </div>

        {/* 📊 Dynamic Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
          {" "}
          {/* Adjusted to 5 columns */}
          {/* Using StatCard for visual consistency with supplier dashboard */}
          {summaryStats.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              link={stat.link}
            />
          ))}
        </div>

        <hr className="border-gray-300 dark:border-gray-700 my-8" />

        {/* 🚀 Quick Action Cards - Grid layout */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {" "}
          {/* 3-4 columns on larger screens */}
          {actionCards.map((card, index) => (
            <div
              key={index}
              onClick={() => card.link !== "#" && navigate(card.link)}
              className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition p-6 rounded-lg cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <div className="text-blue-600 dark:text-blue-400">
                {card.icon}
              </div>{" "}
              {/* Icon display */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <hr className="border-gray-300 dark:border-gray-700 my-8" />

        {/* 📈 Recent Orders & Recommended Products (Main Content Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {" "}
          {/* Example: Recent Orders on left (2/3), Recs on right (1/3) */}
          {/* Recent Orders List - Reusing RecentOrders component */}
          <div className="lg:col-span-2">
            {" "}
            {/* Spans 2 columns on large screens */}
            <RecentOrders orders={dashboardData.recentOrders} />
          </div>
          {/* Recommended Products Card (Placeholder for now) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 lg:col-span-1">
            {" "}
            {/* Spans 1 column on large screens */}
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Recommended for You
            </h2>
            {dashboardData.recommendedProducts.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recommendedProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {/* Assuming recommendedProducts have name, image, price */}
                    {/* Example placeholder for image */}
                    {/* {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />} */}
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                      IMG
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {product.name || `Product ${index + 1}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{product.price?.toLocaleString("en-IN") || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No recommendations right now. Start exploring!
              </p>
            )}
            <button
              onClick={() => navigate("/customer/materials")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition text-sm"
            >
              Explore Materials
            </button>
          </div>
        </div>

        {/* 🛒 Start Shopping - kept as requested */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/customer/materials")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
          >
            🛒 Start Shopping Now
          </button>
        </div>
        
        {/* <hr className="mt-6 mb-6" /> */}

        {/* Public & Government Services 🏛️ - kept as requested
        <h1 className="text-center font-extrabold">
          Future Integration Section
        </h1>
        <div className="mt-2">
          <CommonServices />
        </div> */}
      </div>
    </div>
  );
};

export default CustomerDashboard;
