import React, { useEffect } from "react";
import {
  Scale, // Main icon for fairness/balance
  Brain, // For algorithms/AI
  Users, // For impact on users
  CheckCircle, // For principles/commitments
  Eye, // For transparency
  ShieldCheck, // For accountability
  Info, // For changes to policy
  Mail, // For contact
} from "lucide-react"; // Importing icons

const AlgorithmicFairnessPolicy = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Scale className="text-green-600 dark:text-green-400" size={36} />{" "}
          ConnectingConstructions Algorithmic Fairness Policy
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This Algorithmic Fairness Policy outlines{" "}
          <strong>ConnectingConstructions'</strong> commitment to developing and
          deploying artificial intelligence (AI) and algorithmic systems that
          are fair, unbiased, and equitable for all users on our platform. We
          believe that technology should serve everyone fairly, without
          perpetuating or amplifying existing societal biases.
        </p>

        {/* SECTION 1: Our Commitment to Fairness */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <CheckCircle
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          1. Our Commitment to Fairness
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          ConnectingConstructions is committed to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Bias Mitigation:</strong> Actively working to identify and
            mitigate biases in our data, algorithms, and models to ensure
            equitable outcomes.
          </li>
          <li>
            <strong>Transparency:</strong> Striving for transparency in how our
            algorithms work and how they impact user experiences.
          </li>
          <li>
            <strong>Accountability:</strong> Establishing clear lines of
            responsibility for algorithmic design, deployment, and monitoring.
          </li>
          <li>
            <strong>User Empowerment:</strong> Providing users with information
            and controls where appropriate regarding AI-driven features.
          </li>
        </ul>

        {/* SECTION 2: Principles of Algorithmic Fairness */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Brain className="text-green-500 dark:text-green-300" size={24} /> 2.
          Principles of Algorithmic Fairness
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Our approach to algorithmic fairness is guided by the following
          principles:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Equitable Treatment:</strong> Algorithms should treat
            individuals and groups fairly, without discrimination based on
            protected characteristics (e.g., gender, religion, caste, location,
            or other socio-economic factors).
          </li>
          <li>
            <strong>Representative Data:</strong> We strive to use diverse and
            representative datasets for training our AI models to minimize
            inherent biases.
          </li>
          <li>
            <strong>Regular Audits:</strong> Our algorithms and their outputs
            are regularly audited and tested for fairness and potential biases.
          </li>
          <li>
            <strong>Human Oversight:</strong> Critical algorithmic decisions are
            subject to human review and oversight to ensure alignment with our
            fairness objectives.
          </li>
        </ul>

        {/* SECTION 3: Areas of Algorithmic Application and Impact */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Users className="text-green-500 dark:text-green-300" size={24} /> 3.
          Areas of Algorithmic Application and Impact
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Our algorithms play a role in various aspects of the platform,
          including:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Search and Recommendation Systems:</strong> Determining the
            order of search results, recommended products, suppliers, or
            services. Our{" "}
            <a
              href="/legal/transparentrecommendationlogic"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Transparent Recommendation Logic
            </a>{" "}
            provides further details.
          </li>
          <li>
            <strong>Supplier Matching:</strong> Connecting customers with
            suitable suppliers based on various criteria.
          </li>
          <li>
            <strong>Content Moderation:</strong> Identifying and addressing
            inappropriate or non-compliant content.
          </li>
          <li>
            <strong>Fraud Detection:</strong> Flagging suspicious activities to
            protect users.
          </li>
        </ul>

        {/* SECTION 4: Bias Detection and Mitigation */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Eye className="text-green-500 dark:text-green-300" size={24} /> 4.
          Bias Detection and Mitigation
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We employ various strategies to detect and mitigate algorithmic bias:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Data Auditing:</strong> Regular review of training data for
            representativeness and potential biases.
          </li>
          <li>
            <strong>Fairness Metrics:</strong> Utilizing specific fairness
            metrics to evaluate algorithmic performance across different user
            groups.
          </li>
          <li>
            <strong>A/B Testing:</strong> Conducting controlled experiments to
            assess the impact of algorithmic changes on different user segments.
          </li>
          <li>
            <strong>Feedback Loops:</strong> Incorporating user feedback and
            grievance redressal mechanisms to identify and address fairness
            concerns.
          </li>
        </ul>

        {/* SECTION 5: Transparency and Explainability */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Eye className="text-green-500 dark:text-green-300" size={24} /> 5.
          Transparency and Explainability
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          While the complexity of AI models can make full explainability
          challenging, we are committed to providing transparency where
          feasible. We aim to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Clearly label AI-generated content or recommendations.</li>
          <li>
            Provide explanations for key algorithmic decisions where
            appropriate.
          </li>
          <li>Educate users on how our smart features work.</li>
        </ul>

        {/* SECTION 6: Accountability and Oversight */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <ShieldCheck
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          6. Accountability and Oversight
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions maintains internal governance structures and
          processes to ensure accountability for our algorithmic systems. This
          includes:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Dedicated teams responsible for AI ethics and fairness.</li>
          <li>
            Regular internal reviews and external audits of our AI systems.
          </li>
          <li>Mechanisms for users to report perceived unfairness or bias.</li>
        </ul>

        {/* SECTION 7: Changes to This Policy */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Info className="text-green-500 dark:text-green-300" size={24} /> 7.
          Changes to This Policy
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          Algorithmic Fairness Policy at any time. We will notify you of any
          material changes by posting the updated Policy on this page and
          updating the "Last updated" date. Your continued use of the Service
          after such modifications constitutes your acceptance of the revised
          Policy.
        </p>

        {/* SECTION 8: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Mail className="text-green-500 dark:text-green-300" size={24} /> 8.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding our Algorithmic
          Fairness Policy, please contact us:
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

export default AlgorithmicFairnessPolicy;
