// src/ai/llmService.js
import axios from 'axios';
import { VOICE_SYSTEM_PROMPT } from './prompts';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Ensure this is set in .env
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const processWithLLM = async (transcript, currentPath) => {
  if (!API_KEY) {
    console.warn("Gemini API Key missing. Returning fallback.");
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [{
        parts: [{
          text: `${VOICE_SYSTEM_PROMPT}
          
          Current Path: ${currentPath}
          
          User Command: "${transcript}"
          
          Response (JSON):`
        }]
      }]
    });

    const text = response.data.candidates[0].content.parts[0].text;
    // Extract JSON from potential markdown code blocks
    const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("LLM Processing Error:", error);
    return null;
  }
};
