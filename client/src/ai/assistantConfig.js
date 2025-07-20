// src/ai/aiConfig.js
// This file is enhanced to fetch configurations from a backend (e.g., Firestore)
// for large-scale and real-time updates.

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// IMPORTANT: These global variables (__app_id, __firebase_config) are provided by the Canvas environment.
// Ensure your Firebase app is initialized only once.
let db;
let firebaseConfig;

if (typeof __firebase_config !== "undefined") {
  firebaseConfig = JSON.parse(__firebase_config);
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  console.warn(
    "Firebase config not found. AI configurations will use fallback data."
  );
  // Fallback for development outside Canvas or if config is missing
  // You might load a default config from a local JSON file here in a real app.
}

// Fallback/Default data in case Firestore fetching fails or is not configured
const defaultCategoryKeywords = {
  cement: "Cement",
  bricks: "Bricks",
  sand: "Sand",
  rmc: "RMC",
  labour: "Labours",
  mason: "Mason",
  vastu: "Vastu",
  interiors: "Interiors",
  trucks: "Trucks",
};

const defaultLocationKeywords = [
  "vanasthalipuram",
  "kphb",
  "gachibowli",
  "hyderabad",
  "secunderabad",
  "kondapur",
  "madhapur",
  "ameerpet",
];

const defaultGradeKeywords = ["43 grade", "53 grade", "m20", "m25"];

/**
 * Fetches AI configuration keywords from Firestore.
 * Provides fallback to default hardcoded values if fetching fails or Firestore is not initialized.
 *
 * @returns {Promise<{categoryKeywords: Object, locationKeywords: Array, gradeKeywords: Array}>}
 */
export const getAiConfig = async () => {
  if (!db) {
    console.error(
      "Firestore is not initialized. Using default AI configurations."
    );
    return {
      categoryKeywords: defaultCategoryKeywords,
      locationKeywords: defaultLocationKeywords,
      gradeKeywords: defaultGradeKeywords,
    };
  }

  let fetchedCategoryKeywords = {};
  let fetchedLocationKeywords = [];
  let fetchedGradeKeywords = [];

  try {
    // Fetch Categories
    const categoriesSnapshot = await getDocs(
      collection(db, "ai_configs", "categories", "data")
    );
    categoriesSnapshot.forEach((doc) => {
      const data = doc.data();
      // Assuming each category document has 'id' (for keyword) and 'name' (for display)
      // and optionally 'synonyms' or 'keywords' array for more robust parsing
      if (data.id && data.name) {
        fetchedCategoryKeywords[data.id.toLowerCase()] = data.name;
        // If you have a 'keywords' array in Firestore for synonyms:
        // data.keywords?.forEach(kw => fetchedCategoryKeywords[kw.toLowerCase()] = data.name);
      }
    });
    // If no categories fetched, use default
    if (Object.keys(fetchedCategoryKeywords).length === 0) {
      fetchedCategoryKeywords = defaultCategoryKeywords;
      console.warn(
        "No categories fetched from Firestore. Using default category keywords."
      );
    }

    // Fetch Locations
    const locationsSnapshot = await getDocs(
      collection(db, "ai_configs", "locations", "data")
    );
    locationsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name) {
        // Assuming location documents have a 'name' field
        fetchedLocationKeywords.push(data.name.toLowerCase());
        // If you have 'synonyms' array in Firestore:
        // data.synonyms?.forEach(syn => fetchedLocationKeywords.push(syn.toLowerCase()));
      }
    });
    // If no locations fetched, use default
    if (fetchedLocationKeywords.length === 0) {
      fetchedLocationKeywords = defaultLocationKeywords;
      console.warn(
        "No locations fetched from Firestore. Using default location keywords."
      );
    }

    // Fetch Grades
    const gradesSnapshot = await getDocs(
      collection(db, "ai_configs", "grades", "data")
    );
    gradesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name) {
        // Assuming grade documents have a 'name' field (e.g., "53 grade")
        fetchedGradeKeywords.push(data.name.toLowerCase());
        // If you have 'keywords' array in Firestore for variations:
        // data.keywords?.forEach(kw => fetchedGradeKeywords.push(kw.toLowerCase()));
      }
    });
    // If no grades fetched, use default
    if (fetchedGradeKeywords.length === 0) {
      fetchedGradeKeywords = defaultGradeKeywords;
      console.warn(
        "No grades fetched from Firestore. Using default grade keywords."
      );
    }
  } catch (e) {
    console.error("Error fetching AI configurations from Firestore:", e);
    // Fallback to default values in case of any error during fetching
    return {
      categoryKeywords: defaultCategoryKeywords,
      locationKeywords: defaultLocationKeywords,
      gradeKeywords: defaultGradeKeywords,
    };
  }

  return {
    categoryKeywords: fetchedCategoryKeywords,
    locationKeywords: fetchedLocationKeywords,
    gradeKeywords: fetchedGradeKeywords,
  };
};
