import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || 0),
    0
  );

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const storedOrders = JSON.parse(localStorage.getItem("myOrders")) || [];

    // 🔢 Generate unique order ID
    const lastOrder = storedOrders[storedOrders.length - 1];
    const lastId = lastOrder ? parseInt(lastOrder.id.replace("ORD", "")) : 0;
    const newOrderId = `ORD${(lastId + 1).toString().padStart(3, "0")}`;

    const newOrder = {
      id: newOrderId,
      items: cart,
      total,
      date: new Date().toLocaleDateString(),
      status: "Pending", // or "Confirmed"
    };

    // ✅ Save to myOrders
    const updatedOrders = [...storedOrders, newOrder];
    localStorage.setItem("myOrders", JSON.stringify(updatedOrders));

    // 🧹 Clear cart
    clearCart();

    // ✅ Navigate or toast
    toast.success(`Order ${newOrderId} placed successfully!`);
    navigate("/my-orders");
  };
  

  return (
    <div className="min-h-screen py-8 px-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
        🧾 Checkout Summary
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-xl text-red-600 mt-20">
          😕 No items in cart to checkout.
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* 🛒 Cart Items */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              📦 Items in Your Cart
            </h2>
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="border-b border-gray-300 dark:border-gray-700 py-3"
              >
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          {/* 💳 Payment & Summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">💳 Payment & Summary</h2>

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Select Payment Method:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            <div className="text-lg font-semibold mt-6">
              Total: ₹{totalAmount.toFixed(2)}
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
            >
              ✅ Place Order
            </button>
          </div>
        </div>
      )}

      {/* ✅ Order Placed Popup */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              🎉 Order Placed!
            </h2>
            <p>Your items are on their way. Redirecting to orders...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
