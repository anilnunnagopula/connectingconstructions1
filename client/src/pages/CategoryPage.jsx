import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SupplierCard from "../components/SupplierCard";
import FiltersPanel from "../components/FiltersPanel";

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sortBy, setSortBy] = useState("none");
  const [showPopup, setShowPopup] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [user, setUser] = useState(null);

  const decodedCategory = decodeURIComponent(category).toLowerCase();

  // ✅ Load user from localStorage when component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!user) {
      setShowPopup(true);
      setFiltered([]);
      return;
    }

    setShowPopup(false);

    const allProducts =
      JSON.parse(localStorage.getItem("supplierProducts")) || [];

    let products = allProducts.filter(
      (p) => p.category?.toLowerCase() === decodedCategory
    );

    if (sortBy === "price") {
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "location") {
      products.sort((a, b) =>
        (a.location || "").localeCompare(b.location || "")
      );
    } else if (sortBy === "distance") {
      products.sort((a, b) => parseFloat(a.lat || 0) - parseFloat(b.lat || 0));
    }

    setFiltered(products);
  }, [user, location.pathname, sortBy]);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative">
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-bold mb-3 text-red-600">
              ⚠️ Please Login
            </h2>
            <p className="mb-4">
              You need to login to view supplier details under{" "}
              <b>"{category}"</b>
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => navigate("/")}
              >
                Go Back
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => navigate("/login")}
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${showPopup ? "opacity-20 pointer-events-none" : ""}`}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            🛍️ Suppliers for "{category}"
          </h2>
          <select
            className="border px-3 py-2 rounded shadow-sm focus:outline-none dark:bg-gray-800 dark:border-gray-600"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="none">Sort By</option>
            <option value="price">💰 Price</option>
            <option value="location">📍 Location</option>
            <option value="distance">📏 Distance</option>
          </select>
        </div>

        <FiltersPanel />

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
