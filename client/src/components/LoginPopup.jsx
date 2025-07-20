import React, { useEffect } from "react";
import { X, Lock } from "lucide-react"; // Importing icons from lucide-react

const LoginPopup = ({ onClose, onGoBack, onLoginNow, categoryName }) => {
  // Effect to handle closing the popup with the Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]); // Dependency array includes onClose to avoid stale closure issues

  return (
    // Fixed overlay for the popup, covering the entire screen.
    // Uses a completely opaque background: white in light mode, black in dark mode.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black font-inter">
      {/* Define custom animation keyframes directly within the component for reliability */}
      <style>
        {`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        `}
      </style>

      {/* Popup container with enhanced styling */}
      {/* p-8 provides padding inside the popup, w-full max-w-sm controls its size. */}
      {/* Text colors adjusted for better contrast in dark mode. */}
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center space-y-6 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scaleIn">
        {/* Close button (X icon) */}
        <button
          onClick={onClose} // This button will simply close the popup
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close popup"
        >
          <X size={24} /> {/* Lucide React X icon */}
        </button>

        {/* Icon for the popup message */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 dark:bg-red-800/30 p-3 rounded-full inline-flex items-center justify-center">
            {/* Icon color adjusted for better contrast in dark mode */}
            <Lock size={36} className="text-red-600 dark:text-red-300" />{" "}
            {/* Lucide React Lock icon */}
          </div>
        </div>

        {/* Popup title */}
        {/* Title color adjusted for better contrast in dark mode */}
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-300">
          Access Restricted
        </h2>

        {/* Popup message */}
        {/* Message text color adjusted for better contrast in dark mode */}
        <p className="text-gray-700 dark:text-gray-100 text-base leading-relaxed">
          You need to login to view supplier details under{" "}
          <b>"{categoryName}"</b> {/* Use categoryName prop */}
        </p>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={onGoBack} // Calls the onGoBack function passed from parent
            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Go Back
          </button>
          <button
            onClick={onLoginNow} // Calls the onLoginNow function passed from parent
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
