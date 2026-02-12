import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

/**
 * Dashboard Service - Centralized API calls for supplier dashboard
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
 * Fetch dashboard summary statistics
 * @returns {Promise<Object>} Dashboard stats and data
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await apiClient.get("/api/supplier/dashboard");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to load dashboard data");
  }
};

/**
 * Fetch enhanced dashboard data with additional metrics
 * @returns {Promise<Object>} Enhanced dashboard data
 */
/**
 * Fetch enhanced dashboard data with additional metrics
 * @returns {Promise<Object>} Enhanced dashboard data
 */
/**
 * Fetch enhanced dashboard data with period support
 * @param {number} period - Days to fetch (7, 30, or 90)
 * @returns {Promise<Object>} Enhanced dashboard data
 */
export const fetchEnhancedDashboardData = async (period = 7) => {
  try {
    const response = await apiClient.get(`/api/supplier/dashboard?period=${period}`);
    return {
      success: true,
      data: response.data.data || {
        stats: {},
        charts: { period: 7, salesChart: { labels: [], earnings: [], orders: [] } },
        recentOrders: [],
        lowStockProducts: [],
        alerts: [],
        topProducts: [],
        quoteRequests: [],
        orderStatusDistribution: {},
        profileCompletion: { percentage: 0, missing: [] },
        businessStatus: { isOpen: true, businessHours: "9:00 AM - 6:00 PM" },
      },
    };
  } catch (error) {
    return handleError(error, "Failed to load dashboard data");
  }
};

/**
 * Export products to CSV
 * @returns {Promise<Blob>} CSV file blob
 */
export const exportProductsCSV = async () => {
  try {
    const response = await apiClient.get("/api/supplier/products/export-csv", {
      responseType: "blob",
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to export products");
  }
};

/**
 * Download CSV helper
 * @param {Blob} blob - CSV blob data
 * @param {string} filename - File name
 */
export const downloadCSV = (blob, filename = "products.csv") => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// ==================== ORDERS APIs ====================

/**
 * Fetch all orders with optional filters
 * @param {Object} filters - { status, page, limit, search }
 * @returns {Promise<Object>} Orders list
 */
export const fetchOrders = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit || 20);
    if (filters.search) params.append("search", filters.search);

    const response = await apiClient.get(
      `/api/supplier/orders?${params.toString()}`,
    );
    return {
      success: true,
      data: response.data,
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
export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/supplier/orders/${orderId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to fetch order details");
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @param {Object} additionalData - Extra data (tracking, delivery info)
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (
  orderId,
  status,
  additionalData = {},
) => {
  try {
    const response = await apiClient.put(
      `/api/supplier/orders/${orderId}/status`,
      {
        status,
        ...additionalData,
      },
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to update order status");
  }
};

/**
 * Accept order
 * @param {string} orderId - Order ID
 * @param {Object} deliveryInfo - Delivery date, time, etc.
 * @returns {Promise<Object>} Updated order
 */
export const acceptOrder = async (orderId, deliveryInfo = {}) => {
  return updateOrderStatus(orderId, "confirmed", deliveryInfo);
};

/**
 * Reject order (cancels with reason + restores stock)
 * @param {string} orderId - Order ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Updated order
 */
export const rejectOrder = async (orderId, reason) => {
  try {
    const response = await apiClient.post(
      `/api/supplier/orders/${orderId}/reject`,
      { reason },
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to reject order");
  }
};

// ==================== PRODUCTS APIs ====================

/**
 * Fetch all products with filters
 * @param {Object} filters - { category, status, page, limit, search, sort }
 * @returns {Promise<Object>} Products list
 */
/**
 * Fetch all products with filters
 * @param {Object} filters - { category, status, page, limit, search, sort }
 * @returns {Promise<Object>} Products list
 */
export const fetchProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page || 1);
    if (filters.limit) params.append("limit", filters.limit || 20);
    if (filters.search) params.append("search", filters.search);
    if (filters.sort) params.append("sort", filters.sort);

    const response = await apiClient.get(
      `/api/supplier/myproducts?${params.toString()}`
    );
    
    console.log("✅ Products API Response:", response.data); // Debug log
    
    return {
      success: true,
      data: {
        products: response.data.data || response.data.products || response.data,
        total: response.data.total || response.data.data?.length || 0,
        totalPages: response.data.totalPages || 1,
      },
    };
  } catch (error) {
    console.error("❌ Fetch products error:", error);
    return handleError(error, "Failed to fetch products");
  }
};

/**
 * Fetch low stock products
 * @returns {Promise<Object>} Low stock products
 */
export const fetchLowStockProducts = async () => {
  try {
    const response = await apiClient.get("/api/supplier/products/low-stock");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to fetch low stock products");
  }
};

/**
 * Update product stock
 * @param {string} productId - Product ID
 * @param {number} stock - New stock quantity
 * @returns {Promise<Object>} Updated product
 */
export const updateProductStock = async (productId, stock) => {
  try {
    const response = await apiClient.patch(
      `/api/supplier/products/${productId}/stock`,
      {
        stock,
      },
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to update stock");
  }
};

/**
 * Bulk upload products from CSV/Excel
 * @param {File} file - CSV or Excel file
 * @returns {Promise<Object>} Upload results
 */
export const bulkUploadProducts = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      "/api/supplier/products/bulk-upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" }, timeout: 120000 },
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to upload products");
  }
};

/**
 * Download bulk upload CSV template
 * @returns {Promise<Object>} CSV blob
 */
export const downloadBulkTemplate = async () => {
  try {
    const response = await apiClient.get(
      "/api/supplier/products/bulk-template",
      { responseType: "blob" },
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to download template");
  }
};

/**
 * Duplicate a product
 * @param {string} productId - Product ID to duplicate
 * @returns {Promise<Object>} New duplicated product
 */
export const duplicateProduct = async (productId) => {
  try {
    const response = await apiClient.post(
      `/api/supplier/myproducts/${productId}/duplicate`,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to duplicate product");
  }
};

// ==================== ANALYTICS APIs ====================

/**
 * Fetch supplier analytics data
 * @returns {Promise<Object>} Analytics data
 */
export const fetchSalesAnalytics = async () => {
  try {
    const response = await apiClient.get("/api/supplier/analytics");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to fetch analytics");
  }
};

export default {
  fetchDashboardStats,
  fetchEnhancedDashboardData,
  exportProductsCSV,
  downloadCSV,
  fetchOrders,
  fetchOrderDetails,
  updateOrderStatus,
  acceptOrder,
  rejectOrder,
  fetchProducts,
  fetchLowStockProducts,
  updateProductStock,
  duplicateProduct,
  bulkUploadProducts,
  downloadBulkTemplate,
  fetchSalesAnalytics,
};
