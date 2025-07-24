import React, { useEffect } from "react";
import {
  HelpCircle, // Main icon for Support & Grievance
  Mail, // For contact methods
  Phone, // For phone support
  MessageSquare, // For chat support
  ClipboardList, // For grievance process
  UserCheck, // For resolution steps
  Scale, // For escalation
  Info, // For changes to policy
} from "lucide-react"; // Importing icons

const SupportGrievanceRedressal = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <HelpCircle
            className="text-purple-600 dark:text-purple-400"
            size={36}
          />{" "}
          ConnectingConstructions Support & Grievance Redressal Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Support & Grievance Redressal Policy outlines the channels and
          processes available to customers ("you," or "your") for seeking
          support, raising concerns, and resolving grievances related to the{" "}
          <strong>ConnectingConstructions</strong> platform, products, or
          services. We are committed to providing timely, fair, and effective
          resolution to all your queries and complaints.
        </p>

        {/* SECTION 1: Support Channels */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Mail className="text-purple-500 dark:text-purple-300" size={24} /> 1.
          Support Channels
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          You can reach our support team through the following channels:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Email Support:</strong> For general inquiries, technical
            issues, or non-urgent matters, you can email us at{" "}
            <a
              href="mailto:support@connectingconstructions.com"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              support@connectingconstructions.com
            </a>
            . We aim to respond within [e.g., 24-48 business hours].
          </li>
          <li>
            <strong>In-App/Website Chat:</strong> For real-time assistance
            during business hours, use our live chat feature available on the
            website and mobile app.
          </li>
          <li>
            <strong>Help Center/FAQ:</strong> Our comprehensive Help Center
            provides answers to frequently asked questions and guides on using
            the platform. We encourage you to check here first for immediate
            answers.
          </li>
          <li>
            <strong>Phone Support:</strong> For urgent matters, you may call our
            support hotline at [Your Phone Number, e.g., +91-XXXXXXXXXX] during
            specified business hours.
          </li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          When contacting support, please provide your user ID, order number (if
          applicable), and a clear description of your issue to help us assist
          you efficiently.
        </p>

        {/* SECTION 2: Grievance Redressal Process */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          2. Grievance Redressal Process
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          If you have a complaint or grievance that requires formal resolution,
          please follow these steps:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Level 1: Customer Support:</strong>
            <p className="ml-4 mt-1">
              Initially, raise your concern through any of our standard support
              channels (email, chat, phone). Our customer support team will
              attempt to resolve your issue within [e.g., 3-5 business days].
            </p>
          </li>
          <li>
            <strong>Level 2: Grievance Officer:</strong>
            <p className="ml-4 mt-1">
              If your issue is not resolved to your satisfaction at Level 1, or
              if you wish to escalate directly, you may escalate your grievance
              to our designated Grievance Officer. Please provide your initial
              complaint reference number (if any) and a detailed description of
              the unresolved issue.
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Grievance Officer Name:</strong> [Your Grievance
                Officer's Name, e.g., Mr. Ankit Sharma]
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:grievance@connectingconstructions.com"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  grievance@connectingconstructions.com
                </a>
              </li>
              <li>
                <strong>Expected Resolution Time:</strong> The Grievance Officer
                will acknowledge your complaint within [e.g., 24-48 hours] and
                aim to resolve it within [e.g., 15 business days].
              </li>
            </ul>
          </li>
          <li>
            <strong>Level 3: Nodal Officer (if applicable):</strong>
            <p className="ml-4 mt-1">
              In accordance with certain regulatory requirements, if your
              grievance remains unresolved after escalation to the Grievance
              Officer, you may have the option to escalate it further to a Nodal
              Officer. Details for the Nodal Officer will be provided upon
              request if your issue qualifies for this level of escalation.
            </p>
          </li>
        </ol>

        {/* SECTION 3: Resolution Principles */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <UserCheck
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          3. Resolution Principles
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We are committed to resolving grievances based on principles of:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Fairness:</strong> Treating all complaints objectively and
            impartially.
          </li>
          <li>
            <strong>Transparency:</strong> Keeping you informed about the status
            and progress of your complaint.
          </li>
          <li>
            <strong>Timeliness:</strong> Striving for prompt resolution within
            stated timelines.
          </li>
          <li>
            <strong>Confidentiality:</strong> Handling your personal information
            with utmost care and confidentiality throughout the process.
          </li>
        </ul>

        {/* SECTION 4: Customer Responsibilities */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          4. Customer Responsibilities
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          To facilitate a quick and effective resolution, we request customers
          to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Provide accurate and complete information about the grievance.
          </li>
          <li>Cooperate with our team during the investigation process.</li>
          <li>
            Maintain respectful communication throughout the redressal process.
          </li>
        </ul>

        {/* SECTION 5: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Info className="text-purple-500 dark:text-purple-300" size={24} /> 5.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Support & Grievance Redressal Policy at any time. We will notify you
          of any material changes by posting the updated Policy on this page and
          updating the "Last updated" date.
        </p>

        {/* SECTION 6: General Contact Information */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Mail className="text-purple-500 dark:text-purple-300" size={24} /> 6.
          General Contact Information
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          For any general inquiries or to initiate a support request, please
          use:
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

export default SupportGrievanceRedressal;
