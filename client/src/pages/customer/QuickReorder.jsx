// client/src/pages/customer/QuickReorder.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Package,
  ShoppingCart,
  Calendar,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import { getOrders } from "../../services/customerApiService";
import { useCart } from "../../context/CartContext";
import OrderSkeleton from "../../components/skeletons/OrderSkeleton";

/**
 * Quick Reorder Page
 * Allows customers to easily reorder items from past orders
 */
const QuickReorder = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Delivered");
  const [reorderingOrderId, setReorderingOrderId] = useState(null);

  // Fetch past orders
  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders({
        status: filterStatus === "All" ? "" : filterStatus,
        limit: 50,
      });

      if (response.success) {
        const ordersData = response.data.orders || [];
        setOrders(ordersData);
      } else {
        toast.error(response.error || "Failed to load orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Reorder all items from an order
  const handleReorderAll = async (order) => {
    if (!order.items || order.items.length === 0) {
      toast.error("This order has no items to reorder");
      return;
    }

    setReorderingOrderId(order._id);

    try {
      let addedCount = 0;
      let unavailableCount = 0;

      // Add each item to cart
      for (const item of order.items) {
        // Check if item is available (you can add stock check here)
        try {
          await addToCart(item.productId || item.product, item.quantity);
          addedCount++;
        } catch (error) {
          console.error(`Failed to add ${item.name}:`, error);
          unavailableCount++;
        }
      }

      if (addedCount > 0) {
        toast.success(
          `Added ${addedCount} item${addedCount > 1 ? "s" : ""} to cart!`
        );

        if (unavailableCount > 0) {
          toast.error(
            `${unavailableCount} item${unavailableCount > 1 ? "s" : ""} ${unavailableCount > 1 ? "are" : "is"} no longer available`
          );
        }

        // Navigate to cart
        setTimeout(() => navigate("/customer/cart"), 1000);
      } else {
        toast.error("No items could be added to cart");
      }
    } catch (error) {
      console.error("Reorder error:", error);
      toast.error("Failed to reorder items");
    } finally {
      setReorderingOrderId(null);
    }
  };

  // Reorder a single item from an order
  const handleReorderItem = async (item, orderId) => {
    setReorderingOrderId(orderId);

    try {
      await addToCart(item.productId || item.product, item.quantity);
      toast.success(`Added ${item.name} to cart!`);
    } catch (error) {
      console.error("Reorder item error:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setReorderingOrderId(null);
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

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      Delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
    );
  };

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Reorder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Reorder items from your past orders with one click
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
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

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Delivered">Delivered Orders</option>
                <option value="Cancelled">Cancelled Orders</option>
                <option value="All">All Orders</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && <OrderSkeleton count={5} />}

        {/* Orders List */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
            <Package
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm
                ? "Try a different search term"
                : "Place an order to see it here"}
            </p>
            <button
              onClick={() => navigate("/materials")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Browse Materials
            </button>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Order #{order._id?.slice(-6)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={16} />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>
                        {order.items?.length || 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Reorder All Button */}
                  <button
                    onClick={() => handleReorderAll(order)}
                    disabled={reorderingOrderId === order._id}
                    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 w-full md:w-auto justify-center"
                  >
                    {reorderingOrderId === order._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={18} />
                        Reorder All
                      </>
                    )}
                  </button>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {/* Product Image Placeholder */}
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package size={20} className="text-gray-400" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-semibold">
                              ₹{item.price?.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleReorderItem(item, order._id)}
                        disabled={reorderingOrderId === order._id}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                        title="Add this item to cart"
                      >
                        <ShoppingCart size={16} />
                        Add
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Address (for reference) */}
                {order.deliveryAddress && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Delivered to:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {order.deliveryAddress.fullName ||
                        order.deliveryAddress.addressLine1}
                      {order.deliveryAddress.city &&
                        `, ${order.deliveryAddress.city}`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-900 dark:text-blue-200">
              <p className="font-semibold mb-1">Quick Reorder Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300">
                <li>
                  Click "Reorder All" to add all items from an order to your
                  cart
                </li>
                <li>Or click "Add" next to individual items to reorder them</li>
                <li>
                  Items will be added with the same quantities as your previous
                  order
                </li>
                <li>
                  Review your cart before checkout to update quantities or
                  remove items
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default QuickReorder;
