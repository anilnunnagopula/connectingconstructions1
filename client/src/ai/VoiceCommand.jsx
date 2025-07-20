import React from "react";
import { useVoiceRecognizer } from "./useVoiceRecognizer";
import { parseVoiceCommand } from "./voiceParser";
import { useNavigate } from "react-router-dom";

const VoiceCommand = () => {
  const navigate = useNavigate();
  const { isListening, startListening, stopListening } = useVoiceRecognizer();

  const handleCommand = (transcript) => {
    const { category, location } = parseVoiceCommand(transcript);
    if (category) {
      navigate(
        `/category/${category}/user${location ? `?location=${location}` : ""}`
      );
    } else {
      alert("Sorry, couldn't understand the command!");
    }
  };

  return (
    <button
      onClick={() => startListening(handleCommand)}
      className="p-2 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition-all"
      title="Voice Search"
    >
      🎙️
    </button>
  );
};

export default VoiceCommand;
