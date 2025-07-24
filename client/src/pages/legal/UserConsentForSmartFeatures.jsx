import React, { useEffect } from "react";
import {
  UserCheck, // Main icon for user consent
  CheckCircle, // For consent process
  Settings, // For managing preferences
  Shield, // For data protection link
  Info, // For changes to policy
  Mail, // For contact
  Brain, // For smart features
} from "lucide-react"; // Importing icons

const UserConsentForSmartFeatures = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <UserCheck
            className="text-indigo-600 dark:text-indigo-400"
            size={36}
          />{" "}
          ConnectingConstructions User Consent for Smart Features
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This User Consent for Smart Features Policy explains how{" "}
          <strong>ConnectingConstructions</strong> obtains and manages your
          consent for the use of data by our AI-powered and "smart" features. We
          are committed to giving you full control over your data and ensuring
          transparency in how these advanced functionalities enhance your
          experience.
        </p>

        {/* SECTION 1: What are Smart Features? */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Brain className="text-indigo-500 dark:text-indigo-300" size={24} />{" "}
          1. What are Smart Features?
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          "Smart features" on ConnectingConstructions refer to functionalities
          that utilize artificial intelligence, machine learning, and advanced
          data processing to provide personalized, efficient, and insightful
          experiences. These may include:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Personalized product/supplier recommendations.</li>
          <li>AI-generated market insights and trend analysis.</li>
          <li>Intelligent search suggestions and auto-completion.</li>
          <li>
            Automated matching of customer needs with supplier capabilities.
          </li>
          <li>Optimized logistics planning suggestions.</li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          These features often require processing your usage data, preferences,
          and other relevant information to function effectively.
        </p>

        {/* SECTION 2: Your Consent Process */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          2. Your Consent Process
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We obtain your consent for smart features through clear and explicit
          mechanisms:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Opt-in:</strong> For certain smart features, we will
            explicitly ask for your consent before enabling them or processing
            your data for those purposes. This may be through a pop-up, a
            dedicated settings toggle, or during the onboarding process.
          </li>
          <li>
            <strong>Granular Controls:</strong> Where possible, we provide
            granular controls, allowing you to consent to specific types of data
            processing or specific smart features, rather than an all-or-nothing
            approach.
          </li>
          <li>
            <strong>Information Provided:</strong> Before requesting consent, we
            will provide clear information about what data will be used, how it
            will be used, and the benefits of enabling the smart feature.
          </li>
          <li>
            <strong>Implied Consent:</strong> For basic functionalities that are
            integral to the core operation of the platform and do not involve
            sensitive data processing beyond what is covered in our Privacy
            Policy, your continued use of the Service may imply consent.
          </li>
        </ul>

        {/* SECTION 3: Managing Your Consent and Preferences */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Settings
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          3. Managing Your Consent and Preferences
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          You have the right to withdraw your consent at any time. You can
          manage your preferences for smart features and data usage through:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Account Settings:</strong> A dedicated "Privacy Settings" or
            "Smart Features" section within your ConnectingConstructions account
            will allow you to review and adjust your consent choices.
          </li>
          <li>
            <strong>Opt-out Options:</strong> For features that you previously
            consented to, clear opt-out mechanisms will be provided.
          </li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          Please note that withdrawing consent for certain smart features may
          affect the functionality or personalization of your experience on the
          platform.
        </p>

        {/* SECTION 4: Data Protection and Privacy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Shield className="text-indigo-500 dark:text-indigo-300" size={24} />{" "}
          4. Data Protection and Privacy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          The data collected and processed for smart features is handled in
          strict accordance with our comprehensive{" "}
          <a
            href="/legal/dataprotectionpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Data Protection Policy
          </a>{" "}
          and{" "}
          <a
            href="/legal/privacypolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          . We implement robust security measures to protect your information.
        </p>

        {/* SECTION 5: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Info className="text-indigo-500 dark:text-indigo-300" size={24} /> 5.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          User Consent for Smart Features Policy at any time. We will notify you
          of any material changes by posting the updated Policy on this page and
          updating the "Last updated" date. Your continued use of the Service
          after such modifications constitutes your acceptance of the revised
          Policy.
        </p>

        {/* SECTION 6: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Mail className="text-indigo-500 dark:text-indigo-300" size={24} /> 6.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding our User Consent for
          Smart Features, please contact us:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:anilnunnagopula15@gmail.com"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              anilnunnagopula15@gmail.com
            </a>
          </li>
          <li>
            <strong>Address:</strong> ConnectingConstructions HQ, Mangalpalle,
            Telangana, India
          </li>
        </ul>

        <p className="mt-12 text-sm text-center italic text-gray-500 dark:text-gray-400">
          Last updated: July 2025
        </p>
      </div>
    </div>
  );
};

export default UserConsentForSmartFeatures;
