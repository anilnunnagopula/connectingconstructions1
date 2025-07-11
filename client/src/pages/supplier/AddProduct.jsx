import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import categories from "../../utils/Categories";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 17.385044,
  lng: 78.486671,
};

const AddProduct = () => {
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
    image: null,
    imageUrl: null,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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
    setProduct((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (latitude && longitude) {
            setProduct((prev) => ({
              ...prev,
              latLng: { lat: latitude, lng: longitude },
              location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(
                4
              )}`,
            }));
          } else {
            alert("Could not fetch valid coordinates.");
          }
        },
        (error) => {
          alert("Failed to get location. Please allow location access.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;
    if (product.image) {
      imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(product.image);
      });
    }

    const newProduct = {
      ...product,
      imageUrl,
      image: null,
    };

    const existing = JSON.parse(localStorage.getItem("supplierProducts")) || [];
    localStorage.setItem(
      "supplierProducts",
      JSON.stringify([...existing, newProduct])
    );

    alert("Product added successfully!");

    setProduct({
      name: "",
      category: "",
      price: "",
      quantity: "",
      availability: true,
      locationText: "",
      latLng: null,
      contact: { mobile: "", email: "", address: "" },
      image: null,
      imageUrl: null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md rounded-lg mt-10 transition-all">
      <h2 className="text-2xl font-bold mb-4">📦 Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Input fields */}
        <div>
          <label className="block font-semibold mb-1">Product Name</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
          <label className="block font-semibold mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Quantity Available</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Availability</label>
          <select
            name="availability"
            value={product.availability ? "Available" : "Not Available"}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                availability: e.target.value === "Available",
              }))
            }
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option>Available</option>
            <option>Currently Not Available</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Manual Location</label>
          <input
            name="locationText"
            value={product.locationText}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, locationText: e.target.value }))
            }
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Click map or use current location"
            required
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            📍 Use Current Location
          </button>
        </div>

        <div>
          <label className="block font-semibold mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Mobile</label>
          <input
            name="mobile"
            value={product.contact.mobile}
            onChange={handleContactChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={product.contact.email}
            onChange={handleContactChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Address</label>
          <textarea
            name="address"
            value={product.contact.address}
            onChange={handleContactChange}
            className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            rows="3"
            required
          />
        </div>

        {isLoaded && (
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">
              📌 Mark Location on Map
            </label>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={product.latLng || defaultCenter}
              zoom={12}
              onClick={handleMapClick}
            >
              {product.latLng && <Marker position={product.latLng} />}
            </GoogleMap>
          </div>
        )}

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            ➕ Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
