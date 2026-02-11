// src/pages/Customer/CustomerSettingsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Lock,
  MapPin,
  Camera,
  CreditCard,
  Trash2,
  CheckCircle,
} from "lucide-react"; // Icons for sections

// IMPORT GOOGLE MAPS COMPONENTS AND HOOKS
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const googleMapsLibraries = ["places", "maps"]; // Libraries for useJsApiLoader

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px",
};

const defaultCenter = {
  lat: 17.385044, // Default to Hyderabad, India
  lng: 78.486671,
};

const baseURL = process.env.REACT_APP_API_URL;

// Constants for profile image upload
const MAX_PROFILE_IMAGE_SIZE_MB = 2; // Max 2MB for profile picture
const MAX_PROFILE_IMAGE_SIZE_BYTES = MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024;

const CustomerSettingsPage = () => {
  const navigate = useNavigate();

  // --- 1. ALL useState HOOKS FIRST ---
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Form states for different sections
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState("");

  const [locationInfo, setLocationInfo] = useState({
    address: "",
    lat: null,
    lng: null,
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // NEW: Payment methods states for CUSTOMER
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newMethodForm, setNewMethodForm] = useState({
    type: "CARD", // Default type for customer payments
    details: {
      cardNumber: "",
      cardHolderName: "",
      expiryDate: "", // MM/YY format
      cvv: "",
    },
    isDefault: false,
  });

  // Google Maps Loader
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: googleMapsLibraries,
  });

  // --- 2. ALL useCallback HOOKS SECOND ---

  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  const handlePersonalInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleProfilePictureFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPG, PNG, GIF).");
        e.target.value = null;
        return;
      }
      if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
        toast.error(`Image is too large (max ${MAX_PROFILE_IMAGE_SIZE_MB}MB).`);
        e.target.value = null;
        return;
      }
      setProfilePictureFile(file);
    } else {
      setProfilePictureFile(null);
    }
  }, []);

  const uploadProfilePictureToCloudinary = useCallback(async (file) => {
    if (!file) return null;

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary not configured. Cannot upload profile picture.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("resource_type", "image");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (err) {
      console.error("Cloudinary profile picture upload error:", err);
      toast.error("Failed to upload profile picture.");
      return null;
    }
  }, []);

  const handleLocationInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocationInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Fetch User Profile and Payment Methods
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getToken();

    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      toast.error("Please log in to manage your profile.");
      navigate("/login");
      return;
    }

    try {
      // Fetch Customer Profile
      const profileResponse = await axios.get(
        `${baseURL}/api/customer/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedUser = profileResponse.data;
      setUserProfile(fetchedUser);

      setPersonalInfo({
        name: fetchedUser.name || "",
        username: fetchedUser.username || "",
        email: fetchedUser.email || "",
        phoneNumber: fetchedUser.phoneNumber || "",
      });
      setLocationInfo({
        address: fetchedUser.address || "",
        lat: fetchedUser.location?.lat || null,
        lng: fetchedUser.location?.lng || null,
      });
      setCurrentProfileImageUrl(fetchedUser.profilePictureUrl || "");

      // Fetch Customer Payment Methods
      const methodsResponse = await fetch(
        `${baseURL}/api/customer/payment-methods`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const methodsData = await methodsResponse.json();
      if (!methodsResponse.ok)
        throw new Error(
          methodsData.message || "Failed to fetch payment methods."
        );
      setPaymentMethods(methodsData);

      toast.success("Profile data loaded!");
    } catch (err) {
      console.error("Error fetching user profile/payment methods:", err);
      let errorMessage = "Failed to load profile data.";
      if (err.response) {
        errorMessage =
          err.response.data.message || err.response.data.error || errorMessage;
        if (err.response.status === 401 || err.response.status === 403) {
          toast.error("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  const handleSaveProfile = useCallback(
    async (sectionData) => {
      setSubmitting(true);
      try {
        const token = getToken();
        if (!token) {
          toast.error("Authentication required.");
          navigate("/login");
          return;
        }

        let updatedProfilePictureUrl = currentProfileImageUrl;
        if (activeTab === "personal" && profilePictureFile) {
          toast("Uploading profile image...", { icon: "⏳" });
          const uploadedUrl = await uploadProfilePictureToCloudinary(
            profilePictureFile
          );
          if (uploadedUrl) {
            updatedProfilePictureUrl = uploadedUrl;
          } else {
            setSubmitting(false);
            return;
          }
        }

        const dataToSend = {
          name: personalInfo.name,
          username: personalInfo.username,
          email: personalInfo.email,
          phoneNumber: personalInfo.phoneNumber,
          profilePictureUrl: updatedProfilePictureUrl,
        };

        if (activeTab === "location") {
          dataToSend.address = locationInfo.address;
          dataToSend.location = {
            lat: locationInfo.lat,
            lng: locationInfo.lng,
          };
        } else {
          dataToSend.address = userProfile.address;
          dataToSend.location = userProfile.location;
        }

        if (activeTab === "security" && sectionData.newPassword) {
          dataToSend.currentPassword = sectionData.currentPassword;
          dataToSend.newPassword = sectionData.newPassword;
        } else {
          delete dataToSend.currentPassword;
          delete dataToSend.newPassword;
        }

        const res = await axios.put(
          `${baseURL}/api/customer/profile`,
          dataToSend,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserProfile(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("Profile updated successfully!");

        if (activeTab === "personal") {
          setProfilePictureFile(null);
          const fileInput = document.getElementById("profilePicture");
          if (fileInput) fileInput.value = "";
        }
      } catch (err) {
        console.error("Error saving profile:", err);
        let errorMessage = "Failed to save changes.";
        if (err.response) {
          errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            errorMessage;
          if (err.response.status === 401 || err.response.status === 403) {
            toast.error(
              "Session expired or unauthorized. Please log in again."
            );
            localStorage.removeItem("user");
            navigate("/login");
          }
        }
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
    [
      getToken,
      navigate,
      activeTab,
      personalInfo,
      locationInfo,
      userProfile,
      profilePictureFile,
      currentProfileImageUrl,
      uploadProfilePictureToCloudinary,
    ]
  );

  const handleSavePersonalInfo = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !personalInfo.name.trim() ||
        !personalInfo.username.trim() ||
        !personalInfo.email.trim()
      ) {
        toast.error("Name, username, and email are required.");
        return;
      }
      await handleSaveProfile({});
    },
    [personalInfo, handleSaveProfile]
  );

  const handleSaveLocationInfo = useCallback(
    async (e) => {
      e.preventDefault();
      if (!locationInfo.address.trim()) {
        toast.error("Address cannot be empty.");
        return;
      }
      await handleSaveProfile({});
    },
    [locationInfo, handleSaveProfile]
  );

  const handleChangePassword = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !passwordInfo.currentPassword ||
        !passwordInfo.newPassword ||
        !passwordInfo.confirmNewPassword
      ) {
        toast.error("All password fields are required.");
        return;
      }
      if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
        toast.error("New passwords do not match.");
        return;
      }
      if (passwordInfo.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters.");
        return;
      }
      await handleSaveProfile({
        currentPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
      });
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    },
    [passwordInfo, handleSaveProfile, setPasswordInfo]
  );

  const handleAutoFetchLocation = useCallback(async () => {
    setSubmitting(true);
    toast("📍 Fetching your location...", { icon: "⏳" });

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setSubmitting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `${baseURL}/geocode-proxy?lat=${latitude}&lon=${longitude}`
          );
          const address = response.data.display_name;
          if (address) {
            setLocationInfo((prev) => ({
              ...prev,
              address: address,
              lat: latitude,
              lng: longitude,
            }));
            toast.success("Location fetched!");
          } else {
            toast.error("Could not determine address from coordinates.");
          }
        } catch (err) {
          console.error("Failed to reverse geocode location via proxy:", err);
          toast.error("Failed to fetch location. Try again.");
        } finally {
          setSubmitting(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        let msg = "Failed to get location.";
        if (err.code === err.PERMISSION_DENIED)
          msg = "Location access denied. Enable in browser settings.";
        else if (err.code === err.POSITION_UNAVAILABLE)
          msg = "Location information unavailable.";
        else if (err.code === err.TIMEOUT) msg = "Location request timed out.";
        toast.error(msg);
        setSubmitting(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [setSubmitting, toast, setLocationInfo]);

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocationInfo((prev) => ({
        ...prev,
        lat: lat,
        lng: lng,
        address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      }));
      toast.success("Location updated from map click!");
    },
    [setLocationInfo, toast]
  );

  // NEW: Payment methods handlers for CUSTOMER
  const handleNewPaymentMethodFormChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      if (type === "checkbox") {
        setNewMethodForm((prev) => ({ ...prev, [name]: checked }));
      } else {
        setNewMethodForm((prev) => ({
          ...prev,
          details: { ...prev.details, [name]: value },
        }));
      }
    },
    [setNewMethodForm]
  );

  const handleAddPaymentMethod = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      const token = getToken();
      if (!token) {
        toast.error("Authentication required.");
        navigate("/login");
        return;
      }
      try {
        const res = await axios.post(
          `${baseURL}/api/customer/payment-methods`,
          newMethodForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status !== 201)
          throw new Error(res.data.message || "Failed to add payment method.");
        toast.success("Payment method added successfully!");
        setNewMethodForm((prev) => ({
          ...prev,
          details: {
            cardNumber: "",
            cardHolderName: "",
            expiryDate: "",
            cvv: "",
          },
          isDefault: false,
        }));
        fetchUserProfile();
      } catch (err) {
        console.error("Error adding payment method:", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to add payment method."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [getToken, navigate, newMethodForm, fetchUserProfile, toast]
  );

  const handleSetDefaultPaymentMethod = useCallback(
    async (methodId) => {
      setSubmitting(true);
      const token = getToken();
      if (!token) {
        toast.error("Authentication required.");
        navigate("/login");
        return;
      }
      try {
        const res = await axios.put(
          `${baseURL}/api/customer/payment-methods/${methodId}`,
          { isDefault: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status !== 200)
          throw new Error(res.data.message || "Failed to set as default.");
        toast.success("Payment method set as default!");
        fetchUserProfile();
      } catch (err) {
        console.error("Error setting default payment method:", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to set as default."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [getToken, navigate, fetchUserProfile, toast]
  );

  const handleDeletePaymentMethod = useCallback(
    async (methodId) => {
      if (
        !window.confirm("Are you sure you want to delete this payment method?")
      )
        return;
      setSubmitting(true);
      const token = getToken();
      if (!token) {
        toast.error("Authentication required.");
        navigate("/login");
        return;
      }
      try {
        const res = await axios.delete(
          `${baseURL}/api/customer/payment-methods/${methodId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status !== 200)
          throw new Error(
            res.data.message || "Failed to delete payment method."
          );
        toast.success("Payment method deleted!");
        fetchUserProfile();
      } catch (err) {
        console.error("Error deleting payment method:", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete payment method."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [getToken, navigate, fetchUserProfile, toast]
  );

  // --- 3. ALL useEffect HOOKS LAST ---
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // --- 4. RENDER LOGIC ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading customer profile settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg">
          <p className="text-xl font-semibold mb-2">Error Loading Profile</p>
          <p>{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          ⚙️ Customer Settings
        </h1>

        {/* Tabs/Navigation for Sections */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <button
            className={`flex items-center px-4 py-2 -mb-px text-sm font-medium leading-5 border-b-2
                            ${
                              activeTab === "personal"
                                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                            } focus:outline-none`}
            onClick={() => setActiveTab("personal")}
          >
            <User size={18} className="mr-2" /> Personal Info
          </button>
          <button
            className={`flex items-center px-4 py-2 -mb-px text-sm font-medium leading-5 border-b-2
                            ${
                              activeTab === "location"
                                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                            } focus:outline-none`}
            onClick={() => setActiveTab("location")}
          >
            <MapPin size={18} className="mr-2" /> Delivery Address
          </button>
          <button
            className={`flex items-center px-4 py-2 -mb-px text-sm font-medium leading-5 border-b-2
                            ${
                              activeTab === "payments"
                                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                            } focus:outline-none`}
            onClick={() => setActiveTab("payments")}
          >
            <CreditCard size={18} className="mr-2" /> Payments
          </button>
          <button
            className={`flex items-center px-4 py-2 -mb-px text-sm font-medium leading-5 border-b-2
                            ${
                              activeTab === "security"
                                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                            } focus:outline-none`}
            onClick={() => setActiveTab("security")}
          >
            <Lock size={18} className="mr-2" /> Security
          </button>
        </div>

        {/* Quick Link to Manage All Addresses */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Manage All Addresses</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add, edit, or delete multiple delivery addresses
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/customer/addresses")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              View All Addresses
              <ArrowLeft size={16} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Content for active tab */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">
              Personal Information
            </h2>
            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500 dark:border-blue-400 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {profilePictureFile ? (
                    <img
                      src={URL.createObjectURL(profilePictureFile)}
                      alt="New Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : currentProfileImageUrl ? (
                    <img
                      src={currentProfileImageUrl}
                      alt="Current Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      size={60}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  )}
                  <label
                    htmlFor="profilePicture"
                    className="absolute bottom-0 right-0 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md"
                  >
                    <Camera size={18} />
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePictureFile"
                      accept="image/*"
                      onChange={handleProfilePictureFileChange}
                      className="hidden"
                      disabled={submitting}
                    />
                  </label>
                </div>
                {profilePictureFile && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {profilePictureFile.name} selected.
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max {MAX_PROFILE_IMAGE_SIZE_MB}MB. JPG, PNG, GIF.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={personalInfo.username}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={personalInfo.phoneNumber}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Personal Info"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">
              Delivery Address
            </h2>
            <form onSubmit={handleSaveLocationInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Full Address
                </label>
                <textarea
                  rows="4"
                  name="address"
                  value={locationInfo.address}
                  onChange={handleLocationInfoChange}
                  placeholder="Enter your full delivery address..."
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white resize-none border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  disabled={submitting}
                />
              </div>
              <button
                type="button"
                onClick={handleAutoFetchLocation}
                disabled={submitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
              >
                {submitting ? "Fetching..." : "Auto Fetch Current Location"}
              </button>
              <button
                type="submit"
                disabled={submitting || !locationInfo.address.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold ml-4 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Location"}
              </button>
            </form>
            {isLoaded && (
              <div className="mt-6">
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  📌 Mark Location on Map (Click to set)
                </label>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={
                    locationInfo.lat && locationInfo.lng
                      ? { lat: locationInfo.lat, lng: locationInfo.lng }
                      : defaultCenter
                  }
                  zoom={locationInfo.lat && locationInfo.lng ? 15 : 12}
                  onClick={handleMapClick}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {locationInfo.lat && locationInfo.lng && (
                    <Marker
                      position={{
                        lat: locationInfo.lat,
                        lng: locationInfo.lng,
                      }}
                    />
                  )}
                </GoogleMap>
                {locationInfo.lat && locationInfo.lng && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Selected Coordinates: Lat: {locationInfo.lat.toFixed(4)},
                    Lng: {locationInfo.lng.toFixed(4)}
                  </p>
                )}
              </div>
            )}
            {loadError && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
                Error loading map: {loadError.message}. Please check your Google
                Maps API key.
              </div>
            )}
          </div>
        )}

        {/* NEW: Payment Settings Tab Content for CUSTOMERS */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">
              Payment Methods
            </h2>
            {/* Add New Payment Method Form (e.g., Credit Card) */}
            <form
              onSubmit={handleAddPaymentMethod}
              className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Add New Card
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={newMethodForm.details.cardNumber}
                  onChange={handleNewPaymentMethodFormChange}
                  required
                  disabled={submitting}
                  placeholder="**** **** **** ****"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  name="cardHolderName"
                  value={newMethodForm.details.cardHolderName}
                  onChange={handleNewPaymentMethodFormChange}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={newMethodForm.details.expiryDate}
                    onChange={handleNewPaymentMethodFormChange}
                    required
                    disabled={submitting}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={newMethodForm.details.cvv}
                    onChange={handleNewPaymentMethodFormChange}
                    required
                    disabled={submitting}
                    placeholder="***"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefaultNewMethod"
                  checked={newMethodForm.isDefault}
                  onChange={handleNewPaymentMethodFormChange}
                  disabled={submitting}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="isDefaultNewMethod"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Set as default payment method
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Add Payment Method"}
              </button>
            </form>

            {/* Existing Payment Methods List */}
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white mt-8">
              Existing Payment Methods ({paymentMethods.length})
            </h3>
            {paymentMethods.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No payment methods added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method._id}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div className="flex-grow">
                      <p className="font-bold text-gray-900 dark:text-white flex items-center">
                        {method.type === "CARD" && (
                          <CreditCard size={18} className="mr-2" />
                        )}
                        Card ending in {method.details.cardNumber.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Holder: {method.details.cardHolderName}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Expires: {method.details.expiryDate}
                      </p>
                      {method.isDefault && (
                        <span className="mt-2 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                          Default
                        </span>
                      )}
                      <span
                        className={`mt-2 ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          method.status === "Verified"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : method.status === "Active"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {method.status}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-3 md:mt-0">
                      {!method.isDefault && (
                        <button
                          onClick={() =>
                            handleSetDefaultPaymentMethod(method._id)
                          }
                          disabled={submitting}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(method._id)}
                        disabled={submitting}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">
              Security & Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordInfo.currentPassword}
                  onChange={handlePasswordInfoChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordInfo.newPassword}
                  onChange={handlePasswordInfoChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordInfo.confirmNewPassword}
                  onChange={handlePasswordInfoChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={
                  submitting ||
                  !passwordInfo.newPassword ||
                  passwordInfo.newPassword.length < 6 ||
                  passwordInfo.newPassword !== passwordInfo.confirmNewPassword
                }
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSettingsPage;
