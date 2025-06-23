import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // ✅ Moved INSIDE the component

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("supplierProducts")) || [];
    setProducts(data);
  }, []);

  const handleEdit = (index) => {
    navigate(`/supplier/edit/${index}`);
  };

  const handleAvailabilityToggle = (index) => {
    const updated = [...products];
    updated[index].availability = !updated[index].availability;
    setProducts(updated);
    localStorage.setItem("supplierProducts", JSON.stringify(updated));
  };

  const handleDelete = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
    localStorage.setItem("supplierProducts", JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 My Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-600 text-lg">No products added yet!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((item, idx) => (
            <div key={idx} className="bg-white shadow-md p-4 rounded-lg">
              {item.image && (
                <img
                  src={item.image} // ✅ just use it directly
                  alt={item.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
              <p className="text-gray-600 mb-1">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Price:</strong> ₹{item.price}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Quantity:</strong>{" "}
                <span
                  className={
                    item.quantity < 5
                      ? "text-red-600 font-semibold"
                      : "text-green-600"
                  }
                >
                  {item.quantity} {item.quantity < 5 ? "(Low Stock!)" : ""}
                </span>
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(idx)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  ❌ Delete
                </button>
              </div>
              <p className="text-gray-600 mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    item.availability ? "text-green-600" : "text-red-600"
                  }
                >
                  {item.availability ? "Available" : "Not Available"}
                </span>
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {item.location ? item.location : "Not provided"}
              </p>

              {item.latLng &&
                typeof item.latLng.lat === "number" &&
                typeof item.latLng.lng === "number" && (
                  <a
                    href={`https://maps.google.com/?q=${item.latLng.lat},${item.latLng.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline ml-2"
                  >
                    📍 View on Map
                  </a>
                )}

              <p className="text-gray-600 mb-1">
                <strong>Contact:</strong> {item.contact.mobile} |{" "}
                {item.contact.email}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Address:</strong> {item.contact.address}
              </p>

              <button
                onClick={() => handleAvailabilityToggle(idx)}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Toggle Availability
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
