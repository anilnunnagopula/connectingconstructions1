import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import StatCard from "../../components/StatCard";
import { Box, DollarSign, ShoppingCart, Star } from "lucide-react";
import SalesChart from "../../components/SalesChart";
import ActivityTimeline from "../../components/ActivityTimeline";
import TopProductsTable from "../../components/TopProductsTable";
import RatingsTable from "../../components/RatingsTable";
import ActionShortcuts from "../../components/ActionShortcuts";
import DeliveryStatusTable from "../../components/DeliveryStatusTable";
import NotificationFeed from "../../components/NotificationFeed";
import ProfileWidget from "../../components/ProfileWidget"; // Assuming this is used somewhere or meant to be used

const baseURL = process.env.REACT_APP_API_URL;

const SupplierDashboard = () => {
    const navigate = useNavigate();

    // State for the authenticated supplier's data (from localStorage and API)
    const [supplierData, setSupplierData] = useState(null); // Renamed to supplierData for clarity
    // State for dynamic dashboard metrics
    const [dashboardStats, setDashboardStats] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        averageRating: 0,
        recentOrders: [], // For the recent orders section if you integrate it
    });
    const [loading, setLoading] = useState(true); // Loading state for dashboard data
    const [error, setError] = useState(null); // Error state for API calls

    // Effect to load user data from localStorage and fetch dashboard stats
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            let user = null; // Use a temporary variable for initial localStorage parse

            try {
                const rawUser = localStorage.getItem("user");
                if (rawUser && rawUser !== "undefined") {
                    user = JSON.parse(rawUser);
                    // Check if the user is actually a supplier and has a token
                    if (!user || user.role !== 'supplier' || !user.token) {
                        setError("Unauthorized: Please log in as a supplier.");
                        setLoading(false);
                        navigate('/login'); // Redirect if not authorized
                        toast.error("Please log in as a supplier to view the dashboard.");
                        return;
                    }
                    setSupplierData(user); // Set the basic user data initially

                    // Fetch dynamic dashboard stats from the backend
                    const response = await axios.get(
                        `${baseURL}/api/supplier/dashboard`,
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`, // Send the JWT token
                            },
                        }
                    );

                    const data = response.data;
                    setDashboardStats({
                        totalProducts: data.totalProducts,
                        totalEarnings: data.totalEarnings,
                        totalOrders: data.totalOrders,
                        averageRating: data.averageRating,
                        recentOrders: data.recentOrders,
                    });
                    toast.success("Dashboard data loaded!");

                } else {
                    setError("No user data found. Please log in.");
                    navigate('/login'); // Redirect to login if no user data
                    toast.error("Please log in to view the dashboard.");
                }
            } catch (err) {
                console.error("Error fetching supplier dashboard data:", err);
                let errorMessage = "Failed to load dashboard data.";
                if (err.response) {
                    // Backend sent an error response
                    errorMessage = err.response.data.message || err.response.data.error || errorMessage;
                    if (err.response.status === 401 || err.response.status === 403) {
                         // If unauthorized/forbidden, clear token and redirect
                        localStorage.removeItem('user');
                        navigate('/login');
                        toast.error("Session expired or unauthorized. Please log in again.");
                    }
                } else if (err.request) {
                    // Request was made but no response received
                    errorMessage = "Network error or server is down.";
                } else {
                    // Something else happened in setting up the request
                    errorMessage = err.message;
                }
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]); // navigate is in dependency array to avoid lint warning

    // If loading, show a loading message
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
                <p className="text-lg">Loading dashboard data...</p>
            </div>
        );
    }

    // If there's an error and not loading, display it
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4">
                <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg">
                    <p className="text-xl font-semibold mb-2">Error Loading Dashboard</p>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Ensure supplierData is available before rendering the main content
    if (!supplierData) {
         // This case should ideally be covered by the initial loading/error state
         // but as a fallback, if data is missing after loading, redirect.
        navigate('/login');
        return null; // Or a simple loading spinner/message
    }


    const cards = [
        {
            title: "📦 My Products",
            desc: "Manage, edit and update your products.",
            link: "/supplier/myproducts", // Corrected link to match backend route
        },
        {
            title: "➕ Add Product",
            desc: "Add new materials with details.",
            link: "/supplier/add-product",
        },
        {
            title: "✏️ Edit Product",
            desc: "Update info of existing products.",
            // This link will need to be dynamic to edit a specific product, e.g., /supplier/myproducts/someProductId/edit
            link: "/supplier/myproducts", // Directing to all products for editing
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
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
            <div className="max-w-6xl mx-auto py-10 px-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    🛠️ Welcome, {supplierData?.name || supplierData?.username || "Supplier"}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                    Manage your products, categories, orders, and performance.
                </p>

                {/* 🔗 Dashboard Links */}
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

                {/* 📊 Dynamic Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Products" value={dashboardStats.totalProducts.toLocaleString()} icon={<Box />} />
                    <StatCard title="Earnings (₹)" value={dashboardStats.totalEarnings.toLocaleString()} icon={<DollarSign />} />
                    <StatCard title="Orders" value={dashboardStats.totalOrders.toLocaleString()} icon={<ShoppingCart />} />
                    <StatCard title="Average Rating" value={dashboardStats.averageRating.toFixed(1) + "★"} icon={<Star />} />
                </div>

                {/* 👤 Supplier Profile Box */}
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
                                {/* Use supplierData.address for location if stored there */}
                                📍 {supplierData?.address || "Location not set"}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                📧 {supplierData?.email || "supplier@example.com"}
                            </p>

                            <button
                                onClick={() => navigate("/supplier/settings")} // Settings is more appropriate for profile edit
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                ✏️ Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* 📈 Graphs, Tables & More */}
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
        </div>
    );
};

export default SupplierDashboard;