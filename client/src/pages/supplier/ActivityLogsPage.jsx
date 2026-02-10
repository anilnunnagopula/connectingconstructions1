// src/pages/Supplier/ActivityLogsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ActivityTimeline from "./components/ActivityTimeline";
import { ArrowLeft } from "lucide-react";
import SupplierLayout from "../../layout/SupplierLayout";

const baseURL = process.env.REACT_APP_API_URL;

const ActivityLogsPage = () => {
  const navigate = useNavigate();
  const [activityEvents, setActivityEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Authenticated user state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of items per page

  useEffect(() => {
    const fetchActivityLogs = async () => {
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
        toast.error("Please log in as a supplier to view activity logs.");
        navigate("/login");
        return;
      }
      setUser(currentUser);

      try {
        // Fetch all activity logs from the new dedicated endpoint
        const response = await axios.get(
          `${baseURL}/api/supplier/activity-logs?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setActivityEvents(response.data.results || []);
        setTotalPages(response.data.totalPages);
        toast.success("Activity logs loaded!");
      } catch (err) {
        console.error("Error fetching activity logs:", err);
        let errorMessage = "Failed to load activity logs.";
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

    fetchActivityLogs();
  }, [navigate, currentPage]); // Re-fetch when page changes

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading activity logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg">
          <p className="text-xl font-semibold mb-2">
            Error Loading Activity Logs
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
    // Fallback if useEffect redirection fails for some reason
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
    <SupplierLayout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">
            📜 All Recent Activity
          </h1>
        <ActivityTimeline events={activityEvents} /> {/* Pass the full list */}
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
    </SupplierLayout>
  );
};

export default ActivityLogsPage;
