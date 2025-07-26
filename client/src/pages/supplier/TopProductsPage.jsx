// client/src/pages/supplier/TopProductsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Import the table component from the correct location
import TopProductsTable from "./components/TopProductsTable";

const baseURL = process.env.REACT_APP_API_URL;

const TopProductsPage = () => {
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Authenticated user state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of items per page for the full page view
  const [sortBy, setSortBy] = useState("totalQuantitySold"); // Default sort field
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort order (descending)

  useEffect(() => {
    const fetchTopProducts = async () => {
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
        toast.error("Please log in as a supplier to view top products.");
        navigate("/login");
        return;
      }
      setUser(currentUser);

      try {
        // Fetch all top products from the dedicated backend endpoint
        const response = await axios.get(
          `${baseURL}/api/supplier/top-products?page=${currentPage}&limit=${limit}&sort=${sortBy}&order=${sortOrder}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setTopProducts(response.data.results || []);
        setTotalPages(response.data.totalPages);
        toast.success("Top products loaded!");
      } catch (err) {
        console.error("Error fetching top products:", err);
        let errorMessage = "Failed to load top products.";
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

    fetchTopProducts();
  }, [navigate, currentPage, sortBy, sortOrder]); // Re-fetch when page, sort field, or sort order changes

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

  // Handlers for sorting
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page on sort order change
  };

  // Render loading/error/unauthorized states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading top products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg">
          <p className="text-xl font-semibold mb-2">
            Error Loading Top Products
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
          🔥 All Top-Selling Products
        </h1>

        {/* Sorting Controls */}
        <div className="flex justify-end items-center gap-4 mb-6">
          <div>
            <label
              htmlFor="sortBy"
              className="text-sm font-medium dark:text-gray-300 mr-2"
            >
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="totalQuantitySold">Quantity Sold</option>
              <option value="totalRevenue">Revenue</option>
              <option value="name">Name</option>
              <option value="averageRating">Average Rating</option>
              <option value="createdAt">Date Added</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="sortOrder"
              className="text-sm font-medium dark:text-gray-300 mr-2"
            >
              Order:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={handleSortOrderChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {topProducts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No top-selling products to display.
          </p>
        ) : (
          // Render the TopProductsTable component with the fetched data
          <TopProductsTable products={topProducts} />
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

export default TopProductsPage;
