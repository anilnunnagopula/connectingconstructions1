import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const Login = () => {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("All fields are required.");
    return;
  }

  try {
    // const response = await fetch("http://localhost:5000/api/auth/login", {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role }), // include role!
        }
      );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed.");
    } else {
      alert(`Logged in as ${data.role}`);
      const userData = {
        name: data.name || email.split("@")[0], // fallback if name not available
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {role === "customer" ? "Customer Login" : "Supplier Login"}
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRole("customer")}
            className={`px-4 py-2 rounded-md ${
              role === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setRole("supplier")}
            className={`px-4 py-2 rounded-md ${
              role === "supplier"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Supplier
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your password"
                required
              />
              <p className="text-sm mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </p>

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
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
