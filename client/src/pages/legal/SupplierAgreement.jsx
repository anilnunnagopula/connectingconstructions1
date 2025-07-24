import React, { useEffect } from "react";
import {
  Handshake, // Main agreement icon
  ClipboardList, // Scope, Responsibilities
  CheckCircle, // Quality
  Wallet, // Pricing & Payment
  Package, // Order Process
  Sparkles, // Intellectual Property
  EyeOff, // Confidentiality
  Shield, // Indemnification
  XCircle, // Termination
  Scale, // Governing Law & Dispute Resolution
  Info, // Miscellaneous
  Mail, // Contact
} from "lucide-react"; // Importing icons

const SupplierAgreement = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Handshake className="text-blue-600 dark:text-blue-400" size={36} />{" "}
          ConnectingConstructions Supplier Agreement
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Supplier Agreement ("Agreement") is entered into by and between{" "}
          <strong>ConnectingConstructions</strong> ("ConnectingConstructions,"
          "we," "us," or "our") and the supplier or vendor ("Supplier," "you,"
          or "your") who registers for and uses our platform and services (the
          "Service"). This Agreement governs your participation as a Supplier on
          the ConnectingConstructions platform. By registering as a Supplier and
          using our Service, you agree to be bound by the terms and conditions
          set forth herein.
        </p>

        {/* SECTION 1: Scope of Agreement */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-blue-500 dark:text-blue-300"
            size={24}
          />{" "}
          1. Scope of Agreement
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          This Agreement outlines the terms under which the Supplier can list,
          market, and sell their products or services through the
          ConnectingConstructions platform to customers. It covers various
          aspects of the business relationship, including product/service
          quality, pricing, order fulfillment, payments, and legal obligations.
        </p>

        {/* SECTION 2: Supplier Registration and Account */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Info className="text-blue-500 dark:text-blue-300" size={24} /> 2.
          Supplier Registration and Account
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Eligibility:</strong> By registering, you warrant that you
            are a legally constituted business entity, authorized to conduct
            business in your jurisdiction, and have the full power and authority
            to enter into this Agreement.
          </li>
          <li>
            <strong>Account Information:</strong> You agree to provide accurate,
            current, and complete information during registration and to keep
            this information updated. This includes, but is not limited to,
            business name, GSTIN (Goods and Services Tax Identification Number),
            contact details, and banking information.
          </li>
          <li>
            <strong>Account Security:</strong> You are responsible for
            maintaining the confidentiality of your account login credentials
            and for all activities that occur under your account. You agree to
            notify ConnectingConstructions immediately of any unauthorized use
            of your account.
          </li>
        </ul>

        {/* SECTION 3: Supplier Responsibilities */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-blue-500 dark:text-blue-300"
            size={24}
          />{" "}
          3. Supplier Responsibilities
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          As a Supplier, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Accurate Listings:</strong> Provide accurate and detailed
            descriptions, specifications, pricing, and availability for all
            products or services listed on the platform. All listings must
            comply with our Product Guidelines.
          </li>
          <li>
            <strong>Order Fulfillment:</strong> Promptly process and fulfill all
            orders received through the Service in accordance with the
            agreed-upon terms, including delivery timelines and service levels.
          </li>
          <li>
            <strong>Customer Service:</strong> Provide timely and effective
            customer support to customers for issues related to your
            products/services, including inquiries, complaints, and returns, as
            per our Return & Refund Policy.
          </li>
          <li>
            <strong>Compliance:</strong> Comply with all applicable local,
            state, and national laws and regulations related to your
            products/services, business operations, and data protection.
          </li>
          <li>
            <strong>Taxes:</strong> Be solely responsible for calculating,
            collecting, reporting, and remitting all applicable taxes (including
            GST) associated with your sales through the platform.
          </li>
        </ul>

        {/* SECTION 4: Product/Service Quality */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <CheckCircle className="text-blue-500 dark:text-blue-300" size={24} />{" "}
          4. Product/Service Quality
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          All products and services offered by the Supplier must meet the
          quality standards specified in our{" "}
          <a
            href="/legal/productguidelines"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Product Guidelines
          </a>
          . ConnectingConstructions reserves the right to remove or suspend
          listings that do not comply with these standards or receive consistent
          negative feedback regarding quality.
        </p>

        {/* SECTION 5: Pricing and Payment Terms */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Wallet className="text-blue-500 dark:text-blue-300" size={24} /> 5.
          Pricing and Payment Terms
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Pricing:</strong> Supplier agrees to adhere to the pricing
            policies outlined in our{" "}
            <a
              href="/legal/pricingpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Pricing Policy
            </a>
            . All prices listed must be inclusive of all applicable taxes unless
            otherwise clearly specified.
          </li>
          <li>
            <strong>Payment Processing:</strong> ConnectingConstructions may
            facilitate payment processing between customers and Suppliers.
            Payments to Suppliers will be made according to the terms specified
            in the Pricing Policy, typically after successful order fulfillment
            and a defined reconciliation period.
          </li>
          <li>
            <strong>Commissions/Fees:</strong> Supplier agrees to pay
            ConnectingConstructions any agreed-upon commissions or service fees
            for sales generated through the platform, as detailed in the Pricing
            Policy or a separate commercial agreement.
          </li>
        </ul>

        {/* SECTION 6: Order Process and Logistics */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Package className="text-blue-500 dark:text-blue-300" size={24} /> 6.
          Order Process and Logistics
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Suppliers must manage orders, shipping, and delivery in accordance
          with our{" "}
          <a
            href="/legal/logisticsagreement"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Logistics Agreement
          </a>{" "}
          and{" "}
          <a
            href="/legal/shippingpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Shipping Policy
          </a>
          . This includes timely dispatch, accurate tracking information, and
          adherence to delivery standards.
        </p>

        {/* SECTION 7: Returns, Refunds, and Cancellations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <XCircle className="text-blue-500 dark:text-blue-300" size={24} /> 7.
          Returns, Refunds, and Cancellations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Suppliers must comply with ConnectingConstructions'{" "}
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
          . This includes processing returns, issuing refunds, and managing
          order cancellations in a timely and fair manner.
        </p>

        {/* SECTION 8: Intellectual Property */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Sparkles className="text-blue-500 dark:text-blue-300" size={24} /> 8.
          Intellectual Property
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Supplier Content:</strong> Supplier grants
            ConnectingConstructions a non-exclusive, royalty-free, worldwide
            license to use, reproduce, modify, adapt, publish, translate, create
            derivative works from, distribute, and display any content (e.g.,
            product images, descriptions, company logos) submitted by the
            Supplier on the platform, solely for the purpose of operating and
            promoting the Service.
          </li>
          <li>
            <strong>No Infringement:</strong> Supplier warrants that all content
            provided does not infringe upon the intellectual property rights,
            privacy rights, or any other rights of any third party.
          </li>
        </ul>

        {/* SECTION 9: Confidentiality */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <EyeOff className="text-blue-500 dark:text-blue-300" size={24} /> 9.
          Confidentiality
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          During the term of this Agreement, the Supplier may have access to
          confidential information of ConnectingConstructions and its users. The
          Supplier agrees to keep all such information strictly confidential and
          not to disclose or use it for any purpose other than fulfilling their
          obligations under this Agreement.
        </p>

        {/* SECTION 10: Indemnification */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Shield className="text-blue-500 dark:text-blue-300" size={24} /> 10.
          Indemnification
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Supplier agrees to indemnify, defend, and hold harmless
          ConnectingConstructions and its affiliates, officers, directors,
          employees, and agents from and against any and all claims,
          liabilities, damages, losses, and expenses, including reasonable
          attorneys' fees and costs, arising out of or in any way connected
          with: (a) your access to or use of the Service; (b) your violation of
          this Agreement; (c) your violation of any third-party right, including
          without limitation any intellectual property right, publicity,
          confidentiality, property, or privacy right; or (d) any dispute or
          issue between you and any third party.
        </p>

        {/* SECTION 11: Termination */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <XCircle className="text-blue-500 dark:text-blue-300" size={24} /> 11.
          Termination
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>By ConnectingConstructions:</strong> We may terminate or
            suspend your access to the Service immediately, without prior notice
            or liability, for any reason whatsoever, including without
            limitation if you breach this Agreement.
          </li>
          <li>
            <strong>By Supplier:</strong> You may terminate this Agreement by
            discontinuing your use of the Service and deactivating your Supplier
            account, subject to fulfilling any outstanding obligations (e.g.,
            pending orders, payments).
          </li>
          <li>
            <strong>Effect of Termination:</strong> Upon termination, your right
            to use the Service will immediately cease. All provisions of this
            Agreement which by their nature should survive termination shall
            survive termination, including, without limitation, ownership
            provisions, warranty disclaimers, indemnity, and limitations of
            liability.
          </li>
        </ul>

        {/* SECTION 12: Governing Law and Dispute Resolution */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Scale className="text-blue-500 dark:text-blue-300" size={24} /> 12.
          Governing Law and Dispute Resolution
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Governing Law:</strong> This Agreement shall be governed by
            and construed in accordance with the laws of India, without regard
            to its conflict of law provisions.
          </li>
          <li>
            <strong>Dispute Resolution:</strong> Any dispute, controversy, or
            claim arising out of or relating to this Agreement, or the breach,
            termination, or invalidity thereof, shall be settled by arbitration
            in accordance with the provisions of the Arbitration and
            Conciliation Act, 1996. The arbitration shall be conducted in
            Hyderabad, Telangana, India. The language of the arbitration shall
            be English.
          </li>
        </ul>

        {/* SECTION 13: Miscellaneous */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Info className="text-blue-500 dark:text-blue-300" size={24} /> 13.
          Miscellaneous
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Entire Agreement:</strong> This Agreement constitutes the
            entire agreement between you and ConnectingConstructions regarding
            your use of the Service as a Supplier.
          </li>
          <li>
            <strong>Severability:</strong> If any provision of this Agreement is
            held to be invalid or unenforceable, the remaining provisions will
            remain in full force and effect.
          </li>
          <li>
            <strong>Waiver:</strong> No waiver of any term of this Agreement
            shall be deemed a further or continuing waiver of such term or any
            other term, and ConnectingConstructions’ failure to assert any right
            or provision under this Agreement shall not constitute a waiver of
            such right or provision.
          </li>
        </ul>

        {/* SECTION 14: Changes to This Agreement */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Info className="text-blue-500 dark:text-blue-300" size={24} /> 14.
          Changes to This Agreement
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We reserve the right to modify or replace this Agreement at any time.
          If a revision is material, we will try to provide at least 30 days'
          notice prior to any new terms taking effect. What constitutes a
          material change will be determined at our sole discretion. By
          continuing to access or use our Service after those revisions become
          effective, you agree to be bound by the revised terms.
        </p>

        {/* SECTION 15: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Mail className="text-blue-500 dark:text-blue-300" size={24} /> 15.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions about this Supplier Agreement, please
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

export default SupplierAgreement;
