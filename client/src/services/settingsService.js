import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

/**
 * Settings Service - All settings-related API calls
 */

// Get auth token
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

// Create axios instance
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Error handler
const handleError = (error, customMessage = "An error occurred") => {
  let errorMessage = customMessage;

  if (error.response) {
    errorMessage =
      error.response.data?.message ||
      error.response.data?.error ||
      `Server error: ${error.response.status}`;
  } else if (error.request) {
    errorMessage = "Network error. Please check your connection.";
  } else {
    errorMessage = error.message || customMessage;
  }

  console.error("API Error:", error);
  return { success: false, error: errorMessage };
};

// ==================== USER PROFILE ====================

/**
 * Fetch user profile
 */
export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get("/api/auth/profile");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to load profile");
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/api/auth/profile", profileData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to update profile");
  }
};

// ==================== PROFILE PICTURE ====================

/**
 * Upload profile picture to Cloudinary
 */
export const uploadProfilePicture = async (file) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return {
      success: false,
      error: "Cloudinary not configured",
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "supplier-profiles");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
    );

    return {
      success: true,
      data: {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      },
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: "Failed to upload image",
    };
  }
};

/**
 * Upload business license to Cloudinary
 */
export const uploadBusinessLicense = async (file) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return {
      success: false,
      error: "Cloudinary not configured",
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "business-licenses");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
    );

    return {
      success: true,
      data: {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      },
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: "Failed to upload license",
    };
  }
};

// ==================== PASSWORD ====================

/**
 * Change password
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.put("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to change password");
  }
};

// ==================== LOCATION ====================

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await apiClient.get(
      `/geocode-proxy?lat=${lat}&lon=${lng}`,
    );
    return {
      success: true,
      data: {
        address: response.data.display_name,
        lat,
        lng,
      },
    };
  } catch (error) {
    return handleError(error, "Failed to fetch address");
  }
};

// ==================== PAYMENT METHODS ====================

/**
 * Fetch payment methods
 */
export const fetchPaymentMethods = async () => {
  try {
    const response = await apiClient.get("/api/supplier/payout-methods");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to load payment methods");
  }
};

/**
 * Add payment method
 */
export const addPaymentMethod = async (methodData) => {
  try {
    const response = await apiClient.post(
      "/api/supplier/payout-methods",
      methodData,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to add payment method");
  }
};

/**
 * Update payment method
 */
export const updatePaymentMethod = async (methodId, updates) => {
  try {
    const response = await apiClient.put(
      `/api/supplier/payout-methods/${methodId}`,
      updates,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to update payment method");
  }
};

/**
 * Delete payment method
 */
export const deletePaymentMethod = async (methodId) => {
  try {
    const response = await apiClient.delete(
      `/api/supplier/payout-methods/${methodId}`,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to delete payment method");
  }
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (methodId) => {
  try {
    const response = await apiClient.put(
      `/api/supplier/payout-methods/${methodId}`,
      { isDefault: true },
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, "Failed to set default payment method");
  }
};

export default {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  uploadBusinessLicense,
  changePassword,
  reverseGeocode,
  fetchPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
};
