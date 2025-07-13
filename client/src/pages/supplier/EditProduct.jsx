import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categories from "../../utils/Categories";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "300px", borderRadius: "8px" };
const defaultCenter = { lat: 17.385044, lng: 78.486671 };

const EditProduct = () => {
  const { id } = useParams(); // get productId from route
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "maps"],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/supplier/products/${id}`
        );
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
        } else {
          setMessage(data.error || "Failed to fetch product.");
          setMessageType("error");
        }
      } catch (err) {
        setMessage("Error fetching product.");
        setMessageType("error");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/supplier/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update product.");
      setMessage("✅ Product updated successfully!");
      setMessageType("success");

      setTimeout(() => navigate("/supplier/dashboard"), 1500);
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    }
  };

  if (!product) return <div className="p-6">⏳ Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Product</h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded-md text-center ${
            messageType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="font-semibold">Product Name</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="font-semibold">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="input"
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
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="input"
            rows="3"
          />
        </div>

        <div>
          <label className="font-semibold">Price (₹)</label>
          <input
            name="price"
            value={product.price}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="font-semibold">Quantity</label>
          <input
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="font-semibold">Availability</label>
          <select
            name="availability"
            value={product.availability ? "Available" : "Not Available"}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                availability: e.target.value === "Available",
              }))
            }
            className="input"
          >
            <option>Available</option>
            <option>Not Available</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">Location</label>
          <input
            name="locationText"
            value={product.location?.text || ""}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                location: { ...prev.location, text: e.target.value },
              }))
            }
            className="input"
          />
        </div>

        {isLoaded && (
          <div className="md:col-span-2">
            <label className="font-semibold">Click to Update Location</label>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={product.location || defaultCenter}
              zoom={15}
              onClick={handleMapClick}
            >
              {product.location && (
                <Marker
                  position={{
                    lat: product.location.lat,
                    lng: product.location.lng,
                  }}
                />
              )}
            </GoogleMap>
          </div>
        )}

        <div>
          <label className="font-semibold">Mobile</label>
          <input
            name="mobile"
            value={product.contact.mobile}
            onChange={handleContactChange}
            className="input"
          />
        </div>

        <div>
          <label className="font-semibold">Email</label>
          <input
            name="email"
            value={product.contact.email}
            onChange={handleContactChange}
            className="input"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">Address</label>
          <textarea
            name="address"
            value={product.contact.address}
            onChange={handleContactChange}
            className="input"
            rows="3"
          />
        </div>

        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
