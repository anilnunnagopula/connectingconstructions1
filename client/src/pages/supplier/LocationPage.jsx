import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Make sure you have react-hot-toast installed

// Use process.env.REACT_APP_API_URL for the base URL
const baseURL = process.env.REACT_APP_API_URL;

const LocationPage = () => {
  // State for the authenticated user's data (from localStorage and API)
  // This will hold the full user object including _id, role, token, and address
  const [user, setUser] = useState(null);
  // State for the location input field (text content of the address)
  const [location, setLocation] = useState("");
  // State for loading indicators during API calls
  const [loading, setLoading] = useState(true); // Set to true initially while fetching user data
  // State for displaying messages to the user (e.g., fetching status, errors, success)
  const [message, setMessage] = useState("");

  // Effect to load user data from localStorage and fetch current profile from backend on mount
  useEffect(() => {
    const loadUserDataAndFetchProfile = async () => {
      setLoading(true);
      setMessage("Loading user profile...");

      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          const parsedUser = JSON.parse(storedUser);

          if (
            !parsedUser ||
            !parsedUser.token ||
            !parsedUser._id ||
            parsedUser.role !== "supplier" // <--- This is the most likely culprit based on the error message
          ) {
            setMessage(
              "Please log in as a supplier to manage your shop location."
            );
            localStorage.removeItem("user");
            setUser(null); // <--- This sets user to null again
            setLoading(false);
            toast.error("Unauthorized. Please log in as a supplier.");
            return; // <--- This stops the function. The API call is never made.
          }

          // If we reach here, parsedUser *should* be a supplier with token and _id
          setUser(parsedUser); // Set user state immediately from localStorage

          // Now, fetch the most up-to-date user profile from the backend
          const response = await axios.get(`${baseURL}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
            },
          });

          const fetchedUser = response.data;
          setUser(fetchedUser); // Update user state with fresh data
          setMessage("User profile loaded successfully.");
          toast.success("Profile data refreshed!");

          if (fetchedUser.address) {
            setLocation(fetchedUser.address);
          } else {
            setLocation("");
          }
        } else {
          setMessage("Please log in to manage your location.");
          setUser(null);
        }
      } catch (error) {
        // ... error handling
      } finally {
        setLoading(false);
      }
    };

    loadUserDataAndFetchProfile();
  }, []);
  // Function to handle automatic location fetching using Geolocation API
  const handleAutoFetch = async () => {
    if (!user || user.role !== "supplier") {
      // Ensure user is logged in and is a supplier
      setMessage("❌ Please log in as a supplier to auto-fetch location.");
      toast.error("Unauthorized access.");
      return;
    }

    setLoading(true); // Set loading to true
    setMessage("📍 Fetching your location..."); // Inform the user

    if (!navigator.geolocation) {
      setMessage("❌ Geolocation is not supported by your browser.");
      setLoading(false);
      toast.error("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Call your backend proxy for reverse geocoding
          const response = await axios.get(
            `${baseURL}/geocode-proxy?lat=${latitude}&lon=${longitude}`
          );

          const address = response.data.display_name;
          console.log("Geocoded address received:", address); // Debugging line
          if (address) {
            setLocation(address); // Set the fetched address to the location state
            setMessage("✅ Location fetched successfully!");
            toast.success("Location fetched!");
          } else {
            setMessage("❌ Could not determine address from coordinates.");
            toast.error("Address not found.");
          }
        } catch (err) {
          console.error("Failed to reverse geocode location via proxy:", err);
          let errorMessage =
            "❌ Failed to reverse geocode location. Please try again.";
          if (err.response && err.response.data && err.response.data.message) {
            errorMessage = `❌ ${err.response.data.message}`;
          }
          setMessage(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false); // Reset loading state
        }
      },
      (err) => {
        // Handle errors during geolocation retrieval
        console.error("Geolocation error:", err);
        let errorMessage = "❌ Failed to get location.";
        if (err.code === err.PERMISSION_DENIED) {
          errorMessage =
            "❌ Location access denied. Please enable location services.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMessage = "❌ Location information is unavailable.";
        } else if (err.code === err.TIMEOUT) {
          errorMessage = "❌ The request to get user location timed out.";
        }
        setMessage(errorMessage);
        setLoading(false);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Function to handle saving the location to the backend
  const handleSave = async () => {
    // Double-check user and role before saving (should ideally be handled by button disabled state)
    if (!user || user.role !== "supplier" || !user._id || !user.token) {
      setMessage("Cannot save: Please log in as a supplier first.");
      toast.error("Login as supplier required.");
      return;
    }

    if (location.trim() === "") {
      setMessage("Location cannot be empty.");
      toast.error("Location is required to save.");
      return;
    }

    setLoading(true);
    setMessage("Saving your location...");

    try {
      // Make a PUT request to update the User's profile (address field)
      const res = await axios.put(
        `${baseURL}/api/auth/profile`, // Use the user profile update endpoint
        { address: location }, // Send 'address' field, as per your User model and authController
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Send the JWT token
          },
        }
      );

      console.log("📦 Location saved! Response:", res.data);
      toast.success("📍 Location updated successfully!");
      setMessage("Location saved!");

      // Update the user object in state and localStorage with the fresh data from the backend
      // This includes the new token if one was issued.
      const updatedUser = res.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("❌ Failed to save location:", err);
      let errorMessage = "Failed to update location.";
      if (err.response) {
        errorMessage =
          err.response.data.message || err.response.data.error || errorMessage;
        if (err.response.status === 401 || err.response.status === 403) {
          toast.error("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("user"); // Clear token on auth error
          setUser(null);
        }
      } else if (err.request) {
        errorMessage = "Network error: Server did not respond.";
      } else {
        errorMessage = err.message;
      }
      setMessage(`❌ ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Render a loading spinner until initial user data and profile fetch completes
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p className="text-lg">Loading user data...</p>
      </div>
    );
  }

  // Determine if the "Save Location" button should be enabled
  // It's enabled if user is logged in as a supplier AND location text is not empty AND not currently loading
  const isSaveEnabled =
    user && user.role === "supplier" && location.trim() !== "" && !loading;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4 sm:p-6 font-inter">
      <div className="bg-white dark:bg-gray-800 shadow-xl p-6 sm:p-8 rounded-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700 transform transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          📍 Set Your Shop Location
        </h2>

        {/* Message to prompt login if not a supplier */}
        {(!user || user.role !== "supplier") && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 rounded text-red-700 dark:text-red-300">
            Please log in as a **Supplier** to manage your shop location.
          </div>
        )}

        <textarea
          rows="4"
          placeholder="Enter your full address or auto-fetch it..."
          className="w-full p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4 resize-none
                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none
                                            hover:border-blue-400 dark:hover:border-blue-600 border border-transparent transition duration-200 ease-in-out shadow-sm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Shop location address"
          // Disable input if not a supplier or if loading
          disabled={!user || user.role !== "supplier" || loading}
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <button
            onClick={handleAutoFetch}
            // Disable auto-fetch if not a supplier or if already loading
            disabled={!user || user.role !== "supplier" || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg
                                                 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                                                 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            aria-live="polite"
          >
            {loading && message.includes("Fetching") ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "🌐"
            )}
            Auto Fetch Location
          </button>

          <button
            onClick={handleSave}
            disabled={!isSaveEnabled} // Use the derived state for enabling/disabling
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg
                                                 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                                                 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            {loading && message.includes("Saving") ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "💾"
            )}
            Save Location
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 p-3 rounded-lg text-center font-medium
                                         ${
                                           message.startsWith("✅")
                                             ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                             : message.startsWith("❌")
                                             ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                             : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                         }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
