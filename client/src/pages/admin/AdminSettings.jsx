import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Loader, Shield, globe, ToggleLeft, ToggleRight, Layout, Lock } from "lucide-react";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      siteName: "",
      supportEmail: "",
      contactPhone: "",
      address: ""
    },
    features: {
      maintenanceMode: false,
      allowRegistration: true,
      enableReviews: true
    },
    security: {
      maxLoginAttempts: 5,
      passwordMinLength: 6
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const baseURL = process.env.REACT_APP_API_URL;
        
        const res = await axios.get(`${baseURL}/api/admin/settings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSettings(res.data);
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast.error("Failed to load settings");
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [field]: value
        }
    }));
  };

  const handleSave = async () => {
    try {
        setSaving(true);
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const baseURL = process.env.REACT_APP_API_URL;

        await axios.put(`${baseURL}/api/admin/settings`, settings, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Settings saved successfully");
    } catch (error) {
        console.error("Save error:", error);
        toast.error("Failed to save settings");
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader className="animate-spin mx-auto" /> Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Platform Settings</h1>
        <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
            {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        {["general", "features", "security"].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-4 capitalize font-medium transition-colors ${
                    activeTab === tab 
                    ? "border-b-2 border-blue-600 text-blue-600" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        
        {/* General Settings */}
        {activeTab === "general" && (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Layout size={20} /> General Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Name</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={settings.general.siteName}
                            onChange={(e) => handleChange("general", "siteName", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
                        <input 
                            type="email" 
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={settings.general.supportEmail}
                            onChange={(e) => handleChange("general", "supportEmail", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Phone</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={settings.general.contactPhone}
                            onChange={(e) => handleChange("general", "contactPhone", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={settings.general.address}
                            onChange={(e) => handleChange("general", "address", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Feature Toggles */}
        {activeTab === "features" && (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ToggleLeft size={20} /> Feature Management
                </h2>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                        <h3 className="font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Disable site access for non-admins</p>
                    </div>
                    <button 
                        onClick={() => handleChange("features", "maintenanceMode", !settings.features.maintenanceMode)}
                        className={`p-1 rounded-full w-12 transition-colors ${settings.features.maintenanceMode ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.features.maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                        <h3 className="font-medium">Allow User Registration</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Turn off to stop new signups</p>
                    </div>
                    <button 
                        onClick={() => handleChange("features", "allowRegistration", !settings.features.allowRegistration)}
                        className={`p-1 rounded-full w-12 transition-colors ${settings.features.allowRegistration ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                         <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.features.allowRegistration ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                        <h3 className="font-medium">Enable Reviews</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow customers to write product reviews</p>
                    </div>
                    <button 
                        onClick={() => handleChange("features", "enableReviews", !settings.features.enableReviews)}
                        className={`p-1 rounded-full w-12 transition-colors ${settings.features.enableReviews ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                         <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.features.enableReviews ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                </div>
            </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield size={20} /> Security Policy
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Login Attempts</label>
                        <input 
                            type="number" 
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={settings.security.maxLoginAttempts}
                            onChange={(e) => handleChange("security", "maxLoginAttempts", parseInt(e.target.value))}
                        />
                        <p className="text-xs text-gray-500 mt-1">Lock account after X failed attempts</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Password Length</label>
                        <input 
                            type="number" 
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={settings.security.passwordMinLength}
                            onChange={(e) => handleChange("security", "passwordMinLength", parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminSettings;
