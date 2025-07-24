import React, { useEffect } from "react";
import {
  Ship, // Main icon for shipping
  Globe, // Shipping Locations
  DollarSign, // Shipping Costs
  Clock, // Delivery Times, Order Processing
  PackageCheck, // Confirmation & Tracking
  MapPin, // Accurate Address
  AlertTriangle, // Delivery Issues
  Earth, // International Shipping (if applicable)
  RefreshCw, // Returns
  Info, // Changes to Policy
  Mail, // Contact
} from "lucide-react"; // Importing icons

const ShippingPolicy = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Ship className="text-cyan-600 dark:text-cyan-400" size={36} />{" "}
          ConnectingConstructions Shipping Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Shipping Policy outlines the terms and conditions related to the
          shipment and delivery of products purchased through the{" "}
          <strong>ConnectingConstructions</strong> platform. We strive to ensure
          a smooth and transparent delivery process for our customers,
          facilitated by our network of trusted suppliers and logistics
          partners.
        </p>

        {/* SECTION 1: Shipping Locations */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Globe className="text-cyan-500 dark:text-cyan-300" size={24} /> 1.
          Shipping Locations
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions primarily facilitates shipping within India.
          Specific product availability and shipping capabilities may vary by
          supplier and product type. During the checkout process, you will be
          able to confirm if a product can be shipped to your desired location.
        </p>
        {/* If international shipping is a possibility, add a sub-section: */}
        {/*
        <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Earth className="text-cyan-500 dark:text-cyan-300" size={22} /> 1.1 International Shipping
        </h3>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          For international shipments, additional customs duties, taxes, and fees may apply. These charges are the responsibility of the customer and are not included in the product price or shipping cost. Delivery times for international orders can vary significantly due to customs processing.
        </p>
        */}

        {/* SECTION 2: Shipping Methods and Costs */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <DollarSign className="text-cyan-500 dark:text-cyan-300" size={24} />{" "}
          2. Shipping Methods and Costs
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Methods:</strong> Shipping methods are determined by
            individual suppliers and may include standard delivery, express
            delivery, or specialized freight for larger items.
          </li>
          <li>
            <strong>Costs:</strong> Shipping costs are calculated based on
            various factors, including product weight, dimensions, delivery
            location, and the chosen shipping method. These costs will be
            clearly displayed during the checkout process before you finalize
            your order.
          </li>
          <li>
            <strong>Free Shipping:</strong> Some suppliers may offer free
            shipping on certain products or orders above a specific value. Any
            such offers will be clearly indicated on the product page.
          </li>
        </ul>

        {/* SECTION 3: Estimated Delivery Times */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Clock className="text-cyan-500 dark:text-cyan-300" size={24} /> 3.
          Estimated Delivery Times
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>General Estimates:</strong> Estimated delivery times are
            provided on each product page and during checkout. These are
            approximations and may vary depending on the supplier's location,
            destination, and unforeseen circumstances.
          </li>
          <li>
            <strong>Factors Affecting Delivery:</strong> Delivery times can be
            affected by public holidays, adverse weather conditions, logistical
            delays, or other events beyond our or the supplier's control.
          </li>
        </ul>

        {/* SECTION 4: Order Processing Time */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Clock className="text-cyan-500 dark:text-cyan-300" size={24} /> 4.
          Order Processing Time
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Once an order is placed, suppliers typically require 1-3 business days
          to process and prepare the order for shipment. This processing time is
          separate from the shipping time. Orders are not shipped or delivered
          on weekends or public holidays.
        </p>

        {/* SECTION 5: Shipping Confirmation & Tracking */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <PackageCheck
            className="text-cyan-500 dark:text-cyan-300"
            size={24}
          />{" "}
          5. Shipping Confirmation & Tracking
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Once your order has shipped, you will receive a shipping confirmation
          email containing your tracking number(s). You can use this number to
          track the status of your shipment through the respective logistics
          partner's website or directly on your ConnectingConstructions order
          details page. Please allow up to 24-48 hours for the tracking
          information to become active.
        </p>

        {/* SECTION 6: Accurate Shipping Information */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <MapPin className="text-cyan-500 dark:text-cyan-300" size={24} /> 6.
          Accurate Shipping Information
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          It is the customer's responsibility to provide accurate and complete
          shipping address details, including pincode and contact number.
          ConnectingConstructions and its suppliers are not responsible for
          delays or non-delivery due to incorrect or incomplete address
          information provided by the customer. Additional charges for
          re-delivery or return shipping due to incorrect addresses may be
          passed on to the customer.
        </p>

        {/* SECTION 7: Delivery Issues (Lost or Damaged Shipments) */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-cyan-500 dark:text-cyan-300"
            size={24}
          />{" "}
          7. Delivery Issues (Lost or Damaged Shipments)
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Damaged Upon Arrival:</strong> If your order arrives
            damaged, please document the damage (take photos) and contact our
            customer support immediately within [e.g., 24-48 hours] of delivery.
            Do not dispose of the packaging or damaged items until instructed.
          </li>
          <li>
            <strong>Lost Shipments:</strong> If your tracking information shows
            "delivered" but you have not received your package, please check
            with neighbors or your building's management. If still not found,
            contact our customer support within [e.g., 3 days] of the
            "delivered" status. We will investigate with the supplier and
            logistics partner to resolve the issue.
          </li>
        </ul>

        {/* SECTION 8: Returns Due to Shipping Issues */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <RefreshCw className="text-cyan-500 dark:text-cyan-300" size={24} />{" "}
          8. Returns Due to Shipping Issues
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          For products that are returned due to shipping issues (e.g.,
          undeliverable address, refusal of delivery), refunds will be processed
          according to our{" "}
          <a
            href="/legal/returnrefundpolicy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Return & Refund Policy
          </a>
          . Please note that original shipping charges may not be refundable,
          and a re-stocking fee or return shipping cost may apply.
        </p>

        {/* SECTION 9: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Info className="text-cyan-500 dark:text-cyan-300" size={24} /> 9.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Shipping Policy at any time. We will notify you of any material
          changes by posting the updated Policy on this page and updating the
          "Last updated" date. Your continued use of the Service after such
          modifications constitutes your acceptance of the revised Policy.
        </p>

        {/* SECTION 10: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-cyan-200 dark:border-cyan-700 pb-3 flex items-center gap-2">
          <Mail className="text-cyan-500 dark:text-cyan-300" size={24} /> 10.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding this Shipping Policy,
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

export default ShippingPolicy;
