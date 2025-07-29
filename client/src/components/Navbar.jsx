import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Bell, Plus, UserCircle } from "lucide-react";
import categories from "../utils/Categories";
import { useDarkMode } from "../context/DarkModeContext";
import VoiceCommand from "../ai/VoiceCommand";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const isLoggedIn = !!user;
  const userRole = user?.role;
  const memoizedCategories = useMemo(() => categories, []);

  const scrollToTopSection = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateToRoleDashboard = useCallback(() => {
    if (!isLoggedIn) {
      scrollToTopSection();
      return navigate("/");
    }
    if (userRole === "customer") return navigate("/customer-dashboard");
    if (userRole === "supplier") return navigate("/supplier-dashboard");
    if (userRole === "admin") return navigate("/admin/dashboard");
  }, [isLoggedIn, userRole, navigate, scrollToTopSection]);

  const handleCategoryClick = useCallback(
    (category) => {
      navigate(`/category/${encodeURIComponent(category)}`);
      setIsOpen(false);
      setShowDropdown(false);
      setMobileDropdown(false);
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

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
        (path.includes("dashboard") && location.pathname.includes("dashboard"))
      );
    },
    [location.pathname]
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl px-2 py-2 sticky top-0 z-50 text-black dark:text-white transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={navigateToRoleDashboard}
          className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400"
        >
          ConnectingConstructions
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 relative">
          <button
            onClick={navigateToRoleDashboard}
            className={`hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none ${
              isActive("/") ? "text-blue-600" : ""
            }`}
          >
            Home
          </button>

          {/* Hoverable Categories - Only show if NOT logged in or if customer */}
          {!isLoggedIn || userRole === "customer" ? (
            <div
              className="relative group"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onKeyDown={handleKeyDown}
              tabIndex="0"
            >
              <button
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-300 transition focus:outline-none"
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
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
          ) : (
            // New Supplier-specific Desktop Links
            userRole === "supplier" && (
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
                  to="/supplier/analytics"
                  className={`hover:text-blue-600 dark:hover:text-blue-300 ${
                    isActive("/supplier/analytics") ? "text-blue-600" : ""
                  }`}
                >
                  Analytics
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
            )
          )}

          {!isLoggedIn && (
            <Link
              to="/about"
              className={`hover:text-blue-600 dark:hover:text-blue-300 ${
                isActive("/about") ? "text-blue-600" : ""
              }`}
            >
              About
            </Link>
          )}

          <Link
            to="/contact"
            className={`hover:text-blue-600 dark:hover:text-blue-300 ${
              isActive("/contact") ? "text-blue-600" : ""
            }`}
          >
            Contact
          </Link>

          {/* Grouping Action Icons/Buttons: Voice, Notifications, Add Product, Theme Toggle, Profile */}
          <div className="flex items-center gap-4">
            {/* Voice Command */}
            <VoiceCommand />

            {/* Notifications (Placeholder) */}
            {isLoggedIn && (
              <button
                onClick={() => navigate("/supplier/notifications")}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-white text-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm relative"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-gray-700 dark:text-white" />
              </button>
            )}

            {/* Add Product Quick Link */}
            {isLoggedIn && userRole === "supplier" && (
              <button
                onClick={() => navigate("/supplier/add-product")}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-xl hover:bg-blue-700 transition-all duration-300 shadow-sm"
                title="Add New Product"
                aria-label="Add New Product"
              >
                <Plus size={18} />
              </button>
            )}

            {/* Theme Toggle */}
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

            {/* User Profile/Logout Dropdown */}
            {isLoggedIn ? (
              <div
                className="relative group"
                onMouseEnter={() => setShowProfileDropdown(true)}
                onMouseLeave={() => setShowProfileDropdown(false)}
                onKeyDown={handleKeyDown}
                tabIndex="0"
              >
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)} // Toggle on click
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500" // Only icon, make it same size as others
                  title={user?.name || "User Profile"} // Title for hover
                  aria-haspopup="true"
                  aria-expanded={showProfileDropdown}
                  aria-label="User Profile Menu"
                >
                  <UserCircle size={20} /> {/* Only show icon */}
                </button>
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
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setIsOpen(false);
                    }}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/supplier/settings" // Corrected to supplier-specific settings
                    className="block px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setIsOpen(false);
                    }}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileDropdown(false);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
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

        {/* Mobile Voice + Hamburger Icon */}
        <div className="md:hidden flex items-center gap-1">
          <VoiceCommand />
          <button
            className="text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-0.5"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 px-2 pb-4 animate-fade-in-down">
          <button
            onClick={() => {
              navigateToRoleDashboard();
              setIsOpen(false);
            }}
            className="hover:text-blue-600 dark:hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          >
            Home
          </button>

          {/* Mobile Categories - Only show if NOT logged in or if customer */}
          {!isLoggedIn || userRole === "customer" ? (
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
          ) : (
            // New Supplier-specific Mobile Links
            userRole === "supplier" && (
              <>
                <Link
                  to="/supplier/myproducts"
                  className="block text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                  onClick={() => setIsOpen(false)}
                >
                  My Products
                </Link>
                <Link
                  to="/supplier/orders"
                  className="block text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                  onClick={() => setIsOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/supplier/analytics"
                  className="block text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                  onClick={() => setIsOpen(false)}
                >
                  Analytics
                </Link>
                <Link
                  to="/supplier/payments"
                  className="block text-left hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                  onClick={() => setIsOpen(false)}
                >
                  Payments
                </Link>
              </>
            )
          )}

          {!isLoggedIn && (
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            >
              About
            </Link>
          )}

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          >
            Contact
          </Link>

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
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={user?.name || "User Profile"}
                  aria-haspopup="true"
                  aria-expanded={showProfileDropdown}
                  aria-label="User Profile Menu"
                >
                  <UserCircle size={20} />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-xl w-48 z-50 transform transition-all duration-200 ease-in-out origin-top-right">
                    <Link
                      to={
                        userRole === "customer"
                          ? "/customer-dashboard"
                          : "/supplier-dashboard"
                      }
                      className="block px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setIsOpen(false);
                      }}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/supplier/settings"
                      className="block px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setIsOpen(false);
                      }}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowProfileDropdown(false);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
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
