import { categoryKeywords } from "./assistantConfig";

export const parseVoiceCommand = (transcript) => {
  const text = transcript.toLowerCase();
  let foundCategory = null;
  let foundLocation = null;

  for (const keyword in categoryKeywords) {
    if (text.includes(keyword)) {
      foundCategory = categoryKeywords[keyword];
      break;
    }
  }

  const locationMatch = text.match(/near(?:by)? (\w+)/);
  if (locationMatch) {
    foundLocation = locationMatch[1];
  }

  return {
    category: foundCategory,
    location: foundLocation,
  };
};
