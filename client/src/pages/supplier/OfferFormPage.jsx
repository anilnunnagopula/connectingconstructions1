// pages/supplier/OfferFormPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OfferFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState({
    name: "",
    description: "",
    type: "PERCENTAGE", // PERCENTAGE or FIXED_AMOUNT
    value: 0,
    startDate: "",
    endDate: "",
    applyTo: "ALL_PRODUCTS", // ALL_PRODUCTS, SPECIFIC_PRODUCTS, SPECIFIC_CATEGORIES
    selectedProducts: [], // Array of product IDs if applyTo is SPECIFIC_PRODUCTS
    selectedCategories: [], // Array of category IDs (or names) if applyTo is SPECIFIC_CATEGORIES
  });

  const [supplierProducts, setSupplierProducts] = useState([]); // To select specific products
  const [supplierCategories, setSupplierCategories] = useState([]); // To select specific categories

  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.token;
      }
    } catch (err) {
      console.error("Error parsing user/token from localStorage:", err);
    }
    return null;
  }, []);

  const fetchDataForOfferForm = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");

    const token = getToken();
    console.log("Token:", token);
    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const productsRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/myproducts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const productsData = await productsRes.json();
      if (!productsRes.ok) throw new Error(productsData.message);
      setSupplierProducts(productsData);

      const categoriesRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const categoriesData = await categoriesRes.json();
      if (!categoriesRes.ok) throw new Error(categoriesData.message);
      setSupplierCategories(categoriesData);

      if (id) {
        const offerRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/supplier/offers/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const offerData = await offerRes.json();
        if (!offerRes.ok) throw new Error(offerData.message);

        setOffer({
          ...offerData,
          startDate: offerData.startDate
            ? new Date(offerData.startDate).toISOString().split("T")[0]
            : "",
          endDate: offerData.endDate
            ? new Date(offerData.endDate).toISOString().split("T")[0]
            : "",
          selectedProducts: Array.isArray(offerData.selectedProducts)
            ? offerData.selectedProducts.map((p) => p._id)
            : [],
          selectedCategories: Array.isArray(offerData.selectedCategories)
            ? offerData.selectedCategories.map((c) => c._id)
            : [],
        });
        setMessage("Offer loaded for editing.");
      } else {
        setMessage("Ready to create a new offer.");
      }
      setMessageType("success");
    } catch (err) {
      console.error("Error loading data:", err);
      setMessage(err.message || "Something went wrong.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, getToken]);

  useEffect(() => {
    fetchDataForOfferForm();
  }, [fetchDataForOfferForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductsCategoriesSelection = (e) => {
    const { options } = e.target;
    const selectedValues = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    if (offer.applyTo === "SPECIFIC_PRODUCTS") {
      setOffer((prev) => ({ ...prev, selectedProducts: selectedValues }));
    } else if (offer.applyTo === "SPECIFIC_CATEGORIES") {
      setOffer((prev) => ({ ...prev, selectedCategories: selectedValues }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setMessage("");
    setMessageType("");
    const token = getToken();
    if (!token) return;

    // Basic Validation
    if (
      !offer.name ||
      !offer.type ||
      offer.value <= 0 ||
      !offer.startDate ||
      !offer.endDate
    ) {
      setMessage("Please fill all required offer details.");
      setMessageType("error");
      setFormSubmitting(false);
      return;
    }
    if (new Date(offer.startDate) >= new Date(offer.endDate)) {
      setMessage("Start date must be before end date.");
      setMessageType("error");
      setFormSubmitting(false);
      return;
    }
    if (
      (offer.applyTo === "SPECIFIC_PRODUCTS" &&
        offer.selectedProducts.length === 0) ||
      (offer.applyTo === "SPECIFIC_CATEGORIES" &&
        offer.selectedCategories.length === 0)
    ) {
      setMessage(
        "Please select at least one product or category for the offer."
      );
      setMessageType("error");
      setFormSubmitting(false);
      return;
    }

    try {
      const offerData = { ...offer };
      // Ensure products/categories are just IDs for submission
      offerData.selectedProducts = offerData.selectedProducts.map((p) =>
        typeof p === "object" ? p._id : p
      );
      offerData.selectedCategories = offerData.selectedCategories.map((c) =>
        typeof c === "object" ? c._id : c
      );

      // Clean up unnecessary fields based on applyTo for submission
      if (offerData.applyTo === "ALL_PRODUCTS") {
        delete offerData.selectedProducts;
        delete offerData.selectedCategories;
      } else if (offerData.applyTo === "SPECIFIC_PRODUCTS") {
        delete offerData.selectedCategories;
      } else if (offerData.applyTo === "SPECIFIC_CATEGORIES") {
        delete offerData.selectedProducts;
      }

      let url = `${process.env.REACT_APP_API_URL}/api/supplier/offers`;
      let method = "POST";
      if (id) {
        url = `${url}/${id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(offerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving offer");

      setMessage(`Offer ${id ? "updated" : "created"} successfully!`);
      setMessageType("success");
      if (!id) {
        setOffer({
          name: "",
          description: "",
          type: "PERCENTAGE",
          value: 0,
          startDate: "",
          endDate: "",
          applyTo: "ALL_PRODUCTS",
          selectedProducts: [],
          selectedCategories: [],
        });
      }
      navigate("/supplier/offers");
    } catch (err) {
      console.error("Submit error:", err);
      setMessage(err.message || "Something went wrong");
      setMessageType("error");
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading data for offer form...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          {id ? "✏️ Edit Offer" : "✨ Create New Offer"}{" "}
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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Offer Details */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
              Offer Details
            </h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Offer Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Summer Sale, Bulk Discount"
              value={offer.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={formSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Offer Type
            </label>
            <select
              name="type"
              value={offer.type}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={formSubmitting}
            >
              <option value="PERCENTAGE">Percentage Discount (%)</option>
              <option value="FIXED_AMOUNT">Fixed Amount Discount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Discount Value
            </label>
            <input
              type="number"
              name="value"
              value={offer.value}
              onChange={handleChange}
              placeholder={
                offer.type === "PERCENTAGE"
                  ? "e.g., 10 (for 10%)"
                  : "e.g., 50 (for ₹50)"
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
              min={1}
              disabled={formSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={offer.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={formSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={offer.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={formSubmitting}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={offer.description}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              disabled={formSubmitting}
            ></textarea>
          </div>

          {/* Offer Applicability */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
              Applicability
            </h3>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Apply To
            </label>
            <select
              name="applyTo"
              value={offer.applyTo}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={formSubmitting}
            >
              <option value="ALL_PRODUCTS">All My Products</option>
              <option value="SPECIFIC_PRODUCTS">Specific Products</option>
              <option value="SPECIFIC_CATEGORIES">Specific Categories</option>
            </select>
          </div>

          {offer.applyTo === "SPECIFIC_PRODUCTS" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Products
              </label>
              <select
                multiple
                name="selectedProducts"
                value={offer.selectedProducts}
                onChange={handleProductsCategoriesSelection}
                required={offer.applyTo === "SPECIFIC_PRODUCTS"}
                disabled={formSubmitting}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 h-40"
              >
                {supplierProducts.length === 0 ? (
                  <option disabled>
                    No products available. Add some first!
                  </option>
                ) : (
                  supplierProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} (₹{product.price} - {product.quantity}{" "}
                      units)
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hold Ctrl/Cmd to select multiple.
              </p>
            </div>
          )}

          {offer.applyTo === "SPECIFIC_CATEGORIES" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Categories
              </label>
              <select
                multiple
                name="selectedCategories"
                value={offer.selectedCategories}
                onChange={handleProductsCategoriesSelection}
                required={offer.applyTo === "SPECIFIC_CATEGORIES"}
                disabled={formSubmitting}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 h-40"
              >
                {supplierCategories.length === 0 ? (
                  <option disabled>
                    No categories available. Add some first!
                  </option>
                ) : (
                  supplierCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {" "}
                      {/* Assuming category has _id and name */}
                      {category.name}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hold Ctrl/Cmd to select multiple.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              disabled={formSubmitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formSubmitting
                ? id
                  ? "Updating Offer..."
                  : "Creating Offer..."
                : id
                ? "💾 Save Changes"
                : "🎉 Create Offer"}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferFormPage;
