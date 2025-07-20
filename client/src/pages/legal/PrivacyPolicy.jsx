import React, { useEffect } from "react";
import {
  Shield,
  User,
  Globe,
  Lock,
  SlidersHorizontal,
  Info,
  Handshake,
  ScrollText,
  Mail,
  Users,
  Scale,
} from "lucide-react"; // Importing icons

const PrivacyPolicy = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-850 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Shield className="text-blue-600 dark:text-blue-400" size={36} />{" "}
          ConnectingConstructions Privacy Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Privacy Policy outlines how{" "}
          <strong>ConnectingConstructions</strong> (“we,” “us,” “our”) collects,
          uses, discloses, and protects your personal information when you use
          our platform — including our website, mobile app, and any related
          services (“Service”). We are committed to protecting your privacy and
          ensuring a secure and transparent experience.
        </p>

        {/* SECTION 1: What Data We Collect */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <User className="text-blue-500 dark:text-blue-300" size={24} /> 1.
          What Data We Collect
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          To provide and improve our services, we collect various types of
          information:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Personal Identification Information:</strong> This includes
            your name, phone number, email address, physical address, and any
            other contact details you provide during registration or profile
            setup.
          </li>
          <li>
            <strong>Supplier/Vendor Specific Information:</strong> For our
            business users (suppliers and vendors), we collect business details,
            Goods and Services Tax Identification Number (GSTIN), product or
            service listings, pricing data, and other relevant commercial
            information.
          </li>
          <li>
            <strong>Location Data:</strong> With your explicit consent, we may
            collect precise or approximate location information (e.g., via GPS
            from your mobile device or IP address). This data is primarily used
            through integrations like Google Maps API to facilitate services
            such as finding nearby suppliers, providing directions, and
            optimizing delivery logistics.
          </li>
          <li>
            <strong>Device and Usage Data:</strong> We automatically collect
            information about how you access and use our Service, including your
            IP address, browser type, operating system, unique device
            identifiers, pages viewed, session duration, referral sources, and
            interaction patterns. This helps us understand user behavior and
            improve our platform.
          </li>
          <li>
            <strong>Communication and Support Data:</strong> Records of your
            interactions with our customer support, including customer queries,
            feedback, chat logs, and support history, are collected to provide
            assistance and improve our service quality.
          </li>
          <li>
            <strong>Transaction Data:</strong> If payment services are
            integrated (e.g., via Razorpay), we collect details related to
            transactions you conduct on our platform, but we do not store your
            full payment card details. This may include transaction amounts,
            dates, and payment method types.
          </li>
        </ul>

        {/* SECTION 2: How We Use Your Data */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Globe className="text-blue-500 dark:text-blue-300" size={24} /> 2.
          How We Use Your Data
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Your information is used to provide, maintain, and improve our
          Service, as well as to develop new features:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Service Provision:</strong> To operate, maintain, and
            provide the core functionalities of ConnectingConstructions,
            including enabling user accounts, processing requests, and
            facilitating connections.
          </li>
          <li>
            <strong>Connecting Users:</strong> To effectively connect customers
            with relevant nearby suppliers or service providers based on their
            needs and location.
          </li>
          <li>
            <strong>Service Improvement:</strong> To analyze usage patterns,
            troubleshoot issues, and improve the overall user interface (UI),
            user experience (UX), performance, and security of our platform.
          </li>
          <li>
            <strong>Customer Support:</strong> To respond to your inquiries,
            provide technical support, and address any issues or concerns you
            may have.
          </li>
          <li>
            <strong>Communication:</strong> To send you essential transactional
            messages, service announcements, platform updates, security alerts,
            and administrative notices.
          </li>
          <li>
            <strong>Legal Compliance:</strong> To comply with applicable laws,
            regulations, and legal processes, and to enforce our terms of
            service.
          </li>
        </ul>

        {/* SECTION 3: Who We Share Data With */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Handshake className="text-blue-500 dark:text-blue-300" size={24} />{" "}
          3. Who We Share Data With
        </h2>
        <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
          We value your privacy. We do <strong>not</strong> sell your personal
          data to third parties. However, we may share your information in the
          following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>With Verified Partners:</strong> Your information (such as
            contact details or project requirements) may be shared with verified
            suppliers or service providers *only with your explicit consent*
            when you initiate a request or inquiry that requires such sharing.
          </li>
          <li>
            <strong>Third-Party Service Providers:</strong> We engage trusted
            third-party services to perform functions on our behalf, such as
            hosting, data analysis, payment processing (e.g., Razorpay for
            secure transactions, where applicable), and location services (e.g.,
            Google Maps API for mapping and navigation). These providers have
            access to personal information only to perform their functions and
            are obligated not to disclose or use it for other purposes.
          </li>
          <li>
            <strong>Legal Requirements and Protection:</strong> We may disclose
            your information if required to do so by law or in the good faith
            belief that such action is necessary to comply with a legal
            obligation, protect and defend our rights or property, prevent
            fraud, or protect the personal safety of users or the public.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger,
            acquisition, or asset sale, your personal information may be
            transferred as part of the transaction. We will notify you via email
            and/or a prominent notice on our Service of any change in ownership
            or uses of your personal information.
          </li>
        </ul>

        {/* SECTION 4: Cookies & Tracking */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <SlidersHorizontal
            className="text-blue-500 dark:text-blue-300"
            size={24}
          />{" "}
          4. Cookies & Tracking
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Our platform utilizes cookies and similar tracking technologies (like
          web beacons and pixels) to enhance user experience, remember your
          preferences, analyze usage patterns, and gather demographic
          information. Cookies are small data files stored on your device. You
          have the option to accept or refuse cookies and know when a cookie is
          being sent to your device. If you choose to refuse our cookies, you
          may not be able to use some portions of our Service. For more detailed
          information, please refer to our dedicated{" "}
          <a
            href="/cookie-policy"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Cookie Policy
          </a>
          .
        </p>

        {/* SECTION 5: Data Security */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Lock className="text-blue-500 dark:text-blue-300" size={24} /> 5.
          Data Security
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We are committed to protecting your data. We implement a variety of
          robust security measures, including encryption (e.g., SSL/TLS for data
          in transit), secure server infrastructure, access controls, and
          regular security audits, to safeguard your personal information
          against unauthorized access, alteration, disclosure, or destruction.
          While we strive to use commercially acceptable means to protect your
          personal information, no method of transmission over the Internet or
          method of electronic storage is 100% secure. Therefore, we cannot
          guarantee its absolute security.
        </p>

        {/* SECTION 6: Your Rights */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Info className="text-blue-500 dark:text-blue-300" size={24} /> 6.
          Your Rights
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          You have certain rights regarding your personal data:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Access:</strong> You have the right to request access to the
            personal data we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> You can request the correction of any
            inaccurate or incomplete data.
          </li>
          <li>
            <strong>Deletion:</strong> You can request the deletion of your
            personal data, subject to certain legal obligations we may have to
            retain it.
          </li>
          <li>
            <strong>Withdraw Consent:</strong> Where we rely on your consent to
            process your personal data, you have the right to withdraw that
            consent at any time. This will not affect the lawfulness of
            processing based on consent before its withdrawal.
          </li>
        </ul>
        <p className="text-base mt-4 text-gray-700 dark:text-gray-300">
          To exercise any of these rights, please contact us using the details
          provided in the "Contact Us" section. We may require you to verify
          your identity before responding to such requests.
        </p>

        {/* SECTION 7: Data Retention */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <ScrollText className="text-blue-500 dark:text-blue-300" size={24} />{" "}
          7. Data Retention
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We retain your personal data for as long as necessary to fulfill the
          purposes for which it was collected, including for the purposes of
          satisfying any legal, accounting, or reporting requirements. When your
          personal data is no longer required, we will securely delete or
          anonymize it. You can request deletion of your account and associated
          data by contacting our support team.
        </p>

        {/* SECTION 8: Children's Privacy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Users className="text-blue-500 dark:text-blue-300" size={24} /> 8.
          Children's Privacy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Our Service is not intended for individuals under the age of 18. We do
          not knowingly collect personally identifiable information from
          children under 18. If you are a parent or guardian and you are aware
          that your child has provided us with personal data, please contact us.
          If we become aware that we have collected personal data from children
          without verification of parental consent, we take steps to remove that
          information from our servers.
        </p>

        {/* SECTION 9: Third-Party Services */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Globe className="text-blue-500 dark:text-blue-300" size={24} /> 9.
          Third-Party Services
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Our platform may contain links to third-party websites or services
          that are not operated by us. We have no control over and assume no
          responsibility for the content, privacy policies, or practices of any
          third-party sites or services. We strongly advise you to review the
          Privacy Policy of every site you visit.
        </p>

        {/* SECTION 10: Governing Law */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Scale className="text-blue-500 dark:text-blue-300" size={24} /> 10.
          Governing Law
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          This Privacy Policy shall be governed by and construed in accordance
          with the laws of India, without regard to its conflict of law
          provisions. Any disputes arising under or in connection with this
          Privacy Policy shall be subject to the exclusive jurisdiction of the
          courts located in Telangana, India.
        </p>

        {/* SECTION 11: Changes to This Privacy Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Info className="text-blue-500 dark:text-blue-300" size={24} /> 11.
          Changes to This Privacy Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date. We will also inform you via email
          and/or a prominent notice on our Service prior to the change becoming
          effective, if the changes are material. You are advised to review this
          Privacy Policy periodically for any changes. Continued use of the
          Service after any modifications to this Privacy Policy will constitute
          your acknowledgment of the modifications and your consent to abide and
          be bound by the modified Privacy Policy.
        </p>

        {/* SECTION 12: Consent */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Handshake className="text-blue-500 dark:text-blue-300" size={24} />{" "}
          12. Your Consent
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          By using our Service, you hereby consent to our Privacy Policy and
          agree to its terms. If you do not agree with this policy, please do
          not use our Service.
        </p>

        {/* SECTION 13: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-3 flex items-center gap-2">
          <Mail className="text-blue-500 dark:text-blue-300" size={24} /> 13.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns about this Privacy Policy,
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

export default PrivacyPolicy;
