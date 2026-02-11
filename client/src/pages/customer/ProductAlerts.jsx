import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Bell, Trash2, TrendingDown, PackageCheck, AlertTriangle } from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import { getAlerts, deleteAlert } from "../../services/customerApiService";
import { Link } from "react-router-dom";

const ProductAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await getAlerts();
      if (response.success) {
        setAlerts(response.data);
      } else {
        toast.error("Failed to load alerts");
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast.error("Error loading alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    if (!window.confirm("Are you sure you want to remove this alert?")) return;

    try {
      const response = await deleteAlert(id);
      if (response.success) {
        toast.success("Alert removed");
        setAlerts(alerts.filter((alert) => alert._id !== id));
      } else {
        toast.error("Failed to remove alert");
      }
    } catch (error) {
      console.error("Error removing alert:", error);
      toast.error("Error removing alert");
    }
  };

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Bell className="text-blue-600" size={32} />
            My Product Alerts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your price drop and stock availability notifications.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Active Alerts
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't set up any product alerts yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => handleDeleteAlert(alert._id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove Alert"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                    {alert.product?.imageUrls?.[0] ? (
                      <img
                        src={alert.product.imageUrls[0]}
                        alt={alert.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <PackageCheck size={24}/>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white leading-tight mb-1 truncate">
                      {alert.product?.name || "Unknown Product"}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Current Price: ₹{alert.product?.price?.toLocaleString() || "N/A"}
                    </div>
                    <div className={`text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                        alert.alertType === 'price_drop' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                        {alert.alertType === 'price_drop' ? (
                            <>
                                <TrendingDown size={12} />
                                Target: ₹{alert.targetPrice?.toLocaleString()}
                            </>
                        ) : (
                            <>
                                <PackageCheck size={12} />
                                Back in Stock
                            </>
                        )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className={`text-xs font-medium flex items-center gap-1.5 ${
                        alert.isActive ? "text-green-600 dark:text-green-400" : "text-gray-400"
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${alert.isActive ? "bg-green-500" : "bg-gray-300"}`}></div>
                        {alert.isActive ? "Active" : "Inactive"}
                    </span>
                    <Link 
                        to={`/product/${alert.product._id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View Product
                    </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default ProductAlerts;
