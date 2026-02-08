import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Bell,
  User,
  Plus,
} from "lucide-react";

/**
 * Mobile Bottom Navigation for Supplier Dashboard
 *
 * Features:
 * - 5 primary navigation items
 * - Active state highlighting
 * - Badge notifications
 * - Floating action button (Add Product)
 * - Smooth animations
 * - Touch-optimized (44px minimum)
 * - Dark mode support
 * - iOS safe area support
 */
const SupplierBottomNav = ({ pendingOrders = 0, notifications = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down (optional - can be disabled)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Disable auto-hide by commenting this out if you want nav always visible
    // window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      // window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: LayoutDashboard,
      path: "/supplier-dashboard",
      badge: null,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      path: "/supplier/myproducts",
      badge: null,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/supplier/orders",
      badge: pendingOrders > 0 ? pendingOrders : null,
      badgeColor: "bg-red-500",
    },
    {
      id: "notifications",
      label: "Alerts",
      icon: Bell,
      path: "/supplier/notifications",
      badge: notifications > 0 ? notifications : null,
      badgeColor: "bg-blue-500",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/supplier/settings",
      badge: null,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleNavClick = (path) => {
    navigate(path);
    // Haptic feedback on mobile (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleAddProduct = () => {
    navigate("/supplier/add-product");
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  return (
    <>
      {/* Bottom Navigation Container */}
      <nav
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white dark:bg-gray-900 
          border-t border-gray-200 dark:border-gray-700
          transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "translate-y-full"}
          md:hidden
          safe-area-inset-bottom
        `}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Navigation Items */}
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`
                  relative flex flex-col items-center justify-center
                  min-w-[64px] h-full px-3
                  transition-all duration-200
                  ${active ? "scale-105" : "scale-100"}
                  active:scale-95
                  touch-manipulation
                `}
                aria-label={item.label}
              >
                {/* Icon Container with Badge */}
                <div className="relative">
                  <div
                    className={`
                      p-1.5 rounded-xl transition-all duration-200
                      ${
                        active
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-transparent"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        w-6 h-6 transition-colors duration-200
                        ${
                          active
                            ? "text-blue-600 dark:text-blue-400 stroke-[2.5]"
                            : "text-gray-600 dark:text-gray-400 stroke-[2]"
                        }
                      `}
                    />
                  </div>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={`
                        absolute -top-1 -right-1
                        ${item.badgeColor || "bg-red-500"}
                        text-white text-[10px] font-bold
                        min-w-[18px] h-[18px]
                        flex items-center justify-center
                        rounded-full
                        animate-pulse
                        shadow-lg
                      `}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-[10px] font-medium mt-0.5 transition-colors duration-200
                    ${
                      active
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  `}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {active && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Button (FAB) - Add Product */}
      <button
        onClick={handleAddProduct}
        className={`
          fixed bottom-20 right-4 z-50
          w-14 h-14
          bg-gradient-to-br from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          text-white
          rounded-full
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300 ease-out
          active:scale-95
          md:hidden
          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
        `}
        style={{
          bottom: `calc(5rem + env(safe-area-inset-bottom))`,
        }}
        aria-label="Add Product"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />

        {/* Ripple effect on click */}
        <span className="absolute inset-0 rounded-full bg-white opacity-0 animate-ping-slow" />
      </button>

      {/* Spacer for fixed bottom nav (prevents content from being hidden) */}
      <div className="h-16 md:hidden safe-area-inset-bottom" />
    </>
  );
};

export default SupplierBottomNav;
