// client/src/layout/CustomerLayout.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import { useNavigate } from "react-router-dom";

const CustomerLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  // Mock counts - replace with real data
  const [counts, setCounts] = useState({
    cart: 0,
    wishlist: 0,
    notifications: 0,
    quotes: 0,
  });

  useEffect(() => {
    // Get cart count from CartContext
    if (cart && Array.isArray(cart)) {
      setCounts((prev) => ({ ...prev, cart: cart.length }));
    }

    // TODO: Fetch other counts from API
  }, [cart]);

  // Redirect if not customer
  useEffect(() => {
    if (isAuthenticated && user?.role !== "customer") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <Sidebar
        cartCount={counts.cart}
        wishlistCount={counts.wishlist}
        notificationCount={counts.notifications}
      />

      {/* Main Content */}
      <main className="md:ml-64 pb-16 md:pb-0">
        <div className="min-h-screen">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav cartCount={counts.cart} quoteCount={counts.quotes} />
    </div>
  );
};

export default CustomerLayout;
