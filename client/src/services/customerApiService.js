// client/src/services/customerApiService.js
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

/**
 * Customer API Service - Centralized API calls for customer features
 * Handles token management, error handling, and request formatting
 */

// Get auth token from localStorage
const getAuthToken = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return null;
    const user = JSON.parse(storedUser);
    return user?.token || null;
  } catch (error) {
    console.error("Error parsing auth token:", error);
    return null;
  }
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      // Optionally redirect to login (commented to avoid infinite loops)
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Error handler helper
const handleError = (error, customMessage = "An error occurred") => {
  let errorMessage = customMessage;

  if (error.response) {
    // Server responded with error
    errorMessage =
      error.response.data?.message ||
      error.response.data?.error ||
      `Server error: ${error.response.status}`;
  } else if (error.request) {
    // Request made but no response
    errorMessage = "Network error. Please check your connection.";
  } else {
    // Something else happened
    errorMessage = error.message || customMessage;
  }

  console.error("API Error:", error);
  return { success: false, error: errorMessage };
};

// ==================== DASHBOARD APIs ====================

/**
 * Fetch customer dashboard data
 * @returns {Promise<Object>} Dashboard stats and data
 */
export const getDashboardData = async () => {
  try {
    const response = await apiClient.get("/api/customer/dashboard");
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to load dashboard data");
  }
};

// ==================== ORDERS APIs ====================

/**
 * Fetch all customer orders with optional filters
 * @param {Object} filters - { status, page, limit, search }
 * @returns {Promise<Object>} Orders list
 */
export const getOrders = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit || 20);
    if (filters.search) params.append("search", filters.search);

    const response = await apiClient.get(`/api/orders?${params.toString()}`);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to fetch orders");
  }
};

/**
 * Fetch single order details
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/orders/${orderId}`);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to fetch order details");
  }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Updated order
 */
export const cancelOrder = async (orderId, reason = "") => {
  try {
    const response = await apiClient.put(`/api/orders/${orderId}/cancel`, {
      reason,
    });
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to cancel order");
  }
};

/**
 * Create a new order
 * @param {Object} orderData - Order data (items, address, payment, etc.)
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post("/api/orders/create", orderData);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to create order");
  }
};

// ==================== CART APIs ====================

/**
 * Get customer cart
 * @returns {Promise<Object>} Cart data
 */
export const getCart = async () => {
  try {
    const response = await apiClient.get("/api/cart");
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to fetch cart");
  }
};

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity
 * @returns {Promise<Object>} Updated cart
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await apiClient.post("/api/cart/add", {
      productId,
      quantity,
    });
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to add item to cart");
  }
};

/**
 * Update cart item quantity
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart
 */
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await apiClient.put(`/api/cart/update/${productId}`, {
      quantity,
    });
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to update cart item");
  }
};

/**
 * Remove item from cart
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Updated cart
 */
export const removeFromCart = async (productId) => {
  try {
    const response = await apiClient.delete(`/api/cart/remove/${productId}`);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to remove item from cart");
  }
};

/**
 * Clear entire cart
 * @returns {Promise<Object>} Empty cart
 */
export const clearCart = async () => {
  try {
    const response = await apiClient.delete("/api/cart/clear");
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to clear cart");
  }
};

// ==================== WISHLIST APIs ====================

/**
 * Get customer wishlist
 * @returns {Promise<Object>} Wishlist items
 */
export const getWishlist = async () => {
  try {
    const response = await apiClient.get("/api/wishlist");
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch wishlist");
  }
};

/**
 * Add product to wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Updated wishlist
 */
export const addToWishlist = async (productId) => {
  try {
    const response = await apiClient.post("/api/wishlist/add", { productId });
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to add to wishlist");
  }
};

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Updated wishlist
 */
export const removeFromWishlist = async (productId) => {
  try {
    const response = await apiClient.delete(
      `/api/wishlist/remove/${productId}`,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to remove from wishlist");
  }
};

/**
 * Clear entire wishlist
 * @returns {Promise<Object>} Empty wishlist
 */
export const clearWishlist = async () => {
  try {
    const response = await apiClient.delete("/api/wishlist/clear");
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to clear wishlist");
  }
};

// ==================== QUOTES APIs ====================

/**
 * Get all quote requests with filters
 * @param {Object} filters - { status, page, limit }
 * @returns {Promise<Object>} Quote requests
 */
export const getQuotes = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit || 20);

    const response = await apiClient.get(
      `/api/quotes/request?${params.toString()}`,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to fetch quotes");
  }
};

/**
 * Get single quote request details
 * @param {string} quoteId - Quote ID
 * @returns {Promise<Object>} Quote details
 */
export const getQuoteById = async (quoteId) => {
  try {
    const response = await apiClient.get(`/api/quotes/request/${quoteId}`);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to fetch quote details");
  }
};

/**
 * Create a new quote request
 * @param {Object} quoteData - Quote request data
 * @returns {Promise<Object>} Created quote
 */
export const createQuoteRequest = async (quoteData) => {
  try {
    const response = await apiClient.post("/api/quotes/request", quoteData);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to create quote request");
  }
};

/**
 * Accept a quote response
 * @param {string} quoteId - Quote request ID
 * @param {string} responseId - Quote response ID
 * @returns {Promise<Object>} Updated quote
 */
export const acceptQuote = async (quoteId, responseId) => {
  try {
    const response = await apiClient.put(
      `/api/quotes/request/${quoteId}/accept/${responseId}`,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to accept quote");
  }
};

/**
 * Cancel a quote request
 * @param {string} quoteId - Quote request ID
 * @returns {Promise<Object>} Updated quote
 */
export const cancelQuote = async (quoteId) => {
  try {
    const response = await apiClient.put(`/api/quotes/request/${quoteId}/cancel`);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to cancel quote");
  }
};

// ==================== NOTIFICATIONS APIs ====================

/**
 * Get all notifications
 * @param {Object} filters - { type, page, limit }
 * @returns {Promise<Object>} Notifications
 */
export const getNotifications = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit || 20);

    const response = await apiClient.get(
      `/api/notifications?${params.toString()}`,
    );
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch notifications");
  }
};

/**
 * Get unread notification count
 * @returns {Promise<Object>} Unread count
 */
export const getUnreadCount = async () => {
  try {
    const response = await apiClient.get("/api/notifications/unread-count");
    return {
      success: true,
      data: response.data.data || response.data || { count: 0 },
    };
  } catch (error) {
    return handleError(error, "Failed to fetch unread count");
  }
};

/**
 * Mark single notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(
      `/api/notifications/${notificationId}/read`,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to mark notification as read");
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Success status
 */
export const markAllAsRead = async () => {
  try {
    const response = await apiClient.put("/api/notifications/read-all");
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to mark all as read");
  }
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Success status
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete(`/api/notifications/${notificationId}`);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to delete notification");
  }
};

/**
 * Delete all notifications
 * @returns {Promise<Object>} Success status
 */
export const deleteAllNotifications = async () => {
  try {
    const response = await apiClient.delete("/api/notifications/all");
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to delete all notifications");
  }
};

// ==================== ADDRESSES APIs (NEW) ====================

/**
 * Get all customer addresses
 * @returns {Promise<Object>} Addresses list
 */
export const getAddresses = async () => {
  try {
    const response = await apiClient.get("/api/customer/addresses");
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch addresses");
  }
};

/**
 * Create a new address
 * @param {Object} addressData - Address details
 * @returns {Promise<Object>} Created address
 */
export const createAddress = async (addressData) => {
  try {
    const response = await apiClient.post(
      "/api/customer/addresses",
      addressData,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to create address");
  }
};

/**
 * Update an existing address
 * @param {string} addressId - Address ID
 * @param {Object} addressData - Updated address details
 * @returns {Promise<Object>} Updated address
 */
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await apiClient.put(
      `/api/customer/addresses/${addressId}`,
      addressData,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to update address");
  }
};

/**
 * Delete an address
 * @param {string} addressId - Address ID
 * @returns {Promise<Object>} Success status
 */
export const deleteAddress = async (addressId) => {
  try {
    const response = await apiClient.delete(
      `/api/customer/addresses/${addressId}`,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to delete address");
  }
};

/**
 * Set default address
 * @param {string} addressId - Address ID
 * @returns {Promise<Object>} Updated address
 */
export const setDefaultAddress = async (addressId) => {
  try {
    const response = await apiClient.put(
      `/api/customer/addresses/${addressId}/default`,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to set default address");
  }
};

// ==================== PAYMENT METHODS APIs ====================

/**
 * Get all payment methods
 * @returns {Promise<Object>} Payment methods list
 */
export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get("/api/customer/payment-methods");
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch payment methods");
  }
};

/**
 * Add a new payment method
 * @param {Object} paymentData - Payment method details
 * @returns {Promise<Object>} Created payment method
 */
export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await apiClient.post(
      "/api/customer/payment-methods",
      paymentData,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to add payment method");
  }
};

/**
 * Update payment method
 * @param {string} paymentId - Payment method ID
 * @param {Object} paymentData - Updated payment details
 * @returns {Promise<Object>} Updated payment method
 */
export const updatePaymentMethod = async (paymentId, paymentData) => {
  try {
    const response = await apiClient.put(
      `/api/customer/payment-methods/${paymentId}`,
      paymentData,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to update payment method");
  }
};

/**
 * Delete payment method
 * @param {string} paymentId - Payment method ID
 * @returns {Promise<Object>} Success status
 */
export const deletePaymentMethod = async (paymentId) => {
  try {
    const response = await apiClient.delete(
      `/api/customer/payment-methods/${paymentId}`,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to delete payment method");
  }
};

/**
 * Set default payment method
 * @param {string} paymentId - Payment method ID
 * @returns {Promise<Object>} Updated payment method
 */
export const setDefaultPaymentMethod = async (paymentId) => {
  try {
    const response = await apiClient.put(
      `/api/customer/payment-methods/${paymentId}/default`,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to set default payment method");
  }
};

// ==================== INVOICES APIs ====================

/**
 * Get all invoices for completed orders
 * @param {Object} filters - { page, limit }
 * @returns {Promise<Object>} Invoices list
 */
export const getInvoices = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit || 20);

    const response = await apiClient.get(
      `/api/customer/invoices?${params.toString()}`,
    );
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch invoices");
  }
};

/**
 * Download invoice PDF for an order
 * @param {string} orderId - Order ID
 * @returns {Promise<Blob>} PDF file blob
 */
export const downloadInvoice = async (orderId) => {
  try {
    const response = await apiClient.get(
      `/api/customer/invoices/${orderId}/download`,
      {
        responseType: "blob", // Important for PDF download
      },
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to download invoice");
  }
};

// ==================== REVIEWS APIs ====================

/**
 * Submit a product review
 * @param {Object} reviewData - Review data (orderId, productId, rating, comment, etc.)
 * @returns {Promise<Object>} Created review
 */
export const submitReview = async (reviewData) => {
  try {
    const response = await apiClient.post("/api/reviews", reviewData);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to submit review");
  }
};

// ==================== OFFERS APIs (NEW) ====================

/**
 * Get active offers
 * @returns {Promise<Object>} List of active offers
 */
export const getOffers = async () => {
  try {
    // Note: getActiveOffers is public, so token optional but handled by interceptor if present
    const response = await apiClient.get("/api/offers/active");
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch offers");
  }
};

/**
 * Validate an offer code
 * @param {string} code - Offer code
 * @param {number} cartAmount - Total cart amount
  * @param {Array} cartItems - items in cart
 * @returns {Promise<Object>} Validation result
 */
export const validateOfferCode = async (code, cartAmount, cartItems = []) => {
  try {
    const response = await apiClient.post("/api/offers/validate", {
      code,
      cartAmount,
      cartItems
    });
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Invalid offer code");
  }
};

/**
 * Get nearby suppliers
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in km (default 50)
 * @returns {Promise<Object>} List of suppliers
 */
export const getNearbySuppliers = async (lat, lng, radius = 50) => {
  try {
    const response = await apiClient.get("/api/suppliers/nearby", {
      params: { lat, lng, radius },
    });
    return {
       success: true,
       data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch nearby suppliers");
  }
};



// ==================== CHAT APIs (NEW) ====================

/**
 * Send a message
 * @param {Object} messageData - { receiverId, content, relatedOrder, relatedProduct }
 * @returns {Promise<Object>} Created message
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await apiClient.post("/api/chat/send", messageData);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to send message");
  }
};

/**
 * Get messages with a user
 * @param {string} userId - ID of the user to chat with
 * @returns {Promise<Object>} List of messages
 */
export const getMessages = async (userId) => {
  try {
    const response = await apiClient.get(`/api/chat/${userId}`);
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch messages");
  }
};

/**
 * Get all conversations
 * @returns {Promise<Object>} List of conversations
 */
export const getConversations = async () => {
  try {
    const response = await apiClient.get("/api/chat/conversations");
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch conversations");
  }
};

/**
 * Mark messages as read
 * @param {string} senderId - ID of the sender
 * @returns {Promise<Object>} Success status
 */
export const markMessagesAsRead = async (senderId) => {
  try {
    const response = await apiClient.put(`/api/chat/read/${senderId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to mark messages as read");
  }
};

/**
 * Get suppliers from customer's past orders (for starting conversations)
 * @returns {Promise<Object>} List of suppliers
 */
export const getSuppliersFromOrders = async () => {
  try {
    const response = await apiClient.get("/api/customer/suppliers-from-orders");
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch suppliers");
  }
};

// ==================== ALERT APIs (NEW) ====================

/**
 * Create a product alert
 * @param {Object} alertData - { productId, alertType, targetPrice }
 * @returns {Promise<Object>} Created alert
 */
export const createAlert = async (alertData) => {
  try {
    const response = await apiClient.post("/api/alerts", alertData);
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to create alert");
  }
};

/**
 * Get user's alerts
 * @returns {Promise<Object>} List of alerts
 */
export const getAlerts = async () => {
  try {
    const response = await apiClient.get("/api/alerts");
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch alerts");
  }
};

/**
 * Delete an alert
 * @param {string} alertId - ID of the alert
 * @returns {Promise<Object>} Success status
 */
export const deleteAlert = async (alertId) => {
  try {
    const response = await apiClient.delete(`/api/alerts/${alertId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to delete alert");
  }
};

// ==================== ANALYTICS APIs (NEW) ====================

/**
 * Get customer spending analytics
 * @returns {Promise<Object>} Analytics data
 */
export const getCustomerAnalytics = async () => {
  try {
    const response = await apiClient.get("/api/customer/analytics");
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to fetch analytics");
  }
};

/**
 * Get reviews for a product
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Reviews list
 */
export const getProductReviews = async (productId) => {
  try {
    const response = await apiClient.get(`/api/reviews/product/${productId}`);
    return {
      success: true,
      data: response.data.data || response.data || [],
    };
  } catch (error) {
    return handleError(error, "Failed to fetch reviews");
  }
};

// ==================== RAZORPAY APIs (NEW) ====================

/**
 * Create Razorpay order for payment
 * @param {string} orderId - Order ID
 * @param {number} amount - Amount to pay
 * @param {string} currency - Currency (default INR)
 * @returns {Promise<Object>} Razorpay order details
 */
export const createRazorpayOrder = async (orderId, amount, currency = "INR") => {
  try {
    const response = await apiClient.post("/api/payment/razorpay/create-order", {
      orderId,
      amount,
      currency,
    });
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to create payment order");
  }
};

/**
 * Verify Razorpay payment signature
 * @param {Object} paymentData - { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }
 * @returns {Promise<Object>} Verification result
 */
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const response = await apiClient.post(
      "/api/payment/razorpay/verify-payment",
      paymentData,
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Payment verification failed");
  }
};

/**
 * Handle Razorpay payment failure
 * @param {string} orderId - Order ID
 * @param {Object} error - Error details
 * @returns {Promise<Object>} Result
 */
export const handleRazorpayFailure = async (orderId, error) => {
  try {
    const response = await apiClient.post(
      "/api/payment/razorpay/payment-failed",
      {
        orderId,
        error,
      },
    );
    return {
      success: true,
      data: response.data.data || response.data || {},
    };
  } catch (error) {
    return handleError(error, "Failed to record payment failure");
  }
};

// Export all functions as default
export default {
  // Dashboard
  getDashboardData,
  // Orders
  getOrders,
  getOrderById,
  cancelOrder,
  createOrder,
  // Cart
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  // Wishlist
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  // Quotes
  getQuotes,
  getQuoteById,
  createQuoteRequest,
  acceptQuote,
  cancelQuote,
  // Notifications
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  // Addresses
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  // Payment Methods
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  // Invoices
  getInvoices,
  downloadInvoice,
  // Offers
  getOffers,
  validateOfferCode,
  // Suppliers
  getNearbySuppliers,
  // Chat
  sendMessage,
  getMessages,
  getConversations,
  markMessagesAsRead,
  getSuppliersFromOrders,
  // Alerts
  createAlert,
  getAlerts,
  deleteAlert,
  // Analytics
  getCustomerAnalytics,
  // Reviews
  submitReview,
  getProductReviews,
  // Razorpay
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayFailure,
};
