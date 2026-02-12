import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Plus,
  User,
  LogOut,
  ShoppingCart,
  Package,
  ChevronDown,
  LayoutDashboard,
  Settings,
  CreditCard,
  MapPin,
  HelpCircle,
} from "lucide-react";
import categories from "../utils/Categories";
import { useDarkMode } from "../context/DarkModeContext";
import VoiceCommand from "../ai/VoiceCommand";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, getUserRole } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  // State for toggling menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'categories', 'profile', or null

  const isLoggedIn = !!user;
  const userRole = getUserRole();
  const memoizedCategories = useMemo(() => categories, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const navigateToRoleDashboard = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    if (userRole === "customer") return navigate("/customer-dashboard");
    if (userRole === "supplier") return navigate("/supplier-dashboard");
    if (userRole === "admin") return navigate("/admin");
    navigate("/");
  }, [isLoggedIn, userRole, navigate]);

  const handleLogout = () => {
    logout();
    setActiveDropdown(null);
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={navigateToRoleDashboard}
              className="px-2 py-1 -ml-2 text-xl md:text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
            >
              ConnectingConstructions
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Home
            </Link>

            {!isLoggedIn && (
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  isActive("/about")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                About Us
              </Link>
            )}

            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors ${
                isActive("/contact")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Contact Us
            </Link>

            {/* Categories Dropdown (Non-Suppliers) */}
            {userRole !== "supplier" && userRole !== "admin" && (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("categories")}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none ${
                    activeDropdown === "categories"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  Categories <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "categories" ? "rotate-180" : ""}`} />
                </button>

                {activeDropdown === "categories" && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-80 overflow-y-auto py-2">
                      {memoizedCategories.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={`/category/${encodeURIComponent(cat.name)}`}
                          className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Supplier Links */}
            {userRole === "supplier" && (
              <>
                <Link
                  to="/supplier/myproducts"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/supplier/myproducts")
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  Products
                </Link>
                <Link
                  to="/supplier/orders"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/supplier/orders")
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  Orders
                </Link>
              </>
            )}

            {/* Icons Section */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700 ml-2">
              <VoiceCommand />

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                title="Toggle Theme"
              >
                {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
              </button>

              {userRole === "customer" && (
                <>
                  <Link
                    to="/customer/cart"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    title="Cart"
                  >
                    <ShoppingCart size={20} />
                  </Link>
                  <Link
                    to="/customer/notifications"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell size={20} />
                  </Link>
                </>
              )}

              {userRole === "supplier" && (
                <Link
                    to="/supplier/notifications"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell size={20} />
                </Link>
              )}

              {/* Profile Dropdown */}
              {isLoggedIn ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => toggleDropdown("profile")}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {activeDropdown === "profile" && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black ring-opacity-5">
                      {/* Dropdown Header */}
                      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                          {userRole}
                        </span>
                      </div>

                      {/* Dropdown Links */}
                      <div className="py-2">
                        <Link
                          to={userRole === "supplier" ? "/supplier-dashboard" : "/customer-dashboard"}
                          className="flex items-center px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <LayoutDashboard size={16} className="mr-3 text-gray-400" />
                          Dashboard
                        </Link>
                        
                        <Link
                          to={`/${userRole === "supplier" ? "supplier" : "customer"}/profile`}
                          className="flex items-center px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <User size={16} className="mr-3 text-gray-400" />
                          My Profile
                        </Link>

                        {userRole === "supplier" && (
                           <Link
                           to="/supplier/add-product"
                           className="flex items-center px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                         >
                           <Plus size={16} className="mr-3 text-gray-400" />
                           Add Product
                         </Link>
                        )}

                      </div>

                      {/* Dropdown Footer */}
                      <div className="border-t border-gray-100 dark:border-gray-700 py-2 bg-gray-50/30 dark:bg-gray-800/30">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-600/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <VoiceCommand />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl animate-in slide-in-from-top-4 duration-200 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="px-4 py-6 space-y-4">
             {isLoggedIn ? (
               <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                 <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                   <p className="text-xs text-gray-500">{user?.email}</p>
                 </div>
               </div>
             ) : (
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <Link
                    to="/login"
                    className="flex justify-center py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="flex justify-center py-2.5 bg-blue-600 text-white rounded-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
               </div>
             )}

            <div className="space-y-1">
              
              {!isLoggedIn && (
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 ${isActive('/about') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="w-8 flex justify-center"><HelpCircle size={20} /></div>
                  About Us
                </Link>
              )}

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 ${isActive('/contact') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <div className="w-8 flex justify-center"><MapPin size={20} /></div>
                Contact Us
              </Link>
              
              {isLoggedIn && (
                <Link
                  to={userRole === 'supplier' ? '/supplier-dashboard' : '/customer-dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <div className="w-8 flex justify-center"><LayoutDashboard size={20} /></div>
                  Dashboard
                </Link>
              )}

              {userRole === 'customer' && (
                <>
                  <Link
                    to="/customer/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <div className="w-8 flex justify-center"><ShoppingCart size={20} /></div>
                    My Cart
                  </Link>
                  <Link
                    to="/customer/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                     <div className="w-8 flex justify-center"><Package size={20} /></div>
                    My Orders
                  </Link>
                </>
              )}

            </div>

             <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <div className="w-8 flex justify-center">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</div>
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
             </div>
             
             {isLoggedIn && (
               <div className="pt-2">
                 <button
                   onClick={handleLogout}
                   className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium"
                 >
                   <div className="w-8 flex justify-center"><LogOut size={20} /></div>
                   Sign Out
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
