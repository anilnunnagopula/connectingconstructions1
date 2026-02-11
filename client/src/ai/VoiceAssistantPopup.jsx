// src/ai/VoiceAssistantPopup.jsx
import React, { useEffect } from "react";
import { Mic, X, Loader, Info, AlertCircle } from "lucide-react"; // Icons

const VoiceAssistantPopup = ({
  isListening,
  transcript,
  error,
  onStartListening,
  onStopListening,
  onClose,
  onCommandProcessed,
  setError,
}) => {
  // Handle Escape key to close popup
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        onStopListening();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onStopListening]);

  // Handle click outside popup to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      onStopListening();
    }
  };

  // When a command is successfully processed by the parent, close the popup and clear error
  useEffect(() => {
    if (!isListening && !error && transcript && onCommandProcessed) {
      const timer = setTimeout(() => {
        onClose();
        setError("");
      }, 1500); // Close after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, error, onClose, onCommandProcessed, setError]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-50 font-inter"
      onClick={handleOverlayClick}
    >
      {/* Custom Keyframes for animation */}
      <style>
        {`
        @keyframes pulseMic {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .animate-pulse-mic {
          animation: pulseMic 1.5s infinite;
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
        `}
      </style>

      {/* Popup content container */}
      <div
        className="relative bg-gray-100 dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4 text-center space-y-6 animate-fadeInScale"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing overlay
      >
        {/* Close button */}
        <button
          onClick={() => {
            onClose();
            onStopListening();
            setError("");
          }}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close voice assistant"
        >
          <X size={24} />
        </button>

        {/* Mic Icon and Status */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <button
            onClick={isListening ? onStopListening : onStartListening}
            className={`p-5 rounded-full transition-all duration-300 ease-in-out
              ${
                isListening
                  ? "bg-red-500 text-white animate-pulse-mic"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
              focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 transform hover:scale-105`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? (
              <Loader size={36} className="animate-spin" />
            ) : (
              <Mic size={36} />
            )}
          </button>

          {isListening && (
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg flex items-center gap-2">
              <Info size={18} /> Listening... Speak your command
            </p>
          )}
          {!isListening && !transcript && !error && (
            <p className="text-gray-600 dark:text-gray-300 text-lg flex items-center gap-2">
              <Mic size={18} /> Click the mic to start
            </p>
          )}
        </div>

        {/* Transcript Display */}
        <div className="min-h-[60px] bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-center text-center">
          {transcript ? (
            <p className="text-gray-800 dark:text-gray-100 text-xl font-medium">
              "{transcript}"
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Awaiting your command...
            </p>
          )}
        </div>
        
        {/* Feedback Message (New) */}
         {!error && transcript && (
             <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mt-2">
                 Processing...
             </p>
         )}

        {/* Error/Feedback Message */}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm flex items-center justify-center gap-2">
            <AlertCircle size={16} /> {error}
          </p>
        )}

        {/* Example Commands (for user guidance) */}
        <div className="text-left text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-300 dark:border-gray-700">
          <p className="font-semibold mb-2">Try saying:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>"Show cement suppliers near Vanasthalipuram"</li>
            <li>"Find 53 grade cement"</li>
            <li>"Navigate to Bricks Suppliers"</li>
            <li>"Suppliers for Labours"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantPopup;
