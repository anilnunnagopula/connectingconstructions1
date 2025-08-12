import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  // State for form data, including a default role and other fields
  const [formData, setFormData] = useState({
    role: "customer",
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // State for showing/hiding the password fields
  const [showPassword, setShowPassword] = useState(false);
  // State for displaying general errors
  const [error, setError] = useState("");
  // State for displaying password mismatch errors
  const [passwordMatchError, setPasswordMatchError] = useState("");
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
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      // Automatically generate a username from the name field
      if (name === "name") {
        newState.username = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }
      return newState;
    });
    // Clear password mismatch error when typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatchError("");
    }
  };

  // Function to handle the Google Sign-In callback
  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError("");

    try {
      // Send the ID token and selected role to your backend for registration
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
        throw new Error(data.error || "Google registration failed.");
      }

      // Call the login function from AuthContext to handle state and localStorage
      login(data);

      // Navigate to the correct dashboard based on the role
      navigate(`/${data.role}-dashboard`);
    } catch (err) {
      console.error("Google registration error:", err);
      setError(err.message || "Google registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handles the standard email/password form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPasswordMatchError("");

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    // Generate a username if one isn't explicitly provided
    let finalUsername = formData.username;
    if (!finalUsername && formData.name) {
      finalUsername = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    } else if (!finalUsername && formData.email) {
      finalUsername = formData.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: formData.role,
            name: formData.name,
            username: finalUsername,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      // Call the login function from AuthContext to handle state and localStorage
      login(data);

      navigate(`/${data.role}-dashboard`);
    } catch (err) {
      console.error("Registration submission error:", err);
      setError(
        err.message.includes("timed out")
          ? "Database connection timed out. Please try again."
          : err.message
      );
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
            { theme: "outline", size: "large", text: "signup_with" }
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">
          {formData.role === "customer"
            ? "Customer Register"
            : "Supplier Register"}
        </h2>

        {/* Role selection buttons */}
        <div className="flex justify-center gap-3 mb-4">
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
        {passwordMatchError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {passwordMatchError}
          </div>
        )}

        {/* Standard registration form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
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
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
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
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              required
            />
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
            Register as {formData.role}
          </button>
        </form>

        {/* OR divider and Google Sign-Up button */}
        <div className="relative flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        {/* This div is where the Google Sign-Up button will be rendered by the SDK */}
        <div
          ref={googleSignInButtonRef}
          className="w-full flex justify-center"
        ></div>

        {/* Login link */}
        <p className="text-center text-sm mt-4 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
