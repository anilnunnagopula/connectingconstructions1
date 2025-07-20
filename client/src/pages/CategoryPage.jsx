import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import SupplierCard from "../components/SupplierCard";
import FiltersPanel from "../components/FiltersPanel";
import LoginPopup from "../components/LoginPopup"; 

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sortBy, setSortBy] = useState("none");
  const [showPopup, setShowPopup] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [user, setUser] = useState(null);

  const decodedCategory = decodeURIComponent(category).toLowerCase();

  // Load user from localStorage when component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Effect to filter and sort products, and manage popup visibility
  useEffect(() => {
    if (!user) {
      setShowPopup(true);
      setFiltered([]); // Clear filtered products if no user
      return;
    }

    setShowPopup(false); // Hide popup if user is logged in

    const allProducts =
      JSON.parse(localStorage.getItem("supplierProducts")) || [];

    let products = allProducts.filter(
      (p) => p.category?.toLowerCase() === decodedCategory
    );

    // Sorting logic
    if (sortBy === "price") {
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "location") {
      products.sort((a, b) =>
        (a.location || "").localeCompare(b.location || "")
      );
    } else if (sortBy === "distance") {
      // Assuming 'lat' can be used for a simple distance sort;
      // for true distance, you'd need user's current location and more complex geo-calculations.
      products.sort((a, b) => parseFloat(a.lat || 0) - parseFloat(b.lat || 0));
    }

    setFiltered(products);
  }, [user, location.pathname, sortBy, decodedCategory]); // Added decodedCategory to dependencies

  // Handlers for the LoginPopup's actions
  const handleClosePopup = () => {
    setShowPopup(false); // First, close the popup
    // If the user is not logged in, redirect them to the home page
    if (!user) {
      navigate("/");
    }
  };

  const handleGoBack = () => {
    setShowPopup(false); // Close popup
    navigate("/"); // Navigate to home page
  };

  const handleLoginNow = () => {
    setShowPopup(false); // Close popup
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative font-inter">
      {/* Conditionally render the enhanced LoginPopup */}
      {showPopup && (
        <LoginPopup
          onClose={handleClosePopup} // For the X button and Escape key
          onGoBack={handleGoBack}
          onLoginNow={handleLoginNow}
          categoryName={category} // Pass the category name to the popup
        />
      )}

      {/* Main content area, dimmed and non-interactive when popup is open */}
      <div className={`${showPopup ? "opacity-20 pointer-events-none" : ""}`}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            🛍️ Suppliers for "{category}"
          </h2>
          <select
            className="border px-3 py-2 rounded shadow-sm focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy} // Ensure select reflects current sort state
          >
            <option value="none">Sort By</option>
            <option value="price">💰 Price</option>
            <option value="location">📍 Location</option>
            <option value="distance">📏 Distance</option>
          </select>
        </div>

        {/* Filters Panel component */}
        <FiltersPanel />

        {/* Display filtered suppliers or a no-results message */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((product, index) => (
              <SupplierCard key={index} product={product} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-20 text-xl">
            😕 No suppliers found under "{category}"
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
