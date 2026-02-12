import React, { useState } from "react";
import { Lock, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const SecurityTab = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordInfo.currentPassword ||
      !passwordInfo.newPassword ||
      !passwordInfo.confirmNewPassword
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordInfo.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // The backend expects password fields in the profile update endpoint 
      // OR a dedicated password change endpoint. 
      // Based on SettingsPage.jsx, it was sending to /api/auth/profile with password fields.
      // Let's stick to that for now, or use a specific endpoint if one existed (SettingsPage used auth/profile).
      
      const updateData = {
        currentPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword,
      };

      await axios.put(
        `${baseURL}/api/auth/profile`, 
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password updated successfully!");
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Lock className="text-blue-600" size={24} />
        Security & Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordInfo.currentPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordInfo.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            value={passwordInfo.confirmNewPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecurityTab;
