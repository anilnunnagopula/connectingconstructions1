// client/src/pages/customer/PaymentMethods.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  X,
  AlertCircle,
  Smartphone,
  Wallet,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} from "../../services/customerApiService";
import CardSkeleton from "../../components/skeletons/CardSkeleton";

/**
 * Payment Methods Management Page
 * Allows customers to manage their saved payment methods
 */
const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

  // Form state for adding new payment method
  const [formData, setFormData] = useState({
    type: "upi", // upi, card, netbanking
    upiId: "",
    cardNumber: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    bankName: "",
    accountNumber: "",
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.data || []);
      } else {
        toast.error(response.error || "Failed to load payment methods");
      }
    } catch (error) {
      console.error("Fetch payment methods error:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();

    // Validate based on payment type
    if (formData.type === "upi") {
      if (!formData.upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
    } else if (formData.type === "card") {
      if (
        !formData.cardNumber ||
        !formData.cardHolderName ||
        !formData.expiryMonth ||
        !formData.expiryYear ||
        !formData.cvv
      ) {
        toast.error("Please fill all card details");
        return;
      }
    } else if (formData.type === "netbanking") {
      if (!formData.bankName || !formData.accountNumber) {
        toast.error("Please fill all bank details");
        return;
      }
    }

    const payload = {
      type: formData.type.toUpperCase(), // Convert to uppercase for enum match
      details: {},
    };

    if (formData.type === "upi") {
      payload.details = { upiId: formData.upiId };
    } else if (formData.type === "card") {
      payload.details = {
        cardNumber: formData.cardNumber,
        cardHolderName: formData.cardHolderName,
        expiryDate: `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`, // Format MM/YY
        cvv: formData.cvv,
      };
    } else if (formData.type === "netbanking") {
      payload.details = {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
      };
    }

    try {
      const response = await addPaymentMethod(payload);
      if (response.success) {
        toast.success("Payment method added successfully");
        fetchPaymentMethods();
        handleCloseModal();
      } else {
        toast.error(response.error || "Failed to add payment method");
      }
    } catch (error) {
      console.error("Add payment method error:", error);
      toast.error("Failed to add payment method");
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) {
      return;
    }

    setDeletingId(methodId);
    try {
      const response = await deletePaymentMethod(methodId);
      if (response.success) {
        toast.success("Payment method deleted successfully");
        fetchPaymentMethods();
      } else {
        toast.error(response.error || "Failed to delete payment method");
      }
    } catch (error) {
      console.error("Delete payment method error:", error);
      toast.error("Failed to delete payment method");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (methodId) => {
    setSettingDefaultId(methodId);
    try {
      const response = await setDefaultPaymentMethod(methodId);
      if (response.success) {
        toast.success("Default payment method updated");
        fetchPaymentMethods();
      } else {
        toast.error(response.error || "Failed to set default");
      }
    } catch (error) {
      console.error("Set default error:", error);
      toast.error("Failed to set default");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      type: "upi",
      upiId: "",
      cardNumber: "",
      cardHolderName: "",
      expiryMonth: "",
      expiryYear: "",
      bankName: "",
      accountNumber: "",
    });
  };

  // Get icon for payment type
  const getPaymentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "upi":
        return <Smartphone size={24} className="text-blue-600 dark:text-blue-400" />;
      case "card":
        return <CreditCard size={24} className="text-purple-600 dark:text-purple-400" />;
      case "netbanking":
        return <Wallet size={24} className="text-green-600 dark:text-green-400" />;
      default:
        return <CreditCard size={24} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  // Mask sensitive data
  const maskCardNumber = (number) => {
    if (!number) return "";
    return `**** **** **** ${number.slice(-4)}`;
  };

  const maskAccountNumber = (number) => {
    if (!number) return "";
    return `****${number.slice(-4)}`;
  };

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Methods
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your saved payment methods for faster checkout
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>

        {/* Loading State */}
        {loading && <CardSkeleton count={3} />}

        {/* Empty State */}
        {!loading && paymentMethods.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
            <CreditCard className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No payment methods saved
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add a payment method for faster checkout
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Payment Method
            </button>
          </div>
        )}

        {/* Payment Methods List */}
        {!loading && paymentMethods.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method._id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 transition ${
                  method.isDefault
                    ? "border-blue-600 dark:border-blue-500"
                    : "border-gray-100 dark:border-gray-700"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  {getPaymentIcon(method.type)}
                  {method.isDefault && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>

                {/* Payment Details */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">
                    {method.type.toLowerCase()}
                  </p>
                  {method.type === "UPI" && (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {method.details?.upiId}
                    </p>
                  )}
                  {method.type === "CARD" && (
                    <>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {maskCardNumber(method.details?.cardNumber)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {method.details?.cardHolderName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Expires: {method.details?.expiryDate}
                      </p>
                    </>
                  )}
                  {method.type === "NETBANKING" && (
                    <>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {method.details?.bankName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {maskAccountNumber(method.details?.accountNumber)}
                      </p>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method._id)}
                      disabled={settingDefaultId === method._id}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                    >
                      {settingDefaultId === method._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-700 dark:border-gray-300 border-t-transparent"></div>
                      ) : (
                        <>
                          <Check size={16} />
                          Set Default
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePaymentMethod(method._id)}
                    disabled={deletingId === method._id}
                    className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                  >
                    {deletingId === method._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-900 dark:text-blue-200">
              <p className="font-semibold mb-1">Payment Security:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300">
                <li>All payment information is encrypted and securely stored</li>
                <li>We never share your payment details with third parties</li>
                <li>Set a default payment method for faster checkout</li>
                <li>You can update or remove payment methods anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Payment Method Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add Payment Method
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddPaymentMethod} className="p-6 space-y-4">
                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="upi">UPI</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="netbanking">Net Banking</option>
                  </select>
                </div>

                {/* UPI Fields */}
                {formData.type === "upi" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Card Fields */}
                {formData.type === "card" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.cardHolderName}
                        onChange={(e) =>
                          setFormData({ ...formData, cardHolderName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Month
                        </label>
                        <input
                          type="text"
                          placeholder="MM"
                          maxLength="2"
                          value={formData.expiryMonth}
                          onChange={(e) =>
                            setFormData({ ...formData, expiryMonth: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Year
                        </label>
                        <input
                          type="text"
                          placeholder="YYYY"
                          maxLength="4"
                          value={formData.expiryYear}
                          onChange={(e) =>
                            setFormData({ ...formData, expiryYear: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength="3"
                          value={formData.cvv || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, cvv: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Net Banking Fields */}
                {formData.type === "netbanking" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="State Bank of India"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234567890"
                        value={formData.accountNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, accountNumber: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Add Payment Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default PaymentMethods;
