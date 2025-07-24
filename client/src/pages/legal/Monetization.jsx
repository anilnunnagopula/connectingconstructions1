import React from "react";
import { Link } from "react-router-dom";
import { DollarSign, Percent, Megaphone, Share2 } from "lucide-react";

const monetizationItems = [
  {
    path: "/legal/suppliersubscriptionplans",
    icon: (
      <DollarSign className="text-green-500 dark:text-green-400" size={22} />
    ),
    title: "Supplier Subscription Plans",
    desc: "Flexible tiered plans that help suppliers maximize visibility and features.",
  },
  {
    path: "/legal/commissionmodel",
    icon: <Percent className="text-blue-500 dark:text-blue-400" size={22} />,
    title: "Commission Model Overview",
    desc: "A fair percentage on successful transactions to support platform upkeep.",
  },
  {
    path: "/legal/adplacement",
    icon: (
      <Megaphone className="text-yellow-500 dark:text-yellow-300" size={22} />
    ),
    title: "Ad Placement & Featured Listings",
    desc: "Boost visibility through promoted placements and priority search rankings.",
  },
  {
    path: "/legal/affiliaterevenueprogram",
    icon: <Share2 className="text-purple-500 dark:text-purple-400" size={22} />,
    title: "Affiliate Revenue Program",
    desc: "Earn via referrals and collaborations with construction-related affiliates.",
  },
];

const Monetization = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 px-4 py-6 text-gray-800 dark:text-white font-inter">
      <div className="max-w-6xl mx-auto">
        {/* Added container styling */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-4 leading-tight">
          {" "}
          {/* Adjusted margin-bottom and leading */}
          Monetization & Revenue Policies
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-center">
          {" "}
          {/* Adjusted margin-bottom and text styles */}
          Learn how ConnectingConstructions monetizes and sustains operations,
          while staying transparent and fair.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          {/* Removed mb-12 from this div, added to parent container if needed */}
          {monetizationItems.map((item, index) => (
            <Link // Changed from div to Link
              key={index}
              to={item.path} // Link to the specific policy page
              className="group bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col items-start space-y-2" // Added flex-col, items-start, space-y-2 for better layout within the clickable card
            >
              <div className="flex items-center gap-3 mb-2">
                {" "}
                {/* Retained flex for icon and title alignment */}
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

export default Monetization;
