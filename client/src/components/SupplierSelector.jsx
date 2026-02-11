// client/src/components/SupplierSelector.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MapPin, Search, Check, Store, Star } from "lucide-react";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

/**
 * SupplierSelector Component
 * Allows customers to select specific suppliers for quote requests
 */
const SupplierSelector = ({ selectedSuppliers, onSelectSuppliers }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${baseURL}/api/suppliers`, {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { limit: 50 }, // Get active suppliers
      });

      if (response.data.success) {
        setSuppliers(response.data.data || []);
      } else {
        toast.error("Failed to load suppliers");
      }
    } catch (error) {
      console.error("Fetch suppliers error:", error);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSupplier = (supplierId) => {
    if (selectedSuppliers.includes(supplierId)) {
      // Remove from selection
      onSelectSuppliers(
        selectedSuppliers.filter((id) => id !== supplierId),
      );
    } else {
      // Add to selection
      onSelectSuppliers([...selectedSuppliers, supplierId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSuppliers.length === filteredSuppliers.length) {
      // Deselect all
      onSelectSuppliers([]);
    } else {
      // Select all filtered
      onSelectSuppliers(filteredSuppliers.map((s) => s._id));
    }
  };

  // Filter suppliers by search term
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const shopName = supplier.shopDetails?.shopName?.toLowerCase() || "";
    const ownerName = supplier.name?.toLowerCase() || "";
    const city = supplier.shopDetails?.city?.toLowerCase() || "";

    return (
      shopName.includes(searchLower) ||
      ownerName.includes(searchLower) ||
      city.includes(searchLower)
    );
  });

  // Loading state
  if (loading) {
    return (
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (suppliers.length === 0) {
    return (
      <div className="mt-4 text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
        <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">
          No suppliers available
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Search and Select All */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search suppliers by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleSelectAll}
          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {selectedSuppliers.length === filteredSuppliers.length
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      {/* Selection Counter */}
      {selectedSuppliers.length > 0 && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
          {selectedSuppliers.length} supplier{selectedSuppliers.length > 1 ? "s" : ""}{" "}
          selected
        </div>
      )}

      {/* Suppliers List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredSuppliers.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-4">
            No suppliers match your search
          </p>
        ) : (
          filteredSuppliers.map((supplier) => {
            const isSelected = selectedSuppliers.includes(supplier._id);
            const shopName =
              supplier.shopDetails?.shopName || supplier.name || "Unnamed Shop";
            const city = supplier.shopDetails?.city || "Location not specified";
            const rating = supplier.shopDetails?.rating || 0;
            const distance = supplier.shopDetails?.distance
              ? `${supplier.shopDetails.distance.toFixed(1)} km`
              : null;

            return (
              <div
                key={supplier._id}
                onClick={() => handleToggleSupplier(supplier._id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition hover:shadow-md ${
                  isSelected
                    ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-1">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600"></div>
                    )}
                  </div>

                  {/* Supplier Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {shopName}
                      </h3>
                      {rating > 0 && (
                        <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs font-medium">{rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={14} />
                      <span className="truncate">{city}</span>
                      {distance && (
                        <>
                          <span>•</span>
                          <span>{distance} away</span>
                        </>
                      )}
                    </div>

                    {/* Categories */}
                    {supplier.shopDetails?.categories &&
                      supplier.shopDetails.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {supplier.shopDetails.categories.slice(0, 3).map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                          {supplier.shopDetails.categories.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                              +{supplier.shopDetails.categories.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SupplierSelector;
