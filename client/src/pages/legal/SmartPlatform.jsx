// src/pages/legal/SmartPlatform.jsx
import React from "react";
import { Brain, ScanEye, Settings2, ShieldCheck } from "lucide-react";

const policies = [
  {
    path: "/legal/aigenerateddisclaimer",
    icon: <Brain className="text-pink-500 dark:text-pink-400" size={22} />,
    title: "AI-generated Insights Disclaimer",
    desc: "Clarifying the role of AI in generating platform recommendations.",
  },
  {
    path: "/legal/algorithmicfairness",
    icon: <ScanEye className="text-blue-500 dark:text-blue-400" size={22} />,
    title: "Algorithmic Fairness Policy",
    desc: "Ensuring all AI models behave fairly and without bias.",
  },
  {
    path: "/legal/recommendationlogic",
    icon: (
      <Settings2 className="text-green-500 dark:text-green-400" size={22} />
    ),
    title: "Transparent Recommendation Logic",
    desc: "Insights into how suggestions and personalization work.",
  },
  {
    path: "/legal/userconsent",
    icon: (
      <ShieldCheck className="text-yellow-500 dark:text-yellow-300" size={22} />
    ),
    title: "User Consent for Smart Features",
    desc: "Giving you full control over AI-powered features and data.",
  },
];

const SmartPlatform = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4 py-6 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-black-800 dark:text-white">
          Smart Platform Policies
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((item, index) => (
            <a
              href={item.path}
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 block"
            >
              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                <h2 className="text-lg font-semibold">{item.title}</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartPlatform;
