import React, { useEffect } from "react";
import {
  MapPin, // Main icon for Location Terms
  CheckCircle, // For consent/accuracy
  Globe, // For service areas
  Shield, // For data privacy
  AlertTriangle, // For limitations
  Info, // For changes to policy
  Mail, // For contact
} from "lucide-react"; // Importing icons

const LocationTerms = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <MapPin className="text-cyan-600 dark:text-cyan-400" size={36} />{" "}
          ConnectingConstructions Location Terms
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          These Location Terms outline how{" "}
          <strong>ConnectingConstructions</strong> uses location-based
          information to provide and enhance our services, including connecting
          you with relevant suppliers, products, and services in your area. By
          using our Service, you agree to the collection and use of your
          location data as described in this policy.
        </p>

        {/* SECTION 1: Collection and Use of Location Data */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <CheckCircle className="text-cyan-500 dark:text-cyan-300" size={24} />{" "}
          1. Collection and Use of Location Data
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We collect location data to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Personalize Experience:</strong> Provide you with localized
            search results, recommendations, and relevant content (e.g., nearby
            suppliers, local material availability).
          </li>
          <li>
            <strong>Facilitate Services:</strong> Connect customers with
            suppliers for services requiring physical presence (e.g., labor,
            on-site consultations).
          </li>
          <li>
            <strong>Improve Logistics:</strong> Assist in calculating shipping
            costs and estimated delivery times.
          </li>
          <li>
            <strong>Analyze Trends:</strong> Understand market demand and supply
            patterns in different regions.
          </li>
          <li>
            <strong>Security:</strong> Help detect and prevent fraud or
            unauthorized access.
          </li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          Location data may be collected through various means, including your
          device's GPS, IP address, Wi-Fi, or information you provide directly
          (e.g., shipping address).
        </p>

        {/* SECTION 2: Your Consent */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <CheckCircle className="text-cyan-500 dark:text-cyan-300" size={24} />{" "}
          2. Your Consent
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          By enabling location services on your device for our app or providing
          your address on our website, you consent to the collection and use of
          your location data as described in this policy. You can manage your
          device's location settings or update your address information in your
          profile at any time. For more details on managing consent for smart
          features, refer to our{" "}
          <a
            href="/legal/userconsentforsmartfeatures"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            User Consent for Smart Features Policy
          </a>
          .
        </p>

        {/* SECTION 3: Accuracy of Location Information */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-cyan-500 dark:text-cyan-300"
            size={24}
          />{" "}
          3. Accuracy of Location Information
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          The accuracy of location data can vary and may be affected by factors
          such as your device settings, network connectivity, and environmental
          conditions. ConnectingConstructions is not responsible for any
          inaccuracies in location data provided by your device or by you. It is
          your responsibility to ensure that any addresses or location details
          you provide are accurate and up-to-date for service delivery.
        </p>

        {/* SECTION 4: Sharing of Location Data */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Shield className="text-cyan-500 dark:text-cyan-300" size={24} /> 4.
          Sharing of Location Data
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We may share your location data with:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Suppliers:</strong> Relevant suppliers to facilitate order
            fulfillment, service delivery, or to provide localized
            product/service offerings.
          </li>
          <li>
            <strong>Logistics Partners:</strong> Shipping and delivery companies
            to ensure accurate and timely delivery of your orders.
          </li>
          <li>
            <strong>Service Providers:</strong> Third-party service providers
            who assist us in operating and improving our platform (e.g., mapping
            services, analytics providers).
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law or to
            protect our rights, property, or safety, or that of our users.
          </li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          All sharing of location data is done in accordance with our{" "}
          <a
            href="/legal/privacypolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="/legal/dataprotectionpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Data Protection Policy
          </a>
          .
        </p>

        {/* SECTION 5: Service Area Limitations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Globe className="text-cyan-500 dark:text-cyan-300" size={24} /> 5.
          Service Area Limitations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions' services and supplier availability may be
          limited by geographic location. Not all products or services may be
          available in all areas. You will be informed during the search or
          checkout process if a product/service is not available for your
          specified location.
        </p>

        {/* SECTION 6: Changes to These Terms */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Info className="text-cyan-500 dark:text-cyan-300" size={24} /> 6.
          Changes to These Terms
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update these
          Location Terms at any time. We will notify you of any material changes
          by posting the updated Terms on this page and updating the "Last
          updated" date. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Terms.
        </p>

        {/* SECTION 7: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Mail className="text-cyan-500 dark:text-cyan-300" size={24} /> 7.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding these Location Terms,
          please contact us:
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

export default LocationTerms;
