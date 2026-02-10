import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown

// Suggested prompts for the user
const suggestedPrompts = [
  "🧱 What is the best cement for alkaline areas?",
  "📦 How do I track my order?",
  "🛠️ What construction materials do you recommend?",
  "📐 Vastu tips for my new home?",
  "💳 What are the payment options available?",
  "🚚 When will my delivery arrive?",
  "✨ Compare **53** and **43** grade cements",
  "✨ Recommend materials for a **waterproof basement**",
  "✨ What is **rebar**?",
];

// Initial welcome message for the chatbot
const initialWelcomeMessage = {
  role: "assistant",
  content:
    "👷‍♂️ Hey! I'm here to help with your construction needs. Ask me anything! [Note that AI can make mistakes]",
};

// --- SVG Icon Components ---
// A sleeker Paper Plane Send Icon (similar to WhatsApp/Gemini)
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

// A simple Microphone Icon
const MicIcon = ({ isListening }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${
      isListening ? "text-red-400 animate-pulse" : "text-gray-500"
    }`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.2-3c0 3-2.54 5.1-5.2 5.1S6.8 14 6.8 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.8z" />
  </svg>
);
// --- End SVG Icon Components ---

const Chatbot = ({ isLoggedIn = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    if (isLoggedIn) {
      const saved = localStorage.getItem("chatMessages");
      const parsedSaved = saved ? JSON.parse(saved) : [];
      if (parsedSaved.length > 0) {
        return parsedSaved;
      }
    }
    return [initialWelcomeMessage];
  });
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  // Effect to save messages to localStorage and scroll to bottom
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } else {
      localStorage.removeItem("chatMessages");
    }
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoggedIn]);

  // Effect to manage showSuggestedPrompts based on messages length
  useEffect(() => {
    if (
      messages.length > 1 ||
      (messages.length === 1 && messages[0].role === "user")
    ) {
      setShowSuggestedPrompts(false);
    } else {
      setShowSuggestedPrompts(true);
    }
  }, [messages]);

  // Initialize SpeechRecognition API
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-IN"; // Or 'en-US', 'en-GB'

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setInput("");
        console.log("Speech recognition started...");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        console.log("Speech recognized:", transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          alert(
            "Microphone access denied. Please allow microphone access in your browser settings."
          );
        } else if (event.error === "no-speech") {
          setInput("No speech detected. Please try again.");
          setTimeout(() => setInput(""), 3000);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log("Speech recognition ended.");
      };
    } else {
      console.warn("Web Speech API not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const clearChat = () => {
    setMessages([initialWelcomeMessage]);
    localStorage.removeItem("chatMessages");
    setShowSuggestedPrompts(true);
    setInput("");
    setIsSending(false);
    if (isListening) {
      recognitionRef.current.stop();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isSending || isListening) return;

    let processedInput = input.trim();
    const userOriginalMessage = { role: "user", content: input };

    setShowSuggestedPrompts(false);

    // --- Feature 1: Material Comparison ✨ ---
    const compareMatch = processedInput
      .toLowerCase()
      .match(
        /compare\s+(.*?)\s+and\s+(.*?)(?:\s+for\s+construction)?|\s*(.*?)\s+vs\s+(.*?)(?:\s+for\s+construction)?/
      );
    if (compareMatch) {
      const material1 = compareMatch[1] || compareMatch[3];
      const material2 = compareMatch[2] || compareMatch[4];
      if (material1 && material2) {
        processedInput = `As a construction materials expert, please compare **${material1}** and **${material2}** for construction purposes. Focus on their properties, typical uses, advantages, and disadvantages. Provide a concise, easy-to-understand summary using bullet points or clear sections.`;
      }
    }

    // --- Feature 2: Product Recommendation ✨ ---
    const recommendMatch = processedInput
      .toLowerCase()
      .match(
        /(?:recommend|suggest)\s+(?:materials|products)?\s*(?:for\s+a\s+)?(.*?)(?:\s+project)?(?:\s+considering\s+(.*?))?/
      );
    if (recommendMatch && !compareMatch) {
      const projectType = recommendMatch[1];
      const specificMaterialType = recommendMatch[2];
      if (projectType) {
        processedInput = `As an expert in construction materials, recommend suitable materials for a "**${projectType}**" project.`;
        if (specificMaterialType) {
          processedInput += ` Specifically, consider materials related to "**${specificMaterialType}**".`;
        }
        processedInput += ` Explain why each recommended material is suitable. Use bullet points or a clear list.`;
      }
    }

    // --- Feature 3: Glossary/Definition ✨ ---
    const defineMatch = processedInput
      .toLowerCase()
      .match(/(?:what is|define)\s+(.*?)\??$/);
    if (defineMatch && defineMatch[1] && !compareMatch && !recommendMatch) {
      const term = defineMatch[1];
      processedInput = `As a construction expert, please provide a concise definition and common uses for the term "**${term}**".`;
    }

    // If no specific command was detected and modified the input, prepend a general context
    if (processedInput === input.trim()) {
      processedInput = `As an AI assistant specialized in construction materials and building, please answer the following question: ${input.trim()}`;
    }

    setMessages([...messages, userOriginalMessage]);
    setInput("");
    setIsSending(true);

    let aiReplyContent = "🫤 No reply from AI.";

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

      if (!apiKey) {
        console.error("Gemini API Key is not set in environment variables.");
        aiReplyContent =
          "⚠️ API Key is missing. Please configure REACT_APP_GEMINI_API_KEY.";
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const chatHistory = [
        ...messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        { role: "user", parts: [{ text: processedInput }] },
      ];

      const payload = {
        contents: chatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      };

      console.log("Sending prompt to Gemini AI:", payload);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("📦 Gemini Response:", result);

      if (response.ok) {
        if (
          result.candidates &&
          result.candidates.length > 0 &&
          result.candidates[0].content &&
          result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0
        ) {
          aiReplyContent = result.candidates[0].content.parts[0].text;
        } else {
          const safetyRatings = result.promptFeedback?.safetyRatings;
          let feedbackMessage = "No response from AI 🫠. ";
          if (safetyRatings && safetyRatings.length > 0) {
            safetyRatings.forEach((rating) => {
              if (rating.blocked) {
                feedbackMessage += `Content blocked due to ${rating.category
                  .replace("HARM_CATEGORY_", "")
                  .toLowerCase()} risk. `;
              }
            });
          }
          aiReplyContent = feedbackMessage;
        }
      } else {
        const errorMessage =
          result.error && result.error.message
            ? result.error.message
            : "Unknown error from AI API.";
        aiReplyContent = `⚠️ AI Error: ${errorMessage}`;
        console.error("Gemini API HTTP error:", response.status, result);
      }
    } catch (err) {
      console.error("🔥 Error caught in chatbot:", err);
      aiReplyContent = "⚠️ Oops! Couldn't connect to AI service.";
    } finally {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiReplyContent },
      ]);
      setIsSending(false);
    }
  };

  // The renderContent function is no longer needed because ReactMarkdown handles it
  // const renderContent = (content) =>
  //   content.split("\n").map((line, idx) => (
  //     <p
  //       key={idx}
  //       dangerouslySetInnerHTML={{
  //         __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
  //       }}
  //     />
  //   ));

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 z-50">
      {isOpen ? (
        <div className="w-[90vw] md:w-[26rem] h-[85vh] md:h-[36rem] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
            <h4 className="font-semibold text-lg">AI Assistant</h4>
            {/* Clear Chat Button */}
            <button
              onClick={clearChat}
              className="text-white hover:text-gray-200 ml-auto pl-20"
              title="Clear Chat"
            >
              🧹
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 ml-2 "
            >
              ✖
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-xs md:max-w-sm ${
                    msg.role === "user"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </div>
                  {/* Use ReactMarkdown to render message content */}
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="text-left">
                <div className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-lg animate-pulse inline-block">
                  Typing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Prompts Section - Conditionally rendered */}
          {showSuggestedPrompts && (
            <div className="p-2 px-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
              Try asking:
              <div className="flex flex-wrap gap-2 mt-1">
                {suggestedPrompts.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(text);
                      setShowSuggestedPrompts(false);
                    }}
                    className="bg-gray-100 dark:bg-gray-600 hover:bg-blue-100 dark:hover:bg-blue-800 text-xs px-2 py-1 rounded-full text-gray-800 dark:text-white transition-colors duration-200"
                  >
                    {/* Use ReactMarkdown to render suggested prompt text */}
                    <ReactMarkdown>{text}</ReactMarkdown>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center p-2 border-t dark:border-gray-700">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-l-md text-sm outline-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder={isListening ? "Listening..." : "Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={isSending || isListening}
            />
            {/* Microphone Button - Placed just before send button */}
            <button
              onClick={toggleSpeechRecognition}
              className={`bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600
                          hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${
                            isListening
                              ? "text-red-500 dark:text-red-400 animate-pulse"
                              : ""
                          }
                          `}
              disabled={isSending}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              <MicIcon isListening={isListening} />
            </button>

            {/* Send Button - Now with an icon */}
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSending || isListening}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;