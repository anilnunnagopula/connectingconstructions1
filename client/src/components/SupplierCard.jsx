import React from "react";
import { useCart } from "../context/CartContext";

const SupplierCard = ({ product, user }) => {
  const { addToCart } = useCart();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition flex flex-col">
      {/* 🖼️ Image */}
      <div className="h-40 mb-4 overflow-hidden rounded">
        <img
          src={`${process.env.PUBLIC_URL}/products/${
            product.image || "default.jpg"
          }`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 🏷️ Product Info */}
      <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        📍 {product.location || "Unknown location"}
      </p>
      <p className="text-blue-600 font-semibold mb-3">₹{product.price}</p>

      {/* 🛒 Add to Cart */}
      <button
        onClick={() => addToCart(product)}
        className="mt-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        ➕ Add to Cart
      </button>
    </div>
  );
};

export default SupplierCard;
