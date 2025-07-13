import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import categories from "../../utils/Categories"; // Ensure this path is correct

// Define libraries outside the component to prevent re-creation on re-renders
const googleMapsLibraries = ["places", "maps"]; // Static constant

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px",
};

const defaultCenter = {
  lat: 17.385044, // Default to Hyderabad, India
  lng: 78.486671,
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
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
    imageFile: null,
    imageUrlPreview: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Load Google Maps API (ensure REACT_APP_GOOGLE_MAPS_API_KEY is set in your .env)
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries, // <--- MODIFIED: Using the static constant here
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          imageFile: file,
          imageUrlPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setProduct((prev) => ({
        ...prev,
        imageFile: null,
        imageUrlPreview: null,
      }));
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    if (
      !product.name ||
      !product.category ||
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

    const productData = {
      supplierId: supplierId,
      name: product.name,
      category: product.category,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
      availability: product.availability,
      location: {
        text: product.locationText,
        lat: product.latLng ? product.latLng.lat : null,
        lng: product.latLng ? product.latLng.lng : null,
      },
      contact: product.contact,
      imageUrl: product.imageUrlPreview,
    };

    try {
      const apiUrl =
        typeof process !== "undefined" && process.env.REACT_APP_API_URL
          ? `${process.env.REACT_APP_API_URL}/api/supplier/products`
          : "/api/supplier/products";

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
      setProduct({
        name: "",
        category: "",
        price: "",
        quantity: "",
        availability: true,
        locationText: "",
        latLng: null,
        contact: { mobile: "", email: "", address: "" },
        imageFile: null,
        imageUrlPreview: null,
      });
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
            Please ensure your `REACT_APP_GOOGLE_MAPS_API_KEY` is correct and
            has the necessary APIs enabled (Maps JavaScript API, Geocoding API).
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
        {/* Product Details */}
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

        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
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
            type="number"
            name="quantity"
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
          >
            <option>Available</option>
            <option>Currently Not Available</option>
          </select>
        </div>

        {/* Location Details */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
            Location Details
          </h3>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Manual Location Text
          </label>
          <input
            name="locationText"
            value={product.locationText}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, locationText: e.target.value }))
            }
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Shop No. 123, Main Road, Hyderabad"
            required
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
          >
            📍 Use Current Location
          </button>
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

        {/* Contact Details */}
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

        {/* Image Upload */}
        <div className="md:col-span-2 mt-4">
          <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
            Product Image
          </h3>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {product.imageUrlPreview && (
            <div className="mt-4 border border-gray-300 dark:border-gray-700 rounded-md p-2 flex justify-center items-center">
              <img
                src={product.imageUrlPreview}
                alt="Product Preview"
                className="max-w-full h-auto max-h-48 rounded-md object-contain"
              />
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
