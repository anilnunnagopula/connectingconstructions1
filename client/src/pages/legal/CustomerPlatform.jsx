import React from "react";
import { Link } from "react-router-dom";
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
  // Transformed Customer Policies (now direct links)
  {
    path: "/legal/customer/orderplacementtracking",
    label: "🛒 Order Placement & Tracking",
    icon: <UserCheck className="text-blue-500 dark:text-blue-400" size={22} />,
  },
  {
    path: "/legal/customer/paymentrefundguidelines",
    label: "💳 Payment & Refund Guidelines",
    icon: (
      <CreditCard className="text-green-500 dark:text-green-400" size={22} />
    ),
  },
  {
    path: "/legal/customer/reviewsystemintegrity",
    label: "✨ Review System Integrity", // Changed icon for variety, kept Star
    icon: <Star className="text-yellow-500 dark:text-yellow-300" size={22} />,
  },
  {
    path: "/legal/customer/supportgrievance",
    label: "❓ Support & Grievance Redressal",
    icon: (
      <HelpCircle className="text-purple-500 dark:text-purple-400" size={22} />
    ),
  },
  // Existing Extra Legal Links (kept as is)
  {
    path: "/legal/customeragreement", // Added prefix for customer policies path here
    label: "🧑‍💼 Customer Agreement",
    icon: <ScrollText size={22} className="text-red-500 dark:text-red-300" />,
  },
  {
    path: "/legal/platformpolicy",
    label: "🖥 Platform Policy",
    icon: (
      <ShieldCheck size={22} className="text-indigo-500 dark:text-indigo-300" />
    ),
  },
  {
    path: "/legal/reviewpolicy",
    label: "⭐ General Review Policy", // Renamed to distinguish from System Integrity
    icon: (
      <ThumbsUp size={22} className="text-orange-500 dark:text-orange-300" />
    ),
  },
  {
    path: "/legal/disputes",
    label: "⚖ Disputes",
    icon: <Gavel size={22} className="text-gray-600 dark:text-gray-400" />,
  },
  {
    path: "/legal/locationterms",
    label: "📍 Location Terms",
    icon: <MapPin size={22} className="text-cyan-500 dark:text-cyan-300" />,
  },
  {
    path: "/legal/laborterms",
    label: "👷 Labor Terms",
    icon: <HardHat size={22} className="text-brown-500 dark:text-brown-300" />, // brown not direct tailwind, just placeholder
  },
];

const CustomerLegalCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12 text-gray-800 dark:text-white font-inter">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
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
            <Link
              key={index}
              to={item.path}
              className="group bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center space-x-4"
            >
              <div className="flex-shrink-0">
                {/* Clone the icon to apply group-hover styles if needed, or just apply text colors directly */}
                {React.cloneElement(item.icon, {
                  className: `transition-colors duration-200 ${item.icon.props.className} group-hover:text-blue-600 dark:group-hover:text-blue-300`,
                  size: 28, // Increased icon size for better visibility in the grid
                })}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200">
                {item.label}
              </h2>
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

export default CustomerLegalCenter;
