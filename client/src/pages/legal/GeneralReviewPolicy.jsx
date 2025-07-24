import React, { useEffect } from "react";
import {
  ThumbsUp, // Main icon for General Review Policy
  CheckCircle, // For guidelines
  User, // For eligibility
  Ban, // For prohibited content
  AlertTriangle, // For reporting
  ShieldCheck, // For moderation
  Info, // For changes to policy
  Mail, // For contact
  ClipboardList,
} from "lucide-react"; // Importing icons

const GeneralReviewPolicy = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <ThumbsUp
            className="text-orange-600 dark:text-orange-400"
            size={36}
          />{" "}
          ConnectingConstructions General Review Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This General Review Policy outlines the guidelines for submitting and
          managing product and service reviews on the{" "}
          <strong>ConnectingConstructions</strong> platform. We encourage honest
          and constructive feedback to help our community make informed
          decisions and to foster a transparent marketplace.
        </p>

        {/* SECTION 1: Purpose of Reviews */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          1. Purpose of Reviews
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Reviews on ConnectingConstructions serve to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Provide genuine insights into product quality and supplier
            performance.
          </li>
          <li>Assist other users in their purchasing decisions.</li>
          <li>
            Offer valuable feedback to suppliers for continuous improvement.
          </li>
          <li>
            Build trust and credibility within the ConnectingConstructions
            community.
          </li>
        </ul>

        {/* SECTION 2: Eligibility to Submit a Review */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <User className="text-orange-500 dark:text-orange-300" size={24} /> 2.
          Eligibility to Submit a Review
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Only customers who have a verified purchase or service engagement
          through the ConnectingConstructions platform are eligible to submit a
          review for that specific product or supplier. This ensures
          authenticity and relevance of feedback.
        </p>

        {/* SECTION 3: Review Content Guidelines */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          3. Review Content Guidelines
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          To maintain the integrity and usefulness of our review system, all
          reviews must adhere to the following guidelines:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Relevance:</strong> Reviews must be directly related to the
            product or service being reviewed and your actual experience with
            it.
          </li>
          <li>
            <strong>Accuracy:</strong> Reviews should be truthful and reflect
            your genuine opinion. Do not post false or misleading information.
          </li>
          <li>
            <strong>Respectful Language:</strong> Use polite and constructive
            language. Reviews should not contain hate speech, discriminatory
            remarks, personal attacks, or profanity.
          </li>
          <li>
            <strong>No Personal Information:</strong> Do not include personal
            contact information (e.g., phone numbers, email addresses) of
            yourself or others.
          </li>
          <li>
            <strong>No Promotional Content:</strong> Reviews should not be used
            for advertising, spamming, or promoting other businesses or
            websites.
          </li>
          <li>
            <strong>No Illegal Content:</strong> Content that promotes illegal
            activities or violates any laws is strictly prohibited.
          </li>
          <li>
            <strong>Original Content:</strong> Reviews should be your own
            original content and not infringe on any intellectual property
            rights.
          </li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          For a broader understanding of acceptable content, please refer to our{" "}
          <a
            href="/legal/platformpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Platform Policy
          </a>{" "}
          and{" "}
          <a
            href="/legal/customer/reviewsystemintegrity"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Review System Integrity Policy
          </a>
          .
        </p>

        {/* SECTION 4: Review Moderation and Enforcement */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <ShieldCheck
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          4. Review Moderation and Enforcement
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to moderate reviews to
          ensure compliance with this policy. This includes:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Removal:</strong> Reviews that violate our guidelines will
            be removed from the platform.
          </li>
          <li>
            <strong>No Editing:</strong> We do not edit review content; reviews
            are either published as submitted or removed.
          </li>
          <li>
            <strong>Account Action:</strong> Repeated or severe violations may
            lead to temporary suspension or permanent termination of the user's
            account.
          </li>
          <li>
            <strong>Supplier Responses:</strong> Suppliers can respond to
            reviews, provided their responses also adhere to these guidelines.
          </li>
        </ul>

        {/* SECTION 5: Reporting Inappropriate Reviews */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          5. Reporting Inappropriate Reviews
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          If you believe a review violates this policy, please use the "Report
          Review" option available on the platform or contact our customer
          support. Provide specific reasons for your report to assist our
          moderation team.
        </p>

        {/* SECTION 6: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Info className="text-orange-500 dark:text-orange-300" size={24} /> 6.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          General Review Policy at any time. We will notify you of any material
          changes by posting the updated Policy on this page and updating the
          "Last updated" date. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Policy.
        </p>

        {/* SECTION 7: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Mail className="text-orange-500 dark:text-orange-300" size={24} /> 7.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding this General Review
          Policy, please contact us:
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

export default GeneralReviewPolicy;
