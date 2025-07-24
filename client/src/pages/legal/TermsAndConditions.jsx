import React, { useEffect } from "react";

const TermsAndConditions = () => {
  // Scrolls to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top without smooth behavior
  }, []);

  return (
    // Main container for the terms and conditions page with responsive padding and background
    // Uses py-12 for vertical padding, and px-4 for horizontal on small screens, scaling up for sm and lg.
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      {/* Central content container with shadow and rounded corners */}
      {/* Max-w-5xl ensures readability on large screens, mx-auto centers it. */}
      {/* p-8 for padding on small screens, md:p-12 for medium and larger. */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        {/* Page title - text-4xl for large font, responsive by nature */}
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          ConnectingConstructions Terms & Conditions
        </h1>

        {/* General Introduction paragraphs */}
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Welcome to <strong>ConnectingConstructions!</strong> These Terms and
          Conditions ("Terms") govern your access to and use of the
          ConnectingConstructions website, mobile application, and related
          services (collectively, the "Service"). The Service is operated by
          ConnectingConstructions ("we," "us," or "our"), located in
          Mangalpalle, Telangana, India.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          By accessing or using the Service, you signify that you have read,
          understood, and agree to be bound by these Terms, our Privacy Policy,
          and any other guidelines, rules, or policies applicable to specific
          features of the Service, which are incorporated by reference. If you
          do not agree with any part of these Terms, you must not use the
          Service.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          We reserve the right to modify or discontinue the Service (or any part
          thereof) with or without notice at any time. We also reserve the right
          to update or change these Terms at any time. Your continued use of the
          Service after any such changes constitutes your acceptance of the new
          Terms.
        </p>

        {/* Section 1: Who We Are */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          1. Who We Are
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          ConnectingConstructions is a real-time, large-scale civil supply
          platform designed to bridge the gap between suppliers and buyers
          across India. Our platform facilitates the seamless discovery,
          procurement, and management of construction materials and services,
          from cement and steel to borewells and heavy machinery. We aim to
          streamline the supply chain, ensuring efficiency and transparency for
          all participants.
        </p>

        {/* Section 2: Acceptance of Terms */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          2. Acceptance of Terms
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          By accessing, browsing, or otherwise using the ConnectingConstructions
          web or mobile application, you acknowledge that you have read,
          understood, and agree to be bound by these Terms and Conditions, as
          well as our Privacy Policy. If you do not agree to these Terms, you
          are not authorized to use the Service. Your continued use of the
          platform after any modifications to these Terms signifies your
          acceptance of the revised Terms.
        </p>

        {/* Section 3: User Roles and Responsibilities */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          3. User Roles and Responsibilities
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Suppliers:
            </strong>{" "}
            Suppliers are responsible for creating accurate and truthful product
            listings, managing their inventory, updating pricing and
            availability in real-time, and fulfilling orders promptly. They must
            ensure that all products and services listed comply with relevant
            laws and quality standards.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Customers:
            </strong>{" "}
            Customers can browse, search, and filter product listings, submit
            inquiries, and connect directly with suppliers. Customers are
            responsible for verifying product details and ensuring their
            requirements align with the supplier's offerings before committing
            to a transaction.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Account Security:
            </strong>{" "}
            All users are responsible for maintaining the confidentiality of
            their account credentials and for all activities that occur under
            their account. You agree to notify ConnectingConstructions
            immediately of any unauthorized use of your account.
          </li>
        </ul>

        {/* Section 4: Product Listings and Orders */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          4. Product Listings and Orders
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Listing Accuracy:
            </strong>{" "}
            Suppliers are solely responsible for the authenticity, accuracy, and
            completeness of all product details, images, pricing, and
            availability information provided in their listings.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Order Fulfillment:
            </strong>{" "}
            Once an order or inquiry is confirmed between a supplier and a
            customer, the supplier is obligated to fulfill the order as per the
            agreed-upon terms. ConnectingConstructions is not a party to the
            transaction and is not responsible for the performance or
            non-performance of obligations by either party.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Disputes:
            </strong>{" "}
            Any disputes arising from transactions between suppliers and
            customers must be resolved directly between the involved parties.
            ConnectingConstructions may, at its sole discretion, offer mediation
            assistance but is not obligated to do so.
          </li>
        </ul>

        {/* Section 5: Payments */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          5. Payments and Transactions
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Currently, ConnectingConstructions facilitates the connection between
          suppliers and customers, allowing them to coordinate payments offline
          via shared contact details. We do not process payments directly on the
          platform at this time.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          We are actively working to integrate secure online payment solutions.
          Once implemented, all online payments will be processed through
          reputable third-party payment gateways. Users will be required to
          adhere to the terms and conditions of these payment gateway providers.
          ConnectingConstructions will not store full payment card details on
          its servers and will not be liable for any delays, errors, or failed
          transactions occurring on the payment gateway.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Any service fees charged by ConnectingConstructions for the use of its
          platform, if applicable, will be clearly disclosed to users prior to
          any transaction.
        </p>

        {/* Section 6: Location & Maps */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          6. Location Services and Maps
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          The ConnectingConstructions platform utilizes Google Maps API for
          real-time geolocation services to enhance user experience, such as
          displaying nearby suppliers or delivery locations. By using our
          Service, you consent to the collection and use of your location data
          for these features, in accordance with our Privacy Policy and Google's
          Terms of Service. You can manage location permissions through your
          device settings.
        </p>

        {/* Section 7: Dark Mode */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          7. Dark Mode
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This application supports both full dark mode 🌑 and light mode ☀️ to
          provide optimal viewing comfort. The app automatically detects your
          operating system's preferred theme setting, but you may also have
          options to manually switch between modes within the application
          interface.
        </p>

        {/* Section 8: Prohibited Activities */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          8. Prohibited Activities
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Users agree not to engage in any of the following prohibited
          activities:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700 dark:text-gray-300">
          <li>
            Posting fake, misleading, fraudulent, or inaccurate product listings
            or information.
          </li>
          <li>
            Engaging in hate speech, harassment, spamming, phishing, or any form
            of unsolicited commercial communications.
          </li>
          <li>
            Attempting to carry out illegal transactions or facilitating the
            sale of prohibited goods/services.
          </li>
          <li>
            Uploading or transmitting any harmful code, viruses, malware, or
            disruptive files.
          </li>
          <li>
            Attempting to gain unauthorized access to our systems, other users'
            accounts, or data.
          </li>
          <li>
            Impersonating any person or entity, or misrepresenting your
            affiliation with a person or entity.
          </li>
          <li>
            Using the Service for any illegal or unauthorized purpose, or in
            violation of any applicable local, national, or international law.
          </li>
          <li>
            Any activity that disrupts, interferes with, or negatively affects
            the integrity or performance of the Service.
          </li>
        </ul>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Violations of these prohibited activities may result in immediate
          account suspension or termination, removal of content, and/or legal
          escalation, including reporting to relevant authorities.
        </p>

        {/* Section 9: Platform Availability and Downtime */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          9. Platform Availability and Downtime
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          ConnectingConstructions is built for real-time use and strives for
          high availability. However, the Service may experience minor downtimes
          due to scheduled maintenance, unforeseen technical issues, or other
          factors beyond our control. While we endeavor to minimize disruptions,
          we do not guarantee uninterrupted access to the Service. Major updates
          or planned maintenance windows that may affect service availability
          will be communicated to users in advance through appropriate channels.
        </p>

        {/* Section 10: Modifications to Terms */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          10. Modifications to Terms
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time as we continue to scale and evolve the
          platform. If a revision is material, we will provide at least 30 days'
          notice prior to any new terms taking effect, typically through email
          notification or a prominent notice on our Service. What constitutes a
          material change will be determined at our sole discretion. By
          continuing to access or use our Service after those revisions become
          effective, you agree to be bound by the revised terms. We are
          committed to keeping our policies transparent and accessible.
        </p>

        {/* NEW SECTION: 11. Intellectual Property */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          11. Intellectual Property
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Our Content:
            </strong>{" "}
            All content and materials available on the Service, including but
            not limited to text, graphics, logos, images, software, and the
            compilation thereof (excluding User Content), are the property of
            ConnectingConstructions or its licensors and are protected by
            copyright, trademark, and other intellectual property laws. You may
            not reproduce, distribute, modify, create derivative works of,
            publicly display, publicly perform, republish, download, store, or
            transmit any of the material on our Service, except as generally
            permitted by the Service's normal functionality.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              User Content:
            </strong>{" "}
            You retain all rights in, and are solely responsible for, the
            content you submit, post, or display on or through the Service
            ("User Content"). By submitting User Content, you grant
            ConnectingConstructions a worldwide, non-exclusive, royalty-free,
            transferable, and sublicensable license to use, reproduce,
            distribute, prepare derivative works of, display, and perform the
            User Content in connection with the Service and
            ConnectingConstructions's (and its successors' and affiliates')
            business, including without limitation for promoting and
            redistributing part or all of the Service (and derivative works
            thereof) in any media formats and through any media channels. You
            represent and warrant that you have all rights necessary to grant
            these licenses.
          </li>
        </ul>

        {/* NEW SECTION: 12. Disclaimers and Limitation of Liability */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          12. Disclaimers and Limitation of Liability
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              No Endorsement:
            </strong>{" "}
            ConnectingConstructions does not endorse any specific supplier,
            customer, product, or any User Content. Any references to a
            supplier's "verification" mean only that the supplier has completed
            our registration process, not that their products or services meet
            any particular quality standards or that we endorse their business.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              "As Is" Basis:
            </strong>{" "}
            The Service is provided "as is" and "as available" without any
            warranties of any kind, either express or implied, including, but
            not limited to, implied warranties of merchantability, fitness for a
            particular purpose, non-infringement, or course of performance.
            ConnectingConstructions does not warrant that the Service will be
            uninterrupted, secure, or error-free; that defects will be
            corrected; or that the Service is free of viruses or other harmful
            components.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              No Liability for User Conduct:
            </strong>{" "}
            ConnectingConstructions is not responsible for the conduct, whether
            online or offline, of any user of the Service. You acknowledge and
            agree that you are solely responsible for your interactions with
            other users and for any transactions or agreements entered into
            through the platform.
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Limitation of Liability:
            </strong>{" "}
            To the maximum extent permitted by applicable law, in no event shall
            ConnectingConstructions, nor its directors, employees, partners,
            agents, suppliers, or affiliates, be liable for any indirect,
            incidental, special, consequential, or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from (i) your access to or use of or
            inability to access or use the Service; (ii) any conduct or content
            of any third party on the Service; (iii) any content obtained from
            the Service; and (iv) unauthorized access, use, or alteration of
            your transmissions or content, whether based on warranty, contract,
            tort (including negligence), or any other legal theory, whether or
            not we have been informed of the possibility of such damage, and
            even if a remedy set forth herein is found to have failed its
            essential purpose.
          </li>
        </ul>

        {/* NEW SECTION: 13. Indemnification */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          13. Indemnification
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          You agree to defend, indemnify, and hold harmless
          ConnectingConstructions and its licensee and licensors, and their
          employees, contractors, agents, officers, and directors, from and
          against any and all claims, damages, obligations, losses, liabilities,
          costs or debt, and expenses (including but not limited to attorney's
          fees), resulting from or arising out of a) your use and access of the
          Service, by you or any person using your account and password; b) a
          breach of these Terms; or c) Content posted on the Service.
        </p>

        {/* NEW SECTION: 14. Governing Law and Dispute Resolution */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          14. Governing Law and Dispute Resolution
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          These Terms shall be governed and construed in accordance with the
          laws of India, specifically the laws of the State of Telangana,
          without regard to its conflict of law provisions.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Any dispute arising out of or in connection with these Terms,
          including any question regarding its existence, validity, or
          termination, shall be referred to and finally resolved by arbitration
          in Mangalpalle, Telangana, India, in accordance with the provisions of
          the Arbitration and Conciliation Act, 1996, as amended. The language
          of the arbitration shall be English. The decision of the arbitrator(s)
          shall be final and binding on both parties.
        </p>

        {/* NEW SECTION: 15. Severability */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          15. Severability
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          If any provision of these Terms is held to be invalid or unenforceable
          by a court, the remaining provisions of these Terms will remain in
          effect. These Terms constitute the entire agreement between us
          regarding our Service, and supersede and replace any prior agreements
          we might have had between us regarding the Service.
        </p>

        {/* NEW SECTION: 16. Entire Agreement */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          16. Entire Agreement
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          These Terms and Conditions, together with our Privacy Policy and any
          other legal notices published by us on the Service, constitute the
          entire agreement between you and ConnectingConstructions concerning
          the Service.
        </p>

        {/* Section 17: Contact Us */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          17. Contact Us
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          If you have any questions about these Terms, please contact us:
        </p>
        <p className="mb-2">
          <strong className="text-gray-900 dark:text-white">Email:</strong>{" "}
          <a
            href="mailto:support@connectingconstructions.com"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            anilnunnagopula15@gmail.com
          </a>
        </p>
        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-white">Address:</strong>{" "}
          ConnectingConstructions - Mangalpalle, Telangana, India
        </p>

        {/* Last updated date */}
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July, 2025
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
