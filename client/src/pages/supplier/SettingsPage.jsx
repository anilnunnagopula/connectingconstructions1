// src/pages/Supplier/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building, Lock, Bell, MapPin } from "lucide-react"; // Icons for sections

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

const SettingsPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null); // Full user profile from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal"); // State to manage active tab

  // Form states for different sections
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
  });
  // MODIFIED: locationInfo now includes lat and lng for map integration
  const [locationInfo, setLocationInfo] = useState({
    address: "", // Text address
    lat: null, // Latitude
    lng: null, // Longitude
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Google Maps Loader
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY, // Use the correct env var
    libraries: googleMapsLibraries,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      const storedUser = localStorage.getItem("user");
      let currentUser = null;

      if (storedUser && storedUser !== "undefined") {
        currentUser = JSON.parse(storedUser);
      }

      if (
        !currentUser ||
        !currentUser.token ||
        currentUser.role !== "supplier"
      ) {
        setError("Unauthorized: Please log in as a supplier.");
        setLoading(false);
        toast.error("Please log in as a supplier to manage your profile.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${baseURL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const fetchedUser = response.data;
        setUserProfile(fetchedUser);

        // Populate form states with fetched data
        setPersonalInfo({
          name: fetchedUser.name || "",
          username: fetchedUser.username || "",
          email: fetchedUser.email || "",
          phoneNumber: fetchedUser.phoneNumber || "",
        });
        // MODIFIED: Populate locationInfo with address, lat, and lng
        setLocationInfo({
          address: fetchedUser.address || "",
          lat: fetchedUser.location?.lat || null, // Assuming backend provides location as an object with lat/lng
          lng: fetchedUser.location?.lng || null, // If not, you'll need to adapt this or store just text.
        });

        toast.success("Profile data loaded!");
      } catch (err) {
        console.error("Error fetching user profile:", err);
        let errorMessage = "Failed to load profile data.";
        if (err.response) {
          errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            errorMessage;
          if (err.response.status === 401 || err.response.status === 403) {
            localStorage.removeItem("user");
            navigate("/login");
            toast.error(
              "Session expired or unauthorized. Please log in again."
            );
          }
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handlers for updating different sections
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationInfoChange = (e) => {
    const { name, value } = e.target;
    setLocationInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInfoChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Generic save handler for profile updates
  const handleSaveProfile = async (sectionData) => {
    setLoading(true);
    try {
      const token =
        userProfile.token || JSON.parse(localStorage.getItem("user")).token;

      // Prepare the data to send:
      // Always include essential required fields from the current userProfile state
      const dataToSend = {
        name: userProfile.name,
        username: userProfile.username,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber, // Include current phone number
        address: userProfile.address, // Include current address
        // If using a structured location object:
        // location: userProfile.location,

        // Overlay with section-specific updates
        ...sectionData,
      };

      const res = await axios.put(`${baseURL}/api/auth/profile`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      let errorMessage = "Failed to save changes.";
      if (err.response) {
        if (
          err.response.status === 400 &&
          err.response.data.error &&
          err.response.data.error.includes("validation failed")
        ) {
          errorMessage = err.response.data.details
            ? `Validation failed: ${err.response.data.details.join(", ")}`
            : err.response.data.error;
        } else {
          errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            errorMessage;
        }
        if (err.response.status === 401 || err.response.status === 403) {
          toast.error("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    if (!personalInfo.name || !personalInfo.username || !personalInfo.email) {
      toast.error("Name, username, and email are required.");
      return;
    }
    await handleSaveProfile(personalInfo); // Sending name, username, email, phoneNumber
  };

  const handleSaveLocationInfo = async (e) => {
    e.preventDefault();
    if (!locationInfo.address.trim()) {
      toast.error("Address cannot be empty.");
      return;
    }
    // MODIFIED: Send address, lat, and lng if available
    await handleSaveProfile({
      address: locationInfo.address,
      // If you want to store lat/lng in a nested object 'location' on the User model:
      location: {
        // This structure depends on your User model and backend updateUserProfile
        lat: locationInfo.lat,
        lng: locationInfo.lng,
      },
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
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
  };

  // MODIFIED: handleAutoFetchLocation from AddProduct.jsx
  const handleAutoFetchLocation = async () => {
    setLoading(true); // This loading state is for the overall form, not just geocoding
    toast("📍 Fetching your location...", { icon: "⏳" });

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      setLoading(false);
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
              lat: latitude, // Store lat
              lng: longitude, // Store lng
            }));
            toast.success("Location fetched!");
          } else {
            toast.error("Could not determine address from coordinates.");
          }
        } catch (err) {
          console.error("Failed to reverse geocode location via proxy:", err);
          toast.error("Failed to fetch location. Try again.");
        } finally {
          setLoading(false);
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
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // NEW: handleMapClick from AddProduct.jsx
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLocationInfo((prev) => ({
      ...prev,
      lat: lat,
      lng: lng,
      address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, // Update text field
    }));
    toast.success("Location updated from map click!");
  };

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
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
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
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Personal Info"}
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoFetchLocation}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
              >
                {loading ? "Fetching..." : "Auto Fetch Current Location"}
              </button>
              <button
                type="submit"
                disabled={loading || !locationInfo.address.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-semibold ml-4 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Location"}
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
