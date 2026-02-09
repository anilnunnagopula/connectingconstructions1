// client/src/pages/customer/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CustomerLayout from "../../layout/CustomerLayout";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    totalItems,
    totalPrice,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleQuantityChange = async (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    await updateQuantity(productId, newQty);
  };

  const handleRemove = async (productId) => {
    if (window.confirm("Remove this item from cart?")) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Clear entire cart?")) {
      await clearCart();
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading cart...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <CustomerLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <ShoppingBag
            size={80}
            className="text-gray-300 dark:text-gray-600 mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some construction materials to get started!
          </p>
          <button
            onClick={() => navigate("/materials")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
          >
            <ShoppingBag size={20} />
            Browse Materials
          </button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={loading}
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          )}
        </div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                loading={loading}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    FREE
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/customer/checkout")}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/materials")}
                className="w-full mt-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

// ===== CART ITEM COMPONENT =====
const CartItem = ({ item, onQuantityChange, onRemove, loading }) => {
  const product = item.product;
  const snapshot = item.productSnapshot;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {snapshot?.imageUrl || product?.imageUrls?.[0] ? (
            <img
              src={snapshot?.imageUrl || product?.imageUrls?.[0]}
              alt={snapshot?.name || product?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingBag size={32} />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {snapshot?.name || product?.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {snapshot?.category || product?.category}
          </p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
            ₹{(snapshot?.price || product?.price || 0).toLocaleString("en-IN")}
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-1">
              / {snapshot?.unit || product?.unit || "unit"}
            </span>
          </p>
        </div>

        {/* Remove Button (Desktop) */}
        <button
          onClick={() => onRemove(product._id)}
          disabled={loading}
          className="hidden md:block p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Quantity:
          </span>
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => onQuantityChange(product._id, item.quantity, -1)}
              disabled={loading || item.quantity <= 1}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(product._id, item.quantity, 1)}
              disabled={loading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ₹
            {(
              (snapshot?.price || product?.price || 0) * item.quantity
            ).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Remove Button (Mobile) */}
        <button
          onClick={() => onRemove(product._id)}
          disabled={loading}
          className="md:hidden p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Cart;
