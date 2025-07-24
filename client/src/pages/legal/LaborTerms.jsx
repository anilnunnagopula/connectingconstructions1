import React, { useEffect } from "react";
import {
  HardHat, // Main icon for Labor Terms
  UserCheck, // For eligibility/qualifications
  Handshake, // For service agreements
  DollarSign, // For payment terms
  ClipboardList, // For responsibilities
  AlertTriangle, // For disputes/safety
  Info, // For changes to policy
  Mail, // For contact
} from "lucide-react"; // Importing icons

const LaborTerms = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center flex items-center justify-center gap-3">
          <HardHat className="text-yellow-700 dark:text-yellow-500" size={36} />{" "}
          ConnectingConstructions Labor Terms
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          These Labor Terms outline the specific conditions and responsibilities
          when engaging with labor-related services facilitated through the{" "}
          <strong>ConnectingConstructions</strong> platform. This policy applies
          to both customers seeking labor and suppliers providing labor
          services. It ensures clarity, safety, and fair practices in all labor
          engagements.
        </p>

        {/* SECTION 1: Scope of Labor Services */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <Handshake
            className="text-yellow-600 dark:text-yellow-400"
            size={24}
          />{" "}
          1. Scope of Labor Services
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions facilitates connections for various labor
          services within the construction industry, including but not limited
          to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Skilled and unskilled labor for specific tasks.</li>
          <li>Specialized trades (e.g., electricians, plumbers, masons).</li>
          <li>Project-based labor teams.</li>
          <li>Consultation and supervisory roles.</li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          ConnectingConstructions acts as a platform to connect parties; it does
          not directly employ or manage the labor unless explicitly stated for
          specific services.
        </p>

        {/* SECTION 2: Customer Responsibilities (When Hiring Labor) */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <UserCheck
            className="text-yellow-600 dark:text-yellow-400"
            size={24}
          />{" "}
          2. Customer Responsibilities (When Hiring Labor)
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          As a customer hiring labor through the platform, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Accurate Job Description:</strong> Provide a clear and
            accurate description of the work required, including scope,
            duration, and any specific qualifications.
          </li>
          <li>
            <strong>Safe Work Environment:</strong> Ensure a safe and compliant
            work environment for the labor provided, adhering to all applicable
            safety regulations and standards.
          </li>
          <li>
            <strong>Timely Payments:</strong> Make timely payments as agreed
            upon in the service contract.
          </li>
          <li>
            <strong>Supervision:</strong> Provide adequate supervision or
            guidance for the tasks assigned.
          </li>
          <li>
            <strong>Compliance:</strong> Comply with all local labor laws,
            regulations, and any specific site rules.
          </li>
        </ul>

        {/* SECTION 3: Supplier Responsibilities (When Providing Labor) */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <HardHat className="text-yellow-600 dark:text-yellow-400" size={24} />{" "}
          3. Supplier Responsibilities (When Providing Labor)
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          As a supplier providing labor services through the platform, you agree
          to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Qualified Personnel:</strong> Provide labor that possesses
            the necessary skills, qualifications, and certifications for the
            advertised services.
          </li>
          <li>
            <strong>Adherence to Scope:</strong> Perform services strictly
            according to the agreed-upon job description and customer
            requirements.
          </li>
          <li>
            <strong>Safety Compliance:</strong> Ensure your personnel adhere to
            all site safety regulations and best practices.
          </li>
          <li>
            <strong>Insurance & Licenses:</strong> Maintain all necessary
            licenses, permits, and insurance coverage (e.g., workers'
            compensation, liability) as required by law for your labor force.
          </li>
          <li>
            <strong>Timely Completion:</strong> Strive to complete tasks within
            agreed-upon timelines.
          </li>
          <li>
            <strong>Compliance:</strong> Comply with all applicable labor laws,
            including minimum wage, working hours, and employment regulations.
          </li>
        </ul>

        {/* SECTION 4: Payment Terms for Labor Services */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <DollarSign
            className="text-yellow-600 dark:text-yellow-400"
            size={24}
          />{" "}
          4. Payment Terms for Labor Services
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Payment terms for labor services will be agreed upon between the
          customer and the supplier through the platform's contracting features.
          ConnectingConstructions may facilitate secure payment processing. All
          payments are subject to our{" "}
          <a
            href="/legal/customer/paymentrefundguidelines"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Payment & Refund Guidelines
          </a>{" "}
          and{" "}
          <a
            href="/legal/pricingpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Pricing Policy
          </a>
          .
        </p>

        {/* SECTION 5: Safety and Compliance */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-yellow-600 dark:text-yellow-400"
            size={24}
          />{" "}
          5. Safety and Compliance
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Both customers and suppliers are responsible for ensuring all labor
          engagements comply with relevant health, safety, and environmental
          regulations. Any incidents or safety concerns must be reported
          immediately to ConnectingConstructions and relevant authorities.
        </p>

        {/* SECTION 6: Disputes Related to Labor Services */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-yellow-600 dark:text-yellow-400"
            size={24}
          />{" "}
          6. Disputes Related to Labor Services
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Any disputes arising from labor engagements should first be attempted
          to be resolved directly between the customer and supplier. If
          unresolved, disputes can be escalated through ConnectingConstructions'{" "}
          <a
            href="/legal/disputes"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Disputes Policy
          </a>
          .
        </p>

        {/* SECTION 7: Independent Contractor Relationship */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <Info className="text-yellow-600 dark:text-yellow-400" size={24} /> 7.
          Independent Contractor Relationship
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Suppliers providing labor services through ConnectingConstructions are
          independent contractors. Nothing in this Agreement creates an
          employment, agency, partnership, or joint venture relationship between
          ConnectingConstructions and any supplier or customer.
        </p>

        {/* SECTION 8: Changes to These Terms */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <Info className="text-yellow-600 dark:text-yellow-400" size={24} /> 8.
          Changes to These Terms
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update these
          Labor Terms at any time. We will notify you of any material changes by
          posting the updated Terms on this page and updating the "Last updated"
          date. Your continued use of the Service after such modifications
          constitutes your acceptance of the revised Terms.
        </p>

        {/* SECTION 9: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-yellow-200 dark:border-yellow-700 pb-3 flex items-center gap-2">
          <Mail className="text-yellow-600 dark:text-yellow-400" size={24} /> 9.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding these Labor Terms,
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

export default LaborTerms;
