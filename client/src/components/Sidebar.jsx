import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/supplier/dashboard",
    },
    { label: "My Products", icon: <Package />, path: "/supplier/products" },
    {
      label: "Add Product",
      icon: <PlusSquare />,
      path: "/supplier/add-product",
    },
    { label: "Orders", icon: <ShoppingCart />, path: "/supplier/orders" },
    { label: "Settings", icon: <Settings />, path: "/supplier/settings" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6 fixed top-0 left-0 hidden md:block">
      <h2 className="text-xl font-bold mb-8">ConnectingConstructions</h2>
      <nav className="flex flex-col space-y-4">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition ${
                isActive ? "bg-gray-700 font-semibold" : "text-gray-300"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-red-400 hover:bg-red-800 hover:text-white mt-10 transition"
        >
          <LogOut />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
