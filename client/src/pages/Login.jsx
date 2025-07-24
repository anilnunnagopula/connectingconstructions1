import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    role: "customer",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    // --- IMPORTANT: Remove or disable these hardcoded test credentials in production ---
    // They bypass your actual backend authentication.
    // For development, they can be useful, but ensure they are not deployed.
    if (
      (formData.role === "customer" &&
        formData.email === "customer@gmail.com" &&
        formData.password === "customer") ||
      (formData.role === "supplier" &&
        formData.email === "supplier@gmail.com" &&
        formData.password === "supplier")
    ) {
      // For these test credentials, you'd also need to mock a token if you plan to use them for protected routes.
      // For now, if you use this, protected routes will still fail without a real token.
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: formData.email.split("@")[0],
          email: formData.email,
          role: formData.role,
          // Mock a token here IF you still want to use these for testing protected routes,
          // but it's better to just use real user registrations for that.
          // token: "mock-token-for-testing-only"
        })
      );
      navigate(`/${formData.role}-dashboard`);
      return;
    }
    // --- End of hardcoded test credentials block ---

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json(); // Always parse JSON for error details
      if (!response.ok) {
        // If response.ok is false, it's an HTTP error (e.g., 400, 401, 500)
        // The backend sends { error: "Invalid credentials" } or similar
        throw new Error(data.error || "Login failed.");
      }

      // --- CRUCIAL CHANGE HERE: Store the token and _id from the backend response ---
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id, // Store the user's MongoDB ID
          name: data.name, // The backend now sends the user's name
          email: data.email,
          role: data.role,
          token: data.token, // Store the JWT token from the backend
          username: data.username, // Store username if returned and needed on client-side
        })
      );
      // --- End of CRUCIAL CHANGE ---

      // Navigate to the correct dashboard based on the role returned from the server
      navigate(`/${data.role}-dashboard`);
    } catch (err) {
      console.error("Login submission error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          {formData.role === "customer" ? "Customer Login" : "Supplier Login"}
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

        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-800 rounded text-sm">
          <p className="font-semibold mb-1">Test Credentials</p>
          <p>👤 Customer: customer@gmail.com | password: customer</p>
          <p>🏭 Supplier: supplier@gmail.com | password: supplier</p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Login as {formData.role}
          </button>

          <p className="text-center text-sm mt-4 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
