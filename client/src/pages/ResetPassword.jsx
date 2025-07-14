import React, { useState, useEffect } from "react"; // Import useEffect
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Access the email directly from location.state
  const email = location.state?.email;

  // Optional: Add a useEffect to redirect if email is not present
  useEffect(() => {
    if (!email) {
      setError("Email not provided. Please go back to forgot password.");
      setTimeout(() => {
        navigate("/forgot-password"); // Redirect back to forgot password
      }, 2000);
    }
  }, [email, navigate]); // Depend on email and navigate

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is missing. Cannot reset password.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Reset failed.");
      } else {
        setMessage("Password reset successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {message && (
          <p className="text-green-600 mb-3 text-center">{message}</p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email || ""} // Display the email, disable editing
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            disabled={!email} // Disable button if email is not present
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
