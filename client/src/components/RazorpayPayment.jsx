// client/src/components/RazorpayPayment.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayFailure,
} from "../services/customerApiService";
import { useAuth } from "../context/AuthContext";

/**
 * Razorpay Payment Component
 * Handles Razorpay payment initialization and processing
 */
const RazorpayPayment = ({ orderId, amount, onSuccess, onFailure, disabled = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Razorpay SDK loaded");
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load Razorpay SDK");
      toast.error("Failed to load payment gateway. Please refresh the page.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway not loaded yet. Please wait.");
      return;
    }

    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Razorpay order
      console.log("🔄 Creating Razorpay order...");
      const orderResponse = await createRazorpayOrder(orderId, amount);

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || "Failed to create payment order");
      }

      const { razorpayOrderId, amount: orderAmount, currency, key } = orderResponse.data;

      console.log("✅ Razorpay order created:", razorpayOrderId);

      // Step 2: Configure Razorpay options
      const options = {
        key: key, // Razorpay key from backend
        amount: orderAmount, // Amount in paise
        currency: currency,
        name: "ConnectingConstructions",
        description: `Order Payment - #${orderId.slice(-6)}`,
        order_id: razorpayOrderId,
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#2563eb", // Blue color matching your design
        },
        modal: {
          ondismiss: () => {
            console.log("⚠️ Payment cancelled by user");
            setLoading(false);
            toast.error("Payment cancelled");
          },
        },
        handler: async (response) => {
          // Payment success handler
          console.log("✅ Payment successful:", response);
          await verifyPayment(response);
        },
      };

      // Step 3: Open Razorpay checkout
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async (response) => {
        // Payment failure handler
        console.error("❌ Payment failed:", response.error);

        const errorData = {
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
          metadata: response.error.metadata,
        };

        // Record failure in backend
        await handleRazorpayFailure(orderId, errorData);

        setLoading(false);
        toast.error(`Payment failed: ${response.error.description}`);

        if (onFailure) {
          onFailure(errorData);
        }
      });

      rzp.open();
    } catch (error) {
      console.error("❌ Payment error:", error);
      setLoading(false);
      toast.error(error.message || "Payment failed. Please try again.");

      if (onFailure) {
        onFailure(error);
      }
    }
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      console.log("🔄 Verifying payment...");

      const verificationData = {
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature,
        orderId: orderId,
      };

      const verifyResponse = await verifyRazorpayPayment(verificationData);

      if (verifyResponse.success) {
        console.log("✅ Payment verified successfully");
        toast.success("Payment successful! Your order has been confirmed.");
        setLoading(false);

        if (onSuccess) {
          onSuccess(verifyResponse.data);
        }
      } else {
        throw new Error(verifyResponse.error || "Payment verification failed");
      }
    } catch (error) {
      console.error("❌ Payment verification error:", error);
      setLoading(false);
      toast.error("Payment verification failed. Please contact support.");

      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <CreditCard className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Pay with Razorpay
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Credit/Debit Card, UPI, Net Banking & More
          </p>
        </div>
      </div>

      {/* Amount Display */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{amount?.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Security Info */}
      <div className="flex items-start gap-2 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Lock className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-blue-900 dark:text-blue-200">
          Your payment is secured with 256-bit encryption. We don't store your card details.
        </p>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={disabled || loading || !razorpayLoaded}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : !razorpayLoaded ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Loading Payment Gateway...
          </>
        ) : (
          <>
            <Lock size={18} />
            Pay ₹{amount?.toLocaleString("en-IN")} Securely
          </>
        )}
      </button>

      {/* Supported Methods */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
          Supported Payment Methods:
        </p>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
            💳 Cards
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
            📱 UPI
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
            🏦 Net Banking
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
            💰 Wallets
          </span>
        </div>
      </div>

      {/* Info Alert */}
      {!razorpayLoaded && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-yellow-900 dark:text-yellow-200">
            Please wait while we load the secure payment gateway...
          </p>
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;
