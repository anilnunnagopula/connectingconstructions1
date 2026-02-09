// client/src/components/QuantitySelector.jsx
import React from "react";
import { Minus, Plus } from "lucide-react";

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 9999,
  step = 1,
  unit = "units",
  price = 0,
  disabled = false,
}) => {
  const handleDecrease = () => {
    const newQty = Math.max(min, quantity - step);
    onQuantityChange(newQty);
  };

  const handleIncrease = () => {
    const newQty = Math.min(max, quantity + step);
    onQuantityChange(newQty);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || min;
    const newQty = Math.max(min, Math.min(max, value));
    onQuantityChange(newQty);
  };

  const totalPrice = (quantity * price).toLocaleString("en-IN");

  return (
    <div className="space-y-3">
      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
          Quantity:
        </span>

        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={handleDecrease}
            disabled={disabled || quantity <= min}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Minus size={18} />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-20 text-center bg-transparent border-x border-gray-300 dark:border-gray-600 py-2 text-lg font-semibold focus:outline-none disabled:opacity-50"
            min={min}
            max={max}
            step={step}
          />

          <button
            onClick={handleIncrease}
            disabled={disabled || quantity >= max}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Plus size={18} />
          </button>
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
      </div>

      {/* Price Calculation */}
      {price > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            ₹{price.toLocaleString("en-IN")} × {quantity} {unit}
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{totalPrice}
          </span>
        </div>
      )}

      {/* Min/Max Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Min: {min} {unit} • Max: {max} {unit} • Step: {step}
      </div>
    </div>
  );
};

export default QuantitySelector;
