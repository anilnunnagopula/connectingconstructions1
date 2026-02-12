// client/src/pages/customer/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-hot-toast";
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  MapPin,
  Edit2,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import AddressSelector from "../../components/AddressSelector";
import RazorpayPayment from "../../components/RazorpayPayment";
import { createOrder } from "../../services/customerApiService";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Delivery, 3: Payment, 4: Review, 5: Processing Payment
  const [pendingOrderId, setPendingOrderId] = useState(null); // For Razorpay flow

  // Address state (managed by AddressSelector component)
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Delivery slot state
  const [deliverySlot, setDeliverySlot] = useState({
    date: "",
    timeSlot: "",
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Notes
  const [customerNotes, setCustomerNotes] = useState("");

  // Price breakdown
  const subtotal = totalPrice;
  const deliveryFee = subtotal > 10000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + deliveryFee + tax;

  // Time slots
  const timeSlots = [
    "9:00 AM - 12:00 PM",
    "12:00 PM - 3:00 PM",
    "3:00 PM - 6:00 PM",
    "6:00 PM - 9:00 PM",
  ];

  // Get minimum delivery date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Handle address selection from AddressSelector component
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  // Handle "Add New Address" - navigate to address management page
  const handleAddNewAddress = () => {
    // Save current checkout state to return later
    sessionStorage.setItem("checkoutReturnPath", "/customer/checkout");
    navigate("/customer/addresses");
  };

  // Validate and move to next step
  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }
    } else if (step === 2) {
      if (!deliverySlot.date || !deliverySlot.timeSlot) {
        toast.error("Please select delivery date and time");
        return;
      }
    } else if (step === 3) {
      if (!paymentMethod) {
        toast.error("Please select a payment method");
        return;
      }
    }

    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setLoading(true);

    try {
      // Map payment method: upi/card → razorpay for backend
      const effectivePaymentMethod =
        paymentMethod === "cod" ? "cod" : "razorpay";

      const orderData = {
        deliveryAddress: selectedAddress,
        deliverySlot: {
          date: new Date(deliverySlot.date),
          timeSlot: deliverySlot.timeSlot,
        },
        paymentMethod: effectivePaymentMethod,
        customerNotes,
      };

      console.log("Creating order:", orderData);

      const response = await createOrder(orderData);

      if (!response.success) {
        throw new Error(response.error);
      }

      console.log("Order created:", response.data);

      if (effectivePaymentMethod === "cod") {
        // COD: order is ready, go to success
        toast.success("Order placed successfully!");
        navigate(`/customer/order-success/${response.data.orderId}`, {
          state: { orderData: response.data },
        });
      } else {
        // Online payment: show Razorpay payment step
        setPendingOrderId(response.data.orderId);
        setStep(5); // Go to payment processing step
        setLoading(false);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order");
      setLoading(false);
    }
  };

  // Handle Razorpay payment success
  const handlePaymentSuccess = (paymentData) => {
    console.log("Payment verified:", paymentData);
    navigate(`/customer/order-success/${pendingOrderId}`, {
      state: { orderData: paymentData, paymentMethod: "razorpay" },
    });
  };

  // Handle Razorpay payment failure
  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    // Stay on payment page, user can retry
    toast.error("Payment failed. You can retry or switch to Cash on Delivery.");
  };

  // Check if cart is empty
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
            Add some items to proceed to checkout
          </p>
          <button
            onClick={() => navigate("/materials")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
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
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Checkout
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {cartItems.length} items • ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: "Address", icon: MapPin },
              { num: 2, label: "Delivery", icon: Calendar },
              { num: 3, label: "Payment", icon: CreditCard },
              { num: 4, label: "Review", icon: CheckCircle },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step >= s.num
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    <s.icon size={20} />
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      step >= s.num
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s.num
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Delivery Address
                </h2>

                <AddressSelector
                  selectedAddress={selectedAddress}
                  onSelectAddress={handleSelectAddress}
                  onAddNewAddress={handleAddNewAddress}
                  showAddButton={true}
                />
              </div>
            )}

            {/* Step 2: Delivery Slot */}
            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Choose Delivery Slot
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={deliverySlot.date}
                      onChange={(e) =>
                        setDeliverySlot({
                          ...deliverySlot,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Slot
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() =>
                            setDeliverySlot({ ...deliverySlot, timeSlot: slot })
                          }
                          className={`p-4 border-2 rounded-lg font-medium transition ${
                            deliverySlot.timeSlot === slot
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                              : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      id: "cod",
                      label: "Cash on Delivery",
                      desc: "Pay when you receive",
                    },
                    { id: "upi", label: "UPI", desc: "PhonePe, GPay, Paytm" },
                    {
                      id: "card",
                      label: "Credit/Debit Card",
                      desc: "Visa, Mastercard, RuPay",
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 border-2 rounded-xl text-left transition ${
                        paymentMethod === method.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                      }`}
                    >
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {method.label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Customer Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Any special instructions for delivery..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review Order */}
            {step === 4 && (
              <div className="space-y-6">
                {/* Delivery Address Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Delivery Address
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Edit2 size={16} />
                      Change
                    </button>
                  </div>
                  {selectedAddress && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>{selectedAddress.fullName}</p>
                      <p>{selectedAddress.addressLine1}</p>
                      <p>
                        {selectedAddress.city}, {selectedAddress.state} -{" "}
                        {selectedAddress.pincode}
                      </p>
                      <p>Phone: {selectedAddress.phone}</p>
                    </div>
                  )}
                </div>

                {/* Delivery Slot Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Delivery Slot
                    </h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Edit2 size={16} />
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(deliverySlot.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {deliverySlot.timeSlot}
                  </p>
                </div>

                {/* Payment Method Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setStep(3)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Edit2 size={16} />
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {paymentMethod === "cod" && "Cash on Delivery"}
                    {paymentMethod === "upi" && "UPI (via Razorpay)"}
                    {paymentMethod === "card" && "Credit/Debit Card (via Razorpay)"}
                  </p>
                </div>

                {/* Cart Items */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Order Items ({cartItems.length})
                  </h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                          {item.productSnapshot?.imageUrl ||
                          item.product?.imageUrls?.[0] ? (
                            <img
                              src={
                                item.productSnapshot?.imageUrl ||
                                item.product?.imageUrls?.[0]
                              }
                              alt={
                                item.productSnapshot?.name || item.product?.name
                              }
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag
                                size={24}
                                className="text-gray-400"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.productSnapshot?.name || item.product?.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ₹
                            {(
                              item.productSnapshot?.price || item.product?.price
                            )?.toLocaleString("en-IN")}{" "}
                            × {item.quantity}{" "}
                            {item.productSnapshot?.unit || item.product?.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ₹
                            {(
                              (item.productSnapshot?.price ||
                                item.product?.price) * item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Razorpay Payment Processing */}
            {step === 5 && pendingOrderId && (
              <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    Your order has been created. Please complete the payment to confirm it.
                  </p>
                </div>

                <RazorpayPayment
                  orderId={pendingOrderId}
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />

                <div className="text-center">
                  <button
                    onClick={() => {
                      // Allow switching to COD if payment fails
                      navigate(`/customer/order-success/${pendingOrderId}`, {
                        state: {
                          orderData: { orderId: pendingOrderId },
                          paymentPending: true,
                        },
                      });
                    }}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
                  >
                    Skip payment (pay later / contact support)
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step <= 4 && (
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Placing Order..."
                    : paymentMethod === "cod"
                    ? "Place Order (COD)"
                    : "Place Order & Pay"}
                </button>
              )}
            </div>
            )}
          </div>

          {/* Right: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      FREE
                    </span>
                  ) : (
                    <span className="font-medium">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>GST (18%)</span>
                  <span className="font-medium">
                    ₹{tax.toLocaleString("en-IN")}
                  </span>
                </div>
                {subtotal < 10000 && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Add ₹{(10000 - subtotal).toLocaleString("en-IN")} more for
                    free delivery!
                  </p>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Easy returns & refunds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Checkout;
