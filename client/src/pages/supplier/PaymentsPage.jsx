// pages/supplier/PaymentsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PaymentsPage = () => {
  const navigate = useNavigate();
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [newMethodForm, setNewMethodForm] = useState({
    type: "BANK_TRANSFER", // Default to Bank Transfer
    details: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
      upiId: "", // For UPI type
    },
    isDefault: false,
  });
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Helper to get token
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  // --- Fetch Payout Methods and History ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      // Fetch Payout Methods
      const methodsResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/payout-methods`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const methodsData = await methodsResponse.json();
      if (!methodsResponse.ok)
        throw new Error(
          methodsData.message || "Failed to fetch payout methods."
        );
      setPayoutMethods(methodsData);

      // Fetch Payout History
      const historyResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/payout-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const historyData = await historyResponse.json();
      if (!historyResponse.ok)
        throw new Error(
          historyData.message || "Failed to fetch payout history."
        );
      setPayoutHistory(historyData);

      setMessage("Payment data loaded successfully.");
      setMessageType("success");
    } catch (err) {
      console.error("Error fetching payment data:", err);
      setMessage(err.message || "Error loading payment data.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle message timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle new method form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "type") {
      // When changing method type (Bank vs UPI)
      setNewMethodForm((prev) => ({
        ...prev,
        type: value,
        details: {
          // Reset details when type changes
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

  // Handle Add New Payout Method
  const handleSubmitNewMethod = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      /* ... handle auth ... */ return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/payout-methods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMethodForm),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || data.error || "Failed to add payout method."
        );

      setMessage("Payout method added successfully!");
      setMessageType("success");
      setNewMethodForm({
        // Reset form
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
      fetchData(); // Re-fetch all data
    } catch (err) {
      console.error("Error adding payout method:", err);
      setMessage(err.message || "Failed to add payout method.");
      setMessageType("error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Set as Default
  const handleSetDefault = async (methodId) => {
    setFormSubmitting(true);
    setMessage("");
    setMessageType("");
    const token = getToken();
    if (!token) {
      /* ... */ return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/payout-methods/${methodId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isDefault: true }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || data.error || "Failed to set as default."
        );
      setMessage("Payout method set as default!");
      setMessageType("success");
      fetchData(); // Re-fetch
    } catch (err) {
      console.error("Error setting default:", err);
      setMessage(err.message || "Failed to set as default.");
      setMessageType("error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete Payout Method
  const handleDeleteMethod = async (methodId, type) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this ${type} payout method?`
      )
    )
      return;
    setFormSubmitting(true);
    setMessage("");
    setMessageType("");
    const token = getToken();
    if (!token) {
      /* ... */ return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/payout-methods/${methodId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || data.error || "Failed to delete payout method."
        );
      setMessage("Payout method deleted!");
      setMessageType("success");
      fetchData(); // Re-fetch
    } catch (err) {
      console.error("Error deleting method:", err);
      setMessage(err.message || "Failed to delete payout method.");
      setMessageType("error");
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading payment details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          💹 Payment Methods & History
        </h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium shadow-md ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : messageType === "error"
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
            } transition-colors duration-300`}
          >
            {message}
          </div>
        )}

        {/* Add New Payout Method Form */}
        <section className="mb-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Add New Payout Method
          </h3>
          <form
            onSubmit={handleSubmitNewMethod}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Method Type
              </label>
              <select
                name="type"
                value={newMethodForm.type}
                onChange={handleFormChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                disabled={formSubmitting}
              >
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            {newMethodForm.type === "BANK_TRANSFER" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={newMethodForm.details.accountNumber}
                    onChange={handleFormChange}
                    required
                    disabled={formSubmitting}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={newMethodForm.details.ifscCode}
                    onChange={handleFormChange}
                    required
                    disabled={formSubmitting}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={newMethodForm.details.bankName}
                    onChange={handleFormChange}
                    required
                    disabled={formSubmitting}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={newMethodForm.details.accountHolderName}
                    onChange={handleFormChange}
                    required
                    disabled={formSubmitting}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={newMethodForm.details.upiId}
                  onChange={handleFormChange}
                  required
                  disabled={formSubmitting}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={newMethodForm.isDefault}
                onChange={handleFormChange}
                disabled={formSubmitting}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="isDefault"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Set as default payout method
              </label>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formSubmitting ? "Adding Method..." : "➕ Add Payout Method"}
              </button>
            </div>
          </form>
        </section>

        {/* Existing Payout Methods */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Your Payout Methods ({payoutMethods.length})
          </h3>
          {payoutMethods.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
              No payout methods added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {payoutMethods.map((method) => (
                <div
                  key={method._id}
                  className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="flex-grow">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {method.type === "BANK_TRANSFER"
                        ? "Bank Transfer"
                        : "UPI"}
                    </p>
                    {method.type === "BANK_TRANSFER" ? (
                      <>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Account: ****{method.details.accountNumber.slice(-4)}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          IFSC: {method.details.ifscCode}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Bank: {method.details.bankName}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Holder: {method.details.accountHolderName}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        UPI ID: {method.details.upiId}
                      </p>
                    )}
                    {method.isDefault && (
                      <span className="mt-2 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Default
                      </span>
                    )}
                    <span
                      className={`mt-2 ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        method.status === "Verified"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : method.status === "Active"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {method.status}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-3 md:mt-0">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method._id)}
                        disabled={formSubmitting}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleDeleteMethod(method._id, method.type)
                      }
                      disabled={formSubmitting}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payout History */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Payout History ({payoutHistory.length})
          </h3>
          {payoutHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
              No payout history found yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                      Transaction ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payoutHistory.map((payout) => (
                    <tr key={payout._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(payout.processedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
                        ₹{payout.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {payout.payoutMethodDetailsSnapshot?.type || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payout.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : payout.status === "Processing"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {payout.transactionId || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PaymentsPage;
