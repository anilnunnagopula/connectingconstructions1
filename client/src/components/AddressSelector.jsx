// client/src/components/AddressSelector.jsx
import React, { useState, useEffect } from "react";
import { MapPin, Plus, Check, Home, Building } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAddresses } from "../services/customerApiService";

/**
 * AddressSelector Component
 * Reusable component for selecting a delivery address
 * Used in Checkout and other places where address selection is needed
 */
const AddressSelector = ({
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
  showAddButton = true,
}) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getAddresses();
      if (response.success) {
        setAddresses(response.data);

        // Auto-select default address if no address is selected
        if (!selectedAddress && response.data.length > 0) {
          const defaultAddr = response.data.find((addr) => addr.isDefault);
          if (defaultAddr) {
            onSelectAddress(defaultAddr);
          }
        }
      } else {
        toast.error(response.error || "Failed to load addresses");
      }
    } catch (error) {
      console.error("Fetch addresses error:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
        <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No saved addresses
        </p>
        {showAddButton && (
          <button
            onClick={onAddNewAddress}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Address
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Address Cards */}
      {addresses.map((address) => (
        <div
          key={address._id}
          onClick={() => onSelectAddress(address)}
          className={`border-2 rounded-lg p-4 cursor-pointer transition hover:shadow-md ${
            selectedAddress?._id === address._id
              ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Radio Button */}
            <div className="flex-shrink-0 mt-1">
              {selectedAddress?._id === address._id ? (
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
              )}
            </div>

            {/* Address Details */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                {address.label === "Home" ? (
                  <Home size={18} className="text-blue-600 dark:text-blue-400" />
                ) : (
                  <Building size={18} className="text-blue-600 dark:text-blue-400" />
                )}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {address.label}
                </span>
                {address.isDefault && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium">
                    Default
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {address.fullName} | {address.phone}
                </p>
                <p>
                  {address.addressLine1}
                  {address.addressLine2 && `, ${address.addressLine2}`}
                </p>
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
                {address.landmark && (
                  <p className="text-xs italic">
                    Landmark: {address.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add New Address Button */}
      {showAddButton && (
        <button
          onClick={onAddNewAddress}
          className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-600 dark:text-gray-400 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add New Address
        </button>
      )}
    </div>
  );
};

export default AddressSelector;
