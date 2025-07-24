import React, { useEffect } from "react";
import {
  Search, // Main icon for recommendations/search
  Lightbulb, // For insights/logic
  Filter, // For personalization/filters
  Users, // For user impact
  Info, // For changes to policy
  Mail, // For contact
  Eye, // For transparency
} from "lucide-react"; // Importing icons

const TransparentRecommendationLogic = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Search className="text-blue-600 dark:text-blue-400" size={36} />{" "}
          ConnectingConstructions Transparent Recommendation Logic
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Transparent Recommendation Logic Policy provides insights into
          how <strong>ConnectingConstructions'</strong> recommendation and
          search algorithms work to personalize your experience and present
          relevant products, suppliers, and services. We are committed to
          transparency in our algorithmic processes to help you understand how
          content is prioritized.
        </p>

        {/* SECTION 1: How Recommendations Work */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Lightbulb className="text-blue-500 dark:text-blue-300" size={24} />{" "}
          1. How Recommendations Work
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Our recommendation systems use a combination of factors to suggest
          content relevant to you. These factors typically include:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Your Past Interactions:</strong> Products you've viewed,
            searched for, added to cart, or purchased.
          </li>
          <li>
            <strong>Similar User Behavior:</strong> What other users with
            similar interests or browsing patterns have engaged with.
          </li>
          <li>
            <strong>Product/Supplier Attributes:</strong> Characteristics of the
            items (e.g., category, specifications, price range) or suppliers
            (e.g., location, ratings, specializations).
          </li>
          <li>
            <strong>Popularity and Trends:</strong> Currently popular or
            trending products/services on the platform.
          </li>
          <li>
            <strong>Geographic Relevance:</strong> Proximity of suppliers or
            services to your specified location.
          </li>
          <li>
            <strong>Supplier Performance:</strong> Supplier ratings,
            reliability, and fulfillment history.
          </li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          These factors are weighted by our algorithms to generate a
          personalized ranking of items.
        </p>

        {/* SECTION 2: Personalization and Filters */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Filter className="text-blue-500 dark:text-blue-300" size={24} /> 2.
          Personalization and Filters
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          You have control over how your experience is personalized:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Search Filters:</strong> You can actively use filters (e.g.,
            price range, location, ratings, specific attributes) to narrow down
            search results and recommendations.
          </li>
          <li>
            <strong>Sorting Options:</strong> We provide various sorting options
            (e.g., "Relevance," "Price: Low to High," "Newest Arrivals," "Top
            Rated") to allow you to prioritize results based on your
            preferences.
          </li>
          <li>
            <strong>Account Preferences:</strong> You can manage certain
            preferences in your account settings that may influence
            recommendations.
          </li>
        </ul>

        {/* SECTION 3: Impact of Recommendations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Users className="text-blue-500 dark:text-blue-300" size={24} /> 3.
          Impact of Recommendations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Our recommendation systems are designed to enhance your user
          experience by helping you discover relevant products and services more
          easily. However, it's important to understand that:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Visibility:</strong> Recommendations can significantly
            influence the visibility of products and suppliers on the platform.
          </li>
          <li>
            <strong>No Guarantee:</strong> While designed to be helpful,
            recommendations do not guarantee satisfaction or suitability for
            your specific needs. Always conduct your own due diligence.
          </li>
          <li>
            <strong>Algorithmic Fairness:</strong> We strive to ensure our
            recommendation algorithms are fair and minimize bias. For more
            details, please refer to our{" "}
            <a
              href="/legal/algorithmicfairnesspolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Algorithmic Fairness Policy
            </a>
            .
          </li>
        </ul>

        {/* SECTION 4: Transparency Measures */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Eye className="text-blue-500 dark:text-blue-300" size={24} /> 4.
          Transparency Measures
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions is committed to providing transparency
          regarding its recommendation logic. We aim to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Clearly label sponsored or featured content (refer to{" "}
            <a
              href="/legal/adplacement"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Ad Placement & Featured Listings Policy
            </a>
            ).
          </li>
          <li>
            Offer various sorting and filtering options to empower user control.
          </li>
          <li>
            Provide general explanations of the factors influencing
            recommendations, as outlined in Section 1.
          </li>
        </ul>

        {/* SECTION 5: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Info className="text-blue-500 dark:text-blue-300" size={24} /> 5.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Transparent Recommendation Logic Policy at any time. We will notify
          you of any material changes by posting the updated Policy on this page
          and updating the "Last updated" date. Your continued use of the
          Service after such modifications constitutes your acceptance of the
          revised Policy.
        </p>

        {/* SECTION 6: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Mail className="text-blue-500 dark:text-blue-300" size={24} /> 6.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding our Transparent
          Recommendation Logic, please contact us:
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

export default TransparentRecommendationLogic;
