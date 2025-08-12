import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CompleteProfile = () => {
  const { user, isAuthenticated, isAuthLoading, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: "student", // Default role
    phoneNumber: "",
    hostelName: "", // Optional for hostel owners
    hostelLocation: "", // Optional for hostel owners
    error: "",
    loading: false,
  });

  // Redirect if user is already complete or not logged in
  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // TODO: Uncomment this logic once your backend correctly returns the isProfileComplete flag
    // if (user?.isProfileComplete) {
    //   navigate(`/${user.role}-dashboard`);
    // }
  }, [user, isAuthenticated, isAuthLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, error: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      // Basic validation
      if (!formData.phoneNumber) {
        throw new Error("Phone number is required.");
      }
      if (formData.role === "hostel owner" && !formData.hostelName) {
        throw new Error("Hostel name is required for hostel owners.");
      }

      // CRITICAL FIX: Changed endpoint from /api/user to /api/auth
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/complete-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Send auth token
          },
          body: JSON.stringify({
            role: formData.role,
            phoneNumber: formData.phoneNumber,
            hostelName: formData.hostelName,
            hostelLocation: formData.hostelLocation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete profile.");
      }

      // Update the user state in the context with the new user data
      login(data.user);

      // Redirect to the appropriate dashboard
      navigate(`/${data.user.role}-dashboard`);
    } catch (err) {
      console.error("Profile completion error:", err);
      setFormData((prev) => ({
        ...prev,
        error: err.message || "An unexpected error occurred.",
      }));
    } finally {
      setFormData((prev) => ({ ...prev, loading: false }));
    }
  };

  if (isAuthLoading || !user) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Complete Your Profile
        </h2>

        {formData.error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {formData.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              I am a...
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="student">Student</option>
              <option value="hostel owner">Hostel Owner</option>
            </select>
          </div>

          {/* Conditional fields for Hostel Owner */}
          {formData.role === "hostel owner" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Hostel Name
                </label>
                <input
                  type="text"
                  name="hostelName"
                  value={formData.hostelName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Hostel Location
                </label>
                <input
                  type="text"
                  name="hostelLocation"
                  value={formData.hostelLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={formData.loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            {formData.loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
