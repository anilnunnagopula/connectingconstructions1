// src/pages/Supplier/LocationPage.jsx (Manage Multiple Shop Locations)
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, MapPin, PlusCircle, Edit3, Trash2 } from "lucide-react"; // Icons

const googleMapsLibraries = ["places", "maps"];

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

const LocationPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Authenticated user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [shopLocations, setShopLocations] = useState([]); // State to hold all shop locations for the supplier
  const [currentLocationForm, setCurrentLocationForm] = useState({
    // State for the add/edit form
    _id: null, // Will be populated if editing an existing location
    name: "", // E.g., "Main Warehouse", "Showroom Hyderabad"
    address: "",
    lat: null,
    lng: null,
  });
  const [isEditing, setIsEditing] = useState(false); // Flag to differentiate add/edit mode

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: googleMapsLibraries,
  });

  // Effect to load user data and shop locations on mount
  useEffect(() => {
    const fetchShopLocations = async () => {
      setLoading(true);
      setMessage("Loading shop locations...");
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
        toast.error("Please log in as a supplier to manage shop locations.");
        navigate("/login");
        return;
      }
      setUser(currentUser);

      try {
        // Fetch all shop locations for the current supplier
        // NEW BACKEND ENDPOINT REQUIRED: GET /api/supplier/shop-locations
        const response = await axios.get(
          `${baseURL}/api/supplier/shop-locations`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setShopLocations(response.data);
        setMessage("Shop locations loaded.");
        toast.success("Shop locations loaded!");
      } catch (err) {
        console.error("Error fetching shop locations:", err);
        let errorMessage = "Failed to load shop locations.";
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

    fetchShopLocations();
  }, [navigate]);

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-fetch current location for the form
  const handleAutoFetchLocation = async () => {
    if (!user) return; // Should be handled by initial check, but safety
    setLoading(true); // Set global loading
    toast("📍 Fetching current location...", { icon: "⏳" });

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
            setCurrentLocationForm((prev) => ({
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

  // Handle map click to set location
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setCurrentLocationForm((prev) => ({
      ...prev,
      lat: lat,
      lng: lng,
      address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, // Update text field
    }));
    toast.success("Location updated from map click!");
  };

  // Function to handle adding/updating a shop location
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      toast.error("Authentication required.");
      navigate("/login");
      return;
    }
    if (
      !currentLocationForm.name.trim() ||
      !currentLocationForm.address.trim()
    ) {
      toast.error("Shop name and address are required.");
      return;
    }

    setLoading(true);
    setMessage(
      isEditing ? "Updating shop location..." : "Adding new shop location..."
    );
    setMessageType("info");

    try {
      let response;
      if (isEditing && currentLocationForm._id) {
        // UPDATE existing location
        // NEW BACKEND ENDPOINT REQUIRED: PUT /api/supplier/shop-locations/:id
        response = await axios.put(
          `${baseURL}/api/supplier/shop-locations/${currentLocationForm._id}`,
          {
            name: currentLocationForm.name,
            address: currentLocationForm.address,
            lat: currentLocationForm.lat,
            lng: currentLocationForm.lng,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        // ADD new location
        // NEW BACKEND ENDPOINT REQUIRED: POST /api/supplier/shop-locations
        response = await axios.post(
          `${baseURL}/api/supplier/shop-locations`,
          {
            name: currentLocationForm.name,
            address: currentLocationForm.address,
            lat: currentLocationForm.lat,
            lng: currentLocationForm.lng,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }

      toast.success(
        response.data.message || "Shop location saved successfully!"
      );
      setMessage(response.data.message || "Shop location saved!");
      setMessageType("success");

      // Refresh the list of locations
      // NEW BACKEND ENDPOINT REQUIRED: GET /api/supplier/shop-locations (or reuse if it already provides all)
      const updatedLocationsResponse = await axios.get(
        `${baseURL}/api/supplier/shop-locations`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setShopLocations(updatedLocationsResponse.data);

      // Reset form
      setCurrentLocationForm({
        _id: null,
        name: "",
        address: "",
        lat: null,
        lng: null,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving shop location:", err);
      let errorMessage = "Failed to save shop location.";
      if (err.response) {
        errorMessage =
          err.response.data.message || err.response.data.error || errorMessage;
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.removeItem("user");
          navigate("/login");
          toast.error("Session expired or unauthorized. Please log in again.");
        }
      }
      setMessage(`❌ ${errorMessage}`);
      setMessageType("error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to set form for editing
  const handleEditClick = (locationToEdit) => {
    setCurrentLocationForm({
      _id: locationToEdit._id,
      name: locationToEdit.name,
      address: locationToEdit.address,
      lat: locationToEdit.lat,
      lng: locationToEdit.lng,
    });
    setIsEditing(true);
    setMessage(""); // Clear messages
    setMessageType("");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top for easy editing
  };

  // Function to delete a shop location
  const handleDeleteLocation = async (locationId) => {
    if (
      !window.confirm("Are you sure you want to delete this shop location?")
    ) {
      return;
    }
    if (!user || !user.token) {
      toast.error("Authentication required.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setMessage("Deleting shop location...");
    setMessageType("info");

    try {
      // NEW BACKEND ENDPOINT REQUIRED: DELETE /api/supplier/shop-locations/:id
      await axios.delete(
        `${baseURL}/api/supplier/shop-locations/${locationId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      toast.success("Shop location deleted successfully!");
      setMessage("Shop location deleted!");
      setMessageType("success");

      // Update state to remove deleted location
      setShopLocations((prev) => prev.filter((loc) => loc._id !== locationId));
    } catch (err) {
      console.error("Error deleting shop location:", err);
      let errorMessage = "Failed to delete shop location.";
      if (err.response) {
        errorMessage =
          err.response.data.message || err.response.data.error || errorMessage;
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.removeItem("user");
          navigate("/login");
          toast.error("Session expired or unauthorized. Please log in again.");
        }
      }
      setMessage(`❌ ${errorMessage}`);
      setMessageType("error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial loading state
  if (loading && !shopLocations.length) {
    // Only show full page loading if no data yet
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading shop locations...</p>
      </div>
    );
  }

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 p-4 rounded-lg">
          <p className="text-xl font-semibold mb-2">Error Loading Locations</p>
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

  // Unauthorized message if user is not a supplier
  if (!user || user.role !== "supplier") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          ⚠️ Unauthorized Access
        </h2>
        <p className="mb-6 text-center max-w-md">
          You do not have permission to view this page. Please log in as a
          supplier.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          🔐 Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          📍 Manage Your Shop Locations
        </h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-center ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : messageType === "info"
                ? "bg-blue-100 text-blue-700"
                : messageType === "warning"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form to Add/Edit a Location */}
        <form
          onSubmit={handleSaveLocation}
          className="space-y-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg mb-8"
        >
          <h2 className="text-xl font-bold dark:text-white mb-4">
            {isEditing ? "Edit Shop Location" : "Add New Shop Location"}
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Shop Name
            </label>
            <input
              type="text"
              name="name"
              value={currentLocationForm.name}
              onChange={handleChange}
              placeholder="e.g., Main Warehouse, Downtown Showroom"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Full Address
            </label>
            <textarea
              rows="3"
              name="address"
              value={currentLocationForm.address}
              onChange={handleChange}
              placeholder="Enter full address or use auto-fetch/map"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white resize-none"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAutoFetchLocation}
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50 flex items-center justify-center"
            >
              <MapPin size={18} className="mr-2" />{" "}
              {loading && message.includes("Fetching")
                ? "Fetching..."
                : "Auto Fetch Current Location"}
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !currentLocationForm.name.trim() ||
                !currentLocationForm.address.trim()
              }
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50 flex items-center justify-center"
            >
              <PlusCircle size={18} className="mr-2" />{" "}
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Location"
                : "Add Location"}
            </button>
          </div>

          {isLoaded && (
            <div className="mt-4">
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                📌 Mark Location on Map (Click to set)
              </label>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={
                  currentLocationForm.lat && currentLocationForm.lng
                    ? {
                        lat: currentLocationForm.lat,
                        lng: currentLocationForm.lng,
                      }
                    : defaultCenter
                }
                zoom={
                  currentLocationForm.lat && currentLocationForm.lng ? 15 : 12
                }
                onClick={handleMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {currentLocationForm.lat && currentLocationForm.lng && (
                  <Marker
                    position={{
                      lat: currentLocationForm.lat,
                      lng: currentLocationForm.lng,
                    }}
                  />
                )}
              </GoogleMap>
              {currentLocationForm.lat && currentLocationForm.lng && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Selected Coordinates: Lat:{" "}
                  {currentLocationForm.lat.toFixed(4)}, Lng:{" "}
                  {currentLocationForm.lng.toFixed(4)}
                </p>
              )}
            </div>
          )}
          {loadError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              Error loading map: {loadError.message}. Please check your Google
              Maps API key.
            </div>
          )}
        </form>

        {/* List of Existing Locations */}
        <h2 className="text-2xl font-bold dark:text-white mb-4">
          Your Existing Shop Locations
        </h2>
        {shopLocations.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No shop locations added yet. Use the form above to add your first
            one!
          </p>
        ) : (
          <div className="space-y-4">
            {shopLocations.map((loc) => (
              <div
                key={loc._id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold dark:text-white">
                    {loc.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {loc.address}
                  </p>
                  {loc.lat && loc.lng && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => handleEditClick(loc)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    title="Edit Location"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteLocation(loc._id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    title="Delete Location"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
