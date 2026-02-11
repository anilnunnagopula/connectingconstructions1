import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const ResponsiveSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden p-3 text-gray-600 dark:text-white fixed top-4 left-4 z-50"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
      >
        <h2 className="text-xl font-bold mb-8">ConnectingConstructions</h2>
        <nav className="flex flex-col space-y-4">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              onClick={() => setOpen(false)}
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
    </>
  );
};

export default ResponsiveSidebar;
