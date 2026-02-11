import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart,
  DollarSign,
  PlusCircle,
  FileText,
  Tag,
  MessageSquare
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SupplierSidebar = ({
  pendingOrdersCount = 0,
  notificationCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Define navigation items for Supplier
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/supplier-dashboard",
      badge: null,
    },
    {
      icon: Package,
      label: "My Products",
      path: "/supplier/myproducts",
      badge: null,
    },
    {
      icon: PlusCircle,
      label: "Add Product",
      path: "/supplier/add-product",
      badge: null,
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      path: "/supplier/orders",
      badge: pendingOrdersCount,
      badgeColor: "bg-red-500",
    },
    {
      icon: Tag,
      label: "Offers",
      path: "/supplier/offers",
      badge: null,
    },
    {
      icon: DollarSign,
      label: "Payments",
      path: "/supplier/payments",
      badge: null,
    },
    {
      icon: BarChart,
      label: "Analytics",
      path: "/supplier/analytics",
      badge: null,
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/supplier/notifications",
      badge: notificationCount,
      badgeColor: "bg-blue-500",
    },
    {
      icon: MessageSquare,
      label: "Messages",
      path: "/supplier/messages",
      badge: null,
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/supplier/settings",
      badge: null,
    },
     {
      icon: User,
      label: "Profile",
      path: "/profile",
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
        fixed left-0 top-16 h-[calc(100vh-4rem)] z-40
        overflow-y-auto
      `}
    >
      {/* Collapse Toggle */}
      <div className="h-12 flex items-center justify-end px-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-500"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
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
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }
                relative group
              `}
              title={collapsed ? item.label : ""}
            >
              <Icon size={20} className={active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"} />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">
                    {item.label}
                  </span>
                  {item.badge > 0 && (
                    <span className={`${item.badgeColor || "bg-red-500"} text-white text-xs px-2 py-0.5 rounded-full font-bold ml-2`}>
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                  {item.badge > 0 && ` (${item.badge})`}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SupplierSidebar;
