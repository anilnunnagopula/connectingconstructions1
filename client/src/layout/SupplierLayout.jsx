import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import SupplierSidebar from "../components/SupplierSidebar";
import SupplierBottomNav from "../components/SupplierBottomNav"; // Keep using this for mobile
import { useNavigate } from "react-router-dom";

const SupplierLayout = ({ children, pendingOrders = 0, notifications = 0 }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Use local state if props are not provided, or to sync with context later
  // For now we rely on props passed from pages or default to 0
  
  // Redirect if not supplier
  useEffect(() => {
    if (isAuthenticated && user?.role !== "supplier") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16"> {/* Add pt-16 for Navbar spacing */}
      {/* Desktop Sidebar */}
      <SupplierSidebar 
        pendingOrdersCount={pendingOrders}
        notificationCount={notifications}
      />

      {/* Main Content */}
      <main className="md:ml-64 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Mobile Bottom Navigation - Only shows on small screens */}
      {/* We wrap the whole layout in SupplierBottomNav or just render it? 
          The previous implementation wrapped content in SupplierBottomNav. 
          Let's reuse SupplierBottomNav's existing logic to only show on mobile.
      */}
      <SupplierBottomNav pendingOrders={pendingOrders} notifications={notifications} />
    </div>
  );
};

export default SupplierLayout;
