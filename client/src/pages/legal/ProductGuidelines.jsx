import React, { useEffect } from "react";
import {
  Package, // Main icon for products
  CheckCircle, // General Standards, Quality Control
  ClipboardList, // Listing Accuracy
  Ban, // Prohibited Products
  Sparkles, // Intellectual Property
  ShieldCheck, // Safety & Compliance
  Box, // Packaging & Labeling
  AlertTriangle, // Enforcement
  Info, // Changes to Guidelines
  Mail, // Contact
} from "lucide-react"; // Importing icons

const ProductGuidelines = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Package className="text-indigo-600 dark:text-indigo-400" size={36} />{" "}
          ConnectingConstructions Product Guidelines
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          These Product Guidelines ("Guidelines") outline the standards and
          requirements for all products and services ("Products") listed and
          offered by suppliers ("Suppliers") on the{" "}
          <strong>ConnectingConstructions</strong> platform. By listing your
          Products on our Service, you agree to adhere to these Guidelines,
          ensuring a high-quality, safe, and transparent marketplace for all
          users.
        </p>

        {/* SECTION 1: General Standards */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          1. General Standards
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Quality:</strong> All Products must be of high quality, free
            from defects, and fit for their intended purpose. They must meet or
            exceed industry standards where applicable.
          </li>
          <li>
            <strong>Safety:</strong> Products must be safe for use and comply
            with all relevant safety regulations and standards.
          </li>
          <li>
            <strong>Legality:</strong> All Products must be legal to sell and
            distribute in the jurisdictions where they are offered.
          </li>
          <li>
            <strong>Authenticity:</strong> Products must be genuine and as
            described. Counterfeit or misrepresented goods are strictly
            prohibited.
          </li>
        </ul>

        {/* SECTION 2: Listing Accuracy & Completeness */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <ClipboardList
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          2. Listing Accuracy & Completeness
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Suppliers are responsible for providing accurate and comprehensive
          information for all Product listings:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Descriptions:</strong> Product descriptions must be clear,
            concise, and accurately reflect the item's features, materials,
            dimensions, and functionality. Avoid misleading or exaggerated
            claims.
          </li>
          <li>
            <strong>Images/Videos:</strong> High-quality, clear images or videos
            that accurately represent the Product are required. Do not use
            generic stock photos that do not depict the actual item.
          </li>
          <li>
            <strong>Specifications:</strong> Provide all relevant technical
            specifications, certifications (if applicable), and compatibility
            information.
          </li>
          <li>
            <strong>Pricing:</strong> Prices must be clearly stated and match
            the actual selling price, inclusive of all mandatory taxes (e.g.,
            GST) unless otherwise specified according to our Pricing Policy.
          </li>
          <li>
            <strong>Availability:</strong> Maintain accurate inventory levels
            and ensure listed Products are available for purchase and delivery
            within stated timelines.
          </li>
        </ul>

        {/* SECTION 3: Prohibited Products/Services */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Ban className="text-indigo-500 dark:text-indigo-300" size={24} /> 3.
          Prohibited Products/Services
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          The following categories of products and services are strictly
          prohibited from being listed on ConnectingConstructions:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Illegal or regulated substances and related paraphernalia.</li>
          <li>Weapons, firearms, ammunition, and related accessories.</li>
          <li>
            Hazardous materials or substances without proper certification and
            handling procedures.
          </li>
          <li>
            Items that promote hate, violence, discrimination, or illegal
            activities.
          </li>
          <li>Stolen goods or goods obtained illegally.</li>
          <li>
            Counterfeit products or products that infringe on intellectual
            property rights.
          </li>
          <li>Services that are illegal or promote illegal activities.</li>
          <li>
            Products or services that are culturally insensitive or offensive.
          </li>
          <li>
            Any other products or services deemed inappropriate or unsafe by
            ConnectingConstructions in its sole discretion.
          </li>
        </ul>

        {/* SECTION 4: Intellectual Property */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Sparkles
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          4. Intellectual Property
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Suppliers must ensure that all Products and content (descriptions,
          images, brand names) listed do not infringe upon any third-party
          intellectual property rights, including copyrights, trademarks,
          patents, and trade secrets. You must have the necessary rights or
          licenses to sell and list all Products. ConnectingConstructions
          reserves the right to remove listings and suspend accounts that are
          found to be in violation of intellectual property laws.
        </p>

        {/* SECTION 5: Safety & Compliance */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <ShieldCheck
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          5. Safety & Compliance
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Suppliers are solely responsible for ensuring that their Products
          comply with all relevant safety standards, certifications, and
          regulatory requirements in the regions where they are sold. This
          includes, but is not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Product safety testing and certifications.</li>
          <li>Environmental regulations.</li>
          <li>
            Specific industry standards (e.g., for construction materials).
          </li>
          <li>
            Providing all necessary safety warnings and instructions to
            customers.
          </li>
        </ul>

        {/* SECTION 6: Packaging & Labeling */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Box className="text-indigo-500 dark:text-indigo-300" size={24} /> 6.
          Packaging & Labeling
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Products must be securely and appropriately packaged to prevent damage
          during transit. All packaging and labeling must comply with applicable
          laws and clearly display necessary information such as product name,
          manufacturer, weight/quantity, and any safety warnings.
        </p>

        {/* SECTION 7: Quality Control & Inspections */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          7. Quality Control & Inspections
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions may, at its discretion, conduct random quality
          checks or require Suppliers to provide proof of quality control
          measures for their listed Products. Failure to meet quality
          expectations may result in warnings, temporary suspension, or
          permanent removal from the platform.
        </p>

        {/* SECTION 8: Enforcement & Consequences */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-indigo-500 dark:text-indigo-300"
            size={24}
          />{" "}
          8. Enforcement & Consequences
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Failure to comply with these Product Guidelines may result in various
          actions, including but not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Temporary suspension or permanent removal of specific product
            listings.
          </li>
          <li>
            Temporary suspension or permanent termination of your Supplier
            account.
          </li>
          <li>Withholding of payments for non-compliant orders.</li>
          <li>Legal action, if applicable.</li>
        </ul>

        {/* SECTION 9: Changes to These Guidelines */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Info className="text-indigo-500 dark:text-indigo-300" size={24} /> 9.
          Changes to These Guidelines
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update these
          Product Guidelines at any time. We will notify Suppliers of any
          material changes by posting the updated Guidelines on this page and
          updating the "Last updated" date. Your continued use of the Service
          after such modifications constitutes your acceptance of the revised
          Guidelines.
        </p>

        {/* SECTION 10: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-indigo-200 dark:border-indigo-700 pb-3 flex items-center gap-2">
          <Mail className="text-indigo-500 dark:text-indigo-300" size={24} />{" "}
          10. Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or require clarification regarding these
          Product Guidelines, please contact us:
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

export default ProductGuidelines;
