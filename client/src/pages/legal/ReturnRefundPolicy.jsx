import React, { useEffect } from "react";
import {
  RefreshCw, // Main icon for Return & Refund
  CheckCircle, // Eligibility
  Ban, // Non-Returnable
  ListTodo, // Return Process
  CreditCard, // Refund Method
  AlertTriangle, // Damaged/Defective
  Truck, // Shipping Costs
  XCircle, // Cancellations
  Info, // Changes to Policy
  Mail, // Contact
} from "lucide-react"; // Importing icons

const ReturnRefundPolicy = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <RefreshCw className="text-red-600 dark:text-red-400" size={36} />{" "}
          ConnectingConstructions Return & Refund Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Return & Refund Policy outlines the terms and conditions for
          returning products and receiving refunds for purchases made through
          the <strong>ConnectingConstructions</strong> platform. We aim to
          provide a fair and transparent process to ensure customer satisfaction
          while also supporting our valued suppliers.
        </p>

        {/* SECTION 1: Eligibility for Returns */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <CheckCircle className="text-red-500 dark:text-red-300" size={24} />{" "}
          1. Eligibility for Returns
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          To be eligible for a return, your item must meet the following
          criteria:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Return Window:</strong> The request for return must be
            initiated within [e.g., 7 days for general items, 2 days for
            perishables/fragile] of the delivery date.
          </li>
          <li>
            <strong>Condition:</strong> The item must be unused, in the same
            condition that you received it, and in its original packaging with
            all tags, manuals, and accessories intact.
          </li>
          <li>
            <strong>Proof of Purchase:</strong> A valid proof of purchase (order
            number, invoice) from ConnectingConstructions is required.
          </li>
          <li>
            <strong>Product Specific Conditions:</strong> Some products may have
            specific return conditions (e.g., electronic goods, custom-made
            items). Please check the product description for details.
          </li>
        </ul>

        {/* SECTION 2: Non-Returnable Items */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Ban className="text-red-500 dark:text-red-300" size={24} /> 2.
          Non-Returnable Items
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          The following items are generally not eligible for return or refund,
          unless they arrive damaged or defective:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Perishable goods (e.g., cement with expiry date after delivery,
            certain chemicals).
          </li>
          <li>Custom-made or personalized products.</li>
          <li>Items that have been installed, used, or altered.</li>
          <li>Digital products or downloadable software.</li>
          <li>Items marked as "Final Sale" or "Non-Returnable."</li>
          <li>
            Products where original packaging has been opened, and the product
            cannot be resold (e.g., sealed electrical components).
          </li>
        </ul>

        {/* SECTION 3: Return Process */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <ListTodo className="text-red-500 dark:text-red-300" size={24} /> 3.
          Return Process
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          To initiate a return:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Submit Request:</strong> Log in to your
            ConnectingConstructions account, go to your "Order History," select
            the relevant order, and click "Request Return" within the eligible
            return window. Provide the reason for return and attach any
            supporting photos if necessary.
          </li>
          <li>
            <strong>Approval:</strong> Your return request will be reviewed by
            the supplier. Once approved, you will receive instructions on how to
            return the item. This may include a return shipping label or details
            for arranging a pick-up.
          </li>
          <li>
            <strong>Packaging & Shipping:</strong> Pack the item securely in its
            original packaging. Affix the return label (if provided) and ship
            the item back according to the instructions.
          </li>
          <li>
            <strong>Inspection:</strong> Once the returned item is received by
            the supplier, it will be inspected to ensure it meets the
            eligibility criteria.
          </li>
        </ol>

        {/* SECTION 4: Refund Method and Timeline */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <CreditCard className="text-red-500 dark:text-red-300" size={24} /> 4.
          Refund Method and Timeline
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Refund Method:</strong> Refunds will generally be processed
            to the original payment method used for the purchase. If the
            original payment method is unavailable, a bank transfer or
            ConnectingConstructions credit may be offered.
          </li>
          <li>
            <strong>Refund Timeline:</strong> Once the returned item passes
            inspection, refunds are typically processed within [e.g., 5-7
            business days]. The time it takes for the refund to reflect in your
            account may vary depending on your bank or payment processor.
          </li>
          <li>
            <strong>Partial Refunds:</strong> In some cases, a partial refund
            may be issued if the item is not in its original condition, is
            damaged, or has missing parts not due to supplier error. A
            re-stocking fee may also apply.
          </li>
        </ul>

        {/* SECTION 5: Damaged or Defective Items */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <AlertTriangle className="text-red-500 dark:text-red-300" size={24} />{" "}
          5. Damaged or Defective Items
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          If you receive a damaged or defective item, please contact our
          customer support immediately (within [e.g., 24-48 hours] of delivery)
          with clear photographs or videos of the damage/defect. We will arrange
          for a return, replacement, or full refund at no additional cost to
          you. Do not attempt to repair the item or dispose of it until
          instructed.
        </p>

        {/* SECTION 6: Shipping Costs for Returns */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Truck className="text-red-500 dark:text-red-300" size={24} /> 6.
          Shipping Costs for Returns
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Supplier Error/Defect:</strong> If the return is due to a
            supplier error, damaged/defective product, or incorrect item
            received, ConnectingConstructions or the supplier will cover the
            return shipping costs.
          </li>
          <li>
            <strong>Customer Preference:</strong> If the return is due to a
            change of mind, incorrect order placed by the customer, or other
            reasons not attributable to supplier error, the customer will be
            responsible for the return shipping costs. Original shipping charges
            are generally non-refundable in such cases.
          </li>
        </ul>

        {/* SECTION 7: Cancellations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <XCircle className="text-red-500 dark:text-red-300" size={24} /> 7.
          Cancellations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          For information on canceling an order before it has been shipped,
          please refer to our dedicated{" "}
          <a
            href="/legal/cancellationpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Cancellation Policy
          </a>
          .
        </p>

        {/* SECTION 8: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Info className="text-red-500 dark:text-red-300" size={24} /> 8.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Return & Refund Policy at any time. We will notify you of any material
          changes by posting the updated Policy on this page and updating the
          "Last updated" date. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Policy.
        </p>

        {/* SECTION 9: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Mail className="text-red-500 dark:text-red-300" size={24} /> 9.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding this Return & Refund
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

export default ReturnRefundPolicy;
