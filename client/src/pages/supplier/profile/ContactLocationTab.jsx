import React, { useState } from "react";
import { User, MapPin, Phone, Mail, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { GoogleMap, Marker } from "@react-google-maps/api";

const baseURL = process.env.REACT_APP_API_URL;
const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
};
const defaultCenter = { lat: 17.385, lng: 78.4867 }; // Hyderabad

const ContactLocationTab = ({ user, token, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    location: user?.location || { type: "Point", coordinates: [78.4867, 17.385] },
  });

  const [markerPosition, setMarkerPosition] = useState({
    lat: user?.location?.coordinates[1] || defaultCenter.lat,
    lng: user?.location?.coordinates[0] || defaultCenter.lng,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onMapClick = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setMarkerPosition({ lat: newLat, lng: newLng });
    setFormData((prev) => ({
      ...prev,
      location: { type: "Point", coordinates: [newLng, newLat] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${baseURL}/api/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Contact & Location updated!");
      onUpdate(response.data);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <MapPin className="text-blue-600" size={24} />
        Contact & Location
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <div className="flex items-center gap-2"><User size={16}/> Full Name</div>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <div className="flex items-center gap-2"><Mail size={16}/> Email Address</div>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <div className="flex items-center gap-2"><Phone size={16}/> Phone Number</div>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
               className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Store Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
               className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Map Section */}
        <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPosition}
            zoom={13}
            onClick={onMapClick}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
          <p className="text-xs text-center text-gray-500 bg-gray-50 dark:bg-gray-700 p-2">
            Tap on the map to pin your exact store location.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Contact Info"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactLocationTab;
