import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import categories from "../utils/Categories";
import Materials from "./Materials";
import CommonServices from "../common-services/CommonServices";

const Home = () => {
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const navigate = useNavigate();

  // ✨ Get auth state
  const { isAuthenticated, user, isAuthLoading } = useAuth();

  // ✨ Redirect logged-in users to their dashboard
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      if (user.role === "customer") {
        navigate("/customer-dashboard", { replace: true });
      } else if (user.role === "supplier") {
        navigate("/supplier-dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, isAuthLoading, navigate]);

  // Removed mobile warning popup as per responsiveness requirements

  const handleCategoryClick = (category) => {
    const encoded = encodeURIComponent(category);
    navigate(`/category/${encoded}`);
  };

  // ✨ Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // ✨ Only show home page to non-authenticated users
  return (
    <div>
      {/* ✅ Mobile Warning Popup */}
      {/* Mobile Warning Popup Removed */}

      {/* 🔹 Hero Section */}
      <div
        className="w-full h-[60vh] md:min-h-[85vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/building.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 transition-all duration-500">
          <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md leading-tight px-2">
            The One-Stop
            <span className="block sm:inline"> Platform for Constructions</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl font-medium italic mb-2 text-gray-200 drop-shadow-sm px-4">
            From Ground Levelling to Government Approvals
          </p>

          <strong className="text-sm sm:text-lg md:text-xl font-bold tracking-wide block mt-2">
            Connecting Core and Code
          </strong>
        </div>
      </div>

      {/* 🔹 Category Showcase */}
      <Materials />
      <hr />

      {/* <CommonServices /> */}
    </div>
  );
};

export default Home;
