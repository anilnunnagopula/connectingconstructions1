import React from "react";
import { CheckCircle, Truck, Package, MapPin } from "lucide-react";

const orders = [
  {
    id: "ORD123456",
    item: "UltraTech Cement",
    supplier: "BuildMate Suppliers",
    status: "Out for Delivery", // Placed, Shipped, Out for Delivery, Delivered
    timeline: ["Placed", "Shipped", "Out for Delivery"],
  },
  {
    id: "ORD789012",
    item: "Iron Rods (TMT)",
    supplier: "SteelStrong Traders",
    status: "Shipped",
    timeline: ["Placed", "Shipped"],
  },
];

const statusIcons = {
  Placed: <Package className="text-blue-500" />,
  Shipped: <Truck className="text-yellow-500" />,
  "Out for Delivery": <MapPin className="text-orange-500" />,
  Delivered: <CheckCircle className="text-green-600" />,
};

const OrderTracking = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        🚚 Order Tracking
      </h1>

      {orders.map((order, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8"
        >
          <div className="mb-4">
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Order ID: {order.id}
            </p>
            <h2 className="text-lg font-semibold dark:text-white">
              {order.item} from{" "}
              <span className="text-blue-600">{order.supplier}</span>
            </h2>
          </div>

          {/* Progress Tracker */}
          <div className="flex justify-between items-center gap-4">
            {["Placed", "Shipped", "Out for Delivery", "Delivered"].map(
              (step, stepIndex) => {
                const isDone = order.timeline.includes(step);
                return (
                  <div key={stepIndex} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isDone ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      {statusIcons[step]}
                    </div>
                    <span
                      className={`text-sm ${
                        isDone
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTracking;
