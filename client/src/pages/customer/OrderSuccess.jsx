// client/src/pages/customer/OrderSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CheckCircle, Package, Home } from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import confetti from "canvas-confetti";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();

  const orderData = location.state?.orderData;
  const fromQuote = location.state?.fromQuote;

  useEffect(() => {
    // Celebrate! 🎉
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <CustomerLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle
                size={48}
                className="text-green-600 dark:text-green-400"
              />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {fromQuote ? "Quote Accepted!" : "Order Placed Successfully!"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {fromQuote
                ? "Your order has been created from the accepted quote. The supplier will process it soon."
                : "Thank you for your order. We'll send you a confirmation email shortly."}
            </p>

            {/* Order Details */}
            {orderData && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Order Number
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {orderData.orderNumber}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{orderData.totalAmount?.toLocaleString("en-IN")}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/customer/orders/${orderId}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <Package size={20} />
                View Order Details
              </button>
              <button
                onClick={() => navigate("/customer/orders")}
                className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <Package size={20} />
                My Orders
              </button>
              <button
                onClick={() => navigate("/customer-dashboard")}
                className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
export default OrderSuccess;
