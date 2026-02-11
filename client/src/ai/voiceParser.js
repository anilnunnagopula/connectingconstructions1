import { findClosestMatch } from "./stringUtils";

export const parseVoiceCommand = (transcript, currentPath, context = {}) => {
  const text = transcript.toLowerCase().trim();
  
  // Initialize response structure
  let response = {
    intent: "UNKNOWN",
    route: null,
    query: null,
    category: null,
    confidence: 0.0,
    message: "I didn't understand that. Please try again.",
  };

  if (!text) return response;

  // --- 0. CONFIRMATION Intents ---
  if (["yes", "yeah", "sure", "correct", "do it", "yep"].includes(text)) {
      return { intent: "CONFIRM", confidence: 0.99, message: "Confirmed." };
  }
  if (["no", "nope", "cancel", "wrong", "nah"].includes(text)) {
      return { intent: "DENY", confidence: 0.99, message: "Cancelled." };
  }

  // --- CONTEXTUAL FOLLOW-UPS ---
  // Example: "Which one is cheaper?" or "Add the first one"
  if (context.lastIntent === "CATEGORY" && context.lastEntity) {
      if (text.includes("cheaper") || text.includes("cheapest")) {
           return {
               intent: "SORT_ACTION",
               sortBy: "price_asc",
               category: context.lastEntity,
               confidence: 0.90,
               message: `Showing cheapest ${context.lastEntity}`
           };
      }
  }

  // --- 5. ADD TO CART Intent ---
  // Check for ambiguous "Add [Category]" requests first
  // e.g. "Add cement to cart" -> Ambiguous, which cement?
  const addCategoryPattern = /add\s+([a-z\s]+)\s+(?:to|in)\s+(?:cart|bag|basket)/i;
  const addCategoryMatch = text.match(addCategoryPattern);
  
  if (addCategoryMatch) {
      const potentialCat = addCategoryMatch[1].trim();
      // Check if this potential category is in our valid list
      // Uses simple includes check or exact match
      const matchedCat = validCategories.find(c => potentialCat.includes(c));
      
      if (matchedCat) {
          return {
              intent: "CLARIFICATION",
              category: matchedCat,
              confidence: 0.85,
              message: `I found multiple products for ${matchedCat}. Which one would you like to add?`
          };
      }
  }

  if (text.includes("add to cart") || text.includes("buy this")) {
      // Context Check: Only valid on /product/:id or /category/:category
      if (currentPath && (currentPath.startsWith("/product/") || currentPath.startsWith("/category/") || currentPath.startsWith("/customer/product/"))) {
          return {
              intent: "ADD_TO_CART",
              route: null,
              query: null,
              category: null,
              confidence: 0.88,
              message: "Adding item to cart"
          };
      } else {
          return {
              intent: "HELP",
              route: null,
              query: null,
              category: null,
              confidence: 0.60,
              message: "You can only use 'Add to cart' when viewing a product or category."
          };
      }
  }

  // --- 8. CLEAR CART Intent ---
  if (text.includes("clear cart") || text.includes("empty cart") || text.includes("remove all items") || text.includes("empty basket")) {
      return {
          intent: "CLEAR_CART",
          route: null,
          query: null,
          category: null,
          confidence: 0.95,
          message: "Asking for confirmation to clear cart"
      };
  }

  // --- 9. FEEDBACK / REPORT Intent ---
  if (text.includes("report bug") || text.includes("report issue") || text.includes("feedback") || text.includes("not working")) {
      return {
          intent: "REPORT_ISSUE",
          route: null,
          query: null,
          category: null,
          confidence: 0.95,
          message: "Logging your feedback."
      };
  }

  // --- 1. NAVIGATE Intent ---
  const validRoutes = {
    "home": "/",
    "materials": "/materials",
    "cart": "/customer/cart",
    "orders": "/customer/orders",
    "wishlist": "/customer/wishlist",
    "profile": "/profile",
    "settings": "/customer/settings",
    "notifications": "/customer/notifications",
    "track order": "/customer/order-tracking",
    "order tracking": "/customer/order-tracking",
    "checkout": "/customer/checkout",
    // Aliases
    "my orders": "/customer/orders",
    "my cart": "/customer/cart",
    "my wishlist": "/customer/wishlist",
    "my profile": "/profile",
    "my settings": "/customer/settings",
    // Supplier Routes
    "products": "/supplier/myproducts",
    "my products": "/supplier/myproducts",
    "add product": "/supplier/add-product",
    "dashboard": "/supplier-dashboard",
    "my dashboard": "/supplier-dashboard",
    "analytics": "/supplier/analytics",
    "my analytics": "/supplier/analytics",
    "payments": "/supplier/payments",
    "my payments": "/supplier/payments",
    // "orders" is ambiguous (customer vs supplier), handled in VoiceCommand.jsx via redirection
    "supplier orders": "/supplier/orders"
  };

  // Check for navigation phrases: "go to X", "open X", "show me X", "navigate to X"
  const navPattern = /^(?:go to|open|show|show me|navigate to|view)\s+(.+)/i;
  const navMatch = text.match(navPattern);

  if (navMatch) {
    const target = navMatch[1].trim();
    // Check against known routes
    for (const [key, route] of Object.entries(validRoutes)) {
      if (target.includes(key) || key.includes(target)) { // Simple fuzzy match
        return {
          intent: "NAVIGATE",
          route: route,
          query: null,
          category: null,
          confidence: 0.95,
          message: `Opening ${key}`
        };
      }
    }
  }

  // --- Context Navigation ---
  if (text === "go back" || text === "back" || text === "return") {
      return {
          intent: "NAVIGATE_BACK",
          route: null,
          query: null,
          category: null,
          confidence: 0.95,
          message: "Going back"
      };
  }
  
  // Direct route commands (e.g., just saying "Cart")
  for (const [key, route] of Object.entries(validRoutes)) {
    if (text === key || text === `my ${key}`) {
       return {
          intent: "NAVIGATE",
          route: route,
          query: null,
          category: null,
          confidence: 0.98,
          message: `Opening ${key}`
        };
    }
  }

  // --- 2. CATEGORY Intent ---
  const validCategories = [
    "cement", "bricks", "sand", "iron rods", "tmt bars", "paints", 
    "interiors", "borewells", "earth movers", "steel", "gravel"
  ];

  // Check for category phrases: "show me [category]", "find [category]", "[category] suppliers"
  const catPattern1 = /^(?:show me|find|search for|looking for)\s+([a-z\s]+)/i;
  const catMatch = text.match(catPattern1);
  
  let potentialCategory = catMatch ? catMatch[1].trim() : text;

  // Check if the command *contains* a valid category
  for (const cat of validCategories) {
    if (text.includes(cat)) {
       const titleCaseCat = cat.charAt(0).toUpperCase() + cat.slice(1);
       return {
        intent: "CATEGORY",
        route: `/customer/category/${encodeURIComponent(titleCaseCat)}`,
        query: null,
        category: cat,
        confidence: 0.94,
        message: `Showing suppliers for ${cat}`
      };
    }
  }

  // --- 3. SEARCH Intent ---
  // "Search for [query]", "Find [query]", "Show me [query]"
  // Also handle "in [location]"
  let searchPattern = /^(?:search for|find|show me|looking for)\s+(.+)/i;
  const searchMatch = text.match(searchPattern);

  if (searchMatch) {
    let rawQuery = searchMatch[1].trim();
    let location = null;

    // Check for "in [location]" pattern
    const locationPattern = /\s+in\s+([a-z\s]+)$/i;
    const locationMatch = rawQuery.match(locationPattern);

    if (locationMatch) {
      location = locationMatch[1].trim();
      rawQuery = rawQuery.replace(locationPattern, "").trim();
    }

    // Check if the remaining query is actually a category
    for (const cat of validCategories) {
        if (rawQuery === cat || rawQuery === `suppliers for ${cat}`) {
             const titleCaseCat = cat.charAt(0).toUpperCase() + cat.slice(1);
             return {
                intent: "CATEGORY",
                route: `/customer/category/${encodeURIComponent(titleCaseCat)}` + (location ? `?location=${encodeURIComponent(location)}` : ""),
                query: null,
                category: cat,
                confidence: 0.95,
                message: `Showing ${cat} suppliers${location ? ` in ${location}` : ""}`
            };
        }
    }

    if (rawQuery) {
      // It's a general search
      let route = `/materials?search=${encodeURIComponent(rawQuery)}`;
      if (location) {
          route += `&location=${encodeURIComponent(location)}`;
      }
      return {
        intent: "SEARCH",
        route: route,
        query: rawQuery,
        category: null,
        confidence: 0.93,
        message: `Searching for ${rawQuery}${location ? ` in ${location}` : ""}`
      };
    }
  }

  // --- 4. ORDER STATUS Intent ---
  if (text.includes("where is my order") || text.includes("track my order") || text.includes("order status")) {
      return {
        intent: "ORDER_STATUS",
        route: "/customer/order-tracking",
        query: null,
        category: null,
        confidence: 0.92,
        message: "Opening order tracking"
      };
  }
  


  // --- 6. HELP Intent ---
  if (text.includes("help") || text.includes("what can you do")) {
      return {
        intent: "HELP",
        route: null,
        query: null,
        category: null,
        confidence: 0.90,
        message: "You can say 'Go to cart', 'Search for cement', 'Track my order', or 'Show me bricks'."
      };
  }


  // --- 7. FUZZY MATCHING (Suggestion Fallback) ---
  // If we haven't found a strict match, check for typos in Categories
  // Only attempt if text is single word or short phrase
  if (text.split(" ").length <= 3) {
      const { closest, distance } = findClosestMatch(text, validCategories);
      // Allow 1 error for 3-letter words, 2 for longer
      const maxDistance = text.length <= 4 ? 1 : 2;
      
      if (distance <= maxDistance) {
         const titleCaseCat = closest.charAt(0).toUpperCase() + closest.slice(1);
         return {
            intent: "SUGGESTION",
            route: `/customer/category/${encodeURIComponent(titleCaseCat)}`,
            query: null,
            category: closest, // The *suggested* category
            confidence: 0.65, // Medium confidence
            message: `Did you mean ${closest}?`
         };
      }
  }

  // --- UNKNOWN / Fallback to Help with low confidence ---
  return {
    intent: "UNKNOWN",
    route: null,
    query: null,
    category: null,
    confidence: 0.40,
    message: "I'm not sure what you mean. Try 'Go to cart' or 'Search for cement'."
  };
};
