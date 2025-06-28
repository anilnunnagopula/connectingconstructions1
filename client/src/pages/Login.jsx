import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("customer"); // or "supplier"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    // ✅ Test credentials shortcut
    if (
      (role === "customer" &&
        email === "customer@gmail.com" &&
        password === "customer") ||
      (role === "supplier" &&
        email === "supplier@gmail.com" &&
        password === "supplier")
    ) {
      alert(`Logged in as ${role} (Test Mode ✅)`);
      localStorage.setItem(
        "user",
        JSON.stringify({ name: email.split("@")[0], email, role })
      );
      if (role === "customer") navigate("/customer-dashboard");
      else navigate("/supplier-dashboard");
      return;
    }

    // 🌐 Real API call
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
      } else {
        alert(`Logged in as ${data.role}`);
        const userData = {
          name: data.name || email.split("@")[0],
          email,
          role: data.role,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        if (data.role === "customer") {
          navigate("/customer-dashboard");
        } else if (data.role === "supplier") {
          navigate("/supplier-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600 dark:text-white">
          {role === "customer" ? "Customer Login" : "Supplier Login"}
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRole("customer")}
            className={`px-4 py-2 rounded-md ${
              role === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setRole("supplier")}
            className={`px-4 py-2 rounded-md ${
              role === "supplier"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Supplier
          </button>
        </div>

        {/* 🎯 Test Credentials Box */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-800 p-3 rounded">
          <p className="font-semibold mb-1">🧪 Test Login</p>
          <p>
            👤 <strong>Customer:</strong> customer@gmail.com | password:
            customer
          </p>
          <p>
            🏭 <strong>Supplier:</strong> supplier@gmail.com | password:
            supplier
          </p>
        </div>

        {/* Error Msg */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <p className="text-sm mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Login as {role}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
