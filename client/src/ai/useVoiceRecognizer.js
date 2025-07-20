import { useState } from "react";

export const useVoiceRecognizer = () => {
  const [isListening, setIsListening] = useState(false);

  const startListening = (onResult) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice transcript:", transcript);
      onResult(transcript);
    };

    recognition.start();
  };

  const stopListening = () => setIsListening(false);

  return { isListening, startListening, stopListening };
};
