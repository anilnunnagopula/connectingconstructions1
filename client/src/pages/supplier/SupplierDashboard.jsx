import React from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard";
import { Box, DollarSign, ShoppingCart, Star } from "lucide-react";
import SalesChart from "../../components/SalesChart";
import ActivityTimeline from "../../components/ActivityTimeline";
import TopProductsTable from "../../components/TopProductsTable";
import RatingsTable from "../../components/RatingsTable";
import ActionShortcuts from "../../components/ActionShortcuts";
import DeliveryStatusTable from "../../components/DeliveryStatusTable";
import NotificationFeed from "../../components/NotificationFeed";
import ProfileWidget from "../../components/ProfileWidget";
import Sidebar from "../../components/Sidebar";
import ResponsiveSidebar from "../../components/ResponsiveSidebar";
const SupplierDashboard = () => {
  const navigate = useNavigate();
  let supplier = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser && rawUser !== "undefined") {
      supplier = JSON.parse(rawUser);
    }
  } catch (error) {
    supplier = null;
  }


  const cards = [
    {
      title: "📦 My Products",
      desc: "Manage, edit and update your products.",
      link: "/supplier/products",
    },
    {
      title: "➕ Add Product",
      desc: "Add new materials with details.",
      link: "/supplier/add-product",
    },
    {
      title: "✏️ Edit Product",
      desc: "Update info of existing products.",
      link: "/supplier/edit-product/1", // default example; use dynamic link elsewhere
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
      title: "📊 Analytics",
      desc: "Monitor your shop performance.",
      link: "/supplier/analytics",
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
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* 👈 Sidebar */}
      {/* <Sidebar /> */}
      {/* <ResponsiveSidebar /> */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        🛠️ Welcome, {supplier?.name || "Supplier"}!
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        Manage your products, categories, orders, and performance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.link)}
            className="bg-white shadow-md hover:shadow-xl transition p-6 rounded-lg cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-600">{card.desc}</p>
          </div>
        ))}
      </div>

      <ActionShortcuts />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" value="128" icon={<Box />} />
        <StatCard title="Earnings (₹)" value="25,400" icon={<DollarSign />} />
        <StatCard title="Orders" value="47" icon={<ShoppingCart />} />
        <StatCard title="Average Rating" value="4.5★" icon={<Star />} />
      </div>
      <div className="flex justify-center my-10">
        <div className="bg-blue-50 shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-white">
              S
            </div>
            <h2 className="text-xl font-semibold text-blue-900 mt-4">
              Supplier
            </h2>
            <p className="text-gray-600">📍 Hyderabad, India</p>
            <p className="text-gray-600 mb-4">📧 supplier@example.com</p>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="my-10">
        <SalesChart />
      </div>
      <div className="my-10">
        <ActivityTimeline />
      </div>
      <div className="my-10">
        <TopProductsTable />
      </div>
      <div className="my-10">
        <RatingsTable />
      </div>
      <div className="my-10">
        <DeliveryStatusTable />
      </div>
      <div className="my-10">
        <NotificationFeed />
      </div>
    </div>
  );
};

export default SupplierDashboard;
