import React from "react";
import { Link } from "react-router-dom"; // Keep Link import for clickable cards
import {
  UserCheck, // For Order Placement
  CreditCard, // For Payment & Refund
  Star, // For Review System
  HelpCircle, // For Support & Grievance
  MapPin, // For Location Terms
  HardHat, // For Labor Terms
  ScrollText, // For Customer Agreement
  ShieldCheck, // For Platform Policy
  ThumbsUp, // For Review Policy
  Gavel, // For Disputes
} from "lucide-react"; // All required icons are kept

const customerLegalLinks = [
  // Customer-specific Policies (now with descriptions for display)
  {
    path: "/legal/orderplacementtracking",
    label: "Order Placement & Tracking",
    desc: "How to place orders, track progress, and receive real-time updates.",
    icon: <UserCheck className="text-blue-500 dark:text-blue-400" size={22} />,
  },
  {
    path: "/legal/paymentrefundguidelines",
    label: "Payment & Refund Guidelines",
    desc: "Clear instructions on payments, refund eligibility and timelines.",
    icon: (
      <CreditCard className="text-green-500 dark:text-green-400" size={22} />
    ),
  },
  {
    path: "/legal/reviewsystemintegrity",
    label: "Review System Integrity",
    desc: "Ensuring genuine, constructive reviews and user trust.",
    icon: <Star className="text-yellow-500 dark:text-yellow-300" size={22} />,
  },
  {
    path: "/legal/supportgrievance",
    label: "Support & Grievance Redressal",
    desc: "Channels and processes for raising concerns or getting help.",
    icon: (
      <HelpCircle className="text-purple-500 dark:text-purple-400" size={22} />
    ),
  },
  // General Legal Links relevant to Customers (now with descriptions for display)
  {
    path: "/legal/customeragreement",
    label: "Customer Agreement",
    desc: "Comprehensive terms governing your use of our platform and services.",
    icon: <ScrollText size={22} className="text-red-500 dark:text-red-300" />,
  },
  {
    path: "/legal/platformpolicy",
    label: "Platform Policy",
    desc: "Rules and guidelines for acceptable behavior and content on the platform.",
    icon: (
      <ShieldCheck size={22} className="text-indigo-500 dark:text-indigo-300" />
    ),
  },
  {
    path: "/legal/reviewpolicy",
    label: "General Review Policy",
    desc: "Guidelines for submitting and managing product and service reviews.",
    icon: (
      <ThumbsUp size={22} className="text-orange-500 dark:text-orange-300" />
    ),
  },
  {
    path: "/legal/disputes",
    label: "Disputes",
    desc: "Our process for handling and resolving disputes between users or with the platform.",
    icon: <Gavel size={22} className="text-gray-600 dark:text-gray-400" />,
  },
  {
    path: "/legal/locationterms",
    label: "Location Terms",
    desc: "Information regarding location-based services and data usage.",
    icon: <MapPin size={22} className="text-cyan-500 dark:text-cyan-300" />,
  },
  {
    path: "/legal/laborterms",
    label: "Labor Terms",
    desc: "Specific terms for services involving labor and workforce engagement.",
    icon: (
      <HardHat size={22} className="text-yellow-700 dark:text-yellow-500" />
    ),
  },
];

const CustomerLegalCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 px-4 py-12 text-gray-800 dark:text-white font-inter">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-10 leading-tight">
          Customer Legal & Policy Center
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-center">
          Find comprehensive information about how ConnectingConstructions
          operates for our customers. Explore policies on ordering, payments,
          reviews, support, and other essential legal terms to ensure a smooth
          and trusted experience.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customerLegalLinks.map((item, index) => (
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
                  {item.label} {/* Using item.label for the title */}
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc} {/* Displaying the description */}
              </p>
            </Link> // Closing Link tag
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

export default CustomerLegalCenter;
