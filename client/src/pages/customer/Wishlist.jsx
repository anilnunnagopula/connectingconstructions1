import React, { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.token) {
          setError("Please login to view wishlist");
          return;
        }

        const res = await axios.get(`${API_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setItems(res.data.items || []);
      } catch (err) {
        console.error("Wishlist error:", err);
        setError("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("user"));
      await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems((prev) => prev.filter((item) => item.product._id !== productId));
    } catch {
      alert("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        💔 Your wishlist is empty
        <p className="text-sm mt-2">Save items to compare later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">❤️ My Wishlist</h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ product, supplier }) => (
          <div
            key={product._id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="h-40 w-full object-cover rounded-lg mb-3"
            />

            <h3 className="font-semibold">{product.name}</h3>

            {!product.isService && (
              <p className="text-blue-600 font-medium">
                ₹{product.price} / {product.unit}
              </p>
            )}

            <p className="text-sm text-gray-500">Supplier: {supplier?.name}</p>

            <div className="flex gap-2 mt-4">
              {product.isService ? (
                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">
                  Request Quote
                </button>
              ) : (
                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                  Add to Cart
                </button>
              )}

              <button
                onClick={() => removeFromWishlist(product._id)}
                className="px-4 border rounded-lg text-red-500"
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
