import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || ""; // ✅ email passed from forgot password page
  const [otp, setOtp] = useState("");
  const [resendStatus, setResendStatus] = useState("");

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        // "http://localhost:5000/api/auth/verify-otp",
        `${process.env.REACT_APP_API_URL}/api/auth/verify-otp`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/reset-password", { state: { email } }); // ✅ pass email to next page
      } else {
        alert(data.error || "OTP verification failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(
        // "http://localhost:5000/api/auth/resend-otp",
        `${process.env.REACT_APP_API_URL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setResendStatus("✅ OTP resent successfully!");
      } else {
        setResendStatus(data.error || "Failed to resend OTP");
      }
    } catch (err) {
      setResendStatus("Something went wrong.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-2 rounded mb-3"
        placeholder="Enter OTP"
      />

      <button
        onClick={handleVerifyOtp}
        className="w-full bg-blue-600 text-white p-2 rounded mb-2"
      >
        Verify OTP
      </button>

      <button
        onClick={handleResendOtp}
        className="text-sm text-blue-600 hover:underline"
      >
        Resend OTP
      </button>

      {resendStatus && <p className="mt-2 text-green-600">{resendStatus}</p>}
    </div>
  );
};

export default VerifyOtp;
