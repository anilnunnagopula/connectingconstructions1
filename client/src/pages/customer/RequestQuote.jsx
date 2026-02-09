// client/src/pages/customer/RequestQuote.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, MapPin, Calendar, Send, ArrowLeft } from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";

const baseURL = process.env.REACT_APP_API_URL;

const RequestQuote = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    {
      type: "product",
      name: "",
      quantity: 1,
      unit: "bags",
      specifications: "",
      productRef: productId || "",
    },
  ]);

  const [deliveryLocation, setDeliveryLocation] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [requiredBy, setRequiredBy] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [broadcastToAll, setBroadcastToAll] = useState(true);

  // Product types
  const productTypes = [
    { value: "product", label: "Material/Product" },
    { value: "service", label: "Service" },
    { value: "logistics", label: "Logistics/Transport" },
  ];

  // Units based on type
  const getUnitsForType = (type) => {
    if (type === "product") {
      return ["bags", "kg", "tonnes", "liters", "cubic_ft", "pieces", "units"];
    } else if (type === "service") {
      return ["service", "hours", "days"];
    } else {
      return ["trips", "hours", "days"];
    }
  };

  // Add item
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        type: "product",
        name: "",
        quantity: 1,
        unit: "bags",
        specifications: "",
      },
    ]);
  };

  // Remove item
  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      toast.error("At least one item is required");
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Update item
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    // Reset unit when type changes
    if (field === "type") {
      updated[index].unit = getUnitsForType(value)[0];
    }

    setItems(updated);
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // client/src/pages/customer/RequestQuote.jsx

  // Find the handleSubmit function and update it:

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (items.some((item) => !item.name || !item.quantity)) {
      toast.error("Please fill all item details");
      return;
    }

    if (
      !deliveryLocation.address ||
      !deliveryLocation.city ||
      !deliveryLocation.state ||
      !deliveryLocation.pincode
    ) {
      toast.error("Please fill complete delivery address");
      return;
    }

    if (!requiredBy) {
      toast.error("Please select required date");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // ✅ Clean items - remove empty productRef
      const cleanedItems = items.map((item) => {
        const cleaned = {
          type: item.type,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          specifications: item.specifications || "",
        };

        // Only include productRef if it's a valid ObjectId
        if (item.productRef && item.productRef.trim() !== "") {
          cleaned.productRef = item.productRef;
        }

        return cleaned;
      });

      const response = await axios.post(
        `${baseURL}/api/quotes/request`,
        {
          items: cleanedItems, // ✅ Use cleaned items
          deliveryLocation,
          requiredBy,
          additionalNotes,
          broadcastToAll,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      console.log("✅ Quote request created:", response.data);

      toast.success("Quote request submitted successfully!");
      navigate("/customer/quotes");
    } catch (error) {
      console.error("❌ Quote request error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to submit quote request";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Request Quote
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get custom quotes from suppliers
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Items Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Items Required
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item {index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type *
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) =>
                          handleItemChange(index, "type", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        {productTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name/Description *
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        placeholder="e.g., OPC 53 Grade Cement"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value),
                          )
                        }
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    {/* Unit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unit *
                      </label>
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          handleItemChange(index, "unit", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        {getUnitsForType(item.type).map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Specifications */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Specifications (Optional)
                      </label>
                      <textarea
                        value={item.specifications}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "specifications",
                            e.target.value,
                          )
                        }
                        placeholder="Any specific requirements, grade, size, etc."
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Location */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Delivery Location
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={deliveryLocation.address}
                  onChange={(e) =>
                    setDeliveryLocation({
                      ...deliveryLocation,
                      address: e.target.value,
                    })
                  }
                  placeholder="Street address, building, landmark"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={deliveryLocation.city}
                  onChange={(e) =>
                    setDeliveryLocation({
                      ...deliveryLocation,
                      city: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={deliveryLocation.state}
                  onChange={(e) =>
                    setDeliveryLocation({
                      ...deliveryLocation,
                      state: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={deliveryLocation.pincode}
                  onChange={(e) =>
                    setDeliveryLocation({
                      ...deliveryLocation,
                      pincode: e.target.value,
                    })
                  }
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Timeline & Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Timeline & Additional Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Required By *
                </label>
                <input
                  type="date"
                  value={requiredBy}
                  onChange={(e) => setRequiredBy(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any special requirements, delivery instructions, etc."
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {additionalNotes.length}/1000 characters
                </p>
              </div>
            </div>
          </div>

          {/* Supplier Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Send Quote To
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={broadcastToAll}
                onChange={(e) => setBroadcastToAll(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Broadcast to all suppliers
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send this quote request to all matching suppliers
                </p>
              </div>
            </label>

            {!broadcastToAll && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Feature coming soon: Select specific suppliers
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {loading ? "Submitting..." : "Submit Quote Request"}
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};;

export default RequestQuote;
