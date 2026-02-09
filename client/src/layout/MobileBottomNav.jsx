// client/src/layout/MobileBottomNav.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, ShoppingCart, User, MessageSquare } from "lucide-react";

const MobileBottomNav = ({ cartCount = 0, quoteCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/customer-dashboard",
      color: "blue",
    },
    {
      icon: Package,
      label: "Orders",
      path: "/customer/orders",
      badge: null,
      color: "green",
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      path: "/customer/cart",
      badge: cartCount,
      color: "orange",
    },
    {
      icon: MessageSquare,
      label: "Quotes",
      path: "/customer/quotes",
      badge: quoteCount,
      color: "purple",
    },
    {
      icon: User,
      label: "Profile",
      path: "/customer/settings",
      color: "gray",
    },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center gap-1 relative
                transition-all duration-200
                ${
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }
                hover:bg-gray-50 dark:hover:bg-gray-700/50
                active:scale-95
              `}
            >
              {/* Badge */}
              {item.badge > 0 && (
                <span className="absolute top-1 right-1/4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}

              {/* Icon */}
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className="transition-transform"
              />

              {/* Label */}
              <span
                className={`
                  text-xs font-medium
                  ${active ? "font-semibold" : "font-normal"}
                `}
              >
                {item.label}
              </span>

              {/* Active Indicator */}
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
