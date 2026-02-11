// client/src/layout/AdminSidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  PackageCheck,
  ShieldCheck,
  LogOut,
  Settings,
  AlertTriangle,
  Mail,
  Megaphone,
  Activity,
  XCircle,
} from "lucide-react";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "User Management",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Product Moderation",
      path: "/admin/products",
      icon: PackageCheck,
    },
    {
      label: "Complaints",
      path: "/admin/complaints",
      icon: AlertTriangle,
    },
    {
      label: "Messages",
      path: "/admin/contacts",
      icon: Mail,
    },
    {
      label: "Announcements",
      path: "/admin/announcements",
      icon: Megaphone,
    },
    {
      label: "Verification Requests",
      path: "/admin/users?role=supplier&status=pending",
      icon: ShieldCheck,
    },
    {
      label: "System Health",
      path: "/admin/system-health",
      icon: Activity,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
        {/* Mobile Overlay */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onClose}
            />
        )}

        <div className={`
            w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
        `}>
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-blue-500">CC Admin</h1>
                <p className="text-xs text-gray-400 mt-1">Control Panel</p>
            </div>
            {/* Close Button Mobile */}
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                <XCircle size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path.includes('?') && location.pathname === item.path.split('?')[0] && location.search.includes(item.path.split('?')[1]));
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => onClose && onClose()} // Close sidebar on mobile nav
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
    </>
  );
};

export default AdminSidebar;
