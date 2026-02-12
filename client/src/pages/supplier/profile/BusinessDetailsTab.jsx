import React, { useState, useEffect } from "react";
import { Store, Clock, Save, Power } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const BusinessDetailsTab = ({ user, token, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    businessHours: "9:00 AM - 6:00 PM",
    isOpen: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        businessName: user.businessName || "",
        description: user.description || "",
        businessHours: user.businessHours || "9:00 AM - 6:00 PM",
        isOpen: user.isOpen !== undefined ? user.isOpen : true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = () => {
    setFormData((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update profile with business details
      // Note: We might need to ensure the backend supports these fields in the User/Supplier model
      // If 'businessName' isn't in model, we use 'name' or separate field. 
      // Assuming 'businessName' maps to 'storeName' or similar if 'name' is personal name.
      // For now, sending as is, assuming backend handles flexible update or we simply update 'name' if it's the store name.
      
      const updateData = {
        businessName: formData.businessName,
        description: formData.description,
        businessStatus: {
            isOpen: formData.isOpen,
            businessHours: formData.businessHours
        }
      };

      const response = await axios.put(
        `${baseURL}/api/auth/profile`, 
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Removed redundant call to /api/supplier/business-status as it is now handled by updateProfile

      toast.success("Business details updated successfully!");
      onUpdate(response.data); // Callback to update parent state
    } catch (error) {
      console.error("Error updating business details:", error);
      toast.error(error.response?.data?.message || "Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Store className="text-blue-600" size={24} />
        Business Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Status Toggle */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Store Status</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formData.isOpen ? "Your store is currently OPEN for orders." : "Your store is CLOSED. Orders are paused."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              formData.isOpen
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            <Power size={18} />
            {formData.isOpen ? "Online" : "Offline"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business / Store Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Apex Construction Supplies"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description / About
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              placeholder="Tell customers about your business..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Business Hours
              </div>
            </label>
            <input
              type="text"
              name="businessHours"
              value={formData.businessHours}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Mon-Sat: 9AM - 6PM"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessDetailsTab;
