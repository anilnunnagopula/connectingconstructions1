import React, { useEffect } from "react";
import {
  UserCheck, // Main icon for Order Placement & Tracking
  ShoppingCart, // For Placing Orders
  Truck, // For Tracking Orders
  CheckCircle, // For Order Confirmation
  AlertTriangle, // For Order Issues
  Calendar, // For Delivery Timelines
  Mail, // For Contact Us
  Info, // For Changes to Policy
} from "lucide-react"; // Importing icons

const OrderPlacementTracking = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center flex items-center justify-center gap-3">
          <UserCheck className="text-blue-600 dark:text-blue-400" size={36} />{" "}
          ConnectingConstructions Order Placement & Tracking Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Order Placement & Tracking Policy outlines the steps for placing
          orders, understanding order confirmations, and tracking the status of
          your purchases on the <strong>ConnectingConstructions</strong>{" "}
          platform. We aim to provide a clear and efficient process for all our
          customers.
        </p>

        {/* SECTION 1: Placing an Order */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <ShoppingCart
            className="text-blue-500 dark:text-blue-300"
            size={24}
          />{" "}
          1. Placing an Order
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          To place an order on ConnectingConstructions:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Browse Products:</strong> Explore our wide range of
            construction products and services.
          </li>
          <li>
            <strong>Add to Cart:</strong> Select the desired items and add them
            to your shopping cart. Review your cart to ensure all items and
            quantities are correct.
          </li>
          <li>
            <strong>Proceed to Checkout:</strong> Click on the checkout button.
            You will be prompted to log in or create an account if you haven't
            already.
          </li>
          <li>
            <strong>Provide Shipping Details:</strong> Enter your accurate
            shipping address, including pincode, and contact information. Ensure
            all details are correct to avoid delivery delays.
          </li>
          <li>
            <strong>Select Payment Method:</strong> Choose your preferred
            payment method (e.g., credit/debit card, net banking, UPI).
          </li>
          <li>
            <strong>Review and Confirm:</strong> Carefully review your entire
            order, including product details, shipping address, and total cost.
            Click "Place Order" to confirm your purchase.
          </li>
        </ol>

        {/* SECTION 2: Order Confirmation */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <CheckCircle className="text-blue-500 dark:text-blue-300" size={24} />{" "}
          2. Order Confirmation
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          After successfully placing an order:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Confirmation Email:</strong> You will receive an order
            confirmation email to your registered email address. This email will
            contain your order number, a summary of your purchase, and estimated
            delivery timelines.
          </li>
          <li>
            <strong>Order History:</strong> Your order will appear in your
            "Order History" section within your ConnectingConstructions account,
            where you can view its current status.
          </li>
        </ul>

        {/* SECTION 3: Order Status and Tracking */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Truck className="text-blue-500 dark:text-blue-300" size={24} /> 3.
          Order Status and Tracking
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          You can track the progress of your order through various stages:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Processing:</strong> Your order has been received and is
            being prepared by the supplier.
          </li>
          <li>
            <strong>Dispatched/Shipped:</strong> The supplier has handed over
            your order to the logistics partner. You will receive a shipping
            confirmation email with a tracking number.
          </li>
          <li>
            <strong>In Transit:</strong> Your order is on its way to your
            delivery address. You can use the provided tracking number on the
            logistics partner's website for detailed updates.
          </li>
          <li>
            <strong>Out for Delivery:</strong> Your order is with the local
            delivery agent and will be delivered soon.
          </li>
          <li>
            <strong>Delivered:</strong> Your order has been successfully
            delivered to your address.
          </li>
          <li>
            <strong>Tracking Updates:</strong> We recommend regularly checking
            your order status in your account or using the tracking number for
            real-time updates.
          </li>
        </ul>

        {/* SECTION 4: Estimated Delivery Timelines */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Calendar className="text-blue-500 dark:text-blue-300" size={24} /> 4.
          Estimated Delivery Timelines
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Estimated delivery dates are provided on product pages and at
          checkout. These are approximations and depend on factors such as
          supplier location, product availability, and logistics partner
          efficiency. While we strive for timely delivery, unforeseen
          circumstances (e.g., weather, public holidays, logistical issues) may
          cause delays.
        </p>

        {/* SECTION 5: Order Issues and Support */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-blue-500 dark:text-blue-300"
            size={24}
          />{" "}
          5. Order Issues and Support
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          If you encounter any issues with your order, such as:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Delayed delivery beyond the estimated timeline.</li>
          <li>Incorrect or missing items.</li>
          <li>Damaged products upon arrival.</li>
          <li>Tracking information not updating.</li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          Please contact our customer support team immediately. Refer to our{" "}
          <a
            href="/legal/customer/supportgrievance"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Support & Grievance Redressal Policy
          </a>{" "}
          for detailed steps on how to raise a concern.
        </p>

        {/* SECTION 6: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Info className="text-blue-500 dark:text-blue-300" size={24} /> 6.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Order Placement & Tracking Policy at any time. We will notify you of
          any material changes by posting the updated Policy on this page and
          updating the "Last updated" date. Your continued use of the Service
          after such modifications constitutes your acceptance of the revised
          Policy.
        </p>

        {/* SECTION 7: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Mail className="text-blue-500 dark:text-blue-300" size={24} /> 7.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding this policy, please
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

export default OrderPlacementTracking;
