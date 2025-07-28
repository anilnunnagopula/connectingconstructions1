// pages/supplier/AnalyticsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// You might import chart components here later, e.g., import { Bar, Line } from 'react-chartjs-2';
// And icons for stats: import { TrendingUp, ShoppingBag, Users, Star } from 'lucide-react';
// If you want to use the SalesChart component for salesOverTime, import it:
// import SalesChart from "../../components/SalesChart"; // Assuming it expects `labels` and `data` props

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null); // This will hold all fetched analytics
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Helper to get token
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  // Fetch Analytics Data dynamically
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/analytics`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to fetch analytics."
        );
      }

      setAnalyticsData(data); // Set the dynamically fetched data
      setMessage("Analytics loaded successfully.");
      setMessageType("success");
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setMessage(err.message || "Error loading analytics data.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Handle message timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-8 rounded-lg shadow-xl text-center border border-red-200 dark:border-red-700">
          <p className="font-bold text-2xl mb-4">No Analytics Data Available</p>
          <p className="text-lg mb-6">
            There was an issue loading your analytics or no data exists yet.
          </p>
          <button
            onClick={fetchAnalytics}
            className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          📊 Your Performance Analytics
        </h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium shadow-md ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : messageType === "error"
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
            } transition-colors duration-300`}
          >
            {message}
          </div>
        )}

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-blue-800 dark:text-blue-200">
              ₹{analyticsData.totalSales.toLocaleString("en-IN")}
            </span>
            <p className="text-lg text-blue-700 dark:text-blue-300">
              Total Sales
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-green-800 dark:text-green-200">
              {analyticsData.totalOrders.toLocaleString()}
            </span>
            <p className="text-lg text-green-700 dark:text-green-300">
              Total Orders
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-purple-800 dark:text-purple-200">
              ₹{analyticsData.averageOrderValue.toFixed(2)}
            </span>
            <p className="text-lg text-purple-700 dark:text-purple-300">
              Avg. Order Value
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-yellow-800 dark:text-yellow-200">
              {analyticsData.conversionRate}%
            </span>
            <p className="text-lg text-yellow-700 dark:text-yellow-300">
              Conversion Rate
            </p>
          </div>
        </div>

        {/* Sales Trend Chart (Can replace with a real chart component) */}
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Sales Trend (Last 7 Days)
          </h3>
          {/* Here you would integrate a real chart library like Chart.js or Recharts */}
          {analyticsData.salesOverTime &&
          analyticsData.salesOverTime.labels &&
          analyticsData.salesOverTime.data ? (
            <div className="h-64 flex items-center justify-center">
              {/* Example of how you might pass data to a custom SalesChart component: */}
              {/* <SalesChart labels={analyticsData.salesOverTime.labels} data={analyticsData.salesOverTime.data} /> */}
              <pre className="text-xs p-2 bg-gray-200 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-300">
                Chart Data Preview:
                {JSON.stringify(analyticsData.salesOverTime, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No sales trend data available.
            </p>
          )}
        </div>

        {/* Top Products Section */}
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Top-Selling Products (by Revenue)
          </h3>
          {analyticsData.topProducts && analyticsData.topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-200 dark:bg-gray-600">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                    >
                      Sales (₹)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                    >
                      Quantity Sold
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {analyticsData.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        ₹{product.sales.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {product.quantity.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No top-selling products data available.
            </p>
          )}
        </div>

        {/* Other Analytics Sections (Placeholders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Customer Insights
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Customer demographics, repeat buyers, location data would be
              displayed here.
            </p>
            <p className="text-lg font-bold mt-2 text-blue-600 dark:text-blue-400">
              Total Customer Reach:{" "}
              {analyticsData.customerReach.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Inventory Performance
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Stock turnover rates, low stock alerts, product popularity by
              views.
            </p>
            <p className="text-lg font-bold mt-2 text-blue-600 dark:text-blue-400">
              Total Products Sold:{" "}
              {analyticsData.totalProductsSold.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
