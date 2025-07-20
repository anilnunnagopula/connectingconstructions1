// src/ai/voiceParser.js
// This file now expects the aiConfig object to be passed as a parameter
// instead of importing individual keywords directly.

export const parseVoiceCommand = (transcript, aiConfig) => {
  // Accept aiConfig as a parameter
  if (!aiConfig) {
    console.error("AI configuration not provided to parseVoiceCommand.");
    return { category: null, location: null, grade: null };
  }

  const { categoryKeywords, locationKeywords, gradeKeywords } = aiConfig; // Destructure from the passed config

  const text = transcript.toLowerCase();
  let foundCategory = null;
  let foundLocation = null;
  let foundGrade = null;

  console.log("Parser input transcript:", text); // Debugging: log input transcript

  // 1. Parse Category
  for (const keyword in categoryKeywords) {
    console.log(
      `Checking category keyword: '${keyword}'. Text includes: ${text.includes(
        keyword
      )}`
    ); // Debugging
    if (text.includes(keyword)) {
      foundCategory = categoryKeywords[keyword];
      console.log(`Category found: ${foundCategory}`); // Debugging
      break;
    }
  }

  // 2. Parse Location
  // Look for "near [location]" or just the location keyword
  const locationMatch = text.match(/near(?:by)?\s+([\w\s]+)/); // Capture multiple words for location
  if (locationMatch && locationMatch[1]) {
    const matchedLoc = locationMatch[1].trim();
    // Check if the matched location is in our known locations
    for (const loc of locationKeywords) {
      if (matchedLoc.includes(loc)) {
        foundLocation = loc;
        break;
      }
    }
  } else {
    // If "near" wasn't found, check if any location keyword is directly in the text
    for (const loc of locationKeywords) {
      if (text.includes(loc)) {
        foundLocation = loc;
        break;
      }
    }
  }

  // 3. Parse Grade/Type
  for (const grade of gradeKeywords) {
    if (text.includes(grade.toLowerCase())) {
      foundGrade = grade;
      break;
    }
  }

  console.log("Parser output:", {
    category: foundCategory,
    location: foundLocation,
    grade: foundGrade,
  }); // Debugging
  return {
    category: foundCategory,
    location: foundLocation,
    grade: foundGrade,
  };
};
