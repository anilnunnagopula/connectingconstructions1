// client/src/layout/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Heart,
  Bell,
  Settings,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({
  cartCount = 0,
  wishlistCount = 0,
  notificationCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/customer-dashboard",
      badge: null,
    },
    {
      icon: Layers,
      label: "Browse Materials",
      path: "/customer/materials",
      badge: null,
    },
    {
      icon: ShoppingCart,
      label: "Cart",
      path: "/customer/cart",
      badge: cartCount,
    },
    {
      icon: Package,
      label: "My Orders",
      path: "/customer/orders",
      badge: null,
    },
    {
      icon: MessageSquare,
      label: "Quote Requests",
      path: "/customer/quotes",
      badge: null,
    },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/customer/wishlist",
      badge: wishlistCount,
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/customer/notifications",
      badge: notificationCount,
    },
    {
      icon: MapPin,
      label: "Addresses",
      path: "/customer/addresses",
      badge: null,
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/customer/settings",
      badge: null,
    },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <aside
      className={`
        hidden md:flex flex-col
        bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        fixed left-0 top-0 h-screen z-40
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            CC
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200
                  ${
                    active
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }
                  relative group
                `}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />

                {!collapsed && (
                  <>
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
