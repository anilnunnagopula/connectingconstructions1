// pages/supplier/CategoriesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import globalCategoriesData from "../../utils/Categories"; // <--- IMPORT THIS LINE
import SupplierLayout from "../../layout/SupplierLayout";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Supplier's own categories
  // const [globalCategories, setGlobalCategories] = useState([]); // No longer needed as state
  const [newCategoryName, setNewCategoryName] = useState(""); // For custom typing or editing
  const [selectedGlobalCategory, setSelectedGlobalCategory] = useState(""); // For dropdown selection

  const [editingCategory, setEditingCategory] = useState(null); // { id, name }
  const [loading, setLoading] = useState(true); // Initial loading for fetching all data
  const [formSubmitting, setFormSubmitting] = useState(false); // For add/edit/delete operations
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

  // --- REMOVE: Fetch Global Categories (no longer needed) ---
  // const fetchGlobalCategories = useCallback(async () => { /* ... */ }, []);

  // --- Fetch Supplier's Own Categories ---
  const fetchSupplierCategories = useCallback(async () => {
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
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/categories`,
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
          data.message || data.error || "Failed to fetch your categories."
        );
      }

      setCategories(data);
      setMessage("Your categories loaded successfully.");
      setMessageType("success");
    } catch (err) {
      console.error("Error fetching supplier categories:", err);
      setMessage(err.message || "Error loading your categories.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  // Initial fetch for supplier categories only
  useEffect(() => {
    fetchSupplierCategories();
    // setGlobalCategories(globalCategoriesData); // No longer needed as state, use directly
  }, [fetchSupplierCategories]); // Removed fetchGlobalCategories from dependencies

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

  // Add/Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setFormSubmitting(false);
      navigate("/login");
      return;
    }

    let categoryNameToSubmit = "";

    if (editingCategory) {
      // If editing, use the text input directly
      categoryNameToSubmit = newCategoryName.trim();
    } else {
      // If adding: prioritize dropdown selection, otherwise use custom typed name
      if (selectedGlobalCategory) {
        // Find the name from the imported data using the selected ID (string value)
        categoryNameToSubmit = selectedGlobalCategory; // The ID is the name itself in this setup
      } else {
        categoryNameToSubmit = newCategoryName.trim();
      }
    }

    if (!categoryNameToSubmit) {
      setMessage("Category name cannot be empty.");
      setMessageType("error");
      setFormSubmitting(false);
      return;
    }

    // Check if category already exists in supplier's list if adding
    if (
      !editingCategory &&
      categories.some(
        (cat) => cat.name.toLowerCase() === categoryNameToSubmit.toLowerCase()
      )
    ) {
      setMessage(`Category "${categoryNameToSubmit}" is already in your list.`);
      setMessageType("warning");
      setFormSubmitting(false);
      return;
    }

    try {
      let url = `${process.env.REACT_APP_API_URL}/api/supplier/categories`;
      let method = "POST";

      if (editingCategory) {
        url = `${url}/${editingCategory.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryNameToSubmit }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Failed to ${editingCategory ? "update" : "add"} category.`
        );
      }

      setMessage(
        `Category ${editingCategory ? "updated" : "added"} successfully!`
      );
      setMessageType("success");
      setNewCategoryName("");
      setSelectedGlobalCategory(""); // Clear dropdown selection
      setEditingCategory(null);
      fetchSupplierCategories(); // Re-fetch supplier's categories
    } catch (err) {
      console.error(
        `Error ${editingCategory ? "updating" : "adding"} category:`,
        err
      );
      setMessage(
        err.message ||
          `Failed to ${editingCategory ? "update" : "add"} category.`
      );
      setMessageType("error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Category
  const handleDelete = async (categoryId, categoryName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${categoryName}"? This will affect products linked to it.`
      )
    ) {
      return;
    }

    setFormSubmitting(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setFormSubmitting(false);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to delete category."
        );
      }

      setMessage(`Category "${categoryName}" deleted successfully!`);
      setMessageType("success");
      fetchSupplierCategories(); // Re-fetch categories to update list
    } catch (err) {
      console.error("Error deleting category:", err);
      setMessage(err.message || "Failed to delete category.");
      setMessageType("error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Start editing a category
  const startEditing = (category) => {
    setEditingCategory({ id: category._id, name: category.name });
    setNewCategoryName(category.name); // Pre-fill text input for editing
    setSelectedGlobalCategory(""); // Clear dropdown when editing
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setSelectedGlobalCategory("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading categories...
        </p>
      </div>
    );
  }

  return (
    <SupplierLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            🗂️ Manage Categories
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

        {/* Add/Edit Category Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {editingCategory
              ? `Edit Category: ${editingCategory.name}`
              : "Add New Category"}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Conditional Rendering for Dropdown or Text Input for Adding */}
            {!editingCategory ? ( // Only show dropdown if NOT editing
              <select
                value={selectedGlobalCategory}
                onChange={(e) => setSelectedGlobalCategory(e.target.value)}
                className="flex-grow border border-gray-300 px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                disabled={formSubmitting}
              >
                <option value="">
                  -- Select from predefined categories --
                </option>
                {/* Use globalCategoriesData directly */}
                {globalCategoriesData.map((catName, index) => (
                  <option key={index} value={catName}>
                    {catName}
                  </option> // Use catName as value and key
                ))}
              </select>
            ) : (
              // Text input always visible for editing
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={
                  editingCategory
                    ? "Update category name"
                    : "Type a custom category name"
                }
                className="flex-grow border border-gray-300 px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                required // Always required when editing
                disabled={formSubmitting}
              />
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  formSubmitting ||
                  (!editingCategory &&
                    !selectedGlobalCategory &&
                    !newCategoryName.trim())
                } // Disable if adding and no input/selection
              >
                {formSubmitting
                  ? editingCategory
                    ? "Updating..."
                    : "Adding..."
                  : editingCategory
                  ? "💾 Update Category"
                  : "➕ Add Category"}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition-colors duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formSubmitting}
                >
                  ✖️ Cancel
                </button>
              )}
            </div>
          </div>
          {/* Add a descriptive text if not editing and global categories are available */}
          {!editingCategory && globalCategoriesData.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Select a category from the dropdown or type a custom one.
            </p>
          )}
        </form>

        {/* Categories List */}
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Existing Categories ({categories.length})
        </h3>
        {categories.length === 0 ? (
          <div className="text-center py-10 text-gray-600 dark:text-gray-300">
            <p className="text-lg">
              No categories added yet. Use the form above to add your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span className="text-lg font-medium text-gray-800 dark:text-white">
                  {category.name}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(category)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    title="Edit Category"
                    disabled={loading || formSubmitting}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category._id, category.name)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    title="Delete Category"
                    disabled={loading || formSubmitting}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165M12 2.25L12 2.25c-1.103 0-2.203.15-3.303.447L12 2.25c-1.103 0-2.203.15-3.303.447"
                      />
                    </svg>
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

export default CategoriesPage;
