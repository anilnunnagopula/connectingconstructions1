import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage("");
    setMessageType("");

    let supplierEmail = null;
    let token = null;

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        supplierEmail = user.email;
        token = user.token;
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      setError("Failed to retrieve user information. Please log in again.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    if (!supplierEmail || !token) {
      setError("Supplier not logged in. Please log in to view products.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/myproducts`; // Fetching only supplier's products
      console.log("Fetching products from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the authentication token
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to fetch products."
        );
      }

      setProducts(data);
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
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDeleteProduct = async (productId, productName) => {
    // START of the requested block
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      setLoading(true); // Maybe a local loading for the card or a global overlay
      setMessage("");
      setMessageType("");

      let token = null;
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          token = user.token;
        }
      } catch (err) {
        console.error("Error parsing user from localStorage for delete:", err);
        setMessage("Authentication error. Please log in again.");
        setMessageType("error");
        setLoading(false);
        navigate("/login");
        return;
      }

      if (!token) {
        setMessage("Not authenticated to delete products. Please log in.");
        setMessageType("error");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${productId}`;
        const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token for deletion
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "Failed to delete product."
          );
        }

        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        setMessage(`"${productName}" deleted successfully!`);
        setMessageType("success");
      } catch (err) {
        console.error("Error deleting product:", err);
        setMessage(
          err.message || "Failed to delete product. Please try again."
        );
        setMessageType("error");
      } finally {
        setLoading(false); // Reset loading
      }
    } 
  };

  const handleToggleAvailability = async (productId, currentAvailability) => {
    setLoading(true); // Global loading for simplicity, could be per-card
    setMessage("");
    setMessageType("");

    let token = null;
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        token = user.token;
      }
    } catch (err) {
      console.error(
        "Error parsing user from localStorage for availability toggle:",
        err
      );
      setMessage("Authentication error. Please log in again.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    if (!token) {
      setMessage("Not authenticated to update product. Please log in.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const newAvailability = !currentAvailability;
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${productId}`;
      const response = await fetch(apiUrl, {
        method: "PUT", // Assuming your updateProduct endpoint handles PUT requests
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ availability: newAvailability }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to update product availability."
        );
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, availability: newAvailability }
            : product
        )
      );
      setMessage(
        `Product availability updated to ${
          newAvailability ? "Available" : "Not Available"
        }!`
      );
      setMessageType("success");
    } catch (err) {
      console.error("Error toggling product availability:", err);
      setMessage(
        err.message || "Failed to update availability. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-400"></div>
        <p className="mt-4 text-lg font-medium">Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-8 rounded-lg shadow-xl text-center border border-red-200 dark:border-red-700">
          <p className="font-bold text-2xl mb-4">Error Loading Products!</p>
          <p className="text-lg mb-6">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="mt-6 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          >
            🔄 Retry Loading Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight leading-tight">
            My Products <span className="text-blue-500">📦</span>
          </h2>
        </div>

        {message && (
          <div
            className={`mb-8 p-4 rounded-lg text-center font-medium shadow-md ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : messageType === "info"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : messageType === "warning"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
            } transition-colors duration-300`}
          >
            {message}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-colors duration-300 border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-8">
              It looks like you haven't added any products yet.
            </p>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-10 py-4 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-70"
            >
              <span className="mr-2 text-2xl">✨</span> Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {/* Adjusted to 3 columns on large screens */}
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col border border-gray-100 dark:border-gray-700"
              >
                {/* Made image and main content clickable */}
                <div
                  className="cursor-pointer" // Add cursor pointer to indicate clickability
                  onClick={() => navigate(`/supplier/product/${product._id}`)} // Navigate to product detail page
                >
                  <div className="relative">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-full h-56 object-cover rounded-t-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/600x400/e0e0e0/555555?text=No+Image+Available";
                        }}
                      />
                    ) : (
                      <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 rounded-t-xl flex items-center justify-center text-gray-500 dark:text-gray-400 text-base font-semibold">
                        No Image Available
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                      <span className="font-semibold mr-2">Category:</span>{" "}
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </p>
                    <p className="text-base text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                      {product.description || "No description provided."}
                    </p>

                    <div className="mt-auto">
                      <p className="text-3xl font-extrabold text-green-600 dark:text-green-400 mb-2">
                        ₹{parseFloat(product.price).toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
                        <span className="font-semibold mr-1">Quantity:</span>{" "}
                        {product.quantity} units
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                        <span className="font-semibold mr-1">Location:</span>{" "}
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
                        {product.location?.text || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consolidated Actions Row */}
                <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center space-x-2">
                  {/* Availability Toggle */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {product.availability ? "Available" : "Not Available"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.availability}
                        onChange={() =>
                          handleToggleAvailability(
                            product._id,
                            product.availability
                          )
                        }
                        className="sr-only peer"
                        disabled={loading} // Disable toggle while another operation is ongoing
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      navigate(`/edit-product/${product._id}`);
                    }}
                    className="flex-grow-0 flex-shrink-0 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    title="Edit Product"
                    disabled={loading} // Disable while another operation is ongoing
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      handleDeleteProduct(product._id, product.name);
                    }}
                    className="flex-grow-0 flex-shrink-0 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    title="Delete Product"
                    disabled={loading} // Disable while another operation is ongoing
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165M12 2.25L12 2.25c-1.103 0-2.203.15-3.303.447L12 2.25c-1.103 0-2.203.15-3.303.447"
                      />
                    </svg>
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
