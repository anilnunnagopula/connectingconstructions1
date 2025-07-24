import React, { useEffect } from "react";
import { SlidersHorizontal, Cookie, Shield, Info } from "lucide-react";

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Cookie className="text-yellow-500 dark:text-yellow-300" size={36} />
          Cookie Policy
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Cookie Policy explains how <strong>ConnectingConstructions</strong> (“we,” “us,” or “our”) uses cookies and similar technologies on our platform — including our website, mobile app, and related services (collectively referred to as the “Service”).
        </p>

        {/* What are Cookies */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-300 dark:border-yellow-600 pb-3 flex items-center gap-2">
          <SlidersHorizontal size={24} className="text-yellow-500 dark:text-yellow-300" />
          1. What Are Cookies?
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, improve user experience, and gather analytical data. Some cookies are essential to enable core functionality, while others help us improve your experience.
        </p>

        {/* Types of Cookies */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-300 dark:border-yellow-600 pb-3 flex items-center gap-2">
          <Shield size={24} className="text-yellow-500 dark:text-yellow-300" />
          2. Types of Cookies We Use
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li><strong>Essential Cookies:</strong> Necessary for the platform to function. These include session authentication, load balancing, etc.</li>
          <li><strong>Analytics Cookies:</strong> Help us understand user behavior and interactions (e.g., pages visited, features used).</li>
          <li><strong>Functional Cookies:</strong> Enhance usability by remembering preferences such as language or region selection.</li>
          <li><strong>Advertising Cookies:</strong> May be used by third-party services to deliver relevant ads and track effectiveness.</li>
        </ul>

        {/* How We Use Cookies */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-300 dark:border-yellow-600 pb-3 flex items-center gap-2">
          <Cookie size={24} className="text-yellow-500 dark:text-yellow-300" />
          3. How We Use Cookies
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We use cookies to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Enable secure login and account management</li>
          <li>Analyze site traffic and improve the platform experience</li>
          <li>Remember user preferences and settings</li>
          <li>Facilitate customer support chat systems (if integrated)</li>
        </ul>

        {/* Managing Cookies */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-300 dark:border-yellow-600 pb-3 flex items-center gap-2">
          <Info size={24} className="text-yellow-500 dark:text-yellow-300" />
          4. Managing Cookies
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Most web browsers allow you to control cookies through settings. You can choose to accept or reject cookies, delete existing ones, or receive a warning before storing new ones. However, disabling certain cookies may impact the usability of some features of our platform.
        </p>

        {/* Third-Party Cookies */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-300 dark:border-yellow-600 pb-3 flex items-center gap-2">
          <SlidersHorizontal size={24} className="text-yellow-500 dark:text-yellow-300" />
          5. Third-Party Cookies
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We may allow selected third-party services such as Google Analytics, Razorpay, or others to set cookies to analyze user behavior, payment success rates, or site performance. These cookies are governed by the respective service providers’ policies.
        </p>

        {/* Updates to this Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-300 dark:border-yellow-600 pb-3 flex items-center gap-2">
          <Info size={24} className="text-yellow-500 dark:text-yellow-300" />
          6. Changes to This Cookie Policy
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We may update this Cookie Policy periodically. When we do, we will revise the "Last updated" date at the bottom of this page and notify you if required. Continued use of the Service after such updates will signify your consent.
        </p>

        {/* Contact Info */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-300 dark:border-yellow-600 pb-3 flex items-center gap-2">
          <Info size={24} className="text-yellow-500 dark:text-yellow-300" />
          7. Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have questions about our use of cookies, please contact:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:anilnunnagopula15@gmail.com"
              className="underline text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors duration-200"
            >
              anilnunnagopula15@gmail.com
            </a>
          </li>
          <li>
            <strong>Address:</strong> ConnectingConstructions HQ, Mangalpalle, Telangana, India
          </li>
        </ul>

        <p className="mt-12 text-sm text-center italic text-gray-500 dark:text-gray-400">
          Last updated: July 2025
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;
