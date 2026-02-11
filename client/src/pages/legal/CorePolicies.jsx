import React from "react";
import {
  FileText,
  Lock,
  Shield,
  AlertTriangle,
  Cookie,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const corePoliciesItems = [
  {
    icon: <FileText className="text-blue-500 dark:text-blue-400" size={22} />,
    title: "Terms & Conditions",
    link: "/legal/termsandconditions",
  },
  {
    icon: <Lock className="text-purple-500 dark:text-purple-400" size={22} />,
    title: "Privacy Policy",
    link: "/legal/privacypolicy",
  },
  {
    icon: <Cookie className="text-yellow-500 dark:text-yellow-300" size={22} />,
    title: "Cookie Policy",
    link: "/legal/cookiepolicy",
  },
  {
    icon: (
      <AlertTriangle className="text-red-500 dark:text-red-400" size={22} />
    ),
    title: "Disclaimer",
    link: "/legal/disclaimer",
  },
  {
    icon: <Shield className="text-green-600 dark:text-green-400" size={22} />,
    title: "Data Protection",
    link: "/legal/dataprotection",
  },
  {
    icon: (
      <KeyRound className="text-orange-500 dark:text-orange-400" size={22} />
    ),
    title: "Security Practices",
    link: "/legal/securitypractices",
  },
];

const CorePolicies = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-6 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 dark:text-white">
          Core Policies & Legal Framework
        </h1>

        <p className="text-center mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
          Transparency is our foundation. Explore the key policies that govern
          your experience on ConnectingConstructions.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {corePoliciesItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 block"
            >
              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                <h2 className="text-lg font-semibold">{item.title}</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View detailed explanation of our {item.title.toLowerCase()}.
              </p>
            </Link>
          ))}
        </div>
        <p className="mt-12 text-sm text-center italic text-gray-500 dark:text-gray-400">
          For any clarifications, please refer to the specific policy pages or
          contact our support team.
        </p>
      </div>
    </div>
  );
};

export default CorePolicies;
