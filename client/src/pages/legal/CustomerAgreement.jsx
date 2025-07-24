import React, { useEffect } from "react";
import {
  ScrollText, // Main icon for Customer Agreement
  User, // For user accounts
  ShoppingCart, // For orders
  CreditCard, // For payments
  Truck, // For delivery
  RefreshCw, // For returns/refunds
  MessageSquare, // For content/reviews
  Shield, // For intellectual property
  Scale, // For governing law
  XCircle, // For termination
  Info, // For changes to policy
  Mail, // For contact
} from "lucide-react"; // Importing icons

const CustomerAgreement = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <ScrollText className="text-red-600 dark:text-red-400" size={36} />{" "}
          ConnectingConstructions Customer Agreement
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Customer Agreement ("Agreement") is entered into by and between{" "}
          <strong>ConnectingConstructions</strong> ("ConnectingConstructions,"
          "we," "us," or "our") and you, the individual or entity ("Customer,"
          "you," or "your") accessing or using our platform and services (the
          "Service"). This Agreement governs your access to and use of the
          ConnectingConstructions platform, including any content,
          functionality, and services offered on or through it. By accessing or
          using the Service, you agree to be bound by the terms and conditions
          set forth herein.
        </p>

        {/* SECTION 1: Account Registration and Eligibility */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <User className="text-red-500 dark:text-red-300" size={24} /> 1.
          Account Registration and Eligibility
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Eligibility:</strong> You must be at least 18 years old and
            capable of forming a binding contract to use our Service.
          </li>
          <li>
            <strong>Account Information:</strong> You agree to provide accurate,
            current, and complete information during registration and to keep
            this information updated. You are responsible for maintaining the
            confidentiality of your account credentials.
          </li>
          <li>
            <strong>Account Usage:</strong> Your account is for your personal or
            business use. You are responsible for all activities that occur
            under your account.
          </li>
        </ul>

        {/* SECTION 2: Order Placement and Fulfillment */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <ShoppingCart className="text-red-500 dark:text-red-300" size={24} />{" "}
          2. Order Placement and Fulfillment
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Order Acceptance:</strong> All orders placed through the
            Service are subject to acceptance by the respective supplier.
            ConnectingConstructions is a facilitator and not the direct seller
            of products/services unless explicitly stated.
          </li>
          <li>
            <strong>Order Details:</strong> You are responsible for ensuring the
            accuracy of your order details, including product specifications,
            quantities, and delivery address.
          </li>
          <li>
            <strong>Order Tracking:</strong> For details on order placement and
            tracking, please refer to our{" "}
            <a
              href="/legal/customer/orderplacementtracking"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Order Placement & Tracking Policy
            </a>
            .
          </li>
        </ul>

        {/* SECTION 3: Payments, Pricing, and Charges */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <CreditCard className="text-red-500 dark:text-red-300" size={24} /> 3.
          Payments, Pricing, and Charges
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Pricing:</strong> Product and service prices are set by
            suppliers. All prices are inclusive of applicable taxes unless
            otherwise stated.
          </li>
          <li>
            <strong>Payment:</strong> You agree to pay all charges incurred by
            you or on your behalf through the Service, at the prices in effect
            when such charges are incurred.
          </li>
          <li>
            <strong>Payment Guidelines:</strong> For detailed information on
            payment methods and procedures, please refer to our{" "}
            <a
              href="/legal/customer/paymentrefundguidelines"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Payment & Refund Guidelines
            </a>
            .
          </li>
        </ul>

        {/* SECTION 4: Shipping and Delivery */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Truck className="text-red-500 dark:text-red-300" size={24} /> 4.
          Shipping and Delivery
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Delivery of products and services is governed by our{" "}
          <a
            href="/legal/shippingpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Shipping Policy
          </a>
          . You are responsible for providing accurate delivery information and
          ensuring someone is available to receive the order.
        </p>

        {/* SECTION 5: Returns, Refunds, and Cancellations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <RefreshCw className="text-red-500 dark:text-red-300" size={24} /> 5.
          Returns, Refunds, and Cancellations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          All returns, refunds, and cancellations are subject to the terms
          outlined in our{" "}
          <a
            href="/legal/returnrefundpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Return & Refund Policy
          </a>{" "}
          and{" "}
          <a
            href="/legal/cancellationpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Cancellation Policy
          </a>
          .
        </p>

        {/* SECTION 6: User Content and Reviews */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <MessageSquare className="text-red-500 dark:text-red-300" size={24} />{" "}
          6. User Content and Reviews
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Your Content:</strong> You are solely responsible for any
            content you submit or post on the Service, including reviews,
            comments, and messages.
          </li>
          <li>
            <strong>Content Guidelines:</strong> All user content must comply
            with our{" "}
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
          </li>
          <li>
            <strong>License to ConnectingConstructions:</strong> By submitting
            content, you grant ConnectingConstructions a non-exclusive,
            royalty-free, worldwide license to use, reproduce, modify, publish,
            and display such content in connection with the Service.
          </li>
        </ul>

        {/* SECTION 7: Intellectual Property */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Shield className="text-red-500 dark:text-red-300" size={24} /> 7.
          Intellectual Property
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          All content on the ConnectingConstructions platform, including text,
          graphics, logos, images, and software, is the property of
          ConnectingConstructions or its content suppliers and protected by
          intellectual property laws. You may not use any content from the
          Service without our express written permission.
        </p>

        {/* SECTION 8: Disclaimer of Warranties */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Info className="text-red-500 dark:text-red-300" size={24} /> 8.
          Disclaimer of Warranties
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
          ConnectingConstructions makes no warranties, express or implied,
          regarding the operation of the Service or the information, content,
          materials, or products included on the Service. For a full disclaimer,
          please refer to our general{" "}
          <a
            href="/legal/disclaimer"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Disclaimer
          </a>
          .
        </p>

        {/* SECTION 9: Limitation of Liability */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Scale className="text-red-500 dark:text-red-300" size={24} /> 9.
          Limitation of Liability
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          In no event shall ConnectingConstructions be liable for any direct,
          indirect, incidental, special, consequential, or punitive damages
          arising out of your use of, or inability to use, the Service.
        </p>

        {/* SECTION 10: Governing Law and Dispute Resolution */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Scale className="text-red-500 dark:text-red-300" size={24} /> 10.
          Governing Law and Dispute Resolution
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          This Agreement shall be governed by and construed in accordance with
          the laws of India. Any disputes arising under this Agreement shall be
          resolved as per our{" "}
          <a
            href="/legal/disputes"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Disputes Policy
          </a>
          .
        </p>

        {/* SECTION 11: Termination */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <XCircle className="text-red-500 dark:text-red-300" size={24} /> 11.
          Termination
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions may terminate or suspend your account and
          access to the Service immediately, without prior notice or liability,
          for any reason whatsoever, including without limitation if you breach
          this Agreement.
        </p>

        {/* SECTION 12: Changes to This Agreement */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Info className="text-red-500 dark:text-red-300" size={24} /> 12.
          Changes to This Agreement
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We reserve the right to modify or replace this Agreement at any time.
          We will notify you of any material changes by posting the new
          Agreement on this page and updating the "Last updated" date. Your
          continued use of the Service after such modifications constitutes your
          acceptance of the revised terms.
        </p>

        {/* SECTION 13: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-red-200 dark:border-red-700 pb-3 flex items-center gap-2">
          <Mail className="text-red-500 dark:text-red-300" size={24} /> 13.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions about this Customer Agreement, please
          contact us:
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

export default CustomerAgreement;
