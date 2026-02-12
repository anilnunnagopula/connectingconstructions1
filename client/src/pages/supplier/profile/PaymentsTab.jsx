import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const PaymentsTab = ({ token }) => {
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [newMethodForm, setNewMethodForm] = useState({
    type: "BANK_TRANSFER",
    details: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
      upiId: "",
    },
    isDefault: false,
  });

  const fetchPayoutMethods = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/supplier/payout-methods`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayoutMethods(response.data);
    } catch (err) {
      console.error("Error fetching payout methods:", err);
      toast.error("Failed to load payment methods.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPayoutMethods();
  }, [fetchPayoutMethods, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "type") {
      setNewMethodForm((prev) => ({
        ...prev,
        type: value,
        details: {
          accountNumber: "",
          upiId: "",
          ifscCode: "",
          bankName: "",
          accountHolderName: "",
        },
      }));
    } else if (type === "checkbox") {
      setNewMethodForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setNewMethodForm((prev) => ({
        ...prev,
        details: { ...prev.details, [name]: value },
      }));
    }
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(
        `${baseURL}/api/supplier/payout-methods`,
        newMethodForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Payout method added!");
      setNewMethodForm({
        type: "BANK_TRANSFER",
        details: {
          accountNumber: "",
          upiId: "",
          ifscCode: "",
          bankName: "",
          accountHolderName: "",
        },
        isDefault: false,
      });
      fetchPayoutMethods();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add method.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment method?")) return;
    try {
      await axios.delete(
        `${baseURL}/api/supplier/payout-methods/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Method deleted.");
      fetchPayoutMethods();
    } catch (err) {
      toast.error("Failed to delete method.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(
        `${baseURL}/api/supplier/payout-methods/${id}`,
        { isDefault: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Set as default!");
      fetchPayoutMethods();
    } catch (err) {
      toast.error("Failed to set default.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <CreditCard className="text-blue-600" size={24} />
        Payment Methods
      </h2>

      {/* List Existing Methods */}
      <div className="space-y-4 mb-8">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : payoutMethods.length === 0 ? (
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <AlertCircle className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No payout methods added.</p>
          </div>
        ) : (
          payoutMethods.map((method) => (
            <div
              key={method._id}
              className={`p-4 rounded-lg border flex justify-between items-center ${
                method.isDefault
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {method.type === "BANK_TRANSFER" ? "Bank Transfer" : "UPI"}
                  </h3>
                  {method.isDefault && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>
                {method.type === "BANK_TRANSFER" ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {method.details.bankName} • {method.details.accountNumber}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    UPI ID: {method.details.upiId}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method._id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(method._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Method Form */}
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus size={18} /> Add Payout Method
        </h3>
        <form onSubmit={handleAddMethod} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Method Type</label>
            <select
              name="type"
              value={newMethodForm.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          {newMethodForm.type === "BANK_TRANSFER" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="accountHolderName"
                placeholder="Account Holder Name"
                value={newMethodForm.details.accountHolderName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={newMethodForm.details.bankName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={newMethodForm.details.accountNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                value={newMethodForm.details.ifscCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          ) : (
            <div>
              <input
                type="text"
                name="upiId"
                placeholder="UPI ID (e.g. name@upi)"
                value={newMethodForm.details.upiId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={newMethodForm.isDefault}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">
              Set as default payout method
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {submitting ? "Adding..." : "Save Payout Method"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentsTab;
