import React, { useEffect } from "react";
import {
  XCircle, // Main icon for cancellation
  CheckCircle, // Eligibility
  ListTodo, // Cancellation Process
  CreditCard, // Refund for Cancellations
  Ban, // Non-Cancellable
  AlertTriangle, // Supplier-Initiated
  Info, // Changes to Policy
  Mail, // Contact
} from "lucide-react"; // Importing icons

const CancellationPolicy = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <XCircle className="text-rose-600 dark:text-rose-400" size={36} />{" "}
          ConnectingConstructions Cancellation Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Cancellation Policy outlines the terms and conditions under which
          orders placed on the <strong>ConnectingConstructions</strong> platform
          can be cancelled. We aim to provide a clear and fair process for both
          customers and suppliers.
        </p>

        {/* SECTION 1: Eligibility for Cancellation */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-rose-200 dark:border-rose-700 pb-3 flex items-center gap-2">
          <CheckCircle className="text-rose-500 dark:text-rose-300" size={24} />{" "}
          1. Eligibility for Cancellation
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          An order is generally eligible for cancellation only if:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            The order has not yet been processed or dispatched by the supplier.
          </li>
          <li>
            The cancellation request is made within a specific timeframe after
            placing the order (e.g., within 24 hours).
          </li>
          <li>The item is not a "Non-Cancellable" item as defined below.</li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          Once an order has been dispatched or is in transit, it cannot be
          cancelled but may be eligible for return as per our{" "}
          <a
            href="/legal/returnrefundpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Return & Refund Policy
          </a>
          .
        </p>

        {/* SECTION 2: Cancellation Process */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-rose-200 dark:border-rose-700 pb-3 flex items-center gap-2">
          <ListTodo className="text-rose-500 dark:text-rose-300" size={24} /> 2.
          Cancellation Process
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          To request a cancellation:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Via Your Account:</strong> Log in to your
            ConnectingConstructions account, navigate to your "Order History,"
            select the order you wish to cancel, and click the "Cancel Order"
            button. This option will only be available if the order is still
            eligible for cancellation.
          </li>
          <li>
            <strong>Contact Support:</strong> If the "Cancel Order" option is
            not available, or for any assistance, please contact our customer
            support immediately with your order details. We will check the order
            status with the supplier and inform you of the feasibility of
            cancellation.
          </li>
        </ol>

        {/* SECTION 3: Refund for Cancellations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-rose-200 dark:border-rose-700 pb-3 flex items-center gap-2">
          <CreditCard className="text-rose-500 dark:text-rose-300" size={24} />{" "}
          3. Refund for Cancellations
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Full Refund:</strong> If an order is successfully cancelled
            before processing or dispatch, a full refund of the product cost and
            any associated shipping charges will be initiated.
          </li>
          <li>
            <strong>Refund Method:</strong> Refunds will be processed to the
            original payment method used for the purchase.
          </li>
          <li>
            <strong>Refund Timeline:</strong> Once the cancellation is
            confirmed, refunds are typically processed within [e.g., 5-7
            business days]. The time for the refund to reflect in your account
            may vary depending on your bank or payment processor.
          </li>
        </ul>

        {/* SECTION 4: Non-Cancellable Orders/Items */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-rose-200 dark:border-rose-700 pb-3 flex items-center gap-2">
          <Ban className="text-rose-500 dark:text-rose-300" size={24} /> 4.
          Non-Cancellable Orders/Items
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Some orders or items may not be eligible for cancellation:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Orders that have already been dispatched or are in transit.</li>
          <li>
            Custom-made, personalized, or made-to-order products once production
            has begun.
          </li>
          <li>Perishable goods or items with a limited shelf life.</li>
          <li>
            Items specifically marked as "Non-Cancellable" on the product page.
          </li>
        </ul>

        {/* SECTION 5: Supplier-Initiated Cancellations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-rose-200 dark:border-rose-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-rose-500 dark:text-rose-300"
            size={24}
          />{" "}
          5. Supplier-Initiated Cancellations
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          In rare circumstances, a supplier may need to cancel an order due to
          reasons such as:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Product unavailability (out of stock).</li>
          <li>Quality control issues.</li>
          <li>
            Logistical challenges or inability to deliver to the specified
            address.
          </li>
          <li>Violation of our Product Guidelines or Supplier Agreement.</li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          If a supplier cancels your order, you will be notified promptly, and a
          full refund will be processed immediately.
        </p>

        {/* SECTION 6: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-rose-200 dark:border-rose-700 pb-3 flex items-center gap-2">
          <Info className="text-rose-500 dark:text-rose-300" size={24} /> 6.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Cancellation Policy at any time. We will notify you of any material
          changes by posting the updated Policy on this page and updating the
          "Last updated" date. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Policy.
        </p>

        {/* SECTION 7: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-rose-200 dark:border-rose-700 pb-3 flex items-center gap-2">
          <Mail className="text-rose-500 dark:text-rose-300" size={24} /> 7.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding this Cancellation
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

export default CancellationPolicy;
