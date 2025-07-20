import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";

const Footer = () => {
  const { pathname } = useLocation();

  // ❌ Hide on auth pages if needed
  const hiddenRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    // "/materials",
    // "cart",
    // "/my-orders",
  ];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <footer className="bg-blue-950 text-gray-300 pt-3 pb-3 px-4 border-t border-blue-800 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-15">
        {/* 🧱 Brand Overview */}
        <div>
          <h2 className="text-l font-bold text-white mb-2">
            ConnectingConstructions
          </h2>
          <p className="text-sm leading-6">
            The Amazon for Builders
            <br />— your all-in-one construction ecosystem.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-white text-lg hover:text-gray-300">
              <FaGooglePlay />
            </a>
            <a href="#" className="text-white text-lg hover:text-gray-300">
              <FaApple />
            </a>
          </div>
        </div>

        {/* 📌 Quick Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 ">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm ">
            <li>
              <Link to="/" className="hover:text-white">
                🏠 Home
              </Link>
            </li>
            <li>
              <Link to="/materials" className="hover:text-white">
                🧱 Materials
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white">
                🛒 Cart
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-white">
                📜 Orders
              </Link>
            </li>
            <li>
              <Link to="/customer-dashboard" className="hover:text-white">
                📊 Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* 📦 Categories (Top 5 Only) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Top Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/category/cement" className="hover:text-white">
                Cement
              </Link>
            </li>
            <li>
              <Link to="/category/iron" className="hover:text-white">
                Iron
              </Link>
            </li>
            <li>
              <Link to="/category/paints" className="hover:text-white">
                Paints
              </Link>
            </li>
            <li>
              <Link to="/category/trucks" className="hover:text-white">
                Trucks
              </Link>
            </li>
            <li>
              <Link to="/category/interiors" className="hover:text-white">
                Interiors
              </Link>
            </li>
          </ul>
        </div>

        {/* 📞 Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Get in Touch
          </h3>
          <div className="space-y-2 text-sm mb-4">
            <a
              href="https://www.google.com/maps/search/?api=1&query=CVR+College+Road,+Mangalpally,+Hyderabad,+Telangana"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-blue-300 transition duration-200"
            >
              📍 CVR College Road, Hyderabad
            </a>
            <a
              href="mailto:anilnunnagopula15@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-blue-400 transition duration-200"
            >
              📧 anilnunnagopula15@gmail.com
            </a>
            <a
              href="tel:+919398828248"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div>
                <p>📞+91 93988 28248</p>
              </div>
            </a>
          </div>

          {/* Social Media Glow Squad */}
          <div className="flex gap-4 text-lg">
            <a
              href="#"
              className="hover:text-blue-500 hover:scale-110 transform transition duration-200"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/rowdy_darling_____/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 hover:scale-110 transform transition duration-200"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-sky-400 hover:scale-110 transform transition duration-200"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/anil-nunnagopula15112004/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 hover:scale-110 transform transition duration-200"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* 🧾 Legal Row */}
      <div className="mt-10 border-t border-blue-800 pt-6 text-sm text-center text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">
            ConnectingConstructions
          </span>
          . All rights reserved.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Link to="#" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/legal/termsandcondtions" className="hover:text-white">
            Terms & Conditions
          </Link>
          <Link to="#" className="hover:text-white">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
