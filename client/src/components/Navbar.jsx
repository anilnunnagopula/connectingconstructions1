import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger & close icons
import categories from "../utils/Categories";
import { useDarkMode } from "../context/DarkModeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();

  // const isLoggedIn = localStorage.getItem("userRole");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const userRole = user?.role;
  console.log("User:", user);
  console.log("Role:", userRole);



  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    navigate("/login");

    // navigate("/login");
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
    setIsOpen(false);
    setShowDropdown(false);
    setMobileDropdown(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 sticky top-0 z-50 text-black dark:text-white transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 dark:text-blue-400"
        >
          ConnectingConstructions
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 relative">
          {!isLoggedIn && (
            <Link
              to="/home"
              className="hover:text-blue-600 dark:hover:text-blue-300"
            >
              Home
            </Link>
          )}

          {isLoggedIn && userRole === "customer" && (
            <Link
              to="/customer-dashboard"
              className="hover:text-blue-600 dark:hover:text-blue-300"
            >
              Home
            </Link>
          )}

          {isLoggedIn && userRole === "supplier" && (
            <Link
              to="/supplier-dashboard"
              className="hover:text-blue-600 dark:hover:text-blue-300"
            >
              Home
            </Link>
          )}

          {/* Hover Categories Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-300 transition">
              Categories <Menu className="w-5 h-5" />
            </button>

            <div
              className={`absolute top-8 left-0 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-xl w-56 z-50 transform transition-all duration-200 ease-in-out origin-top ${
                showDropdown
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              } max-h-64 overflow-y-auto`}
            >
              {categories.map((cat, idx) => (
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

          {!isLoggedIn ? (
            <Link
              to="/about"
              className="hover:text-blue-600 dark:hover:text-blue-300"
            >
              About
            </Link>
          ) : null}

          {/* 🔘 Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 dark:text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 px-2 pb-4 animate-fade-in-down">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-300">
            Home
          </Link>

          <div>
            <button
              className="w-full text-left hover:text-blue-600 dark:hover:text-blue-300"
              onClick={() => setMobileDropdown(!mobileDropdown)}
            >
              Categories {mobileDropdown ? "▲" : "▼"}
            </button>
            {mobileDropdown && (
              <div className="pl-4 mt-2 space-y-1">
                {categories.map((cat, idx) => (
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

          {!isLoggedIn ? (
            <Link
              to="/about"
              className="hover:text-blue-600 dark:hover:text-blue-300"
            >
              About
            </Link>
          ) : null}

          {/* 🔘 Mobile Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-white text-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
            title="Toggle Dark Mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
