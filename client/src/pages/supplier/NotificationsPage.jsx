// src/pages/Supplier/NotificationsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // For "time ago" formatting

const baseURL = process.env.REACT_APP_API_URL;

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Authenticated user state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of items per page for the full page view

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      const storedUser = localStorage.getItem("user");
      let currentUser = null;

      if (storedUser && storedUser !== "undefined") {
        currentUser = JSON.parse(storedUser);
      }

      if (
        !currentUser ||
        !currentUser.token ||
        currentUser.role !== "supplier"
      ) {
        setError("Unauthorized: Please log in as a supplier.");
        setLoading(false);
        toast.error("Please log in as a supplier to view notifications.");
        navigate("/login");
        return;
      }
      setUser(currentUser);

      try {
        // Fetch all notifications from the dedicated backend endpoint
        const response = await axios.get(
          `${baseURL}/api/supplier/notifications?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setNotifications(response.data.results || []);
        setTotalPages(response.data.totalPages);
        toast.success("Notifications loaded!");
      } catch (err) {
        console.error("Error fetching notifications:", err);
        let errorMessage = "Failed to load notifications.";
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
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate, currentPage]); // Re-fetch when page or query parameters change

  // Handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Render loading/error/unauthorized states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg">
          <p className="text-xl font-semibold mb-2">
            Error Loading Notifications
          </p>
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

  if (!user || user.role !== "supplier") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          ⚠️ Unauthorized Access
        </h2>
        <p className="mb-6 text-center max-w-md">
          You do not have permission to view this page. Please log in as a
          supplier.
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page (dashboard)
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          🔔 All Notifications
        </h1>

        {notifications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No notifications to display.
          </p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`font-semibold ${
                      notif.type === "New Order"
                        ? "text-blue-600"
                        : notif.type === "Stock Alert"
                        ? "text-red-600"
                        : notif.type === "New Review"
                        ? "text-yellow-600"
                        : "text-gray-800 dark:text-gray-200" // Default color for the notification type
                    }`}
                  >
                    {notif.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {notif.timestamp
                      ? formatDistanceToNow(new Date(notif.timestamp), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base">
                  {notif.message}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
