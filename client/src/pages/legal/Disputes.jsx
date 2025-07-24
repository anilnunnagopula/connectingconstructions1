import React, { useEffect } from "react";
import {
  Gavel, // Main icon for Disputes
  Users, // For types of disputes (user-to-user)
  ClipboardList, // For dispute resolution process
  Scale, // For mediation/arbitration
  Mail, // For contact
  Info, // For changes to policy
  AlertTriangle, // For non-compliance
} from "lucide-react"; // Importing icons

const Disputes = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Gavel className="text-gray-700 dark:text-gray-400" size={36} />{" "}
          ConnectingConstructions Disputes Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Disputes Policy outlines the procedures for resolving
          disagreements, conflicts, or complaints that may arise between users
          (customers and suppliers) or between a user and{" "}
          <strong>ConnectingConstructions</strong> regarding transactions or
          interactions on our platform. We are committed to providing a fair and
          efficient mechanism for dispute resolution.
        </p>

        {/* SECTION 1: Types of Disputes */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-gray-300 dark:border-gray-700 pb-3 flex items-center gap-2">
          <Users className="text-gray-600 dark:text-gray-400" size={24} /> 1.
          Types of Disputes
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Disputes on ConnectingConstructions generally fall into the following
          categories:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Customer-Supplier Disputes:</strong> Issues arising from a
            transaction, such as:
            <ul className="list-circle pl-6 mt-1 space-y-1">
              <li>Product quality or description discrepancies.</li>
              <li>Delivery issues (e.g., late, damaged, incorrect item).</li>
              <li>Service delivery failures.</li>
              <li>Refund or return disagreements.</li>
            </ul>
          </li>
          <li>
            <strong>User-Platform Disputes:</strong> Issues related to account
            suspension, policy enforcement, or platform functionality.
          </li>
        </ul>

        {/* SECTION 2: Dispute Resolution Process */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-gray-300 dark:border-gray-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-gray-600 dark:text-gray-400"
            size={24}
          />{" "}
          2. Dispute Resolution Process
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We encourage users to resolve issues amicably whenever possible. If
          direct resolution is not feasible, please follow our structured
          dispute resolution process:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>
              Step 1: Direct Communication (Customer-Supplier Disputes):
            </strong>
            <p className="ml-4 mt-1">
              For issues between a customer and a supplier, first attempt to
              resolve the matter directly through the platform's messaging
              system. Many issues can be resolved quickly through clear
              communication.
            </p>
          </li>
          <li>
            <strong>
              Step 2: Initiate a Dispute on ConnectingConstructions:
            </strong>
            <p className="ml-4 mt-1">
              If direct communication fails, or for disputes involving the
              platform itself, you can formally initiate a dispute through your
              ConnectingConstructions account (e.g., via the "Report an Issue"
              or "Open Dispute" option in your order history or profile).
              Provide all relevant details, including order numbers,
              communication history, and supporting evidence (photos, videos).
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Response Time:</strong> We aim to acknowledge your
                dispute submission within [e.g., 24-48 business hours].
              </li>
              <li>
                <strong>Investigation:</strong> Our dispute resolution team will
                review the provided information, and may contact both parties
                for further details.
              </li>
            </ul>
          </li>
          <li>
            <strong>Step 3: ConnectingConstructions Mediation/Decision:</strong>
            <p className="ml-4 mt-1">
              ConnectingConstructions will act as a neutral mediator. Based on
              the evidence and our policies (e.g.,{" "}
              <a
                href="/legal/returnrefundpolicy"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Return & Refund Policy
              </a>
              ,{" "}
              <a
                href="/legal/shippingpolicy"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Shipping Policy
              </a>
              ,{" "}
              <a
                href="/legal/platformpolicy"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Platform Policy
              </a>
              ), we will issue a decision. This decision is binding on both
              parties unless further escalation is available.
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Expected Resolution Time:</strong> We aim to provide a
                resolution within [e.g., 7-14 business days] from the date the
                dispute is formally initiated, depending on complexity.
              </li>
            </ul>
          </li>
          <li>
            <strong>Step 4: Arbitration (for specific disputes):</strong>
            <p className="ml-4 mt-1">
              For certain types of disputes, particularly those involving
              significant financial claims or complex contractual issues, and if
              the parties cannot agree to a resolution through our internal
              mediation, the matter may be referred to binding arbitration in
              accordance with the Arbitration and Conciliation Act, 1996, in
              Hyderabad, Telangana, India. This will be specified in relevant
              agreements like the{" "}
              <a
                href="/legal/customeragreement"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Customer Agreement
              </a>{" "}
              or{" "}
              <a
                href="/legal/supplieragreement"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Supplier Agreement
              </a>
              .
            </p>
          </li>
        </ol>

        {/* SECTION 3: Customer and Supplier Responsibilities */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-gray-300 dark:border-gray-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-gray-600 dark:text-gray-400"
            size={24}
          />{" "}
          3. Customer and Supplier Responsibilities
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          During a dispute, both parties are expected to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Cooperate fully with ConnectingConstructions' investigation.</li>
          <li>
            Provide all requested information and evidence truthfully and
            promptly.
          </li>
          <li>
            Maintain respectful communication and avoid harassment or abusive
            language.
          </li>
          <li>Adhere to the timelines provided for responses and actions.</li>
        </ul>

        {/* SECTION 4: Non-Compliance and Consequences */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-gray-300 dark:border-gray-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-gray-600 dark:text-gray-400"
            size={24}
          />{" "}
          4. Non-Compliance and Consequences
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Failure to comply with ConnectingConstructions' dispute resolution
          process or final decision may result in:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Account restrictions or suspension.</li>
          <li>Forfeiture of claims.</li>
          <li>
            Other actions as outlined in our{" "}
            <a
              href="/legal/platformpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Platform Policy
            </a>
            .
          </li>
        </ul>

        {/* SECTION 5: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-gray-300 dark:border-gray-700 pb-3 flex items-center gap-2">
          <Info className="text-gray-600 dark:text-gray-400" size={24} /> 5.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Disputes Policy at any time. We will notify you of any material
          changes by posting the updated Policy on this page and updating the
          "Last updated" date. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Policy.
        </p>

        {/* SECTION 6: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-gray-300 dark:border-gray-700 pb-3 flex items-center gap-2">
          <Mail className="text-gray-600 dark:text-gray-400" size={24} /> 6.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding this Disputes Policy,
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

export default Disputes;
