// client/src/pages/customer/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Heart,
  ShoppingCart,
  MessageSquare,
  Trash2,
  Star,
  ArrowLeft,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import { useCart } from "../../context/CartContext";

const baseURL = process.env.REACT_APP_API_URL;

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.token) {
        toast.error("Please login to view wishlist");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${baseURL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log("✅ Wishlist loaded:", response.data);
      setItems(response.data.data.items || []);
    } catch (error) {
      console.error("❌ Wishlist error:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.delete(`${baseURL}/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setItems((prev) => prev.filter((item) => item.product._id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("❌ Remove from wishlist error:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product._id, 1);
    if (success) {
      // Optionally remove from wishlist after adding to cart
      handleRemoveFromWishlist(product._id);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (items.length === 0) {
    return (
      <CustomerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <Heart size={80} className="text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Save items you love to compare and buy later
          </p>
          <button
            onClick={() => navigate("/materials")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Browse Materials
          </button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/customer-dashboard")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="text-red-500" />
              My Wishlist
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {items.length} item{items.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(({ product, addedAt }) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Product Image */}
              <div 
                className="relative h-48 bg-gray-200 dark:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/customer/product/${product._id}`)}
              >
                {product.imageUrls?.[0] ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart size={48} className="text-gray-400" />
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(product._id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
                >
                  <Heart
                    size={20}
                    className="text-red-500 fill-red-500 group-hover:scale-110 transition"
                  />
                </button>

                {/* Rating Badge */}
                {product.averageRating > 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="text-xs font-medium">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 
                  className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/customer/product/${product._id}`)}
                >
                  {product.name}
                </h3>

                {product.productType !== "service" ? (
                  <div className="mb-3">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      per {product.unit}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                    Service
                  </p>
                )}

                {/* Supplier Info */}
                {product.supplier && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    by {product.supplier.name || product.supplier.companyName}
                  </p>
                )}

                {/* Added Date */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Added {new Date(addedAt).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {product.productType === "service" || product.isQuoteOnly ? (
                    <button
                      onClick={() =>
                        navigate(
                          `/customer/quotes/request?product=${product._id}`,
                        )
                      }
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} />
                      Request Quote
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="px-3 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Wishlist;
