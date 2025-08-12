import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  // State for form data, including a default role
  const [formData, setFormData] = useState({
    role: "customer",
    email: "",
    password: "",
  });
  // State for showing/hiding the password
  const [showPassword, setShowPassword] = useState(false);
  // State for displaying form errors
  const [error, setError] = useState("");
  // State for managing loading status during API calls
  const [loading, setLoading] = useState(false);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Reference for the Google Sign-In button container, used by the Google SDK
  const googleSignInButtonRef = useRef(null);

  // Call the useAuth hook to get the login function from context
  const { login } = useAuth();

  // Handles form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle the Google Sign-In callback
  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError("");

    try {
      // Send the ID token and selected role to your backend for verification
      const apiResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: response.credential,
            role: formData.role, // Use the role selected by the user
          }),
        }
      );

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || "Google login failed.");
      }

      // Call the login function from AuthContext to handle state and localStorage
      login(data);

      // Navigate to the correct dashboard based on the role returned from the server
      navigate(`/${data.role}-dashboard`);
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handles the standard email/password form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      // Call the login function from AuthContext
      login(data);

      // Navigate to the correct dashboard based on the role
      navigate(`/${data.role}-dashboard`);
    } catch (err) {
      console.error("Login submission error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // This useEffect hook handles loading the Google Identity Services script
  // and rendering the Google Sign-In button on component mount.
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        // Initialize the Google Identity Services client
        window.google.accounts.id.initialize({
          // TODO: Replace with your actual Google Client ID from your .env file
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        });

        // Render the Google Sign-In button inside our ref container
        if (googleSignInButtonRef.current) {
          window.google.accounts.id.renderButton(
            googleSignInButtonRef.current,
            { theme: "outline", size: "large", text: "signin_with" }
          );
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, [formData.role]); // Rerun the effect if the user's selected role changes

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          {formData.role === "customer" ? "Customer Login" : "Supplier Login"}
        </h2>

        {/* Role selection buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["customer", "supplier"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
              className={`px-4 py-2 rounded-md capitalize ${
                formData.role === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Standard email/password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline block text-right mt-1"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-bold rounded-md transition-colors ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Login as {formData.role}
          </button>
        </form>

        {/* OR divider and Google Sign-In button */}
        <div className="relative flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        {/* This div is where the Google Sign-In button will be rendered by the SDK */}
        <div
          ref={googleSignInButtonRef}
          className="w-full flex justify-center"
        ></div>

        {/* Registration link */}
        <p className="text-center text-sm mt-4 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
