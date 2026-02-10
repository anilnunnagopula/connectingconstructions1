// src/ai/analytics.js

/**
 * Logs voice command interactions for analysis.
 * In a real app, this would send data to a backend (e.g., Mixpanel, Google Analytics, or custom endpoint).
 * For now, we log to console and potentially LocalStorage for demo purposes.
 */
export const logVoiceCommand = (commandData) => {
  const {
    transcript,
    intent,
    confidence,
    success,
    route,
    timestamp = new Date().toISOString(),
    userRole,
  } = commandData;

  const logEntry = {
    event: "VOICE_COMMAND",
    transcript,
    intent,
    confidence,
    success,
    route,
    userRole,
    timestamp,
    userAgent: navigator.userAgent,
  };

  // 1. Console Log (for Dev)
  console.group("🎤 Voice Analytics");
  console.log("Transcript:", transcript);
  console.log("Intent:", intent);
  console.log("Success:", success);
  console.groupEnd();

  // 2. Mock Backend Call
  // fetch('/api/analytics/voice', { method: 'POST', body: JSON.stringify(logEntry) });
  
  // 3. Store in LocalStorage for persistence check (optional)
  try {
      const history = JSON.parse(localStorage.getItem("voice_analytics_history") || "[]");
      history.unshift(logEntry); // Add to top
      // Keep last 50
      if (history.length > 50) history.pop();
      localStorage.setItem("voice_analytics_history", JSON.stringify(history));
  } catch (e) {
      console.warn("Analytics storage failed", e);
  }
};
