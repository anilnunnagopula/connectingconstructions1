import React from "react";
import { Building, FileText, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

const BusinessInfoTab = ({ profileData, onDataChange, onSave, saving }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.businessName?.trim()) {
      toast.error("Business name is required");
      return;
    }
    await onSave();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Business Information</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Business Name *
          </label>
          <input
            type="text"
            value={profileData.businessName}
            onChange={(e) => onDataChange("businessName", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
        </div>

        {/* GST Number */}
        <div>
          <label className="block text-sm font-medium mb-2">GST Number</label>
          <input
            type="text"
            value={profileData.gstNumber}
            onChange={(e) => onDataChange("gstNumber", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="22AAAAA0000A1Z5"
          />
        </div>

        {/* Business Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Business Description
          </label>
          <textarea
            rows="4"
            value={profileData.businessDescription}
            onChange={(e) =>
              onDataChange("businessDescription", e.target.value)
            }
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Describe your business..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {saving ? "Saving..." : "Save Business Info"}
        </button>
      </form>
    </div>
  );
};

export default BusinessInfoTab;
