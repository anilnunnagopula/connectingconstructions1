import React, { useEffect } from "react";
import {
  Megaphone, // Main icon for ads/promotions
  CheckCircle, // For eligibility
  List, // For types of ads
  DollarSign, // For pricing model
  Eye, // For placement & visibility
  BarChart2, // For performance metrics
  ClipboardList, // For content guidelines
  XCircle, // For cancellation
  Info, // For general info/changes
  Mail, // For contact
} from "lucide-react"; // Importing icons

const AdPlacementFeaturedListings = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Megaphone
            className="text-orange-600 dark:text-orange-400"
            size={36}
          />{" "}
          ConnectingConstructions Ad Placement & Featured Listings Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Ad Placement & Featured Listings Policy outlines the terms and
          conditions for suppliers ("Suppliers," "you," or "your") to promote
          their products and services through paid advertising and featured
          placements on the <strong>ConnectingConstructions</strong> platform.
          These options are designed to boost your visibility, attract more
          customers, and drive sales.
        </p>

        {/* SECTION 1: Overview of Ad Services */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Megaphone
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          1. Overview of Ad Services
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions offers various advertising and promotional
          opportunities to enhance supplier presence on the platform. These
          services include, but are not limited to, sponsored listings in search
          results, featured positions on category pages, and display
          advertisements.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Increased Visibility:</strong> Ads and featured listings
            help your products and services stand out to potential customers.
          </li>
          <li>
            <strong>Targeted Reach:</strong> Campaigns can be tailored to reach
            specific customer segments or geographic locations.
          </li>
          <li>
            <strong>Performance-Driven:</strong> We provide tools to monitor the
            performance of your ad campaigns.
          </li>
        </ul>

        {/* SECTION 2: Eligibility */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          2. Eligibility
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          To be eligible for Ad Placement and Featured Listings, suppliers must:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Have an active and in good standing Supplier account on
            ConnectingConstructions.
          </li>
          <li>
            Comply with all terms outlined in the{" "}
            <a
              href="/legal/supplieragreement"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Supplier Agreement
            </a>{" "}
            and{" "}
            <a
              href="/legal/productguidelines"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Product Guidelines
            </a>
            .
          </li>
          <li>
            Ensure all advertised products/services comply with our content
            guidelines (Section 7).
          </li>
          <li>
            Maintain a positive performance record (e.g., low cancellation
            rates, good customer reviews).
          </li>
        </ul>

        {/* SECTION 3: Types of Ad Placements and Featured Listings */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <List className="text-orange-500 dark:text-orange-300" size={24} /> 3.
          Types of Ad Placements and Featured Listings
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We offer various formats for promoting your offerings:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Sponsored Search Results:</strong> Your products/services
            appear at the top or within relevant search results, clearly marked
            as sponsored.
          </li>
          <li>
            <strong>Category Page Features:</strong> Prominent placement on
            specific category or sub-category pages.
          </li>
          <li>
            <strong>Homepage Banners/Sections:</strong> High-visibility
            placements on the ConnectingConstructions homepage.
          </li>
          <li>
            <strong>Email Marketing Inclusion:</strong> Opportunities to be
            featured in our promotional email campaigns to customers.
          </li>
          <li>
            <strong>Custom Campaigns:</strong> For enterprise-tier suppliers,
            custom advertising solutions may be available.
          </li>
        </ul>

        {/* SECTION 4: Pricing Model */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <DollarSign
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          4. Pricing Model
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          The pricing for ad placements and featured listings varies based on
          the type of placement, duration, targeting, and competitive bidding.
          Common pricing models include:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Cost-Per-Click (CPC):</strong> You pay each time a user
            clicks on your ad.
          </li>
          <li>
            <strong>Cost-Per-Impression (CPM):</strong> You pay for every
            thousand times your ad is displayed.
          </li>
          <li>
            <strong>Fixed Fee:</strong> A set fee for a specific placement over
            a defined period (e.g., weekly, monthly).
          </li>
          <li>
            <strong>Subscription Add-on:</strong> Certain featured listing
            benefits may be included or offered at a discounted rate with
            higher-tier{" "}
            <a
              href="/legal/monetization/suppliersubscriptionplans"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Supplier Subscription Plans
            </a>
            .
          </li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          Detailed pricing and bidding options are available within the
          Advertising section of your Supplier dashboard.
        </p>

        {/* SECTION 5: Placement and Visibility */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Eye className="text-orange-500 dark:text-orange-300" size={24} /> 5.
          Placement and Visibility
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Algorithm:</strong> Ad placements are determined by a
            combination of bidding, relevance to user search queries/categories,
            and ad quality score.
          </li>
          <li>
            <strong>"Sponsored" Label:</strong> All paid placements will be
            clearly identified to users as "Sponsored," "Ad," or "Featured" to
            maintain transparency.
          </li>
          <li>
            <strong>Fairness:</strong> While ads offer increased visibility, our
            platform's organic search results and recommendation algorithms
            remain unbiased and driven by relevance and user preference.
          </li>
        </ul>

        {/* SECTION 6: Performance Metrics and Reporting */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <BarChart2
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          6. Performance Metrics and Reporting
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Suppliers will have access to a dashboard providing key performance
          metrics for their ad campaigns, including:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Impressions (number of times your ad was viewed).</li>
          <li>Clicks (number of times your ad was clicked).</li>
          <li>Click-Through Rate (CTR).</li>
          <li>Conversion Rate (if applicable).</li>
          <li>Total spend.</li>
        </ul>

        {/* SECTION 7: Ad Content Guidelines */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          7. Ad Content Guidelines
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          All ad content must comply with the following:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Accuracy:</strong> Ad content must be truthful, accurate,
            and not misleading.
          </li>
          <li>
            <strong>Relevance:</strong> Ads must be relevant to the
            product/service being promoted.
          </li>
          <li>
            <strong>Prohibited Content:</strong> Ads must not contain any
            content that is illegal, offensive, discriminatory, harmful, or
            infringes on third-party rights (e.g., intellectual property). This
            includes content prohibited by our{" "}
            <a
              href="/legal/productguidelines"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Product Guidelines
            </a>
            .
          </li>
          <li>
            <strong>Quality:</strong> Images and text must be high-quality and
            professional.
          </li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to reject or remove any ad
          content that violates these guidelines without refund.
        </p>

        {/* SECTION 8: Cancellation of Ad Campaigns */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <XCircle className="text-orange-500 dark:text-orange-300" size={24} />{" "}
          8. Cancellation of Ad Campaigns
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Suppliers can cancel their ad campaigns at any time through their
          Supplier dashboard. For CPC/CPM campaigns, billing will cease
          immediately. For fixed-fee placements, refunds for unused portions are
          subject to the specific terms agreed upon at the time of purchase.
        </p>

        {/* SECTION 9: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Info className="text-orange-500 dark:text-orange-300" size={24} /> 9.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this Ad
          Placement & Featured Listings Policy at any time. We will notify
          Suppliers of any material changes by posting the updated Policy on
          this page and updating the "Last updated" date. Your continued use of
          our ad services after such modifications constitutes your acceptance
          of the revised Policy.
        </p>

        {/* SECTION 10: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Mail className="text-orange-500 dark:text-orange-300" size={24} />{" "}
          10. Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding our Ad Placement &
          Featured Listings, please contact us:
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

export default AdPlacementFeaturedListings;
