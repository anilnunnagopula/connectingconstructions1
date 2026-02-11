import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Plus,
  UserCircle,
  LogOut,
  ShoppingCart,
  Package,
} from "lucide-react";
import categories from "../utils/Categories";
import { useDarkMode } from "../context/DarkModeContext";
import VoiceCommand from "../ai/VoiceCommand";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Navbar = () => {
  // Use the global authentication state from AuthContext
  // Now user.role will be a string (e.g., "customer", "supplier")
  const { user, logout, getUserRole } = useAuth();  

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();

  const isLoggedIn = !!user;
  const userRole = getUserRole();
  const memoizedCategories = useMemo(() => categories, []);

  const navigateToRoleDashboard = useCallback(() => {
    if (!isLoggedIn) { 
      navigate("/"); // Or navigate("/customer-dashboard");
      return;
    } 
    if (userRole === "customer") return navigate("/customer-dashboard");
    if (userRole === "supplier") return navigate("/supplier-dashboard");
    if (userRole === "admin") return navigate("/admin");  
    navigate("/");  
  }, [isLoggedIn, userRole, navigate]); // userRole is now a direct dependency

  const handleCategoryClick = useCallback(
    (category) => {
      navigate(`/category/${encodeURIComponent(category)}`);
      setIsOpen(false);
      setShowDropdown(false);
      setMobileDropdown(false);
    },
    [navigate]
  );

  // Use the logout function from AuthContext
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
      setMobileDropdown(false);
      setShowProfileDropdown(false);
    }
  }, []);

  const isActive = useCallback(
    (path) => {
      return (
        location.pathname === path ||
        (path !== "/" && location.pathname.startsWith(path))
      );
    },
    [location.pathname]
  );

  const ProfileDropdown = ({ onClose }) => (
    <div
      className={`absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-xl w-48 z-50 transform transition-all duration-200 ease-in-out origin-top-right ${
        showProfileDropdown
          ? "opacity-100 scale-100 visible"
          : "opacity-0 scale-95 invisible"
      }`}
    >
      <Link
        to={
          userRole === "customer"
            ? "/customer-dashboard"
            : "/supplier-dashboard"
        }
        className="block px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        My Dashboard
      </Link>
      <Link
        to={`/${userRole}/settings`} // Use userRole directly
        className="block px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        Settings
      </Link>
      <button
        onClick={() => {
          handleLogout();
          onClose();
        }}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
      >
        <LogOut size={16} className="inline mr-2" /> Logout
      </button>
    </div>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl px-2 py-2 sticky top-0 z-50 text-black dark:text-white transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button
          onClick={navigateToRoleDashboard}
          className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400"
        >
          ConnectingConstructions
        </button>

        <div className="hidden md:flex items-center gap-6 relative">
          <button
            onClick={navigateToRoleDashboard}
            className={`hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none ${
              isActive("/") ? "text-blue-600" : ""
            }`}
          >
            Home
          </button>

          {/* Conditional rendering based on userRole string */}
          {userRole !== "supplier" && userRole !== "admin" && (
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onKeyDown={handleKeyDown}
              tabIndex="0"
            >
              <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-300 transition focus:outline-none">
                Categories <Menu className="w-5 h-5" />
              </button>
              <div
                className={`absolute top-8 left-0 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-xl w-56 z-50 transform transition-all duration-200 ease-in-out origin-top ${
                  showDropdown
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                } max-h-64 overflow-y-auto`}
              >
                {memoizedCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {userRole === "supplier" && (
            <>
              <Link
                to="/supplier/myproducts"
                className={`hover:text-blue-600 dark:hover:text-blue-300 ${
                  isActive("/supplier/myproducts") ? "text-blue-600" : ""
                }`}
              >
                My Products
              </Link>
              <Link
                to="/supplier/orders"
                className={`hover:text-blue-600 dark:hover:text-blue-300 ${
                  isActive("/supplier/orders") ? "text-blue-600" : ""
                }`}
              >
                Orders
              </Link>
              <Link
                to="/supplier/payments"
                className={`hover:text-blue-600 dark:hover:text-blue-300 ${
                  isActive("/supplier/payments") ? "text-blue-600" : ""
                }`}
              >
                Payments
              </Link>
            </>
          )}

          <Link
            to="/contact"
            className={`hover:text-blue-600 dark:hover:text-blue-300 ${
              isActive("/contact") ? "text-blue-600" : ""
            }`}
          >
            ContactUs
          </Link>

          <div className="flex items-center gap-4">
            <VoiceCommand />

            {userRole === "customer" && (
              <>
                <Link
                  to="/customer/cart"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-white text-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
                  title="My Cart"
                  aria-label="My Cart"
                >
                  <ShoppingCart
                    size={18}
                    className="text-gray-700 dark:text-white"
                  />
                </Link>
                <Link
                  to="/customer/orders"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-white text-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
                  title="My Orders"
                  aria-label="My Orders"
                >
                  <Package
                    size={18}
                    className="text-gray-700 dark:text-white"
                  />
                </Link>
                <Link
                  to="/customer/notifications"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-white text-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm relative"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell size={18} className="text-gray-700 dark:text-white" />
                </Link>
              </>
            )}

            {userRole === "supplier" && (
              <>
                <Link
                  to="/supplier/notifications"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-white text-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm relative"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell size={18} className="text-gray-700 dark:text-white" />
                </Link>
                <Link
                  to="/supplier/add-product"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl hover:bg-blue-700 transition-all duration-300 shadow-sm"
                  title="Add New Product"
                  aria-label="Add New Product"
                >
                  <Plus size={18} />
                </Link>
              </>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-white text-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
              title={`Switch to ${darkMode ? "light" : "dark"} mode`}
              aria-label={`Toggle ${darkMode ? "light" : "dark"} mode`}
            >
              {darkMode ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-blue-500" />
              )}
            </button>

            {isLoggedIn ? (
              <div
                className="relative"
                onMouseEnter={() => setShowProfileDropdown(true)}
                onMouseLeave={() => setShowProfileDropdown(false)}
                onKeyDown={handleKeyDown}
                tabIndex="0"
              >
                <button className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <UserCircle size={20} /> {user?.name || "User"}
                </button>
                <ProfileDropdown
                  onClose={() => setShowProfileDropdown(false)}
                />
              </div>
            ) : (
              <Link
                to="/login"
                className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-900"
              >
                SignUp
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <VoiceCommand />

          {userRole === "customer" && (
            <>
              <Link
                to="/customer/cart"
                className="p-1"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart
                  size={22}
                  className="text-gray-700 dark:text-white"
                />
              </Link>
              <Link
                to="/customer/orders"
                className="p-1"
                onClick={() => setIsOpen(false)}
              >
                <Package size={22} className="text-gray-700 dark:text-white" />
              </Link>
            </>
          )}

          <button
            className="text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-0.5"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 px-2 pb-4 animate-fade-in-down">
          <button
            onClick={() => {
              navigateToRoleDashboard();
              setIsOpen(false);
            }}
            className={`hover:text-blue-600 dark:hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 ${
              isActive("/") ? "text-blue-600" : ""
            }`}
          >
            Home
          </button>

          {userRole !== "supplier" && userRole !== "admin" && (
            <div>
              <button
                className="w-full text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                onClick={() => setMobileDropdown(!mobileDropdown)}
                aria-expanded={mobileDropdown}
              >
                Categories {mobileDropdown ? "▲" : "▼"}
              </button>
              {mobileDropdown && (
                <div className="pl-4 mt-2 space-y-1">
                  {memoizedCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer text-sm hover:text-blue-500 dark:hover:text-blue-300"
                      onClick={() => handleCategoryClick(cat)}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {userRole === "supplier" && (
            <>
              <Link
                to="/supplier/myproducts"
                onClick={() => setIsOpen(false)}
                className={`block text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 ${
                  isActive("/supplier/myproducts") ? "text-blue-600" : ""
                }`}
              >
                My Products
              </Link>
              <Link
                to="/supplier/orders"
                onClick={() => setIsOpen(false)}
                className={`block text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 ${
                  isActive("/supplier/orders") ? "text-blue-600" : ""
                }`}
              >
                Orders
              </Link>
              <Link
                to="/supplier/payments"
                onClick={() => setIsOpen(false)}
                className={`block text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 ${
                  isActive("/supplier/payments") ? "text-blue-600" : ""
                }`}
              >
                Payments
              </Link>
            </>
          )}

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className={`hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 ${
              isActive("/contact") ? "text-blue-600" : ""
            }`}
          >
            Contact
          </Link>

          {isLoggedIn && (
            <Link
              to={`/${userRole}/notifications`}
              onClick={() => setIsOpen(false)}
              className="block text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            >
              Notifications
            </Link>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                setIsOpen(false);
              }}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Toggle Theme"
            >
              {darkMode ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-blue-600" />
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="px-3 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <UserCircle size={20} /> {user?.name || "User"}
                </button>
                {showProfileDropdown && (
                  <ProfileDropdown
                    onClose={() => {
                      setShowProfileDropdown(false);
                      setIsOpen(false);
                    }}
                  />
                )}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                SignUp
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
