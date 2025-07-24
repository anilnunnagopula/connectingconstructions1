import React, { useEffect } from "react";
import {
  Link, // Main icon for affiliation/connection
  DollarSign, // For revenue/commission
  Users, // For partners/community
  CheckCircle, // For eligibility/approval
  Mail, // For contact
  Info, // For changes to policy
  AlertTriangle, // For prohibited activities
  ClipboardList, // For marketing guidelines
  XCircle, // For termination
} from "lucide-react"; // Importing icons

const AffiliateRevenueProgram = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Link className="text-teal-600 dark:text-teal-400" size={36} />{" "}
          ConnectingConstructions Affiliate Revenue Program
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Affiliate Revenue Program Policy outlines the terms and
          conditions for individuals and entities ("Affiliates," "you," or
          "your") to partner with <strong>ConnectingConstructions</strong> and
          earn commissions by referring customers or suppliers to our platform.
          This program is designed to foster collaborations and expand our
          community within the construction industry.
        </p>

        {/* SECTION 1: Program Overview */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Users className="text-teal-500 dark:text-teal-300" size={24} /> 1.
          Program Overview
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          The ConnectingConstructions Affiliate Revenue Program allows approved
          Affiliates to earn a commission on qualifying sales or sign-ups
          generated through their unique referral links. Our goal is to reward
          partners who help us grow our user base and facilitate more
          connections in the construction sector.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Referral-Based:</strong> Earn by directing traffic that
            results in specific actions (e.g., customer purchases, supplier
            subscriptions).
          </li>
          <li>
            <strong>Tracking:</strong> All referrals are tracked using unique
            affiliate links and cookies.
          </li>
          <li>
            <strong>Transparency:</strong> Performance and earnings are
            accessible through a dedicated Affiliate dashboard.
          </li>
        </ul>

        {/* SECTION 2: Eligibility and Application */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <CheckCircle className="text-teal-500 dark:text-teal-300" size={24} />{" "}
          2. Eligibility and Application
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          To become an Affiliate, you must:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Be at least 18 years old.</li>
          <li>
            Have a website, blog, social media presence, or other legitimate
            marketing channels that align with the construction industry and our
            brand values.
          </li>
          <li>Complete the Affiliate Program application form.</li>
          <li>
            Agree to all terms outlined in this policy and our general{" "}
            <a
              href="/legal/termsandconditions"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Terms & Conditions
            </a>
            .
          </li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to approve or reject any
          application at its sole discretion.
        </p>

        {/* SECTION 3: Commission Structure */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <DollarSign className="text-teal-500 dark:text-teal-300" size={24} />{" "}
          3. Commission Structure
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Affiliates earn a commission on qualifying actions. The specific
          commission rates and qualifying actions (e.g., percentage of a product
          sale, fixed amount for a new supplier subscription) will be detailed
          in your Affiliate dashboard and may vary based on campaign or product
          category.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Cookie Duration:</strong> A cookie duration of [e.g., 30
            days] typically applies, meaning you earn commission if the referred
            user completes a qualifying action within this period after clicking
            your link.
          </li>
          <li>
            <strong>Qualifying Actions:</strong> These may include successful
            product purchases, paid supplier subscriptions, or other defined
            actions.
          </li>
          <li>
            <strong>Exclusions:</strong> Commissions are not paid on returned,
            refunded, or cancelled orders/subscriptions. Self-referrals are also
            not eligible.
          </li>
        </ul>

        {/* SECTION 4: Payment Terms */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <DollarSign className="text-teal-500 dark:text-teal-300" size={24} />{" "}
          4. Payment Terms
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Payout Schedule:</strong> Commissions are typically paid out
            on a [Monthly/Bi-monthly] basis, after a reconciliation period to
            account for returns/cancellations.
          </li>
          <li>
            <strong>Minimum Payout Threshold:</strong> A minimum payout
            threshold of [e.g., INR 1000 / $20] applies. Earnings below this
            threshold will roll over to the next payment cycle.
          </li>
          <li>
            <strong>Payment Method:</strong> Payouts are made via [e.g., bank
            transfer, UPI] to the bank account provided in your Affiliate
            profile. It is your responsibility to ensure accurate payment
            details.
          </li>
          <li>
            <strong>Taxes:</strong> Affiliates are responsible for all
            applicable taxes on their earnings. ConnectingConstructions may be
            required to withhold taxes as per Indian tax laws.
          </li>
        </ul>

        {/* SECTION 5: Marketing Guidelines and Prohibited Activities */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-teal-500 dark:text-teal-300"
            size={24}
          />{" "}
          5. Marketing Guidelines and Prohibited Activities
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Affiliates must adhere to ethical marketing practices. Prohibited
          activities include, but are not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Spamming (unsolicited emails, messages).</li>
          <li>Misleading or false advertising.</li>
          <li>Using fraudulent means to generate clicks or sales.</li>
          <li>
            Bidding on ConnectingConstructions brand keywords in paid search
            campaigns without explicit permission.
          </li>
          <li>Any activity that violates applicable laws or regulations.</li>
          <li>
            Using ConnectingConstructions' intellectual property (logos,
            trademarks) without proper authorization.
          </li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          Violation of these guidelines may lead to immediate termination from
          the program and forfeiture of earned commissions.
        </p>

        {/* SECTION 6: Termination */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <XCircle className="text-teal-500 dark:text-teal-300" size={24} /> 6.
          Termination
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>By Affiliate:</strong> You may terminate your participation
            in the program at any time by notifying us.
          </li>
          <li>
            <strong>By ConnectingConstructions:</strong> We may terminate your
            participation immediately if you breach this Agreement or for any
            other reason at our sole discretion, with or without notice.
          </li>
          <li>
            <strong>Effect of Termination:</strong> Upon termination, you will
            cease to earn commissions. Any legitimate, outstanding earnings will
            be paid out after a final reconciliation.
          </li>
        </ul>

        {/* SECTION 7: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Info className="text-teal-500 dark:text-teal-300" size={24} /> 7.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Affiliate Revenue Program Policy at any time. We will notify
          Affiliates of any material changes by posting the updated Policy on
          this page and updating the "Last updated" date. Your continued
          participation in the program after such modifications constitutes your
          acceptance of the revised Policy.
        </p>

        {/* SECTION 8: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-teal-200 dark:border-teal-700 pb-3 flex items-center gap-2">
          <Mail className="text-teal-500 dark:text-teal-300" size={24} /> 8.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding our Affiliate Revenue
          Program, please contact us:
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

export default AffiliateRevenueProgram;
