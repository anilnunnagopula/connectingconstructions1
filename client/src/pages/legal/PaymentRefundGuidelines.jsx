import React, { useEffect } from "react";
import {
  CreditCard, // Main icon for Payment & Refund
  Wallet, // For Payment Methods
  DollarSign, // For Pricing & Charges
  RefreshCw, // For Refunds Process
  Ban, // For Non-Refundable Items
  AlertTriangle, // For Disputes & Chargebacks
  Info, // For Changes to Policy
  Mail, // For Contact Us
  CheckCircle, // For Payment Confirmation
} from "lucide-react"; // Importing icons

const PaymentRefundGuidelines = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <CreditCard
            className="text-green-600 dark:text-green-400"
            size={36}
          />{" "}
          ConnectingConstructions Payment & Refund Guidelines
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          These Payment & Refund Guidelines outline the accepted payment
          methods, billing procedures, and the process for refunds when
          purchasing products and services on the{" "}
          <strong>ConnectingConstructions</strong> platform. We aim to ensure a
          secure, transparent, and fair financial experience for all our
          customers.
        </p>

        {/* SECTION 1: Accepted Payment Methods */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Wallet className="text-green-500 dark:text-green-300" size={24} /> 1.
          Accepted Payment Methods
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions supports various secure payment methods for
          your convenience:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Credit/Debit Cards:</strong> Visa, MasterCard, American
            Express, RuPay, and other major credit and debit cards.
          </li>
          <li>
            <strong>Net Banking:</strong> Direct bank transfers from a wide
            range of Indian banks.
          </li>
          <li>
            <strong>UPI (Unified Payments Interface):</strong> Payments through
            popular UPI apps.
          </li>
          <li>
            <strong>Digital Wallets:</strong> Integration with select digital
            wallet services (e.g., Paytm, Google Pay).
          </li>
          <li>
            <strong>Other Methods:</strong> Any other payment methods explicitly
            listed and made available during the checkout process.
          </li>
        </ul>
        <p className="mt-4 text-base italic text-gray-600 dark:text-gray-400">
          All payment transactions are processed through secure, third-party
          payment gateways (e.g., Razorpay) to ensure the safety of your
          financial information. We do not store your full payment card details
          on our servers.
        </p>

        {/* SECTION 2: Pricing and Charges */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <DollarSign
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          2. Pricing and Charges
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Product Price:</strong> The price displayed on the product
            page is the final price, inclusive of all applicable taxes (e.g.,
            GST), unless otherwise explicitly stated.
          </li>
          <li>
            <strong>Shipping Charges:</strong> Any applicable shipping charges
            will be calculated and displayed separately during the checkout
            process, before you confirm your order. Refer to our{" "}
            <a
              href="/legal/shippingpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Shipping Policy
            </a>{" "}
            for more details.
          </li>
          <li>
            <strong>Payment Gateway Fees:</strong> In rare cases, certain
            payment methods might incur a small transaction fee charged by the
            payment gateway. Any such fees will be clearly indicated before you
            complete the transaction.
          </li>
        </ul>

        {/* SECTION 3: Payment Confirmation */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          3. Payment Confirmation
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Upon successful completion of your payment, you will receive an order
          confirmation email containing your order details and a payment
          receipt. Your order status in your ConnectingConstructions account
          will also be updated. If you experience any issues with payment or do
          not receive a confirmation, please contact our customer support.
        </p>

        {/* SECTION 4: Refund Eligibility */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <RefreshCw className="text-green-500 dark:text-green-300" size={24} />{" "}
          4. Refund Eligibility
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Refunds are processed in accordance with our comprehensive{" "}
          <a
            href="/legal/returnrefundpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Return & Refund Policy
          </a>
          . Generally, you may be eligible for a refund if:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Your order is successfully cancelled before dispatch (refer to{" "}
            <a
              href="/legal/cancellationpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Cancellation Policy
            </a>
            ).
          </li>
          <li>
            You return a product that meets the eligibility criteria outlined in
            the Return & Refund Policy.
          </li>
          <li>The product received is damaged, defective, or incorrect.</li>
          <li>
            There is a confirmed issue with payment processing that results in
            an overcharge or unfulfilled order.
          </li>
        </ul>

        {/* SECTION 5: Refund Process and Timeline */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <RefreshCw className="text-green-500 dark:text-green-300" size={24} />{" "}
          5. Refund Process and Timeline
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Initiation:</strong> Once your return or cancellation
            request is approved, the refund process will be initiated by
            ConnectingConstructions.
          </li>
          <li>
            <strong>Refund Method:</strong> Refunds will typically be issued to
            the original payment method used for the purchase. If this is not
            possible, an alternative secure method (e.g., bank transfer) will be
            used.
          </li>
          <li>
            <strong>Timeline:</strong> After initiation, refunds are generally
            processed within [e.g., 5-7 business days]. The time it takes for
            the refunded amount to appear in your account may vary depending on
            your bank or payment provider.
          </li>
          <li>
            <strong>Partial Refunds:</strong> In some cases, partial refunds may
            be issued as per the Return & Refund Policy (e.g., for items not in
            original condition, or if shipping costs are non-refundable).
          </li>
        </ul>

        {/* SECTION 6: Non-Refundable Items/Situations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Ban className="text-green-500 dark:text-green-300" size={24} /> 6.
          Non-Refundable Items/Situations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Certain items or situations are generally non-refundable, as detailed
          in our{" "}
          <a
            href="/legal/returnrefundpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Return & Refund Policy
          </a>
          . These may include, but are not limited to, digital products,
          custom-made items, or items returned outside the specified window or
          condition.
        </p>

        {/* SECTION 7: Disputes and Chargebacks */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          7. Disputes and Chargebacks
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          If you have a dispute regarding a payment or refund, please contact
          our customer support first to resolve the issue. Initiating a
          chargeback with your bank without first attempting to resolve it with
          us may delay the resolution process and could result in account
          restrictions. For more on dispute resolution, refer to our{" "}
          <a
            href="/legal/disputes"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Disputes Policy
          </a>
          .
        </p>

        {/* SECTION 8: Changes to These Guidelines */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Info className="text-green-500 dark:text-green-300" size={24} /> 8.
          Changes to These Guidelines
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update these
          Payment & Refund Guidelines at any time. We will notify you of any
          material changes by posting the updated Guidelines on this page and
          updating the "Last updated" date. Your continued use of the Service
          after such modifications constitutes your acceptance of the revised
          Guidelines.
        </p>

        {/* SECTION 9: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Mail className="text-green-500 dark:text-green-300" size={24} /> 9.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding these Payment & Refund
          Guidelines, please contact us:
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

export default PaymentRefundGuidelines;
