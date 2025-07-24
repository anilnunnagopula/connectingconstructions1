import React, { useEffect } from "react";
import {
  Percent, // Main icon for commission
  DollarSign, // For rates and calculation
  Receipt, // For payment & deductions
  AlertTriangle, // For adjustments & disputes
  Info, // For changes to policy
  Mail, // For contact
} from "lucide-react"; // Importing icons

const CommissionModelOverview = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Percent className="text-green-600 dark:text-green-400" size={36} />{" "}
          ConnectingConstructions Commission Model Overview
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Commission Model Overview outlines how{" "}
          <strong>ConnectingConstructions</strong> monetizes its platform by
          charging a commission on successful transactions facilitated through
          our Service. This model ensures a fair and sustainable ecosystem for
          both customers and suppliers ("Suppliers"). By selling on our
          platform, Suppliers agree to the terms outlined in this policy.
        </p>

        {/* SECTION 1: Overview of Commission Model */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <DollarSign
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          1. Overview of Commission Model
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions operates on a commission-based model, where a
          percentage of the sale price is charged for each completed
          transaction. This commission helps cover the costs of platform
          maintenance, development, marketing, customer support, and secure
          payment processing.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Success-Based:</strong> Commission is only charged on
            successful sales where the product or service has been delivered and
            the transaction completed.
          </li>
          <li>
            <strong>Transparency:</strong> Commission rates are transparent and
            communicated to suppliers during onboarding and are accessible in
            their Supplier dashboard.
          </li>
        </ul>

        {/* SECTION 2: Commission Rates */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Percent className="text-green-500 dark:text-green-300" size={24} />{" "}
          2. Commission Rates
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Commission rates vary depending on the product or service category.
          These rates are determined based on market dynamics, operational
          costs, and value provided within each category.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Category-Specific:</strong> Different categories (e.g.,
            heavy machinery, raw materials, skilled labor services) may have
            different commission percentages.
          </li>
          <li>
            <strong>Tiered Rates:</strong> In some cases, tiered commission
            rates may apply based on sales volume or supplier subscription plan
            (refer to{" "}
            <a
              href="/legal/monetization/suppliersubscriptionplans"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Supplier Subscription Plans
            </a>
            ).
          </li>
          <li>
            <strong>Updates:</strong> Any changes to commission rates will be
            communicated to suppliers with advance notice.
          </li>
        </ul>

        {/* SECTION 3: Calculation of Commission */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <DollarSign
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          3. Calculation of Commission
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Commission is typically calculated on the final sale price of the
          product or service, excluding shipping charges (unless shipping is
          integrated into the product price).
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Formula:</strong> Commission Amount = (Product Sale Price) x
            (Applicable Commission Rate).
          </li>
          <li>
            <strong>Taxes:</strong> The commission amount is exclusive of
            applicable taxes (e.g., GST) on the commission itself, which will be
            added as per Indian tax laws. Suppliers are responsible for the GST
            on their sales.
          </li>
        </ul>

        {/* SECTION 4: Payment and Deductions */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Receipt className="text-green-500 dark:text-green-300" size={24} />{" "}
          4. Payment and Deductions
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions facilitates payment collection from customers.
          The commission and any other applicable fees (as per the{" "}
          <a
            href="/legal/pricingpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Pricing Policy
          </a>
          ) are automatically deducted from the total transaction amount before
          the net payout is transferred to the Supplier.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Payouts:</strong> Payouts to suppliers occur on a regular
            cycle (e.g., weekly, bi-weekly) as specified in the{" "}
            <a
              href="/legal/pricingpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Pricing Policy
            </a>
            .
          </li>
          <li>
            <strong>Statements:</strong> Detailed transaction statements and
            commission breakdowns will be available in the Supplier dashboard
            for reconciliation.
          </li>
        </ul>

        {/* SECTION 5: Adjustments and Disputes */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          5. Adjustments and Disputes
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Commission adjustments may occur in cases of:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Returns and Refunds:</strong> If a transaction is refunded
            as per the{" "}
            <a
              href="/legal/returnrefundpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Return & Refund Policy
            </a>
            , the corresponding commission will also be reversed or adjusted
            from future payouts.
          </li>
          <li>
            <strong>Cancellations:</strong> For orders cancelled before
            dispatch, no commission will be charged. If a commission was already
            deducted, it will be refunded.
          </li>
          <li>
            <strong>Chargebacks:</strong> In the event of a chargeback, the
            commission related to that transaction will be reversed, and any
            associated chargeback fees may be passed on to the Supplier.
          </li>
          <li>
            <strong>Discrepancies:</strong> Suppliers should review their
            statements regularly. Any disputes regarding commission calculations
            must be raised within [e.g., 7 days] of the statement date through
            our support channels.
          </li>
        </ul>

        {/* SECTION 6: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Info className="text-green-500 dark:text-green-300" size={24} /> 6.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Commission Model Overview at any time. We will notify Suppliers of any
          material changes to commission rates or calculation methods by posting
          the updated Policy on this page and updating the "Last updated" date.
          Your continued use of the Service after such modifications constitutes
          your acceptance of the revised Policy.
        </p>

        {/* SECTION 7: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Mail className="text-green-500 dark:text-green-300" size={24} /> 7.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding our Commission Model,
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

export default CommissionModelOverview;
