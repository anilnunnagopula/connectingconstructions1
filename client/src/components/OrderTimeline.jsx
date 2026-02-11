// client/src/components/OrderTimeline.jsx
import React from "react";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  Home,
  XCircle,
  AlertCircle,
} from "lucide-react";

/**
 * OrderTimeline Component
 * Enhanced timeline visualization for order tracking
 * @param {Object} order - Order object with status and timestamps
 * @param {String} variant - "horizontal" or "vertical" (default: horizontal)
 */
const OrderTimeline = ({ order, variant = "horizontal" }) => {
  // Get order stages based on order status
  const getOrderStages = () => {
    const allStages = [
      {
        key: "pending",
        label: "Order Placed",
        description: "Your order has been received",
        date: order.createdAt,
        icon: Package,
      },
      {
        key: "confirmed",
        label: "Confirmed",
        description: "Supplier confirmed your order",
        date: order.confirmedAt,
        icon: CheckCircle,
      },
      {
        key: "processing",
        label: "Processing",
        description: "Order is being prepared",
        date: order.processingAt,
        icon: Package,
      },
      {
        key: "shipped",
        label: "Shipped",
        description: "Order is on the way",
        date: order.shippedAt,
        icon: Truck,
      },
      {
        key: "delivered",
        label: "Delivered",
        description: "Order delivered successfully",
        date: order.deliveredAt,
        icon: Home,
      },
    ];

    // Handle cancelled orders
    if (order.orderStatus === "Cancelled" || order.orderStatus === "cancelled") {
      return [
        allStages[0], // Order Placed
        {
          key: "cancelled",
          label: "Cancelled",
          description: order.cancellationReason || "Order was cancelled",
          date: order.cancelledAt,
          icon: XCircle,
        },
      ];
    }

    return allStages;
  };

  // Get current stage index
  const getCurrentStageIndex = () => {
    const stages = getOrderStages();
    const statusLower = order.orderStatus?.toLowerCase();
    return stages.findIndex((stage) => stage.key === statusLower);
  };

  const stages = getOrderStages();
  const currentIndex = getCurrentStageIndex();

  // Format date
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get stage color
  const getStageColor = (index, stage) => {
    const isCancelled = stage.key === "cancelled";
    const isCompleted = index <= currentIndex;
    const isCurrent = index === currentIndex;

    if (isCancelled) {
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    }

    if (isCompleted) {
      return "border-green-500 bg-green-50 dark:bg-green-900/20";
    }

    if (isCurrent) {
      return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }

    return "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800";
  };

  // Get icon color
  const getIconColor = (index, stage) => {
    const isCancelled = stage.key === "cancelled";
    const isCompleted = index <= currentIndex;

    if (isCancelled) {
      return "text-red-600 dark:text-red-400";
    }

    if (isCompleted) {
      return "text-green-600 dark:text-green-400";
    }

    return "text-gray-400 dark:text-gray-500";
  };

  // Horizontal Timeline (default - responsive)
  if (variant === "horizontal") {
    return (
      <div className="relative py-6">
        {/* Progress Line - Desktop */}
        <div className="hidden md:block absolute top-10 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 mx-8">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-700"
            style={{
              width: `${Math.max(0, (currentIndex / (stages.length - 1)) * 100)}%`,
            }}
          />
        </div>

        {/* Stages */}
        <div className="grid grid-cols-2 md:flex md:justify-between gap-4 md:gap-2 relative">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const StageIcon = stage.icon;

            return (
              <div
                key={stage.key}
                className={`flex flex-col items-center text-center transition-all duration-300 ${
                  isCurrent ? "scale-105" : ""
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 border-4 transition-all duration-300 shadow-lg ${getStageColor(
                    index,
                    stage,
                  )} ${isCurrent ? "ring-4 ring-blue-200 dark:ring-blue-800 animate-pulse" : ""}`}
                >
                  <StageIcon size={24} className={getIconColor(index, stage)} />
                  {isCompleted && stage.key !== "cancelled" && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Label */}
                <p
                  className={`text-xs md:text-sm font-semibold mb-1 ${
                    isCompleted
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {stage.label}
                </p>

                {/* Description - Hidden on mobile */}
                <p className="hidden md:block text-xs text-gray-600 dark:text-gray-400 max-w-[120px]">
                  {stage.description}
                </p>

                {/* Date */}
                {stage.date && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatDate(stage.date)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical Timeline
  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const StageIcon = stage.icon;
        const isLast = index === stages.length - 1;

        return (
          <div key={stage.key} className="relative flex gap-4">
            {/* Vertical Line */}
            {!isLast && (
              <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
                {isCompleted && (
                  <div className="w-full bg-gradient-to-b from-green-500 to-blue-500 h-full transition-all duration-700" />
                )}
              </div>
            )}

            {/* Icon */}
            <div
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 transition-all duration-300 shadow-md ${getStageColor(
                index,
                stage,
              )} ${isCurrent ? "ring-4 ring-blue-200 dark:ring-blue-800 animate-pulse" : ""}`}
            >
              <StageIcon size={20} className={getIconColor(index, stage)} />
              {isCompleted && stage.key !== "cancelled" && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${getStageColor(
                  index,
                  stage,
                )}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3
                    className={`font-semibold ${
                      isCompleted
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {stage.label}
                  </h3>
                  {isCurrent && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {stage.description}
                </p>
                {stage.date && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(stage.date)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
