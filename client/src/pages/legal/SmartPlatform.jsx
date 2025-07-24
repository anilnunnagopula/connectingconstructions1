import React from "react";
import { Link } from "react-router-dom"; // Import Link for internal navigation
import { Brain, ScanEye, Settings2, ShieldCheck } from "lucide-react";

const policies = [
  {
    // Path is now actively used for linking
    path: "/legal/aigeneratedinsightsdisclaimer",
    icon: <Brain className="text-pink-500 dark:text-pink-400" size={22} />,
    title: "AI-generated Insights Disclaimer",
    desc: "Clarifying the role of AI in generating platform recommendations.",
  },
  {
    // Path is now actively used for linking
    path: "/legal/algorithmicfairnesspolicy",
    icon: <ScanEye className="text-blue-500 dark:text-blue-400" size={22} />,
    title: "Algorithmic Fairness Policy",
    desc: "Ensuring all AI models behave fairly and without bias.",
  },
  {
    // Path is now actively used for linking
    path: "/legal/transparentrecommendationlogic",
    icon: (
      <Settings2 className="text-green-500 dark:text-green-400" size={22} />
    ),
    title: "Transparent Recommendation Logic",
    desc: "Insights into how suggestions and personalization work.",
  },
  {
    // Path is now actively used for linking
    path: "/legal/userconsentforsmartfeatures",
    icon: (
      <ShieldCheck className="text-yellow-500 dark:text-yellow-300" size={22} />
    ),
    title: "User Consent for Smart Features",
    desc: "Giving you full control over AI-powered features and data.",
  },
];

const SmartPlatform = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 px-4 py-12 text-gray-800 dark:text-white font-inter">
      <div className="max-w-6xl mx-auto">
        {/* Added container styling */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-10 leading-tight">
          {" "}
          {/* Adjusted margin-bottom and leading */}
          Smart Platform Policies
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-center">
          {" "}
          {/* Adjusted margin-bottom and text styles */}
          Understand how our intelligent systems enhance your experience, from
          AI-driven insights to personalized recommendations, with a focus on
          fairness and user control.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((item, index) => (
            <Link // Changed from div to Link to make it clickable
              key={index}
              to={item.path} // Link to the specific policy page
              className="group bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col items-start space-y-2" // Added flex-col, items-start, space-y-2 for better layout within the clickable card
            >
              <div className="flex items-center gap-3 mb-2">
                {/* Clone the icon to apply group-hover styles, and adjust size for better clickability */}
                {React.cloneElement(item.icon, {
                  className: `transition-colors duration-200 ${item.icon.props.className} group-hover:text-blue-600 dark:group-hover:text-blue-300`,
                  size: 28, // Increased icon size for better tap target and visibility
                })}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200">
                  {item.title}
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </Link> // Closing Link tag
          ))}
        </div>
        {/* Added the bottom text as per the Monetization page image */}
        <p className="mt-12 text-sm text-center italic text-gray-500 dark:text-gray-400">
          For any clarifications, please refer to the specific policy pages or
          contact our support team.
        </p>
      </div>
    </div>
  );
};

export default SmartPlatform;
