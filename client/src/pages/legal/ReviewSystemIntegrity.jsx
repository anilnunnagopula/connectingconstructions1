import React, { useEffect } from "react";
import {
  Star, // Main icon for Review System Integrity
  CheckCircle, // For principles/guidelines
  User, // For reviewer identity
  Ban, // For prohibited content
  AlertTriangle, // For reporting violations
  ShieldCheck, // For moderation
  Info, // For changes to policy
  Mail, // For contact us
  ClipboardList,
} from "lucide-react"; // Importing icons

const ReviewSystemIntegrity = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Star className="text-yellow-600 dark:text-yellow-400" size={36} />{" "}
          ConnectingConstructions Review System Integrity Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Review System Integrity Policy outlines{" "}
          <strong>ConnectingConstructions'</strong> commitment to maintaining a
          fair, transparent, and trustworthy review system on our platform. We
          believe that genuine and constructive reviews are essential for
          helping customers make informed decisions and for enabling suppliers
          to build their reputation.
        </p>

        {/* SECTION 1: Purpose of the Review System */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-yellow-500 dark:text-yellow-300"
            size={24}
          />{" "}
          1. Purpose of the Review System
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Our review system serves to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Provide customers with authentic feedback on products, services, and
            suppliers.
          </li>
          <li>
            Enable suppliers to receive constructive criticism and showcase
            their quality and reliability.
          </li>
          <li>
            Foster a community of trust and accountability on the platform.
          </li>
          <li>
            Inform our recommendation algorithms to improve user experience.
          </li>
        </ul>

        {/* SECTION 2: Eligibility to Leave a Review */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <User className="text-yellow-500 dark:text-yellow-300" size={24} /> 2.
          Eligibility to Leave a Review
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Only verified customers who have completed a transaction (purchase or
          service engagement) with a specific supplier or product on
          ConnectingConstructions are eligible to leave a review for that
          transaction. This helps ensure that reviews are based on actual
          experiences.
        </p>

        {/* SECTION 3: Review Content Guidelines */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-yellow-500 dark:text-yellow-300"
            size={24}
          />{" "}
          3. Review Content Guidelines
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          All reviews must adhere to our content guidelines to maintain a
          respectful and useful environment. Prohibited content includes:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Irrelevant Content:</strong> Reviews should be directly
            related to the product/service and the transaction experience. Do
            not include personal attacks, political commentary, or unrelated
            grievances.
          </li>
          <li>
            <strong>Hate Speech & Discrimination:</strong> Any content that
            promotes hatred, discrimination, or violence against individuals or
            groups.
          </li>
          <li>
            <strong>Obscenity & Profanity:</strong> Explicit, vulgar, or
            offensive language.
          </li>
          <li>
            <strong>Personal Information:</strong> Do not include personally
            identifiable information of yourself or others (e.g., phone numbers,
            addresses, email IDs).
          </li>
          <li>
            <strong>Illegal Activities:</strong> Content that promotes or
            describes illegal activities.
          </li>
          <li>
            <strong>Spam & Advertising:</strong> Unsolicited promotional
            content, external links, or attempts to divert traffic from
            ConnectingConstructions.
          </li>
          <li>
            <strong>Intellectual Property Infringement:</strong> Content that
            infringes on copyrights, trademarks, or other intellectual property
            rights.
          </li>
          <li>
            <strong>False or Misleading Information:</strong> Reviews that
            contain factually incorrect statements or are intentionally
            deceptive.
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
            href="/legal/reviewpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            General Review Policy
          </a>
          .
        </p>

        {/* SECTION 4: Review Moderation and Enforcement */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <ShieldCheck
            className="text-yellow-500 dark:text-yellow-300"
            size={24}
          />{" "}
          4. Review Moderation and Enforcement
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions employs a combination of automated tools and
          human moderators to review reported content and ensure compliance with
          these guidelines.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Removal of Violating Content:</strong> Reviews found to
            violate these guidelines will be removed.
          </li>
          <li>
            <strong>Account Suspension:</strong> Repeated or severe violations
            may lead to temporary suspension or permanent termination of the
            user's account.
          </li>
          <li>
            <strong>No Editing by ConnectingConstructions:</strong> We do not
            edit reviews for content, only remove them if they violate policy.
          </li>
          <li>
            <strong>Supplier Responses:</strong> Suppliers have the right to
            publicly respond to reviews, provided their responses also adhere to
            these guidelines.
          </li>
        </ul>

        {/* SECTION 5: Reporting Violations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-yellow-500 dark:text-yellow-300"
            size={24}
          />{" "}
          5. Reporting Violations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          If you encounter a review that you believe violates these guidelines,
          please report it using the "Report Review" option available on the
          platform. Provide as much detail as possible to help us investigate.
        </p>

        {/* SECTION 6: Prevention of Fake Reviews */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-yellow-500 dark:text-yellow-300"
            size={24}
          />{" "}
          6. Prevention of Fake Reviews
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We actively work to prevent and detect fraudulent or manipulated
          reviews. Our measures include:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Restricting reviews to verified purchasers/users.</li>
          <li>
            Utilizing sophisticated algorithms to identify suspicious patterns.
          </li>
          <li>Investigating reports of review manipulation.</li>
          <li>
            Taking swift action against individuals or businesses found to be
            engaging in fake review practices.
          </li>
        </ul>

        {/* SECTION 7: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <Info className="text-yellow-500 dark:text-yellow-300" size={24} /> 7.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Review System Integrity Policy at any time. We will notify you of any
          material changes by posting the updated Policy on this page and
          updating the "Last updated" date. Your continued use of the Service
          after such modifications constitutes your acceptance of the revised
          Policy.
        </p>

        {/* SECTION 8: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <Mail className="text-yellow-500 dark:text-yellow-300" size={24} /> 8.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding our Review System
          Integrity Policy, please contact us:
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

export default ReviewSystemIntegrity;
