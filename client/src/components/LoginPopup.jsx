import React, { useEffect } from "react";
import { X, Lock } from "lucide-react"; // Importing icons from lucide-react

const LoginPopup = ({ onClose }) => {
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
    // Removed 'p-4' from here to ensure full screen coverage without visible borders.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black font-inter">
      {/* Popup container with enhanced styling */}
      {/* p-8 provides padding inside the popup, w-full max-w-sm controls its size. */}
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center space-y-6 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scaleIn">
        {/* Close button (X icon) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close popup"
        >
          <X size={24} /> {/* Lucide React X icon */}
        </button>

        {/* Icon for the popup message */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 dark:bg-red-800/30 p-3 rounded-full inline-flex items-center justify-center">
            <Lock size={36} className="text-red-600 dark:text-red-400" />{" "}
            {/* Lucide React Lock icon */}
          </div>
        </div>

        {/* Popup title */}
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Access Restricted
        </h2>

        {/* Popup message */}
        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          It looks like you need to log in to view this content. Please sign in
          or create an account to proceed.
        </p>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Okay, got it!
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
