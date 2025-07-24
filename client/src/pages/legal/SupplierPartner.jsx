import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  PackageCheck,
  FileText,
  BadgeDollarSign,
  RotateCcw,
  XCircle,
  Ship,
} from "lucide-react";

const policies = [
  {
    path: "/legal/supplieragreement",
    icon: <FileText className="text-blue-500 dark:text-blue-400" size={22} />,
    title: "Supplier Agreement",
    desc: "Understand our terms for all suppliers partnering with us.",
  },
  {
    path: "/legal/productguidelines",
    icon: (
      <PackageCheck className="text-green-500 dark:text-green-400" size={22} />
    ),
    title: "Product Guidelines",
    desc: "Rules and quality standards for listing your products.",
  },
  {
    path: "/legal/logisticsagreement",
    icon: <Truck className="text-indigo-500 dark:text-indigo-400" size={22} />,
    title: "Logistics Agreement",
    desc: "Responsibilities and expectations for shipping & delivery.",
  },
  {
    path: "/legal/pricingpolicy",
    icon: (
      <BadgeDollarSign
        className="text-yellow-500 dark:text-yellow-300"
        size={22}
      />
    ),
    title: "Pricing Policy",
    desc: "Transparent pricing rules to ensure fairness and clarity.",
  },
  {
    path: "/legal/returnrefundpolicy",
    icon: (
      <RotateCcw className="text-purple-500 dark:text-purple-400" size={22} />
    ),
    title: "Return & Refund",
    desc: "Conditions and timelines for refunds & returns.",
  },
  {
    path: "/legal/shippingpolicy",
    icon: <Ship className="text-cyan-500 dark:text-cyan-400" size={22} />,
    title: "Shipping Policy",
    desc: "Details on shipping methods, charges, and timelines.",
  },
  {
    path: "/legal/cancellationpolicy",
    icon: <XCircle className="text-red-500 dark:text-red-400" size={22} />,
    title: "Cancellation Policy",
    desc: "When and how an order can be cancelled.",
  },
];

const SupplierPartner = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-black-800 dark:text-white">
          Supplier & Partner Policies
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((item, index) => (
            <Link
              to={item.path}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierPartner;
