// src/pages/Supplier/SettingsPage.jsx
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

const SettingsPage = () => {
  const navigate = useNavigate();

  // --- 1. ALL useState HOOKS FIRST ---
  const [userProfile, setUserProfile] = useState(null); // Full user profile from backend
  const [loading, setLoading] = useState(true); // Overall loading for fetching profile
  const [submitting, setSubmitting] = useState(false); // For form submissions within tabs
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal"); // State to manage active tab

  // Form states for different sections
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null); // Selected file for upload
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState(""); // Current image URL from backend

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

  // Payment methods states (reused from PaymentsPage)
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [newMethodForm, setNewMethodForm] = useState({
    type: "BANK_TRANSFER",
    details: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
      upiId: "",
    },
    isDefault: false,
  });

  // Google Maps Loader (useJsApiLoader is a hook, so it goes after useState)
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script", // Unique ID for this map instance
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: googleMapsLibraries,
  });

  // --- 2. ALL useCallback HOOKS SECOND (after all useState hooks) ---

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
        e.target.value = null; // Clear input
        return;
      }
      if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
        toast.error(`Image is too large (max ${MAX_PROFILE_IMAGE_SIZE_MB}MB).`);
        e.target.value = null; // Clear input
        return;
      }
      setProfilePictureFile(file); // Store the file object
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
    formData.append("resource_type", "image"); // Ensure it's treated as image

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
  }, []); // No external dependencies that change, so empty array

  const handleLocationInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocationInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Fetch User Profile and Payout Methods
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
      const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      setCurrentProfileImageUrl(fetchedUser.profilePictureUrl || ""); // Set current profile image

      // Fetch Payout Methods
      const methodsResponse = await fetch(
        `${baseURL}/api/supplier/payout-methods`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const methodsData = await methodsResponse.json();
      if (!methodsResponse.ok)
        throw new Error(
          methodsData.message || "Failed to fetch payout methods."
        );
      setPayoutMethods(methodsData);

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
  }, [
    navigate,
    getToken,
    setCurrentProfileImageUrl,
    setLocationInfo,
    setPersonalInfo,
    setPayoutMethods,
  ]); // Added setPayoutMethods here

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
        // Only upload if a new file is selected in personal tab
        if (activeTab === "personal" && profilePictureFile) {
          toast("Uploading profile image...", { icon: "⏳" });
          const uploadedUrl = await uploadProfilePictureToCloudinary(
            profilePictureFile
          );
          if (uploadedUrl) {
            updatedProfilePictureUrl = uploadedUrl;
          } else {
            setSubmitting(false);
            return; // Stop if image upload fails
          }
        }

        const dataToSend = {
          name: personalInfo.name,
          username: personalInfo.username,
          email: personalInfo.email,
          phoneNumber: personalInfo.phoneNumber,
          profilePictureUrl: updatedProfilePictureUrl, // Include the image URL
          // Address and location handled specifically below
          // Password fields handled specifically below
        };

        if (activeTab === "location") {
          dataToSend.address = locationInfo.address;
          dataToSend.location = {
            lat: locationInfo.lat,
            lng: locationInfo.lng,
          };
        } else {
          // If not on location tab, send existing address/location to avoid clearing it
          dataToSend.address = userProfile.address;
          dataToSend.location = userProfile.location;
        }

        if (activeTab === "security" && sectionData.newPassword) {
          dataToSend.currentPassword = sectionData.currentPassword;
          dataToSend.newPassword = sectionData.newPassword;
        } else {
          // Exclude password fields if not changing password
          delete dataToSend.currentPassword;
          delete dataToSend.newPassword;
        }

        const res = await axios.put(`${baseURL}/api/auth/profile`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("Profile updated successfully!");

        // Clear the selected file input visually after successful save
        if (activeTab === "personal") {
          // Only clear if we were on personal tab
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
      setCurrentProfileImageUrl,
      toast,
      setError,
      setUserProfile,
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
        // Clear password fields after attempt
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

  // NEW: Payment methods handlers (reused from PaymentsPage)
  const handleNewMethodFormChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      if (name === "type") {
        setNewMethodForm((prev) => ({
          ...prev,
          type: value,
          details: {
            accountNumber: "",
            upiId: "",
            ifscCode: "",
            bankName: "",
            accountHolderName: "",
          }, // Reset details
        }));
      } else if (type === "checkbox") {
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

  const handleAddPayoutMethod = useCallback(
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
          `${baseURL}/api/supplier/payout-methods`,
          newMethodForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.status === 201)
          throw new Error(res.data.message || "Failed to add payout method."); // Status should be 201 Created
        toast.success("Payout method added successfully!");
        setNewMethodForm((prev) => ({
          ...prev,
          type: "BANK_TRANSFER",
          details: {
            accountNumber: "",
            upiId: "",
            ifscCode: "",
            bankName: "",
            accountHolderName: "",
          },
          isDefault: false,
        })); // Reset form
        fetchUserProfile(); // Re-fetch all data to refresh methods list and profile
      } catch (err) {
        console.error("Error adding payout method:", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to add payout method."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [getToken, navigate, newMethodForm, fetchUserProfile, toast]
  ); // Added toast as dependency

  const handleSetDefaultPayoutMethod = useCallback(
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
          `${baseURL}/api/supplier/payout-methods/${methodId}`,
          { isDefault: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.status === 200)
          throw new Error(res.data.message || "Failed to set as default.");
        toast.success("Payout method set as default!");
        fetchUserProfile(); // Re-fetch all data to refresh
      } catch (err) {
        console.error("Error setting default payout method:", err);
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

  const handleDeletePayoutMethod = useCallback(
    async (methodId, type) => {
      if (
        !window.confirm(
          `Are you sure you want to delete this ${type} payout method?`
        )
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
          `${baseURL}/api/supplier/payout-methods/${methodId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.status === 200)
          throw new Error(
            res.data.message || "Failed to delete payout method."
          );
        toast.success("Payout method deleted!");
        fetchUserProfile(); // Re-fetch all data to refresh
      } catch (err) {
        console.error("Error deleting payout method:", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete payout method."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [getToken, navigate, fetchUserProfile, toast]
  );

  // --- 3. ALL useEffect HOOKS LAST (after useCallback hooks) ---
  useEffect(() => {
    fetchUserProfile(); // Initial fetch on component mount
  }, [fetchUserProfile]); // fetchUserProfile is a useCallback, so it's stable

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading profile settings...</p>
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
    navigate("/login"); // Should ideally not be reached if error is handled
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
          ⚙️ Supplier Settings
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
            <MapPin size={18} className="mr-2" /> Location
          </button>
          {/* NEW: Payment Settings Tab Button */}
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
          {/* Add more tabs as needed: Business Details, Notifications, etc. */}
        </div>

        {/* Content for active tab */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">
              Personal Information
            </h2>
            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              {/* Profile Picture Section */}
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500 dark:border-blue-400 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {profilePictureFile ? ( // Show preview of newly selected file
                    <img
                      src={URL.createObjectURL(profilePictureFile)}
                      alt="New Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : currentProfileImageUrl ? ( // Show current image from backend
                    <img
                      src={currentProfileImageUrl}
                      alt="Current Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Fallback to generic User icon
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
                      onChange={handleProfilePictureFileChange} // Ensure this handler is defined in SettingsPage
                      className="hidden"
                      disabled={submitting}
                    />
                  </label>
                </div>
                {profilePictureFile && ( // Display file name if a new file is selected
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {profilePictureFile.name} selected.
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max {MAX_PROFILE_IMAGE_SIZE_MB}MB. JPG, PNG, GIF.
                </p>{" "}
                {/* Ensure MAX_IMAGE_SIZE_MB is defined at the top of SettingsPage */}
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
              Shop/Delivery Location
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
                  placeholder="Enter your full shop address..."
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
            {/* Google Map Integration */}
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

        {/* NEW: Payment Settings Tab Content */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">
              Payout Methods
            </h2>
            {/* Add New Payout Method Form */}
            <form
              onSubmit={handleAddPayoutMethod}
              className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Add/Update Method
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Method Type
                </label>
                <select
                  name="type"
                  value={newMethodForm.type}
                  onChange={handleNewMethodFormChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  disabled={submitting}
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              {newMethodForm.type === "BANK_TRANSFER" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={newMethodForm.details.accountNumber}
                      onChange={handleNewMethodFormChange}
                      required
                      disabled={submitting}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={newMethodForm.details.ifscCode}
                      onChange={handleNewMethodFormChange}
                      required
                      disabled={submitting}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={newMethodForm.details.bankName}
                      onChange={handleNewMethodFormChange}
                      required
                      disabled={submitting}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={newMethodForm.details.accountHolderName}
                      onChange={handleNewMethodFormChange}
                      required
                      disabled={submitting}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={newMethodForm.details.upiId}
                    onChange={handleNewMethodFormChange}
                    required
                    disabled={submitting}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefaultNewMethod"
                  checked={newMethodForm.isDefault}
                  onChange={handleNewMethodFormChange}
                  disabled={submitting}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="isDefaultNewMethod"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Set as default payout method
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Add Payout Method"}
              </button>
            </form>

            {/* Existing Payout Methods List */}
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white mt-8">
              Existing Payout Methods ({payoutMethods.length})
            </h3>
            {payoutMethods.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No payout methods added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {payoutMethods.map((method) => (
                  <div
                    key={method._id}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div className="flex-grow">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {method.type === "BANK_TRANSFER"
                          ? "Bank Transfer"
                          : "UPI"}
                      </p>
                      {method.type === "BANK_TRANSFER" ? (
                        <>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Account: ****
                            {method.details.accountNumber.slice(-4)}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            IFSC: {method.details.ifscCode}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Bank: {method.details.bankName}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Holder: {method.details.accountHolderName}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          UPI ID: {method.details.upiId}
                        </p>
                      )}
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
                            handleSetDefaultPayoutMethod(method._id)
                          }
                          disabled={submitting}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeletePayoutMethod(method._id, method.type)
                        }
                        disabled={submitting}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                      >
                        Delete
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
                  loading ||
                  !passwordInfo.newPassword ||
                  passwordInfo.newPassword.length < 6 ||
                  passwordInfo.newPassword !== passwordInfo.confirmNewPassword
                }
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        )}

        {/* Add content for other tabs here */}
      </div>
    </div>
  );
};

export default SettingsPage;
