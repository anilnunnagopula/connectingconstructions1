import React, { useEffect } from "react";
import {
  Brain, // Main icon for AI/Insights
  Info, // For general disclaimers, changes
  AlertTriangle, // For limitations, warnings
  User, // For user responsibility
  Mail, // For contact
  Lightbulb, // For nature of insights
} from "lucide-react"; // Importing icons

const AIGeneratedInsightsDisclaimer = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <Brain className="text-purple-600 dark:text-purple-400" size={36} />{" "}
          ConnectingConstructions AI-generated Insights Disclaimer
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          This AI-generated Insights Disclaimer ("Disclaimer") clarifies the
          nature and limitations of insights, recommendations, and data analyses
          ("Insights") provided by artificial intelligence (AI) models on the{" "}
          <strong>ConnectingConstructions</strong> platform. By utilizing our
          AI-powered features, you acknowledge and agree to the terms outlined
          herein.
        </p>

        {/* SECTION 1: Nature of AI-generated Insights */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Lightbulb
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          1. Nature of AI-generated Insights
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Our platform leverages advanced AI and machine learning algorithms to
          process vast amounts of data, identify patterns, and generate
          insights. These Insights are designed to assist users in making
          informed decisions by providing:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Market trends and demand forecasts.</li>
          <li>Supplier performance analysis.</li>
          <li>Project cost estimations.</li>
          <li>Material recommendations.</li>
          <li>
            Other data-driven observations relevant to the construction
            industry.
          </li>
        </ul>
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
          These Insights are generated based on the data available to our AI
          models at a given time and are intended to be supplementary tools, not
          definitive statements or guarantees.
        </p>

        {/* SECTION 2: Limitations of AI Insights */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <AlertTriangle
            className="text-purple-500 dark:text-purple-300"
            size={24}
          />{" "}
          2. Limitations of AI Insights
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          While our AI models strive for accuracy, it is important to understand
          their inherent limitations:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Data Dependency:</strong> Insights are only as good as the
            data they are trained on. Inaccurate, incomplete, or biased input
            data can lead to inaccurate or biased outputs.
          </li>
          <li>
            <strong>Not Real-time:</strong> Some data used for insights may not
            be real-time, leading to potential discrepancies with rapidly
            changing market conditions.
          </li>
          <li>
            <strong>Probabilistic Nature:</strong> AI models generate
            predictions and recommendations based on probabilities, not
            certainties. They do not account for all real-world variables,
            nuances, or unforeseen events.
          </li>
          <li>
            <strong>No Human Judgment:</strong> AI Insights lack human
            intuition, contextual understanding, and the ability to adapt to
            unique, complex situations that require nuanced judgment.
          </li>
          <li>
            <strong>Not Professional Advice:</strong> AI-generated Insights do
            not constitute professional advice (e.g., legal, financial,
            engineering, or construction advice). They are not a substitute for
            consultation with qualified professionals.
          </li>
        </ul>

        {/* SECTION 3: User Responsibility */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <User className="text-purple-500 dark:text-purple-300" size={24} /> 3.
          User Responsibility
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          You are solely responsible for evaluating the accuracy, completeness,
          and usefulness of any AI-generated Insights before relying on them.
          All decisions made based on these Insights are at your own risk. We
          strongly advise you to:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>Verify information from multiple sources.</li>
          <li>Consult with human experts for critical decisions.</li>
          <li>
            Consider your specific project requirements and local conditions.
          </li>
        </ul>

        {/* SECTION 4: No Warranty */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Info className="text-purple-500 dark:text-purple-300" size={24} /> 4.
          No Warranty
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions provides AI-generated Insights "AS IS" and "AS
          AVAILABLE" without any warranties of any kind, whether express or
          implied, including but not limited to warranties of merchantability,
          fitness for a particular purpose, non-infringement, or accuracy. We do
          not warrant that the Insights will be error-free, uninterrupted, or
          meet your specific requirements. For a broader understanding of our
          general disclaimers, please refer to our{" "}
          <a
            href="/legal/disclaimer"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Disclaimer
          </a>
          .
        </p>

        {/* SECTION 5: Changes to This Disclaimer */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Info className="text-purple-500 dark:text-purple-300" size={24} /> 5.
          Changes to This Disclaimer
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          ConnectingConstructions reserves the right to modify or update this
          AI-generated Insights Disclaimer at any time. We will notify you of
          any material changes by posting the updated Disclaimer on this page
          and updating the "Last updated" date. Your continued use of AI-powered
          features after such modifications constitutes your acceptance of the
          revised Disclaimer.
        </p>

        {/* SECTION 6: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-purple-200 dark:border-purple-700 pb-3 flex items-center gap-2">
          <Mail className="text-purple-500 dark:text-purple-300" size={24} /> 6.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns regarding this AI-generated
          Insights Disclaimer, please contact us:
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

export default AIGeneratedInsightsDisclaimer;
