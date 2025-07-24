import React, { useEffect } from "react";
import {
  DollarSign, // Main icon for subscriptions/monetization
  CheckCircle, // For plan features/benefits
  CreditCard, // For payment terms
  Calendar, // For billing cycle
  XCircle, // For cancellation
  Info, // For general info/changes
  Mail, // For contact
  Award, // For premium features
  ArrowRightCircle, // For trial periods
} from "lucide-react"; // Importing icons

const SubscriptionPlans = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <DollarSign
            className="text-purple-600 dark:text-purple-400"
            size={36}
          />{" "}
          ConnectingConstructions Supplier Subscription Plans
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Supplier Subscription Plans Policy outlines the various
          subscription tiers available to suppliers ("Suppliers," "you," or
          "your") on the <strong>ConnectingConstructions</strong> platform,
          detailing their features, benefits, pricing, and terms. Our
          subscription plans are designed to offer flexible options that help
          suppliers maximize their visibility, reach, and business
          opportunities.
        </p>

        {/* SECTION 1: Subscription Tiers Overview */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          1. Subscription Tiers Overview
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions offers different subscription tiers, each
          tailored to various business needs and scales. Details of each tier,
          including pricing and specific features, are available on our
          dedicated "Plans" page and within your Supplier dashboard. Common
          tiers may include:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Basic/Free Plan:</strong> Limited features, suitable for new
            or small-scale suppliers to get started.
          </li>
          <li>
            <strong>Standard/Growth Plan:</strong> Enhanced features, increased
            listing limits, and basic analytics.
          </li>
          <li>
            <strong>Premium/Enterprise Plan:</strong> Full suite of features,
            priority support, advanced analytics, dedicated account management,
            and potential for featured listings.
          </li>
        </ul>

        {/* SECTION 2: Plan Features and Benefits */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Award className="text-purple-500 dark:text-purple-300" size={24} />{" "}
          2. Plan Features and Benefits
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Each subscription tier provides a unique set of features and benefits,
          which may include:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Number of product/service listings allowed.</li>
          <li>Access to advanced analytics and reporting.</li>
          <li>Inclusion in specific categories or search filters.</li>
          <li>Priority customer support.</li>
          <li>
            Eligibility for ad placement and featured listings (as per{" "}
            <a
              href="/legal/monetization/adplacement"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Ad Placement & Featured Listings Policy
            </a>
            ).
          </li>
          <li>Integration capabilities with other tools.</li>
          <li>Dedicated account manager (for higher tiers).</li>
        </ul>

        {/* SECTION 3: Pricing and Payment Terms */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <CreditCard
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          3. Pricing and Payment Terms
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Subscription Fees:</strong> Fees for each plan are clearly
            stated on our pricing page. All fees are in INR and are exclusive of
            applicable taxes (e.g., GST), which will be added at checkout.
          </li>
          <li>
            <strong>Billing Cycle:</strong> Subscriptions are typically billed
            on a [Monthly/Quarterly/Annual] basis, starting from the date of
            subscription activation.
          </li>
          <li>
            <strong>Payment Method:</strong> Payments are processed via secure
            online payment gateways (e.g., credit/debit card, net banking). You
            authorize ConnectingConstructions to charge your chosen payment
            method automatically for recurring subscription fees.
          </li>
          <li>
            <strong>Automatic Renewal:</strong> Subscriptions are set to
            automatically renew at the end of each billing cycle unless
            cancelled prior to the renewal date.
          </li>
          <li>
            <strong>Late Payments:</strong> Failure to make timely payments may
            result in temporary suspension or termination of your subscription
            benefits and access to premium features.
          </li>
        </ul>

        {/* SECTION 4: Free Trials */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <ArrowRightCircle
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          4. Free Trials
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions may offer free trial periods for certain
          subscription plans. During a free trial, you will have access to the
          features of the selected plan without charge. At the end of the trial
          period, your subscription will automatically convert to a paid
          subscription at the standard rate unless you cancel before the trial
          expires. You may be required to provide payment information to start a
          free trial.
        </p>

        {/* SECTION 5: Upgrades and Downgrades */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Calendar
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          5. Upgrades and Downgrades
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Upgrades:</strong> You can upgrade your subscription plan at
            any time. The upgrade will take effect immediately, and you will be
            charged a pro-rated amount for the remainder of the current billing
            cycle, reflecting the difference in plan costs.
          </li>
          <li>
            <strong>Downgrades:</strong> You can downgrade your subscription
            plan. The downgrade will typically take effect at the end of your
            current billing cycle. No refunds will be provided for the unused
            portion of a higher-tier plan.
          </li>
        </ul>

        {/* SECTION 6: Cancellation and Refunds */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <XCircle className="text-purple-500 dark:text-purple-300" size={24} />{" "}
          6. Cancellation and Refunds
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Cancellation:</strong> You can cancel your subscription at
            any time through your Supplier dashboard. Cancellation will take
            effect at the end of your current billing cycle. You will continue
            to have access to your plan's features until then.
          </li>
          <li>
            <strong>Refunds:</strong> Subscription fees are generally
            non-refundable. Refunds will only be issued in exceptional
            circumstances, such as a technical error on our part or as required
            by applicable law. No refunds will be provided for partial months or
            unused portions of a subscription term.
          </li>
        </ul>

        {/* SECTION 7: Changes to Plans and Pricing */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Info className="text-purple-500 dark:text-purple-300" size={24} /> 7.
          Changes to Plans and Pricing
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or discontinue
          any subscription plan or change its pricing at any time. We will
          provide reasonable advance notice (e.g., 30 days) of any material
          changes to existing subscribers via email or through prominent notice
          on the platform. Your continued subscription after such changes
          constitutes your acceptance of the new terms.
        </p>

        {/* SECTION 8: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Mail className="text-purple-500 dark:text-purple-300" size={24} /> 8.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding our Supplier
          Subscription Plans, please contact us:
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

export default SubscriptionPlans;
