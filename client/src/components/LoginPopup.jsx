import React from "react";

const LoginPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-[300px] text-center space-y-4 animate-bounceIn">
        <h2 className="text-xl font-bold text-red-600">⚠️ Hold up!</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Please login to view this category!
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Okay, got it!
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
