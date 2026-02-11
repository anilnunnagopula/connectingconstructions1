// client/src/utils/analytics.js

/**
 * Analytics Utility
 * Centralized analytics tracking for customer actions
 * Supports Google Analytics, Mixpanel, or custom analytics
 */

// Analytics configuration
const ANALYTICS_ENABLED = process.env.REACT_APP_ANALYTICS_ENABLED === "true";
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

/**
 * Initialize analytics (call this in App.jsx)
 */
export const initAnalytics = () => {
  if (!ANALYTICS_ENABLED) {
    console.log("📊 Analytics: Disabled in development");
    return;
  }

  // Google Analytics initialization
  if (GA_TRACKING_ID && window.gtag) {
    window.gtag("js", new Date());
    window.gtag("config", GA_TRACKING_ID, {
      send_page_view: false, // We'll track page views manually
    });
    console.log("📊 Analytics: Google Analytics initialized");
  }
};

/**
 * Track page view
 * @param {string} pagePath - Path of the page (e.g., "/customer/dashboard")
 * @param {string} pageTitle - Title of the page
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (!ANALYTICS_ENABLED) return;

  // Google Analytics
  if (window.gtag && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }

  // Custom analytics endpoint (optional)
  logEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Additional parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!ANALYTICS_ENABLED) return;

  // Google Analytics
  if (window.gtag) {
    window.gtag("event", eventName, eventParams);
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`📊 Analytics Event: ${eventName}`, eventParams);
  }

  // Send to custom analytics backend
  logEvent(eventName, eventParams);
};

/**
 * Log event to backend analytics service
 * @param {string} eventName
 * @param {Object} eventData
 */
const logEvent = async (eventName, eventData) => {
  if (process.env.NODE_ENV !== "production") return;

  try {
    // Optional: Send to your backend analytics endpoint
    // const baseURL = process.env.REACT_APP_API_URL;
    // await fetch(`${baseURL}/api/analytics/track`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     event: eventName,
    //     data: eventData,
    //     timestamp: new Date().toISOString(),
    //     userId: localStorage.getItem('userId'),
    //   }),
    // });
  } catch (error) {
    // Silently fail - don't interrupt user experience
    console.error("Analytics error:", error);
  }
};

// ==================== E-COMMERCE EVENTS ====================

/**
 * Track add to cart event
 * @param {Object} product - Product details
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  trackEvent("add_to_cart", {
    item_id: product._id || product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
    quantity: quantity,
    currency: "INR",
  });
};

/**
 * Track remove from cart event
 * @param {Object} product - Product details
 */
export const trackRemoveFromCart = (product) => {
  trackEvent("remove_from_cart", {
    item_id: product._id || product.id,
    item_name: product.name,
    price: product.price,
    currency: "INR",
  });
};

/**
 * Track begin checkout event
 * @param {Array} items - Cart items
 * @param {number} totalAmount - Total cart value
 */
export const trackBeginCheckout = (items, totalAmount) => {
  trackEvent("begin_checkout", {
    items: items.map((item) => ({
      item_id: item.product?._id || item.productId,
      item_name: item.product?.name || item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    value: totalAmount,
    currency: "INR",
  });
};

/**
 * Track purchase/order completion
 * @param {Object} order - Order details
 */
export const trackPurchase = (order) => {
  trackEvent("purchase", {
    transaction_id: order._id,
    value: order.totalAmount,
    currency: "INR",
    tax: order.tax || 0,
    shipping: order.deliveryFee || 0,
    items: order.items?.map((item) => ({
      item_id: item.product?._id || item.productId,
      item_name: item.productSnapshot?.name || item.name,
      price: item.priceAtOrder || item.price,
      quantity: item.quantity,
    })),
    payment_method: order.paymentMethod,
  });
};

/**
 * Track add to wishlist event
 * @param {Object} product - Product details
 */
export const trackAddToWishlist = (product) => {
  trackEvent("add_to_wishlist", {
    item_id: product._id || product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
    currency: "INR",
  });
};

/**
 * Track quote request event
 * @param {Object} quoteData - Quote request details
 */
export const trackQuoteRequest = (quoteData) => {
  trackEvent("quote_request", {
    items_count: quoteData.items?.length || 0,
    total_quantity: quoteData.items?.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ),
    delivery_city: quoteData.deliveryLocation?.city,
    broadcast_to_all: quoteData.broadcastToAll,
    targeted_suppliers: quoteData.targetSuppliers?.length || 0,
  });
};

/**
 * Track quote acceptance event
 * @param {string} quoteId - Quote ID
 * @param {number} amount - Quote amount
 */
export const trackQuoteAccept = (quoteId, amount) => {
  trackEvent("quote_accept", {
    quote_id: quoteId,
    value: amount,
    currency: "INR",
  });
};

// ==================== ENGAGEMENT EVENTS ====================

/**
 * Track search event
 * @param {string} searchTerm - Search query
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (searchTerm, resultsCount = 0) => {
  trackEvent("search", {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Track product view event
 * @param {Object} product - Product details
 */
export const trackProductView = (product) => {
  trackEvent("view_item", {
    item_id: product._id || product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
    currency: "INR",
  });
};

/**
 * Track filter application
 * @param {Object} filters - Applied filters
 */
export const trackFilterApply = (filters) => {
  trackEvent("filter_apply", {
    filter_category: filters.category,
    filter_price_min: filters.minPrice,
    filter_price_max: filters.maxPrice,
    filter_sort: filters.sortBy,
  });
};

/**
 * Track offer code copy
 * @param {string} offerCode - Offer code
 * @param {string} offerType - Type of offer
 */
export const trackOfferCopy = (offerCode, offerType) => {
  trackEvent("offer_code_copy", {
    offer_code: offerCode,
    offer_type: offerType,
  });
};

/**
 * Track product alert creation
 * @param {string} productId - Product ID
 * @param {string} alertType - Type of alert (price_drop, restock)
 */
export const trackAlertCreate = (productId, alertType) => {
  trackEvent("alert_create", {
    product_id: productId,
    alert_type: alertType,
  });
};

/**
 * Track message sent
 * @param {string} recipientType - Type of recipient (supplier, support)
 */
export const trackMessageSent = (recipientType) => {
  trackEvent("message_sent", {
    recipient_type: recipientType,
  });
};

/**
 * Track user registration
 * @param {string} method - Registration method (email, google, etc.)
 */
export const trackRegistration = (method = "email") => {
  trackEvent("sign_up", {
    method: method,
  });
};

/**
 * Track user login
 * @param {string} method - Login method (email, google, etc.)
 */
export const trackLogin = (method = "email") => {
  trackEvent("login", {
    method: method,
  });
};

/**
 * Track review submission
 * @param {number} rating - Rating given
 * @param {string} productId - Product ID
 */
export const trackReviewSubmit = (rating, productId) => {
  trackEvent("review_submit", {
    rating: rating,
    product_id: productId,
  });
};

// ==================== USER PROPERTIES ====================

/**
 * Set user properties for analytics
 * @param {Object} user - User object
 */
export const setUserProperties = (user) => {
  if (!ANALYTICS_ENABLED || !user) return;

  if (window.gtag && GA_TRACKING_ID) {
    window.gtag("set", "user_properties", {
      user_id: user._id,
      user_role: user.role,
      account_created: user.createdAt,
    });
  }
};

/**
 * Clear user properties (on logout)
 */
export const clearUserProperties = () => {
  if (!ANALYTICS_ENABLED) return;

  if (window.gtag && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      user_id: null,
    });
  }
};

export default {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackPurchase,
  trackAddToWishlist,
  trackQuoteRequest,
  trackQuoteAccept,
  trackSearch,
  trackProductView,
  trackFilterApply,
  trackOfferCopy,
  trackAlertCreate,
  trackMessageSent,
  trackRegistration,
  trackLogin,
  trackReviewSubmit,
  setUserProperties,
  clearUserProperties,
};
