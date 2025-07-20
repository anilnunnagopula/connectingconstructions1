import React, { useEffect, useState } from "react";
import categories from "../utils/Categories";
import { useNavigate } from "react-router-dom";
import Materials from "./Materials";
const Home = () => {
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowMobilePopup(true);
      const timer = setTimeout(() => setShowMobilePopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCategoryClick = (category) => {
    const encoded = encodeURIComponent(category);
    navigate(`/category/${encoded}`);
  };

  return (
    <div>
      {/* ✅ Mobile Warning Popup */}
      {showMobilePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg w-80 text-center space-y-4">
            <h2 className="text-lg font-semibold">📱 Heads Up!</h2>
            <p className="text-sm">
              For better viewing experience, please use a desktop or landscape
              mode.
            </p>
            <button
              onClick={() => setShowMobilePopup(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Hero Section */}
      <div
        className="w-full h-[95vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/building.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            The Amazon for Builders
          </h1>
          <p className="text-xl md:text-2xl font-light mb-6">
            Connecting the Core and the Code
          </p>
        </div>
      </div>

      {/* 🔹 Category Showcase */}
      <Materials/>
      
    </div>
  );
};

export default Home;
