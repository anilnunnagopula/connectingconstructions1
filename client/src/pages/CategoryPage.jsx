import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  UserCircle,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Truck,
  Star,
  Bell,
  Headset,
  CreditCard,
  FileText,
  Repeat,
  MessageSquare,
  MapPin,
  Settings,
  History,
} from "lucide-react";

import LoginPopup from "../components/LoginPopup";

const baseURL = process.env.REACT_APP_API_URL;

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sortBy, setSortBy] = useState("none");
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);
  const [customerCart, setCustomerCart] = useState([]);
  const [customerWishlist, setCustomerWishlist] = useState([]);
  const decodedCategory = decodeURIComponent(category).toLowerCase();

  // Fetch products only if user exists
  const fetchProductsByCategory = useCallback(async () => {
    if (!user) {
      setShowPopup(true);
      setFiltered([]); // Clear filtered products if no user
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${baseURL}/api/products?category=${encodeURIComponent(category)}`
      );
      const data = response.data;

      const productsWithSuppliers = data.filter(
        (p) => p.supplier && p.supplier.name
      );

      setProducts(productsWithSuppliers);
    } catch (err) {
      console.error("Fetch error:", err);
      let errorMessage = `Failed to load materials for "${decodedCategory}".`;
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [category, user]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);
  const isProductInCart = useCallback(
    (productId) => customerCart.some((item) => item.productId === productId),
    [customerCart]
  );
  const isProductInWishlist = useCallback(
    (productId) => customerWishlist.some((item) => item.product === productId),
    [customerWishlist]
  );

  // Filter + sort effect
  useEffect(() => {
    if (products.length > 0) {
      let sorted = [...products];
      if (sortBy === "price") {
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortBy === "location") {
        sorted.sort((a, b) =>
          (a.location?.text || "").localeCompare(b.location?.text || "")
        );
      } else if (sortBy === "distance") {
        sorted.sort((a, b) => (a.location?.lat || 0) - (b.location?.lat || 0));
      }
      setFiltered(sorted);
    } else {
      setFiltered([]);
    }
  }, [products, sortBy]);

  // Popup handlers
  const handleClosePopup = () => {
    setShowPopup(false);
    if (!user) navigate("/");
  };

  const handleGoBack = () => {
    setShowPopup(false);
    navigate("/");
  };

  const handleLoginNow = () => {
    setShowPopup(false);
    navigate("/login");
  };

  const handleViewDetails = (productId) => {
    if (!user) {
      setShowPopup(true);
    } else if (user.role === "customer") {
      navigate(`/product/${productId}`);
    } else {
      toast.error("Access restricted for this role.");
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading materials for "{decodeURIComponent(category)}"...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-red-700 dark:text-red-300">
        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg shadow-xl text-center">
          <p className="font-bold text-xl mb-2">Error Loading Materials!</p>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const handleAddToCart = async (productId, e) => {
    e.stopPropagation(); // Stop event bubbling
    if (!isLoggedIn) {
      setShowPopup(true);
      return;
    }
    try {
      const token = user.token;
      const response = await axios.post(
        `${baseURL}/api/customer/cart`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Item added to cart!");
      fetchCustomerData(token);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  const handleAddToWishlist = async (productId, e) => {
    e.stopPropagation(); // Stop event bubbling
    if (!isLoggedIn) {
      setShowPopup(true);
      return;
    }
    try {
      const token = user.token;
      const response = await axios.post(
        `${baseURL}/api/customer/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Item added to wishlist!");
      fetchCustomerData(token);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist.");
    }
  };

  const handleRemoveFromWishlist = async (productId, e) => {
    e.stopPropagation(); // Stop event bubbling
    if (!isLoggedIn) return;
    try {
      const token = user.token;
      const response = await axios.delete(
        `${baseURL}/api/customer/wishlist/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Item removed from wishlist!");
      fetchCustomerData(token);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to remove from wishlist."
      );
    }
  };

  const handleRemindMe = async (productId, e) => {
    e.stopPropagation(); // Stop event bubbling
    if (!isLoggedIn) {
      setShowPopup(true);
      return;
    }
    // You'll need a backend endpoint for this feature, e.g., POST /api/customer/product-alerts
    toast.success("We'll remind you when this product is back in stock!");
  };

  

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative font-inter">
      {showPopup && (
        <LoginPopup
          onClose={handleClosePopup}
          onGoBack={handleGoBack}
          onLoginNow={handleLoginNow}
          categoryName={category}
        />
      )}

      <div className={`${showPopup ? "opacity-20 pointer-events-none" : ""}`}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
            🛍️ Suppliers for "{category}"
          </h2>
          <select
            className="border px-3 py-2 rounded shadow-sm focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="none">Sort By</option>
            <option value="price">💰 Price</option>
            <option value="location">📍 Location</option>
            <option value="distance">📏 Distance</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                onClick={() => handleViewDetails(product._id)}
              >
                {product.imageUrls?.length > 0 ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No Image Available
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                    <p className="text-green-600 dark:text-green-400 font-semibold mb-2">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  </div>
                  {product.supplier?.name && (
                    <div className="flex items-center text-sm mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
                      {product.supplier.profilePictureUrl ? (
                        <img
                          src={product.supplier.profilePictureUrl}
                          alt={product.supplier.name}
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                      ) : (
                        <UserCircle size={20} className="mr-2" />
                      )}
                      <span>By {product.supplier.name}</span>
                    </div>
                  )}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    {product.availability ? (
                      isProductInCart(product._id) ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/customer/cart");
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm w-full"
                        >
                          In Cart
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product._id);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm w-full"
                        >
                          <ShoppingCart size={16} className="inline mr-2" /> Add
                          to Cart
                        </button>
                      )
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemindMe(product._id);
                        }}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-sm w-full"
                      >
                        Remind when available
                      </button>
                    )}

                    {isProductInWishlist(product._id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWishlist(product._id);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm w-full"
                      >
                        <Heart size={16} className="inline mr-2" /> Remove from
                        Wishlist
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(product._id);
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 text-sm w-full"
                      >
                        <Heart size={16} className="inline mr-2" /> Add to
                        Wishlist
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
