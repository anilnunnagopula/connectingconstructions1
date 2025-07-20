// src/ai/VoiceCommand.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import { useVoiceRecognizer } from "./useVoiceRecognizer";
import { parseVoiceCommand } from "./voiceParser";
import VoiceAssistantPopup from "./VoiceAssistantPopup";

const VoiceCommand = () => {
  const navigate = useNavigate();
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setError,
  } = useVoiceRecognizer();
  const [showAssistantPopup, setShowAssistantPopup] = useState(false);

  // This function is called when useVoiceRecognizer successfully gets a final transcript
  const handleCommand = (finalTranscript) => {
    const { category, location, grade } = parseVoiceCommand(finalTranscript);
    console.log("Parsed Command:", { category, location, grade });

    if (category) {
      let path = `/category/${encodeURIComponent(category)}/user`; // Ensure /user is part of the path
      const queryParams = [];

      if (location) {
        queryParams.push(`location=${encodeURIComponent(location)}`);
      }
      if (grade) {
        queryParams.push(`grade=${encodeURIComponent(grade)}`);
      }

      if (queryParams.length > 0) {
        path += `?${queryParams.join("&")}`;
      }

      navigate(path);
      // The popup's useEffect will handle closing after a short delay
    } else {
      // If no category is understood, set an error message to display in the popup
      setError(
        "Sorry, I couldn't understand the material category. Please try again."
      );
    }
  };

  const openAssistant = () => {
    setShowAssistantPopup(true);
    // Start listening immediately when the popup opens
    startListening(handleCommand);
  };

  const closeAssistant = () => {
    setShowAssistantPopup(false);
    stopListening(); // Ensure mic stops when popup closes
    setError(""); // Clear any error messages when closing
  };

  return (
    <>
      {/* The main mic button that triggers the popup */}
      <button
        onClick={openAssistant}
        className="p-2 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        title="Voice Search"
        aria-label="Activate voice search assistant"
      >
        <Mic size={24} />
      </button>

      {/* The VoiceAssistantPopup component, rendered conditionally */}
      {showAssistantPopup && (
        <VoiceAssistantPopup
          isListening={isListening}
          transcript={transcript}
          error={error}
          onStartListening={() => startListening(handleCommand)} // Pass the handler
          onStopListening={stopListening}
          onClose={closeAssistant}
          onCommandProcessed={handleCommand} // Pass the command handler for internal popup logic
          setError={setError} // Pass setError to allow popup to clear/set its own errors
        />
      )}
    </>
  );
};

export default VoiceCommand;
