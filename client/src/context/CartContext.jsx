// client/src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CartContext = createContext();

const baseURL = process.env.REACT_APP_API_URL;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get auth token and user info
  const getAuthToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.token;
    } catch {
      return null;
    }
  };

  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.role;
    } catch {
      return null;
    }
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    const token = getAuthToken();
    const role = getUserRole();

    console.log("🛒 Cart fetch check:", { hasToken: !!token, role });

    // Only fetch for customers
    if (!token || role !== 'customer') {
      console.log("ℹ️  Skipping cart fetch - not a customer");
      return;
    }

    try {
      setLoading(true);
      console.log("📡 Fetching cart from backend...");
      
      const response = await axios.get(`${baseURL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Cart fetched:", response.data);

      const { items, totalItems: total, totalPrice: price } = response.data.data;
      setCartItems(items || []);
      setTotalItems(total || 0);
      setTotalPrice(price || 0);
    } catch (error) {
      console.error("❌ Error fetching cart:", error.response?.status);
      
      // Don't show error for 404 (empty cart) or 403 (not customer)
      if (error.response?.status !== 404 && error.response?.status !== 403) {
        // toast.error("Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    const token = getAuthToken();
    const role = getUserRole();

    if (!token) {
      toast.error("Please login to add items to cart");
      return false;
    }

    if (role !== 'customer') {
      toast.error("Only customers can add items to cart");
      return false;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseURL}/api/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { items, totalItems: total, totalPrice: price } = response.data.data;
      setCartItems(items || []);
      setTotalItems(total || 0);
      setTotalPrice(price || 0);

      toast.success("Item added to cart!");
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMsg = error.response?.data?.message || "Failed to add item to cart";
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    const token = getAuthToken();
    const role = getUserRole();

    if (!token || role !== 'customer') return false;

    try {
      setLoading(true);
      const response = await axios.put(
        `${baseURL}/api/cart/update/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { items, totalItems: total, totalPrice: price } = response.data.data;
      setCartItems(items || []);
      setTotalItems(total || 0);
      setTotalPrice(price || 0);

      return true;
    } catch (error) {
      console.error("Error updating cart:", error);
      const errorMsg = error.response?.data?.message || "Failed to update quantity";
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    const token = getAuthToken();
    const role = getUserRole();

    if (!token || role !== 'customer') return false;

    try {
      setLoading(true);
      const response = await axios.delete(
        `${baseURL}/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { items, totalItems: total, totalPrice: price } = response.data.data;
      setCartItems(items || []);
      setTotalItems(total || 0);
      setTotalPrice(price || 0);

      toast.success("Item removed from cart");
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    const token = getAuthToken();
    const role = getUserRole();

    if (!token || role !== 'customer') return false;

    try {
      setLoading(true);
      await axios.delete(`${baseURL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems([]);
      setTotalItems(0);
      setTotalPrice(0);

      toast.success("Cart cleared");
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart on mount - ONLY for customers
  useEffect(() => {
    const role = getUserRole();
    console.log("🎯 CartContext mounted - User role:", role);
    
    if (role === 'customer') {
      fetchCart();
    } else {
      console.log("ℹ️  Not a customer - cart disabled");
    }
  }, []);

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};