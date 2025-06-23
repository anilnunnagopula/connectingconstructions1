import React from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard";
import RecentOrders from "../../components/RecentOrders";
import { ShoppingBag, Heart, History, Headset } from "lucide-react"; 

// ✅ Safe localStorage parse
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
  const user = getUserSafely();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          ⚠️ Please Login
        </h2>
        <p className="mb-6 text-center max-w-md">
          You're not logged in. To access your dashboard and see recent orders,
          please log in first.
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

  const recentOrders = [
    {
      id: "ORD123",
      item: "Cement - Ultratech",
      date: "2024-06-15",
      status: "Delivered",
    },
    {
      id: "ORD124",
      item: "Iron Rods - TMT 12mm",
      date: "2024-06-13",
      status: "Pending",
    },
    {
      id: "ORD125",
      item: "Wall Paint - Asian Paints",
      date: "2024-06-11",
      status: "Delivered",
    },
    {
      id: "ORD126",
      item: "Sand (20 tons)",
      date: "2024-06-09",
      status: "Delivered",
    },
    {
      id: "ORD127",
      item: "Vastu Consultation",
      date: "2024-06-08",
      status: "Pending",
    },
  ];

  const stats = [
    { title: "Orders Made", value: "24", icon: <ShoppingBag /> },
    { title: "Wishlist Items", value: "8", icon: <Heart /> },
    { title: "History Viewed", value: "65", icon: <History /> },
    { title: "Support Requests", value: "3", icon: <Headset /> },
  ];

  const cards = [
    {
      title: "🧱 Browse Materials",
      desc: "Explore Cement, Iron, Paints, etc.",
      link: "/materials",
    },
    {
      title: "📦 My Orders",
      desc: "Check your past & current orders.",
      link: "/my-orders",
    },
    {
      title: "❤️ Saved Items",
      desc: "Access your wishlist anytime.",
      link: "#",
    },
    {
      title: "📞 Help & Support",
      desc: "We’re here if you need anything.",
      link: "#",
    },
    {
      title: "🔔 Notifications",
      desc: "See your latest updates and alerts.",
      link: "/notifications",
    },
    {
      title: "🛒 My Cart",
      desc: "View all your selected materials.",
      link: "/cart",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-3xl font-bold mb-2  text-gray-900 dark:text-white">
        👋 Welcome {user?.name || "Customer"}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
        What are you building today? Explore materials and services tailored for
        you.
      </p>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* 🧾 Recent Orders */}
      <div className="mb-10">
        <RecentOrders orders={recentOrders} />
      </div>

      {/* 🔗 Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* 🛒 Start Shopping */}
      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/materials")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          🛒 Start Shopping Now
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
