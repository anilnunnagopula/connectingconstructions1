import React, { useEffect } from "react";
import {
  Wallet, // Main icon for pricing
  DollarSign, // Pricing Models, Commissions, Adjustments
  Calendar, // Payment Terms
  Receipt, // Taxes, Invoicing
  Percent, // Promotions
  CreditCard, // Refunds/Chargebacks
  AlertTriangle, // Non-compliance
  Info, // Changes to Policy
  Mail, // Contact
} from "lucide-react"; // Importing icons

const PricingPolicy = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Wallet className="text-teal-600 dark:text-teal-400" size={36} />{" "}
          ConnectingConstructions Pricing Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Pricing Policy ("Policy") outlines the terms, conditions, and
          guidelines regarding pricing, commissions, fees, and payments for
          products and services sold by suppliers ("Suppliers," "you," or
          "your") on the <strong>ConnectingConstructions</strong> platform. By
          listing and selling on our Service, you agree to adhere to this
          Policy, ensuring transparent and fair financial transactions for all
          participants.
        </p>

        {/* SECTION 1: Pricing Models */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <DollarSign className="text-teal-500 dark:text-teal-300" size={24} />{" "}
          1. Pricing Models
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Supplier-Set Pricing:</strong> Suppliers are generally free
            to set the retail price for their products and services. Prices must
            be competitive and reflect the value and quality of the offering.
          </li>
          <li>
            <strong>Minimum Advertised Price (MAP):</strong> In some cases,
            ConnectingConstructions may recommend or enforce a Minimum
            Advertised Price (MAP) for certain categories or products to
            maintain market fairness.
          </li>
          <li>
            <strong>Price Consistency:</strong> Suppliers are encouraged to
            maintain consistent pricing across different sales channels to avoid
            customer confusion.
          </li>
        </ul>

        {/* SECTION 2: Commission and Fees */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <DollarSign className="text-teal-500 dark:text-teal-300" size={24} />{" "}
          2. Commission and Fees
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions charges a commission on each successful sale
          made through the platform. The commission rates vary by product
          category and are communicated to the Supplier during the onboarding
          process or via your Supplier dashboard.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Commission Structure:</strong> Commission is calculated as a
            percentage of the final sale price (excluding shipping fees, unless
            otherwise specified) and is deducted automatically from the payment
            processed for the sale.
          </li>
          <li>
            <strong>Additional Fees:</strong> Depending on the services utilized
            (e.g., premium listings, advertising), additional fees may apply.
            These will be clearly communicated and agreed upon separately.
          </li>
          <li>
            <strong>Platform Fee:</strong> A nominal platform usage fee may be
            applied per transaction or on a monthly/annual basis.
          </li>
        </ul>

        {/* SECTION 3: Payment Terms and Cycles */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Calendar className="text-teal-500 dark:text-teal-300" size={24} /> 3.
          Payment Terms and Cycles
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Payment Processing:</strong> ConnectingConstructions
            facilitates payment processing for sales made on the platform.
            Payments from customers are collected by ConnectingConstructions.
          </li>
          <li>
            <strong>Payout Schedule:</strong> Payments to Suppliers (net of
            commissions, fees, and any applicable deductions for
            returns/refunds) are typically processed on a
            [Weekly/Bi-weekly/Monthly] cycle, on [Specify Day/Date], for sales
            successfully completed during the preceding period.
          </li>
          <li>
            <strong>Minimum Payout Threshold:</strong> A minimum payout
            threshold of [e.g., INR 500 / $10] may apply. Amounts below this
            threshold will roll over to the next payment cycle.
          </li>
          <li>
            <strong>Payment Method:</strong> Payouts are made via [e.g., bank
            transfer, UPI] to the bank account registered by the Supplier.
            Ensure your banking details are accurate and up-to-date.
          </li>
        </ul>

        {/* SECTION 4: Taxes */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Receipt className="text-teal-500 dark:text-teal-300" size={24} /> 4.
          Taxes
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Supplier Responsibility:</strong> Suppliers are solely
            responsible for all applicable taxes (including GST, income tax,
            etc.) related to their sales on the ConnectingConstructions
            platform.
          </li>
          <li>
            <strong>GST Compliance:</strong> Suppliers must provide a valid
            GSTIN and comply with all GST regulations, including timely filing
            of returns and accurate invoicing. ConnectingConstructions will
            provide transaction data to assist with your tax compliance.
          </li>
          <li>
            <strong>Tax Withholding:</strong> ConnectingConstructions may be
            required by law to withhold taxes (e.g., TDS - Tax Deducted at
            Source) from your payouts. Any such withholding will be clearly
            reflected in your payment statements.
          </li>
        </ul>

        {/* SECTION 5: Pricing Adjustments */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <DollarSign className="text-teal-500 dark:text-teal-300" size={24} />{" "}
          5. Pricing Adjustments
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Price Changes:</strong> Suppliers can adjust their product
            prices at any time through their dashboard. However, prices for
            existing, unfulfilled orders cannot be changed.
          </li>
          <li>
            <strong>ConnectingConstructions Discretion:</strong>{" "}
            ConnectingConstructions reserves the right to make temporary price
            adjustments (e.g., for platform-wide promotions) or request
            Suppliers to adjust prices to remain competitive or address
            discrepancies.
          </li>
        </ul>

        {/* SECTION 6: Promotions and Discounts */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Percent className="text-teal-500 dark:text-teal-300" size={24} /> 6.
          Promotions and Discounts
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Supplier-Initiated:</strong> Suppliers can offer discounts
            and run promotions on their products. These must be clearly
            communicated and honored for all eligible sales.
          </li>
          <li>
            <strong>Platform Promotions:</strong> ConnectingConstructions may
            run platform-wide promotions or discounts. Participation by
            Suppliers in such promotions may be optional or mandatory, with
            terms clearly outlined.
          </li>
          <li>
            <strong>Cost of Discounts:</strong> Unless otherwise specified, the
            cost of any discounts or promotions offered by the Supplier will be
            borne by the Supplier.
          </li>
        </ul>

        {/* SECTION 7: Refunds and Chargebacks */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <CreditCard className="text-teal-500 dark:text-teal-300" size={24} />{" "}
          7. Refunds and Chargebacks
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Refunds:</strong> All refunds initiated as per the{" "}
            <a
              href="/legal/returnrefundpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Return & Refund Policy
            </a>{" "}
            will be deducted from the Supplier's payout.
          </li>
          <li>
            <strong>Chargebacks:</strong> In the event of a chargeback initiated
            by a customer, the Supplier will be responsible for the full amount
            of the chargeback, along with any associated fees incurred by
            ConnectingConstructions from the payment processor. Suppliers may
            dispute chargebacks with supporting evidence.
          </li>
        </ul>

        {/* SECTION 8: Invoicing and Reconciliation */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Receipt className="text-teal-500 dark:text-teal-300" size={24} /> 8.
          Invoicing and Reconciliation
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions will provide Suppliers with detailed sales
          reports and payment statements via the Supplier dashboard. It is the
          Supplier's responsibility to reconcile these statements with their own
          records. Any discrepancies must be reported to ConnectingConstructions
          within [e.g., 7 days] of the statement date.
        </p>

        {/* SECTION 9: Non-compliance and Penalties */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-teal-500 dark:text-teal-300"
            size={24}
          />{" "}
          9. Non-compliance and Penalties
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Failure to comply with this Pricing Policy, including misrepresenting
          prices, failing to honor promotions, or engaging in fraudulent
          financial activities, may result in:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Temporary suspension of listings.</li>
          <li>Withholding of payouts.</li>
          <li>Temporary or permanent suspension of your Supplier account.</li>
          <li>Legal action, if necessary.</li>
        </ul>

        {/* SECTION 10: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Info className="text-teal-500 dark:text-teal-300" size={24} /> 10.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Pricing Policy at any time. We will notify Suppliers of any material
          changes by posting the updated Policy on this page and updating the
          "Last updated" date. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Policy.
        </p>

        {/* SECTION 11: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Mail className="text-teal-500 dark:text-teal-300" size={24} /> 11.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or require clarification regarding this
          Pricing Policy, please contact us:
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

export default PricingPolicy;
