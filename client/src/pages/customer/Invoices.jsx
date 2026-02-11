// client/src/pages/customer/Invoices.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FileText,
  Download,
  Calendar,
  Package,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import { getOrders, downloadInvoice } from "../../services/customerApiService";
import OrderSkeleton from "../../components/skeletons/OrderSkeleton";

/**
 * Invoices Page
 * Shows all completed orders with downloadable invoices
 */
const Invoices = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);

  // Fetch completed orders (orders that have invoices)
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders({
        status: "Delivered", // Only completed/delivered orders have invoices
        limit: 50,
      });

      if (response.success) {
        const ordersData = response.data.orders || [];
        setOrders(ordersData);
      } else {
        toast.error(response.error || "Failed to load invoices");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  // Download invoice PDF
  const handleDownloadInvoice = async (orderId, orderNumber) => {
    setDownloadingOrderId(orderId);

    try {
      const response = await downloadInvoice(orderId);

      if (response.success && response.data) {
        // Create a blob URL and trigger download
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice-${orderNumber || orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Invoice downloaded successfully");
      } else {
        toast.error("Failed to download invoice");
      }
    } catch (error) {
      console.error("Download invoice error:", error);
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingOrderId(null);
    }
  };

  // Filter orders by search term
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const orderId = order._id?.slice(-6).toLowerCase() || "";
    const itemNames = order.items
      ?.map((item) => item.name?.toLowerCase())
      .join(" ");

    return orderId.includes(searchLower) || itemNames?.includes(searchLower);
  });

  // Calculate tax from order
  const calculateTax = (order) => {
    // Assuming 18% GST (can be adjusted based on your business logic)
    const subtotal = order.totalAmount || 0;
    const taxRate = 0.18;
    const tax = (subtotal * taxRate) / (1 + taxRate);
    return tax;
  };

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Download invoices for your completed orders
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-lg">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && <OrderSkeleton count={5} />}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
            <FileText
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No invoices found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm
                ? "Try a different search term"
                : "Invoices are generated for completed orders"}
            </p>
          </div>
        )}

        {/* Invoices List */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const tax = calculateTax(order);
              const subtotal = (order.totalAmount || 0) - tax;

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  {/* Invoice Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <FileText
                          size={24}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Invoice #{order._id?.slice(-6).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Order #{order._id?.slice(-6)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() =>
                        handleDownloadInvoice(
                          order._id,
                          order._id?.slice(-6).toUpperCase(),
                        )
                      }
                      disabled={downloadingOrderId === order._id}
                      className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 w-full md:w-auto justify-center"
                    >
                      {downloadingOrderId === order._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download size={18} />
                          Download Invoice
                        </>
                      )}
                    </button>
                  </div>

                  {/* Invoice Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Items ({order.items?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Package
                                size={16}
                                className="text-gray-400 flex-shrink-0"
                              />
                              <span className="text-gray-900 dark:text-white truncate">
                                {item.name}
                              </span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 ml-2 flex-shrink-0">
                              <span className="font-medium">
                                ×{item.quantity}
                              </span>
                              <span className="ml-2">
                                ₹{item.price?.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Payment Summary
                      </h4>
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Subtotal
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            ₹{subtotal.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            GST (18%)
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            ₹{tax.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        {order.deliveryFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Delivery Fee
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              ₹{order.deliveryFee?.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Total Amount
                            </span>
                            <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                              ₹{order.totalAmount?.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm pt-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Payment Method
                          </span>
                          <span className="text-gray-900 dark:text-white capitalize">
                            {order.paymentMethod || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        Delivery Address
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {order.deliveryAddress.fullName ||
                          order.deliveryAddress.addressLine1}
                        {order.deliveryAddress.addressLine1 && (
                          <>, {order.deliveryAddress.addressLine1}</>
                        )}
                        {order.deliveryAddress.city && (
                          <>, {order.deliveryAddress.city}</>
                        )}
                        {order.deliveryAddress.state && (
                          <>, {order.deliveryAddress.state}</>
                        )}
                        {order.deliveryAddress.pincode && (
                          <> - {order.deliveryAddress.pincode}</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle
              className="text-blue-600 dark:text-blue-400 flex-shrink-0"
              size={20}
            />
            <div className="text-sm text-blue-900 dark:text-blue-200">
              <p className="font-semibold mb-1">Invoice Information:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300">
                <li>
                  Invoices are available for all delivered orders
                </li>
                <li>
                  Click "Download Invoice" to save the PDF to your device
                </li>
                <li>
                  All invoices include GST details and payment information
                </li>
                <li>
                  Keep invoices for warranty claims and tax purposes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Invoices;
