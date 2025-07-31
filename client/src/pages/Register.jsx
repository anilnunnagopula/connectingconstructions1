import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // IMPORT useAuth

const Register = () => {
  const [formData, setFormData] = useState({
    role: "customer",
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const navigate = useNavigate();

  // CALL the useAuth hook to get the login function from context
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "name") {
        newState.username = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }
      return newState;
    });
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatchError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordMatchError("");

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

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

      // --- CRITICAL FIX ---
      // Instead of writing to localStorage directly, call the login function from AuthContext.
      // The backend's register route is designed to return the same user data as the login route,
      // so we can use the same login function to update the global state.
      login(data);
      // --- END CRITICAL FIX ---

      navigate(`/${data.role}-dashboard`);
    } catch (err) {
      console.error("Registration submission error:", err);
      setError(
        err.message.includes("timed out")
          ? "Database connection timed out. Please try again."
          : err.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          {formData.role === "customer"
            ? "Customer Register"
            : "Supplier Register"}
        </h2>
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Register as {formData.role}
          </button>
          <p className="text-center text-sm mt-4 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
