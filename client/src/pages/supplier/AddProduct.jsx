import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import categories from "../../utils/Categories"; 

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

// Define constants for image limits
const MAX_IMAGES = 6; // Allow up to 6 images
const MAX_IMAGE_SIZE_MB = 5; // Max 5MB per image
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    userKeywords: "",
    price: "",
    quantity: "",
    availability: true,
    locationText: "",
    latLng: null,
    contact: {
      mobile: "",
      email: "",
      address: "",
    },
    imageFiles: [], // Now an array to hold File objects
    imageUrls: [], // Now an array to hold Cloudinary URLs
  });
  const [loading, setLoading] = useState(false); // For form submission
  const [aiLoading, setAiLoading] = useState(false); // For AI description generation
  const [message, setMessage] = useState(""); // User feedback message
  const [messageType, setMessageType] = useState(""); // Type of message (success, error, info)
  const [showKeywordsInput, setShowKeywordsInput] = useState(false); // State for conditional rendering of keywords input

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: googleMapsLibraries,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };

  // --- MODIFICATION START: Multi-Image Handling & Size Limit ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newMessages = [];

    // Reset current image states if new files are selected from input
    // This assumes replacing all images. If you want to add, adjust logic.
    setProduct((prev) => ({
      ...prev,
      imageFiles: [],
      imageUrls: [],
    }));

    if (files.length > MAX_IMAGES) {
      newMessages.push(
        `You can only upload a maximum of ${MAX_IMAGES} images.`
      );
      setMessageType("error");
      setMessage(newMessages.join(" "));
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        newMessages.push(
          `Image "${file.name}" is too large (max ${MAX_IMAGE_SIZE_MB}MB).`
        );
        setMessageType("error");
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setProduct((prev) => ({
        ...prev,
        imageFiles: validFiles, // Store valid File objects
      }));
      if (newMessages.length === 0) {
        setMessage("Images selected for upload. Click Add Product to upload.");
        setMessageType("info");
      } else {
        setMessage(newMessages.join(" ") + " Some images were too large.");
      }
    } else if (newMessages.length > 0) {
      setMessage(newMessages.join(" "));
    } else {
      setMessage("");
      setMessageType("");
    }
  };

  // Function to upload an array of images to Cloudinary
  const uploadImagesToCloudinary = async (files) => {
    if (!files || files.length === 0) return [];

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    console.log(
      "Cloudinary Cloud Name:",
      process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    );
    console.log(
      "Cloudinary Upload Preset:",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    console.log("All envs:", process.env);


    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary credentials not set in environment variables.");
      setMessage("Image upload failed: Cloudinary not configured.");
      setMessageType("error");
      return [];
    }

    const uploadedUrls = [];
    let uploadSuccess = true;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (response.ok && data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          uploadSuccess = false;
          setMessage(
            `Image "${file.name}" upload failed: ${
              data.error ? data.error.message : "Unknown Cloudinary error."
            }`
          );
          setMessageType("error");
          console.error("Cloudinary upload error for", file.name, ":", data);
          // Continue trying to upload other images but mark overall failure
        }
      } catch (err) {
        uploadSuccess = false;
        setMessage(`Image "${file.name}" upload failed due to network error.`);
        setMessageType("error");
        console.error("Cloudinary fetch error for", file.name, ":", err);
        // Continue trying to upload other images but mark overall failure
      }
    }

    if (uploadSuccess && uploadedUrls.length === files.length) {
      setMessage("All images uploaded to Cloudinary successfully!");
      setMessageType("success");
    } else if (uploadedUrls.length > 0) {
      setMessage(
        "Some images uploaded, but others failed. Please check console for details."
      );
      setMessageType("warning");
    }

    return uploadedUrls;
  };
  // --- MODIFICATION END: Multi-Image Handling & Size Limit ---

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setMessage("Fetching current location...");
      setMessageType("info");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          if (latitude && longitude) {
            setProduct((prev) => ({
              ...prev,
              latLng: { lat: latitude, lng: longitude },
              locationText: `Lat: ${latitude.toFixed(
                4
              )}, Lng: ${longitude.toFixed(4)}`,
            }));
            setMessage("Location fetched successfully!");
            setMessageType("success");
          } else {
            setMessage("Could not fetch valid coordinates.");
            setMessageType("error");
          }
        },
        (error) => {
          setMessage(
            "Failed to get location. Please allow location access in your browser settings."
          );
          setMessageType("error");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setMessage("Geolocation is not supported by this browser.");
      setMessageType("error");
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setProduct((prev) => ({
      ...prev,
      latLng: { lat, lng },
      locationText: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
    }));
    setMessage("Location updated from map click!");
    setMessageType("success");
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleGenerateDescription = async () => {
    setShowKeywordsInput(true);
    setAiLoading(true);
    setMessage("");
    setMessageType("");

    if (!product.name && !product.category && !product.userKeywords) {
      setMessage(
        "Please enter a Product Name, select a Category, or provide Keywords to generate a description."
      );
      setMessageType("error");
      setAiLoading(false);
      return;
    }

    let prompt = `Generate a concise and appealing product description for a construction material.`;

    if (product.name) {
      prompt += `\nProduct Name: ${product.name}`;
    }
    if (product.category) {
      prompt += `\nCategory: ${product.category}`;
    }
    if (product.userKeywords) {
      prompt += `\nKey Features/Keywords: ${product.userKeywords}`;
    }

    prompt += `\n\nEnsure the description is engaging, highlights benefits, and directly incorporates the provided keywords/features. Keep it under 100 words.`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      console.log("Sending prompt to Gemini AI:", prompt);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("AI generation raw result:", result);

      if (response.ok) {
        if (
          result.candidates &&
          result.candidates.length > 0 &&
          result.candidates[0].content &&
          result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0
        ) {
          const generatedText = result.candidates[0].content.parts[0].text;
          setProduct((prev) => ({ ...prev, description: generatedText }));
          setMessage("Description generated successfully!");
          setMessageType("success");
        } else {
          setMessage(
            "AI could not generate a suitable description. Please try modifying your input or try again."
          );
          setMessageType("error");
          console.error(
            "AI generation response structure unexpected or empty content:",
            result
          );
        }
      } else {
        const errorMessage =
          result.error && result.error.message
            ? result.error.message
            : "Unknown error from AI API.";
        setMessage(`Failed to generate description: ${errorMessage}`);
        setMessageType("error");
        console.error("AI API HTTP error:", response.status, result);
      }
    } catch (err) {
      console.error("AI generation network/fetch error:", err);
      setMessage(
        "Error connecting to AI service. Please check network or try again later."
      );
      setMessageType("error");
    } finally {
      setAiLoading(false);
    }
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    if (
      !product.name ||
      !product.category ||
      !product.description ||
      !product.price ||
      !product.quantity ||
      !product.locationText ||
      !product.contact.mobile ||
      !product.contact.email ||
      !product.contact.address
    ) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    let supplierId = null;
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        supplierId = user.email; // Using email as placeholder ID
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }

    if (!supplierId) {
      setMessage("Supplier not logged in. Please log in to add products.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    // --- MODIFICATION START: Multi-Image Upload Logic ---
    let finalImageUrls = [...product.imageUrls]; // Start with any existing uploaded URLs

    // Only upload new files if they are present
    if (product.imageFiles.length > 0) {
      setMessage("Uploading images to Cloudinary...");
      setMessageType("info");
      const uploadedUrls = await uploadImagesToCloudinary(product.imageFiles);

      if (uploadedUrls.length === 0 && product.imageFiles.length > 0) {
        // All new image uploads failed, and there were images to upload
        setMessage("All image uploads failed. Product not added.");
        setMessageType("error");
        setLoading(false);
        return;
      }
      finalImageUrls = uploadedUrls; // Replace with newly uploaded URLs
      setProduct((prev) => ({ ...prev, imageUrls: uploadedUrls })); // Update state for potential re-submission/preview
    } else if (product.imageUrls.length === 0) {
      // If no new files selected AND no existing URLs, ensure finalImageUrls is empty
      finalImageUrls = [];
    }

    // You might want to remove this validation if images are optional
    if (finalImageUrls.length === 0) {
      setMessage("Please upload at least one image for the product.");
      setMessageType("error");
      setLoading(false);
      return;
    }
    // --- MODIFICATION END: Multi-Image Upload Logic ---

    // Prepare product data for submission
    const productData = {
      supplierId: supplierId,
      name: product.name,
      category: product.category,
      description: product.description,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
      availability: product.availability,
      location: {
        text: product.locationText,
        lat: product.latLng ? product.latLng.lat : null,
        lng: product.latLng ? product.latLng.lng : null,
      },
      contact: product.contact,
      // --- MODIFICATION START: Sending an array of URLs ---
      imageUrls: finalImageUrls, // Send the array of Cloudinary URLs to backend
      // --- MODIFICATION END: Sending an array of URLs ---
    };

    try {
      // --- MODIFICATION START: Simplified API URL ---
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/products`;
      // --- MODIFICATION END: Simplified API URL ---

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product.");
      }

      setMessage("Product added successfully!");
      setMessageType("success");
      // Clear form after successful submission
      setProduct({
        name: "",
        category: "",
        description: "",
        userKeywords: "",
        price: "",
        quantity: "",
        availability: true,
        locationText: "",
        latLng: null,
        contact: { mobile: "", email: "", address: "" },
        imageFiles: [], // Clear files
        imageUrls: [], // Clear URLs
      });
      setShowKeywordsInput(false);
    } catch (err) {
      console.error("Error adding product:", err);
      setMessage(
        err.message || "An unexpected error occurred. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-md">
          Error loading Google Maps: {loadError.message}
          <p>
            Please ensure your `REACT_APP_Maps_API_KEY` is correct and has the
            necessary APIs enabled (Maps JavaScript API, Geocoding API).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-lg mt-10 mb-10 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📦 Add New Product
      </h2>

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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
            Product Details
          </h3>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Product Name
          </label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block font-semibold text-gray-700 dark:text-gray-300">
              Product Description
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
              title="Auto-Generate with AI"
              disabled={aiLoading}
            >
              {aiLoading ? (
                <svg
                  className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400"
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
                <>
                  <span className="text-lg">⚙️</span> Use AI to Generate{" "}
                </>
              )}
            </button>
          </div>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Leave empty and let AI generate if needed 🤖"
            required
          ></textarea>
        </div>

        {showKeywordsInput && (
          <div className="md:col-span-2 mt-4">
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Key Features / Keywords (for AI generation)
            </label>
            <input
              type="text"
              name="userKeywords"
              value={product.userKeywords}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 'high strength, fast setting, waterproof'"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate keywords with commas for best results.
            </p>
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Price (₹)
          </label>
          <input
            type="text"
            name="price"
            placeholder="eg: 350/bag 1000 for each cement bag"
            value={product.price}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Quantity Available
          </label>
          <input
            type="text"
            name="quantity"
            placeholder="eg: 500 cement bags available"
            value={product.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Availability
          </label>
          <select
            name="availability"
            value={product.availability ? "Available" : "Not Available"}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                availability: e.target.value === "Available",
              }))
            }
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option>Available</option>
            <option>Currently Not Available</option>
          </select>
        </div>

        <div className="md:col-span-2 mt-4">
          <h3 className="text-xl font-semibold mb-1 border-b pb-1 border-gray-200 dark:border-gray-700">
            Location Details
          </h3>
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block font-semibold text-gray-700 dark:text-gray-300">
              Enter Location
            </label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
              title="Use Current Location"
            >
              <span className="text-lg">📍</span> Use Current Location{" "}
            </button>
          </div>
          <input
            name="locationText"
            value={product.locationText}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, locationText: e.target.value }))
            }
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Mangalpally, Hyderabad"
            required
          />
        </div>

        {isLoaded && (
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              📌 Mark Location on Map (Click to set)
            </label>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={product.latLng || defaultCenter}
              zoom={product.latLng ? 15 : 12}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {product.latLng && <Marker position={product.latLng} />}
            </GoogleMap>
            {product.latLng && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Selected Coordinates: Lat: {product.latLng.lat.toFixed(4)}, Lng:{" "}
                {product.latLng.lng.toFixed(4)}
              </p>
            )}
          </div>
        )}

        <div className="md:col-span-2 mt-4">
          <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
            Contact Details
          </h3>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Mobile
          </label>
          <input
            name="mobile"
            type="tel"
            value={product.contact.mobile}
            onChange={handleContactChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={product.contact.email}
            onChange={handleContactChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Address
          </label>
          <textarea
            name="address"
            value={product.contact.address}
            onChange={handleContactChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            required
          />
        </div>

        {/* Product Image Section (for multiple images) */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
            Product Images
          </h3>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Upload Images (Max {MAX_IMAGES} images, {MAX_IMAGE_SIZE_MB}MB each)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple // Allow multiple file selection
            onChange={handleImageChange}
            className="w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {/* Display previews for all selected images */}
          {(product.imageFiles.length > 0 || product.imageUrls.length > 0) && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Display already uploaded images */}
              {product.imageUrls.map((url, index) => (
                <div
                  key={`uploaded-${index}`}
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-1 flex justify-center items-center h-32 overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Product Image ${index + 1}`}
                    className="max-w-full h-auto max-h-full object-contain"
                  />
                </div>
              ))}
              {/* Display newly selected local files */}
              {product.imageFiles.map((file, index) => (
                <div
                  key={`local-${index}`}
                  className="border border-gray-300 dark:border-gray-700 rounded-md p-1 flex justify-center items-center h-32 overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New Image ${index + 1}`}
                    className="max-w-full h-auto max-h-full object-contain"
                    onLoad={() => URL.revokeObjectURL(file)} // Clean up memory
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Adding Product..." : "➕ Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
