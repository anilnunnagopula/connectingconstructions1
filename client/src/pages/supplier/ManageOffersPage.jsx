// pages/supplier/ManageOffersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierLayout from '../../layout/SupplierLayout';

const ManageOffersPage = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingOfferId, setDeletingOfferId] = useState(null); // To track which offer is being deleted
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Helper to get token
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  // Fetch Offers for the supplier
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      // Using the existing /api/supplier/offers endpoint
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/offers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to fetch offers."
        );
      }

      setOffers(data); // Assuming data is an array of offer objects
      setMessage("Offers loaded successfully.");
      setMessageType("success");
    } catch (err) {
      console.error("Error fetching offers:", err);
      setMessage(err.message || "Error loading offers.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Handle message timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle Delete Offer
  const handleDelete = async (offerId, offerName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the offer "${offerName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingOfferId(offerId); // Indicate which offer is being deleted
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setDeletingOfferId(null);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/offers/${offerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to delete offer."
        );
      }

      setMessage(`Offer "${offerName}" deleted successfully!`);
      setMessageType("success");
      fetchOffers(); // Re-fetch offers to update list
    } catch (err) {
      console.error("Error deleting offer:", err);
      setMessage(err.message || "Failed to delete offer.");
      setMessageType("error");
    } finally {
      setDeletingOfferId(null);
    }
  };

  // Handle Edit Offer
  const handleEdit = (offerId) => {
    navigate(`/supplier/offers/${offerId}/edit`); // <--- NAVIGATE TO THE EDIT FORM
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading offers...
        </p>
      </div>
    );
  }

  return (
    <SupplierLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans p-6">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            📈 Manage My Offers
          </h2>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center font-medium shadow-md ${
                messageType === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  : messageType === "error"
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
              } transition-colors duration-300`}
            >
              {message}
            </div>
          )}

          {offers.length === 0 ? (
            <div className="text-center py-20 text-gray-600 dark:text-gray-300">
              <p className="text-lg mb-4">
                No offers created yet. Start by creating a new one!
              </p>
              <button
                onClick={() => navigate("/supplier/create-offer")}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                ➕ Create First Offer
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-4 border-gray-300 dark:border-gray-600">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {offer.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {offer.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        <span className="font-semibold">Type:</span>{" "}
                        {offer.type === "PERCENTAGE"
                          ? `${offer.value}% OFF`
                          : `₹${offer.value} OFF`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">Validity:</span>{" "}
                        {formatDate(offer.startDate)} -{" "}
                        {formatDate(offer.endDate)}
                      </p>
                      {offer.code && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Code:</span>{" "}
                          <span className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                            {offer.code}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="mt-3 md:mt-0 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          offer.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : offer.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : offer.status === "Expired" ||
                              offer.status === "Inactive"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {offer.status}
                      </span>
                      {offer.usageLimit && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Used: {offer.usedCount} / {offer.usageLimit}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Offer Applicability Summary */}
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                      Applies To:
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                      <li>
                        {offer.applyTo === "ALL_PRODUCTS"
                          ? "All Products"
                          : offer.applyTo === "SPECIFIC_PRODUCTS"
                          ? "Specific Products"
                          : "Specific Categories"}
                      </li>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                        <li>
                          {offer.applyTo === "ALL_PRODUCTS"
                            ? "All Products"
                            : offer.applyTo === "SPECIFIC_PRODUCTS"
                            ? "Specific Products"
                            : "Specific Categories"}
                        </li>
                        {/* Corrected Block 1 (for selectedProducts): */}
                        {offer.applyTo === "SPECIFIC_PRODUCTS" &&
                          offer.selectedProducts.length > 0 && (
                            <li>
                              Products:{" "}
                              {offer.selectedProducts
                                .map((p) =>
                                  p && p._id ? p.name || p._id.slice(0, 8) : "N/A"
                                )
                                .join(", ")}
                            </li>
                          )}
                        {/* Corrected Block 2 (for selectedCategories): */}
                        {offer.applyTo === "SPECIFIC_CATEGORIES" &&
                          offer.selectedCategories.length > 0 && (
                            <li>
                              Categories:{" "}
                              {offer.selectedCategories
                                .map((c) =>
                                  c && c._id ? c.name || c._id.slice(0, 8) : "N/A"
                                )
                                .join(", ")}
                            </li>
                          )}
                      </ul>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() => handleEdit(offer._id)} // Pass offer ID
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                      disabled={deletingOfferId === offer._id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id, offer.name)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                      disabled={deletingOfferId === offer._id} // Disable during deletion
                    >
                      {deletingOfferId === offer._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
};

export default ManageOffersPage;