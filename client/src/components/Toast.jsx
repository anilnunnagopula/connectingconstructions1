import React from "react";

const Toast = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-bounce-in-out">
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose}>
        ✖
      </button>
    </div>
  );
};

export default Toast;
