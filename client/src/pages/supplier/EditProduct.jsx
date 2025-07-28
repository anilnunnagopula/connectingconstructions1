import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categories from "../../utils/Categories";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "300px", borderRadius: "8px" };
const defaultCenter = { lat: 17.385044, lng: 78.486671 };

// Define constants for image limits (copied from AddProduct for consistency)
const MAX_IMAGES = 6; // Allow up to 6 images
const MAX_IMAGE_SIZE_MB = 5; // Max 5MB per image
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

const EditProduct = () => {
  const { id } = useParams(); // get productId from route
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading for fetching product
  const [formSubmitting, setFormSubmitting] = useState(false); // For form submit
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [aiLoading, setAiLoading] = useState(false); // For AI description generation
  const [showKeywordsInput, setShowKeywordsInput] = useState(false); // State for conditional rendering of keywords input

  // New states for image management
  const [newImageFiles, setNewImageFiles] = useState([]); // To hold new File objects
  const [currentImageUrls, setCurrentImageUrls] = useState([]); // To hold existing Cloudinary URLs

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: ["places", "maps"],
  });

  // Fetch product on component mount or ID change
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setMessage("");
      setMessageType("");

      let token = null;
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          token = user.token;
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        setMessage("Authentication error. Please log in again.");
        setMessageType("error");
        setLoading(false);
        navigate("/login");
        return;
      }

      if (!token) {
        setMessage("You are not authorized. Please log in.");
        setMessageType("error");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${id}`, // Fetching using protected route
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          // Set product state, and separate image URLs
          setProduct({
            ...data,
            // Ensure location and contact objects exist for the form
            location: data.location || { text: "", lat: null, lng: null },
            contact: data.contact || { mobile: "", email: "", address: "" },
          });
          setCurrentImageUrls(data.imageUrls || []); // Initialize current images
        } else {
          setMessage(data.error || "Failed to fetch product.");
          setMessageType("error");
        }
      } catch (err) {
        setMessage("Error fetching product. Please check network.");
        setMessageType("error");
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]); // Added navigate to dependencies

  // Generic input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Contact info change handler
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  // Google Map click handler
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setProduct((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        lat,
        lng,
        text: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      },
    }));
    setMessage("Location updated from map click!");
    setMessageType("info");
  };

  // Use Current Location handler
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
              location: {
                ...prev.location,
                lat: latitude,
                lng: longitude,
                text: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(
                  4
                )}`,
              },
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

  // --- Image Management Functions ---
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newMessages = [];

    // Check total images (current + new)
    if (currentImageUrls.length + files.length > MAX_IMAGES) {
      newMessages.push(
        `You can only have a total of ${MAX_IMAGES} images (existing + new). Too many new files selected.`
      );
      setMessageType("error");
      setMessage(newMessages.join(" "));
      e.target.value = null; // Clear input field
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
      setNewImageFiles(validFiles); // Store valid File objects
      if (newMessages.length === 0) {
        setMessage("New images selected for upload. Save changes to upload.");
        setMessageType("info");
      } else {
        setMessage(newMessages.join(" ") + " Some new images were too large.");
      }
    } else if (newMessages.length > 0) {
      setMessage(newMessages.join(" "));
    } else {
      setMessage("");
      setMessageType("");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setCurrentImageUrls((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
    setMessage("Image removed. Save changes to apply.");
    setMessageType("info");
  };

  const uploadImagesToCloudinary = async (files) => {
    if (!files || files.length === 0) return [];

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

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
        }
      } catch (err) {
        uploadSuccess = false;
        setMessage(`Image "${file.name}" upload failed due to network error.`);
        setMessageType("error");
        console.error("Cloudinary fetch error for", file.name, ":", err);
      }
    }

    if (uploadSuccess && uploadedUrls.length === files.length) {
      setMessage("All new images uploaded to Cloudinary successfully!");
      setMessageType("success");
    } else if (uploadedUrls.length > 0) {
      setMessage("Some new images uploaded, but others failed.");
      setMessageType("warning");
    }
    return uploadedUrls;
  };
  // --- End Image Management Functions ---

  // AI Description Generation
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
    // Add product.userKeywords (if you have this field for editing)
    if (product.userKeywords) {
      // Assuming you might add this to the product state for editing
      prompt += `\nKey Features/Keywords: ${product.userKeywords}`;
    }

    prompt += `\n\nEnsure the description is engaging, highlights benefits, and directly incorporates the provided keywords/features. Keep it under 100 words.`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

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
            "AI could not generate a suitable description. Try again."
          );
          setMessageType("error");
        }
      } else {
        const errorMessage =
          result.error && result.error.message
            ? result.error.message
            : "Unknown error from AI API.";
        setMessage(`Failed to generate description: ${errorMessage}`);
        setMessageType("error");
      }
    } catch (err) {
      console.error("AI generation network/fetch error:", err);
      setMessage(
        "Error connecting to AI service. Check network or try again later."
      );
      setMessageType("error");
    } finally {
      setAiLoading(false);
    }
  };

  // Handle form submission (Update Product)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setMessage("");
    setMessageType("");

    if (
      !product.name ||
      !product.category ||
      !product.description ||
      !product.price ||
      !product.quantity ||
      !product.location?.text ||
      !product.contact?.mobile ||
      !product.contact?.email ||
      !product.contact?.address
    ) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      setFormSubmitting(false);
      return;
    }

    let token = null;
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        token = user.token;
      }
    } catch (err) {
      console.error("Error parsing user from localStorage for submit:", err);
      setMessage("Authentication error. Please log in again.");
      setMessageType("error");
      setFormSubmitting(false);
      navigate("/login");
      return;
    }

    if (!token) {
      setMessage("You are not authorized. Please log in.");
      setMessageType("error");
      setFormSubmitting(false);
      navigate("/login");
      return;
    }

    let finalImageUrls = [...currentImageUrls]; // Start with existing images

    // Upload new images if any are selected
    if (newImageFiles.length > 0) {
      setMessage("Uploading new images to Cloudinary...");
      setMessageType("info");
      const uploadedUrls = await uploadImagesToCloudinary(newImageFiles);
      if (uploadedUrls.length === 0 && newImageFiles.length > 0) {
        setMessage("All new image uploads failed. Product not updated.");
        setMessageType("error");
        setFormSubmitting(false);
        return;
      }
      finalImageUrls = [...currentImageUrls, ...uploadedUrls]; // Combine existing with newly uploaded
    }

    // Ensure at least one image if required (same logic as AddProduct)
    if (finalImageUrls.length === 0) {
      setMessage("Please upload at least one image for the product.");
      setMessageType("error");
      setFormSubmitting(false);
      return;
    }

    const productData = {
      name: product.name,
      category: product.category,
      description: product.description,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
      availability: product.availability,
      location: {
        text: product.location.text,
        lat: product.location.lat,
        lng: product.location.lng,
      },
      contact: product.contact,
      imageUrls: finalImageUrls, // Send the combined array of URLs
      // Add userKeywords if you want to store them in the product
      userKeywords: product.userKeywords || "", // Include userKeywords if present
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${id}`, // Ensure this is a PUT endpoint in backend
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to update product."
        );
      }
      setMessage("✅ Product updated successfully!");
      setMessageType("success");
      setNewImageFiles([]); // Clear new image files after successful upload
      setCurrentImageUrls(data.imageUrls || []); // Update with the latest URLs from the backend

      setTimeout(() => navigate("/supplier/myproducts"), 1500); // Navigate back to My Products
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
      console.error("Error updating product:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading || !product) {
    // Show loading until product data is fetched
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-400"></div>
        <p className="mt-4 text-lg font-medium">Loading product details...</p>
      </div>
    );
  }

  // If there's a loadError from Google Maps API
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          ✏️ Edit Product: {product.name}
        </h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium shadow-md ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : messageType === "info"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                : messageType === "warning"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
            } transition-colors duration-300`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Product Details Section */}
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
              value={product.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              name="category"
              value={product.category || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
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
              value={product.description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Leave empty and let AI generate if needed 🤖"
              required
            />
          </div>

          {showKeywordsInput && ( // Keywords input for AI generation
            <div className="md:col-span-2 mt-2">
              <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Key Features / Keywords (for AI generation)
              </label>
              <input
                type="text"
                name="userKeywords"
                value={product.userKeywords || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
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
              value={product.price || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Quantity
            </label>
            <input
              type="text"
              name="quantity"
              value={product.quantity || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option>Available</option>
              <option>Not Available</option>
            </select>
          </div>

          {/* Location Details Section */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
              Location Details
            </h3>
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                Location Text
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
                title="Use Current Location"
              >
                <span className="text-lg">📍</span> Use Current Location
              </button>
            </div>
            <input
              name="locationText"
              value={product.location?.text || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  location: { ...prev.location, text: e.target.value },
                }))
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
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
                center={
                  product.location?.lat && product.location?.lng
                    ? { lat: product.location.lat, lng: product.location.lng }
                    : defaultCenter
                }
                zoom={product.location?.lat ? 15 : 12}
                onClick={handleMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {product.location?.lat && product.location?.lng && (
                  <Marker
                    position={{
                      lat: product.location.lat,
                      lng: product.location.lng,
                    }}
                  />
                )}
              </GoogleMap>
              {product.location?.lat && product.location?.lng && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Selected Coordinates: Lat: {product.location.lat.toFixed(4)},
                  Lng: {product.location.lng.toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* Contact Details Section */}
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
              value={product.contact?.mobile || ""}
              onChange={handleContactChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
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
              value={product.contact?.email || ""}
              onChange={handleContactChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Address
            </label>
            <textarea
              name="address"
              value={product.contact?.address || ""}
              onChange={handleContactChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
              Product Images
            </h3>
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Existing Images
            </label>
            {currentImageUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {currentImageUrls.map((url, index) => (
                  <div
                    key={url} // Use URL as key or a stable unique ID
                    className="relative border border-gray-300 dark:border-gray-700 rounded-md p-1 flex justify-center items-center h-32 overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Existing Product Image ${index + 1}`}
                      className="max-w-full h-auto max-h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Remove Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No existing images.
              </p>
            )}

            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Add New Images (Max {MAX_IMAGES - currentImageUrls.length} more,{" "}
              {MAX_IMAGE_SIZE_MB}MB each)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImageChange}
              className="w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {newImageFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {newImageFiles.map((file, index) => (
                  <div
                    key={file.name + index} // Use unique key
                    className="border border-gray-300 dark:border-gray-700 rounded-md p-1 flex justify-center items-center h-32 overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New Image Preview ${index + 1}`}
                      className="max-w-full h-auto max-h-full object-contain"
                      onLoad={() => URL.revokeObjectURL(file)}
                    />
                  </div>
                ))}
              </div>
            )}
            {currentImageUrls.length + newImageFiles.length > MAX_IMAGES && (
              <p className="text-red-500 text-sm mt-2">
                You have selected too many images. Max {MAX_IMAGES} total.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Saving Changes..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
