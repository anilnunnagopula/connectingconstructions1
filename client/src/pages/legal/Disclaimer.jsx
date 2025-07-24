import React, { useEffect } from "react";
import {
  Info, // For general information and changes
  ClipboardList, // For accuracy/content
  Lightbulb, // For professional advice
  Link, // For third-party links
  Scale, // For limitation of liability
  Mail, // For contact information
  Gavel, // For the main disclaimer icon
} from "lucide-react"; // Importing icons

const Disclaimer = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Gavel className="text-purple-600 dark:text-purple-400" size={36} />{" "}
          ConnectingConstructions Disclaimer
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          The information provided by <strong>ConnectingConstructions</strong>{" "}
          (“we,” “us,” or “our”) on our website(the “Service”) and our mobile application is for general
          informational purposes only. All information on the Service is
          provided in good faith, however, we make no representation or warranty
          of any kind, express or implied, regarding the accuracy, adequacy,
          validity, reliability, availability, or completeness of any
          information on the Service.
        </p>

        {/* SECTION 1: General Information */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Info className="text-purple-500 dark:text-purple-300" size={24} /> 1.
          General Information
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          The content on ConnectingConstructions is intended to provide a
          platform for connecting construction professionals, suppliers, and
          customers. While we strive to offer a valuable service, the
          information presented should not be taken as comprehensive or
          definitive for all situations.
        </p>

        {/* SECTION 2: Accuracy of Information */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          2. Accuracy of Information
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We do our best to ensure that the information on our platform,
          including supplier listings, product details, and project
          requirements, is accurate and up-to-date. However,
          ConnectingConstructions does not guarantee the complete accuracy or
          reliability of any information provided by users or third parties.
          Users are advised to independently verify any critical information,
          especially concerning business transactions, product specifications,
          or service quality, before making decisions.
        </p>

        {/* SECTION 3: Not Professional Advice */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Lightbulb
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          3. Not Professional Advice
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          The information on ConnectingConstructions is not intended as, and
          shall not be understood or construed as, professional advice (e.g.,
          legal, financial, engineering, construction, or technical advice). Our
          Service is a connecting platform and does not provide professional
          consulting services. You should consult with a qualified professional
          for advice tailored to your specific situation.
        </p>

        {/* SECTION 4: External Links Disclaimer */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Link className="text-purple-500 dark:text-purple-300" size={24} /> 4.
          External Links Disclaimer
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Our Service may contain links to external websites that are not
          provided or maintained by or in any way affiliated with
          ConnectingConstructions. Please note that ConnectingConstructions does
          not guarantee the accuracy, relevance, timeliness, or completeness of
          any information on these external websites. The inclusion of any links
          does not necessarily imply a recommendation or endorse the views
          expressed within them.
        </p>

        {/* SECTION 5: Limitation of Liability */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Scale className="text-purple-500 dark:text-purple-300" size={24} />{" "}
          5. Limitation of Liability
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          In no event shall ConnectingConstructions, nor its directors,
          employees, partners, agents, suppliers, or affiliates, be liable for
          any indirect, incidental, special, consequential or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses, resulting from (i) your access to or use of
          or inability to access or use the Service; (ii) any conduct or content
          of any third party on the Service; (iii) any content obtained from the
          Service; and (iv) unauthorized access, use or alteration of your
          transmissions or content, whether based on warranty, contract, tort
          (including negligence) or any other legal theory, whether or not we
          have been informed of the possibility of such damage, and even if a
          remedy set forth herein is found to have failed of its essential
          purpose.
        </p>

        {/* SECTION 6: "As Is" and "As Available" Disclaimer */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Info className="text-purple-500 dark:text-purple-300" size={24} /> 6.
          "As Is" and "As Available" Disclaimer
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          The Service is provided to you "AS IS" and "AS AVAILABLE" and with all
          faults and defects without warranty of any kind. To the maximum extent
          permitted under applicable law, ConnectingConstructions, on its own
          behalf and on behalf of its affiliates and its and their respective
          licensors and service providers, expressly disclaims all warranties,
          whether express, implied, statutory or otherwise, with respect to the
          Service, including all implied warranties of merchantability, fitness
          for a particular purpose, title and non-infringement, and warranties
          that may arise out of course of dealing, course of performance, usage
          or trade practice. Without limitation to the foregoing,
          ConnectingConstructions provides no warranty or undertaking, and makes
          no representation of any kind that the Service will meet your
          requirements, achieve any intended results, be compatible or work with
          any other software, applications, systems or services, operate without
          interruption, meet any performance or reliability standards or be
          error free or that any errors or defects can or will be corrected.
        </p>

        {/* SECTION 7: Changes to This Disclaimer */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Info className="text-purple-500 dark:text-purple-300" size={24} /> 7.
          Changes to This Disclaimer
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We may update our Disclaimer from time to time. We will notify you of
          any changes by posting the new Disclaimer on this page and updating
          the "Last updated" date. We advise you to review this Disclaimer
          periodically for any changes.
        </p>

        {/* SECTION 8: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Mail className="text-purple-500 dark:text-purple-300" size={24} /> 8.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns about this Disclaimer, please
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

export default Disclaimer;
