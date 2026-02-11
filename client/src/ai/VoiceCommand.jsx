// src/ai/VoiceCommand.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic } from "lucide-react";
import { useVoiceRecognizer } from "./useVoiceRecognizer";
import { parseVoiceCommand } from "./voiceParser";
import VoiceAssistantPopup from "./VoiceAssistantPopup";
import { speak } from "./textToSpeech";
import { processWithLLM } from "./llmService";

import { useAuth } from "../context/AuthContext";
import { logVoiceCommand } from "./analytics";

import { useConversation } from "../context/ConversationContext";

import { useCart } from "../context/CartContext";

const VoiceCommand = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setError,
  } = useVoiceRecognizer();
  const { user, isAuthenticated } = useAuth(); // Access auth state
  const { context: voiceContext, updateContext } = useConversation();
  const { clearCart, cartItems } = useCart(); // Access cart context
  const [showAssistantPopup, setShowAssistantPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // For "Did you mean?" flow

  // Helper to execute the parsed/confirmed command
  const executeAction = async (response, transcriptForLog) => {
      const { intent, route, query, category, message, confidence, sortBy } = response;

      // Update Conversation Context
      if (intent !== "UNKNOWN" && intent !== "HELP" && intent !== "CONFIRM" && intent !== "DENY" && intent !== "CLEAR_CART") {
          updateContext({
              lastIntent: intent,
              lastEntity: category || query || (route ? route.split('/').pop() : null), // Try to guess entity
              activeRoute: route
          });
      }

      // --- ANALYTICS LOGGING ---
      logVoiceCommand({
          transcript: transcriptForLog,
          intent: intent,
          confidence: confidence,
          success: intent !== "UNKNOWN" && intent !== "HELP",
          route: route,
          userRole: user?.role || "guest"
      });

      // Speak feedback
      if (message) {
          let variant = "neutral";
          if (intent === "CLARIFICATION") variant = "clarification";
          else if (intent === "UNKNOWN" || intent === "HELP") variant = "error"; // soft error tone
          else if (intent === "CONFIRM") variant = "success";
          else variant = "success"; // Default success for navigation/actions
          
          speak(message, { variant });
      }

      // --- EXECUTION LOGIC ---
      if (intent === "NAVIGATE" && route) {
            // 1. Check for Customer Protected Routes
            if (route.startsWith("/customer/")) {
                if (!isAuthenticated) {
                    speak("You need to login to access this area.");
                    navigate("/login");
                    return;
                }
                
                // INTELLIGENT REDIRECTION FOR SUPPLIERS
                // If a supplier asks for "notifications" or "settings", redirect them to their own page
                if (user?.role === "supplier") {
                    if (route.includes("notifications")) {
                        navigate("/supplier/notifications");
                        return;
                    }
                    if (route.includes("settings")) {
                        navigate("/supplier/settings");
                        return;
                    }
                    // Redirect "orders" to supplier orders
                    if (route.includes("orders")) {
                        navigate("/supplier/orders");
                        return;
                    }
                }

                if (user?.role !== "customer") {
                    speak("This feature is only for customers.");
                    return;
                }
            }
            
            // 2. Check for Supplier Protected Routes
            if (route.startsWith("/supplier/")) {
                if (!isAuthenticated) {
                    speak("Please login to your supplier account.");
                    navigate("/login");
                    return;
                }
                if (user?.role !== "supplier") {
                    speak("This feature is only for suppliers.");
                    return;
                }
            }
            navigate(route);
      } else if (intent === "NAVIGATE_BACK") {
          navigate(-1);
      } else if (intent === "CATEGORY" && route) {
           // Check auth for category
           if (route.startsWith("/customer/")) {
             if (!isAuthenticated) {
                speak("Please login to browse categories.");
                navigate("/login");
                return;
            }
            if (user?.role !== "customer") {
                speak("This feature is for customers.");
                return;
            }
        }
          navigate(route);
      } else if (intent === "SEARCH" && query) {
          navigate(`/materials?search=${encodeURIComponent(query)}`);
      } else if (intent === "ORDER_STATUS") {
           if (!isAuthenticated) {
              speak("Please login to view your orders.");
              navigate("/login");
              return;
          }
          navigate("/customer/order-tracking");
      } else if (intent === "ADD_TO_CART") {
          if (!isAuthenticated) {
              speak("Please login to add items to your cart.");
              navigate("/login");
              return;
          }
          if (user?.role === "supplier") {
              speak("Suppliers cannot add items to the cart.");
              return;
          }
          window.dispatchEvent(new CustomEvent('voice-add-to-cart'));
      } else if (intent === "SORT_ACTION") {
          // Handle sorting (e.g. trigger event or navigate with param)
           if (category) {
              const titleCaseCat = category.charAt(0).toUpperCase() + category.slice(1);
              navigate(`/customer/category/${encodeURIComponent(titleCaseCat)}?sort=${sortBy}`);
           }
      } else if (intent === "CLEAR_CART") {
           // DESTRUCTIVE ACTION: Confirm first
           if (!isAuthenticated || user?.role !== "customer") {
               speak("Only customers can clear their cart.");
               return;
           }
           if (cartItems.length === 0) {
               speak("Your cart is already empty.");
               return;
           }
           
           speak(`You have ${cartItems.length} items. Are you sure you want to remove them all?`, { variant: "question" });
           setPendingAction({
               intent: "CONFIRM_CLEAR_CART", // Use 'intent' so executeAction picks it up
               message: "Clearing cart"
           });
           
      } else if (intent === "CONFIRM_CLEAR_CART") {
          // Actually clear it
          await clearCart();
          speak("Cart cleared.", { variant: "success" });
           
      } else if (intent === "REPORT_ISSUE") {
          speak("Thanks for letting me know. I've logged this report.", { variant: "success" });
          // The logVoiceCommand above already captured this with intent="REPORT_ISSUE"
      
      } else if (intent === "HELP" || intent === "UNKNOWN") {
          setError(message || "I didn't understand that. Please try again.");
      }
  };

  // This function is called when useVoiceRecognizer successfully gets a final transcript
  const handleCommand = async (finalTranscript) => {
    let response = parseVoiceCommand(finalTranscript, location.pathname, voiceContext);
    
    // Fallback to LLM
    if (response.intent === "UNKNOWN" || (response.intent === "HELP" && response.confidence < 0.6)) {
        const llmResponse = await processWithLLM(finalTranscript, location.pathname);
        if (llmResponse) {
            console.log("LLM Response:", llmResponse);
            response = llmResponse;
        }
    }

    console.log("Voice Command Response:", response);
    
    // ... rest of handleCommand ...
    // --- Handling Confirmation Flow ---
    if (response.intent === "CONFIRM") {
        if (pendingAction) {
            // ... (existing helper for confirm)
            let actionToExec = pendingAction;
             // If we were waiting for a clarification response but they just said "Yes", 
             // it might be weird. But let's assume valid.
            speak("Okay, proceeding.", { variant: "success" });
            executeAction(actionToExec, `(Confirmed) ${actionToExec.message}`);
            setPendingAction(null);
            return;
        } else {
             speak("I'm not sure what you are confirming.", { variant: "error" });
             return;
        }
    } else if (response.intent === "DENY") {
        if (pendingAction) {
            speak("Okay, cancelled.", { variant: "neutral" });
            setPendingAction(null);
            return;
        }
    } else if (response.intent === "SUGGESTION") {
        speak(response.message, { variant: "question" });
        setPendingAction({
            ...response,
            intent: response.category ? "CATEGORY" : "NAVIGATE",
            message: `Opening ${response.category || "page"}`
        });
        return;
    } else if (response.intent === "CLARIFICATION") {
        speak(response.message, { variant: "clarification" });
        setPendingAction({
            type: "CLARIFICATION_RESPONSE",
            originalIntent: response,
            category: response.category
        });
        return;
    }

    // --- Handling Clarification Response (User answers the question) ---
    if (pendingAction && pendingAction.type === "CLARIFICATION_RESPONSE") {
        // The user just said something like "UltraTech" or "The first one"
        // We treat the *entire* transcript as the specific entity they want.
        const specificEntity = finalTranscript.trim();
        speak(`Searching for ${specificEntity} ${pendingAction.category}`, { variant: "success" });
        
        // Execute the resolved action (Search)
        // We override the original intent to be a SEARCH for "Entity Category"
        executeAction({
            intent: "SEARCH",
            query: `${specificEntity} ${pendingAction.category}`,
            confidence: 1.0, 
            message: `Showing results for ${specificEntity}`
        }, finalTranscript);
        
        setPendingAction(null);
        return;
    }

    // Normal execution
    setPendingAction(null);
    executeAction(response, finalTranscript);
  };

  const openAssistant = () => {
    setShowAssistantPopup(true);
    startListening(handleCommand);
  };

  const closeAssistant = () => {
    setShowAssistantPopup(false);
    stopListening();
    setError("");
  };

  return (
    <>
      <button
        onClick={openAssistant}
        className="p-2 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        title="Voice Search"
        aria-label="Activate voice search assistant"
      >
        <Mic size={24} />
      </button>

      {showAssistantPopup && (
        <VoiceAssistantPopup
          isListening={isListening}
          transcript={transcript}
          error={error}
          onStartListening={() => startListening(handleCommand)}
          onStopListening={stopListening}
          onClose={closeAssistant}
          onCommandProcessed={handleCommand}
          setError={setError}
        />
      )}
    </>
  );
};

export default VoiceCommand;
