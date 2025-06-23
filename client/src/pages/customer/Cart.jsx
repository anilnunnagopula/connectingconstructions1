import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || 0),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-gray-600 dark:text-gray-300">
        🛒 Your cart is empty.
      </div>
    );
  }

  return (
    <div className="pt-10 pb-20 px-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        🧺 Your Cart Items
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cartItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl rounded-lg overflow-hidden transition"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={`${process.env.PUBLIC_URL}/products/${
                  item.image || "default.jpg"
                }`}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col justify-between h-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                📍 {item.location || "Not specified"}
              </p>
              <p className="text-lg font-bold text-blue-600 mt-2">
                ₹{item.price}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-4 text-red-600 hover:text-red-800 font-medium"
              >
                ❌ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Panel */}
      <div className="mt-12 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          🧮 Total Amount:{" "}
          <span className="text-blue-600">₹{totalPrice.toFixed(2)}</span>
        </h3>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={clearCart}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
          >
            🧹 Clear Cart
          </button>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
          >
            ✅ Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
