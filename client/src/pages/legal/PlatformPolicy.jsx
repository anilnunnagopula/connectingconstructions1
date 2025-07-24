import React, { useEffect } from "react";
import {
  ShieldCheck, // Main icon for Platform Policy
  CheckCircle, // For general principles
  Ban, // For prohibited conduct
  ClipboardList, // For content guidelines
  AlertTriangle, // For violations/enforcement
  Users, // For community
  Info, // For changes to policy
  Mail, // For contact
} from "lucide-react"; // Importing icons

const PlatformPolicy = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <ShieldCheck
            className="text-indigo-600 dark:text-indigo-400"
            size={36}
          />{" "}
          ConnectingConstructions Platform Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Platform Policy outlines the rules and guidelines for acceptable
          conduct and content on the <strong>ConnectingConstructions</strong>{" "}
          platform. It applies to all users, including customers, suppliers, and
          partners. By accessing or using our Service, you agree to abide by
          this policy, fostering a safe, respectful, and productive environment
          for everyone.
        </p>

        {/* SECTION 1: General Principles */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          1. General Principles
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We expect all users to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Be Respectful:</strong> Treat all members of the
            ConnectingConstructions community with respect and courtesy.
          </li>
          <li>
            <strong>Be Honest:</strong> Provide accurate information and engage
            in truthful interactions.
          </li>
          <li>
            <strong>Comply with Laws:</strong> Adhere to all applicable local,
            state, and national laws and regulations.
          </li>
          <li>
            <strong>Protect Privacy:</strong> Respect the privacy of others and
            do not share personal information without consent.
          </li>
          <li>
            <strong>Maintain Integrity:</strong> Do not engage in activities
            that undermine the integrity or security of the platform.
          </li>
        </ul>

        {/* SECTION 2: Prohibited Conduct */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Ban className="text-indigo-500 dark:text-indigo-300" size={24} /> 2.
          Prohibited Conduct
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          The following types of conduct are strictly prohibited on
          ConnectingConstructions:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Fraudulent or Deceptive Activities:</strong>{" "}
            Misrepresentation, scams, phishing, or any attempt to defraud other
            users or ConnectingConstructions.
          </li>
          <li>
            <strong>Harassment & Abuse:</strong> Any form of harassment,
            bullying, hate speech, threats, or abusive behavior towards other
            users or our staff.
          </li>
          <li>
            <strong>Spamming & Unsolicited Communication:</strong> Sending
            unsolicited messages, promotions, or engaging in repetitive posting
            that disrupts the user experience.
          </li>
          <li>
            <strong>Impersonation:</strong> Pretending to be another person or
            entity, or misrepresenting your affiliation.
          </li>
          <li>
            <strong>Unauthorized Access:</strong> Attempting to gain
            unauthorized access to accounts, systems, or data on the platform.
          </li>
          <li>
            <strong>Malware & Viruses:</strong> Uploading or distributing
            malicious software, viruses, or any code that could harm the
            platform or other users.
          </li>
          <li>
            <strong>Circumvention of Policies:</strong> Attempting to bypass or
            circumvent any of our policies, including payment, review, or
            content guidelines.
          </li>
          <li>
            <strong>Illegal Activities:</strong> Using the platform for any
            illegal purpose or to facilitate illegal activities.
          </li>
        </ul>

        {/* SECTION 3: Content Guidelines */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          3. Content Guidelines
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          All content posted on the platform (e.g., product listings, reviews,
          messages, profiles) must adhere to the following:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Accuracy:</strong> Content must be truthful and not
            misleading.
          </li>
          <li>
            <strong>Relevance:</strong> Content should be relevant to the
            context (e.g., product reviews should be about the product).
          </li>
          <li>
            <strong>Intellectual Property:</strong> Do not post content that
            infringes on the intellectual property rights of others (copyrights,
            trademarks, etc.).
          </li>
          <li>
            <strong>No Sensitive Personal Information:</strong> Avoid sharing
            sensitive personal information about yourself or others.
          </li>
          <li>
            <strong>No Illegal or Harmful Content:</strong> Content promoting
            illegal activities, violence, self-harm, or containing sexually
            explicit material is strictly prohibited.
          </li>
          <li>
            <strong>Respectful Language:</strong> Use appropriate and respectful
            language.
          </li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          For specific guidelines on product listings, refer to our{" "}
          <a
            href="/legal/productguidelines"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Product Guidelines
          </a>
          . For reviews, see our{" "}
          <a
            href="/legal/reviewpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            General Review Policy
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

        {/* SECTION 4: Reporting Violations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          4. Reporting Violations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          If you encounter any content or conduct that violates this Platform
          Policy, please report it to us immediately using the reporting tools
          available on the platform or by contacting our support team. Provide
          as much detail as possible to assist our investigation.
        </p>

        {/* SECTION 5: Enforcement and Consequences */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          5. Enforcement and Consequences
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to take appropriate action
          against any user who violates this policy, including but not limited
          to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Issuing warnings.</li>
          <li>Removing violating content.</li>
          <li>Temporarily suspending account access.</li>
          <li>Permanently terminating account access.</li>
          <li>Reporting illegal activities to relevant authorities.</li>
          <li>Withholding payments (for suppliers).</li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          The severity of the action taken will depend on the nature and
          frequency of the violation.
        </p>

        {/* SECTION 6: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Info className="text-indigo-500 dark:text-indigo-300" size={24} /> 6.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Platform Policy at any time. We will notify you of any material
          changes by posting the updated Policy on this page and updating the
          "Last updated" date. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Policy.
        </p>

        {/* SECTION 7: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Mail className="text-indigo-500 dark:text-indigo-300" size={24} /> 7.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding this Platform Policy,
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

export default PlatformPolicy;
