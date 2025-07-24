import React, { useEffect } from "react";
import {
  Truck, // Main icon for logistics
  ClipboardList, // Scope, Responsibilities
  Clock, // Delivery Timelines
  Box, // Packaging & Handling
  Wallet, // Shipping Costs
  CheckCircle, // Delivery Confirmation
  Ban, // Undeliverable Shipments
  AlertTriangle, // Customer Disputes, Performance Monitoring
  CloudLightning, // Force Majeure
  XCircle, // Termination
  Scale, // Governing Law
  Info, // Changes to Agreement
  Mail, // Contact
} from "lucide-react"; // Importing icons

const LogisticsAgreement = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Truck className="text-orange-600 dark:text-orange-400" size={36} />{" "}
          ConnectingConstructions Logistics Agreement
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Logistics Agreement ("Agreement") governs the terms and
          conditions under which suppliers ("Suppliers," "you," or "your") on
          the <strong>ConnectingConstructions</strong> platform manage the
          shipping, delivery, and related logistics for products and services
          sold through our Service. By using our platform to fulfill orders, you
          agree to adhere to the terms outlined herein, ensuring efficient and
          reliable delivery to our customers.
        </p>

        {/* SECTION 1: Scope of Agreement */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          1. Scope of Agreement
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          This Agreement covers all aspects of product and service delivery
          originating from Suppliers via the ConnectingConstructions platform,
          including but not limited to dispatch, transit, final delivery, and
          handling of related issues.
        </p>

        {/* SECTION 2: Supplier's Responsibilities */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          2. Supplier's Responsibilities
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          As a Supplier, you are solely responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Timely Dispatch:</strong> Ensuring all ordered products are
            dispatched from your location within the timelines committed at the
            time of order confirmation.
          </li>
          <li>
            <strong>Accurate Information:</strong> Providing accurate and
            complete shipping information, including customer address, contact
            details, and product specifics, to your chosen logistics partner.
          </li>
          <li>
            <strong>Logistics Partner Selection:</strong> Engaging reputable
            logistics partners capable of handling the nature and volume of your
            products, and ensuring they comply with all applicable transport
            laws.
          </li>
          <li>
            <strong>Proof of Delivery:</strong> Obtaining and retaining valid
            proof of delivery for all shipments.
          </li>
          <li>
            <strong>Adherence to Shipping Policy:</strong> Complying with all
            terms outlined in our{" "}
            <a
              href="/legal/shippingpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Shipping Policy
            </a>
            .
          </li>
        </ul>

        {/* SECTION 3: Delivery Timelines & Tracking */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Clock className="text-orange-500 dark:text-orange-300" size={24} />{" "}
          3. Delivery Timelines & Tracking
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Estimated Delivery Dates (EDD):</strong> Suppliers must
            provide realistic EDDs at the time of order and strive to meet them.
            Delays must be communicated to the customer and
            ConnectingConstructions promptly.
          </li>
          <li>
            <strong>Tracking Information:</strong> Suppliers must provide valid
            tracking numbers and ensure tracking information is updated
            regularly and accurately, enabling customers to monitor their
            shipment status. This information must be updated on the
            ConnectingConstructions platform.
          </li>
          <li>
            <strong>Service Level Agreements (SLAs):</strong> Repeated failure
            to meet delivery SLAs or provide accurate tracking may result in
            penalties or suspension as per the Performance Monitoring section.
          </li>
        </ul>

        {/* SECTION 4: Packaging & Handling */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Box className="text-orange-500 dark:text-orange-300" size={24} /> 4.
          Packaging & Handling
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Secure Packaging:</strong> Products must be securely
            packaged to withstand standard handling during transit and prevent
            damage. Appropriate cushioning, protective materials, and external
            packaging suitable for the product's nature (e.g., fragile, heavy)
            must be used.
          </li>
          <li>
            <strong>Labeling:</strong> All packages must be clearly and
            correctly labeled with shipping addresses, contact details, and any
            special handling instructions (e.g., "Fragile," "This Side Up").
          </li>
          <li>
            <strong>Environmentally Friendly Practices:</strong> Suppliers are
            encouraged to use sustainable and environmentally friendly packaging
            materials where feasible.
          </li>
        </ul>

        {/* SECTION 5: Shipping Costs & Charges */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Wallet className="text-orange-500 dark:text-orange-300" size={24} />{" "}
          5. Shipping Costs & Charges
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Shipping costs and any associated charges (e.g., handling fees,
          customs duties if applicable) must be communicated clearly to the
          customer as per the{" "}
          <a
            href="/legal/pricingpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Pricing Policy
          </a>
          . Suppliers are responsible for any undisclosed shipping charges or
          additional fees incurred due to their negligence.
        </p>

        {/* SECTION 6: Delivery Confirmation */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          6. Delivery Confirmation
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Upon successful delivery, the Supplier or their logistics partner must
          obtain confirmation of receipt (e.g., signature, photo proof, GPS
          coordinates) and update the order status on the
          ConnectingConstructions platform. This proof may be required in case
          of customer disputes.
        </p>

        {/* SECTION 7: Undeliverable Shipments */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Ban className="text-orange-500 dark:text-orange-300" size={24} /> 7.
          Undeliverable Shipments
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          In cases where a shipment cannot be delivered (e.g., incorrect
          address, recipient unavailable after multiple attempts), the Supplier
          is responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Promptly communicating the issue to the customer and
            ConnectingConstructions.
          </li>
          <li>
            Attempting to resolve the delivery issue or arranging for return and
            refund as per the{" "}
            <a
              href="/legal/returnrefundpolicy"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Return & Refund Policy
            </a>
            .
          </li>
          <li>
            Bearing any additional costs incurred for redelivery or return if
            the undeliverable status is due to Supplier negligence or inaccurate
            information.
          </li>
        </ul>

        {/* SECTION 8: Customer Disputes & Damages */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          8. Customer Disputes & Damages
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Suppliers are responsible for resolving customer disputes related to
          shipping and delivery, including lost, damaged, or incorrect
          shipments. Claims for damages during transit must be handled by the
          Supplier with their chosen logistics partner. ConnectingConstructions
          may mediate disputes but is not liable for logistics issues caused by
          the Supplier or their chosen carrier.
        </p>

        {/* SECTION 9: Performance Monitoring */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          9. Performance Monitoring
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions monitors Supplier performance related to
          logistics, including on-time delivery rates, tracking update
          frequency, and customer feedback on shipping. Consistent failure to
          meet performance targets may result in warnings, temporary
          restrictions, or suspension of your Supplier account.
        </p>

        {/* SECTION 10: Force Majeure */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <CloudLightning
            className="text-orange-500 dark:text-orange-300"
            size={24}
          />{" "}
          10. Force Majeure
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Neither party shall be liable for any failure or delay in performance
          under this Agreement due to causes beyond its reasonable control,
          including, but not limited to, acts of God, war, terrorism, riots,
          embargoes, acts of civil or military authorities, fire, floods,
          accidents, strikes, or shortages of transportation facilities, fuel,
          energy, labor, or materials. The affected party must notify the other
          party promptly of the force majeure event and use reasonable efforts
          to mitigate its impact.
        </p>

        {/* SECTION 11: Termination */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <XCircle className="text-orange-500 dark:text-orange-300" size={24} />{" "}
          11. Termination
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          This Agreement may be terminated by either party as per the terms
          outlined in the main{" "}
          <a
            href="/legal/supplieragreement"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Supplier Agreement
          </a>
          . Upon termination, all outstanding logistics obligations must be
          completed.
        </p>

        {/* SECTION 12: Governing Law and Dispute Resolution */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Scale className="text-orange-500 dark:text-orange-300" size={24} />{" "}
          12. Governing Law and Dispute Resolution
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          This Agreement shall be governed by and construed in accordance with
          the laws of India. Any disputes arising from or relating to this
          Agreement shall be subject to the dispute resolution mechanisms
          outlined in the main{" "}
          <a
            href="/legal/supplieragreement"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Supplier Agreement
          </a>
          .
        </p>

        {/* SECTION 13: Changes to This Agreement */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Info className="text-orange-500 dark:text-orange-300" size={24} />{" "}
          13. Changes to This Agreement
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or replace this
          Logistics Agreement at any time. We will notify Suppliers of any
          material changes by posting the updated Agreement on this page. Your
          continued use of the Service after such modifications constitutes your
          acceptance of the revised terms.
        </p>

        {/* SECTION 14: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-orange-200 dark:border-orange-700 pb-3 flex items-center gap-2">
          <Mail className="text-orange-500 dark:text-orange-300" size={24} />{" "}
          14. Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or require clarification regarding this
          Logistics Agreement, please contact us:
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

export default LogisticsAgreement;
