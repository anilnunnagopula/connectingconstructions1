export const speak = (text, options = {}) => {
  if (!window.speechSynthesis) {
    console.error("Text-to-Speech not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN"; // Default to Indian English
  
  // Default values
  let pitch = 1.0;
  let rate = 1.0;

  // Apply tone variations based on 'variant' option
  switch (options.variant) {
      case "success":
          pitch = 1.1; // Slightly higher, more enthusiastic
          rate = 1.05;
          break;
      case "error":
          pitch = 0.9; // Slightly lower, more serious/apologetic
          rate = 0.95;
          break;
      case "clarification":
      case "question":
          pitch = 1.05; // Slightly higher to sound inquisitive
          rate = 1.0;
          break;
      case "assertive":
          pitch = 1.0;
          rate = 1.1; // Faster, more efficient
          break;
      default:
          pitch = 1.0;
          rate = 1.0;
  }

  utterance.pitch = pitch;
  utterance.rate = rate;
  
  // Optional: Select a specific voice preference if available
  // const voices = window.speechSynthesis.getVoices();
  // utterance.voice = voices.find(v => v.lang === 'en-IN') || voices[0];

  window.speechSynthesis.speak(utterance);
};
