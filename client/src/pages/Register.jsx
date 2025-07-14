import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    role: "customer",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(""); // New state for password mismatch
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear password mismatch error when typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatchError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous server errors
    setPasswordMatchError(""); // Clear previous password errors

    // Client-side validation: Password and Confirm Password Match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      return; // Stop submission if passwords don't match
    }

    // Client-side validation: Password length (optional, but good practice)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: formData.role,
            email: formData.email,
            password: formData.password, // Send the password
            name: formData.name,
          }),
        }
      );

      const data = await response.json(); // Always parse JSON for error details

      if (!response.ok) {
        // If response.ok is false, it's an HTTP error (e.g., 400, 500)
        // The backend sends { error: "Email already exists" } or similar
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      // If response.ok is true (e.g., 201 Created)
      navigate("/login"); // Navigate on successful registration
    } catch (err) {
      console.error("Registration submission error:", err); // Log the full error
      setError(
        err.message.includes("timed out")
          ? "Database connection timed out. Please try again."
          : err.message // Display the backend's error message (e.g., "Email already exists")
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

        {error && ( // Display server-side errors (like "Email already exists")
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {passwordMatchError && ( // Display client-side password mismatch error
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
                minLength="6" // HTML5 minLength attribute for basic client-side validation
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
