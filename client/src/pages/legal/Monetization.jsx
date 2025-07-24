import React from "react";
import { DollarSign, Percent, Megaphone, Share2 } from "lucide-react";

const monetizationItems = [
  {
    icon: (
      <DollarSign className="text-green-500 dark:text-green-400" size={22} />
    ),
    title: "Supplier Subscription Plans",
    desc: "Flexible tiered plans that help suppliers maximize visibility and features.",
  },
  {
    icon: <Percent className="text-blue-500 dark:text-blue-400" size={22} />,
    title: "Commission Model Overview",
    desc: "A fair percentage on successful transactions to support platform upkeep.",
  },
  {
    icon: (
      <Megaphone className="text-yellow-500 dark:text-yellow-300" size={22} />
    ),
    title: "Ad Placement & Featured Listings",
    desc: "Boost visibility through promoted placements and priority search rankings.",
  },
  {
    icon: <Share2 className="text-purple-500 dark:text-purple-400" size={22} />,
    title: "Affiliate Revenue Program",
    desc: "Earn via referrals and collaborations with construction-related affiliates.",
  },
];

const Monetization = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 dark:from-gray-900 dark:to-gray-800 px-4 py-6 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">
          Monetization & Revenue Policies
        </h1>

        <p className="text-center mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
          Learn how ConnectConstructions monetizes and sustains operations,
          while staying transparent and fair.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {monetizationItems.map((item, index) => (
            <div
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Monetization;
