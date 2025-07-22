import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  // Dark mode state, initialized from localStorage or system preference
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  // Effect to apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      setMessage("");
      setMessageType("");

      let supplierEmail = null;
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          supplierEmail = user.email;
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        setError("Failed to retrieve user information. Please log in again.");
        setMessageType("error");
        setLoading(false);
        navigate("/login"); // Redirect to login if user data is bad
        return;
      }

      if (!supplierEmail) {
        setError("Supplier not logged in. Please log in to view products.");
        setMessageType("error");
        setLoading(false);
        navigate("/login"); // Redirect to login if not logged in
        return;
      }

      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/products?supplierEmail=${supplierEmail}`;

        console.log("Fetching products from:", apiUrl); // Debugging

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // If you have authentication tokens (e.g., JWT), include them here:
            // "Authorization": `Bearer ${user.token}`
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products.");
        }

        setProducts(data); // Assuming data is an array of products
        setMessage("Products loaded successfully!");
        setMessageType("success");
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err.message || "An unexpected error occurred while fetching products."
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]); // Dependency array includes navigate to avoid lint warnings

  // Message display logic
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
        <p className="mt-4 text-lg font-medium">Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-6 rounded-lg shadow-xl text-center border border-red-300 dark:border-red-700">
          <p className="font-bold text-xl mb-2">Oops! Something went wrong.</p>
          <p className="text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple reload to retry
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-200 font-semibold shadow-md"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-blue-300">
            My Products <span className="text-2xl">📦</span>
          </h2>
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-4.575l.707-.707M5.968 18.032l-.707.707M18.032 5.968l.707-.707M5.293 5.293l-.707-.707M17 12a5 5 0 11-10 0 5 5 0 0110 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium shadow-md ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                : messageType === "info"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                : messageType === "warning"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
            } transition-colors duration-300`}
          >
            {message}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-300">
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
              It looks like you haven't added any products yet.
            </p>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <span className="mr-2">✨</span> Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-200 dark:border-gray-700"
              >
                <div>
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm border border-gray-100 dark:border-gray-700"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src =
                          "https://placehold.co/400x300/e0e0e0/555555?text=No+Image"; // Placeholder
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                      No Image Available
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                    <span className="font-semibold mr-2">Category:</span>{" "}
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                    <span className="font-semibold">Description:</span>{" "}
                    {product.description}
                  </p>
                  <p className="text-2xl font-extrabold text-green-600 dark:text-green-400 mb-2">
                    ₹{product.price}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span className="font-semibold">Quantity:</span>{" "}
                    {product.quantity} units
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                    <span className="font-semibold mr-2">Status:</span>{" "}
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                        product.availability
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {product.availability ? "Available" : "Not Available"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                    <span className="font-semibold mr-2">Location:</span>{" "}
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {product.location.text}
                    </span>
                  </p>
                </div>
                <div className="mt-4 flex flex-col space-y-3">
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="w-full bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                  >
                    ✏️ Edit Product
                  </button>
                  <button
                    onClick={() => {
                      // Implement delete logic here, maybe a confirmation modal
                      setMessage(
                        `Delete functionality for ${product.name} not yet implemented.`
                      );
                      setMessageType("info");
                    }}
                    className="w-full bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    🗑️ Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
