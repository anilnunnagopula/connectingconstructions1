import { Link } from "react-router-dom";
import { useState } from "react";

const commonServiceData = [
  {
    title: "Public Infrastructure",
    path: "/common-services/public-infrastructure/roads-transport",
    icon: "🚗",
  },
  {
    title: "Water & Waste Management",
    path: "/common-services/water-waste-management/water-supply",
    icon: "🚰",
  },
  {
    title: "Waste Management",
    path: "/common-services/waste-management/solid-waste-disposal",
    icon: "🗑️",
  },
  {
    title: "Energy & Utilities",
    path: "/common-services/energy-utilities/power-distribution",
    icon: "⚡",
  },
  {
    title: "Community Facilities",
    path: "/common-services/community-facilities/schools",
    icon: "🏥",
  },
  {
    title: "Recreation & Parks",
    path: "/common-services/recreation-parks/parks-gardens",
    icon: "🏞️",
  },
  {
    title: "Urban Housing",
    path: "/common-services/urban-housing/affordable-housing",
    icon: "🏘️",
  },
  {
    title: "Emergency Services",
    path: "/common-services/emergency-services/disaster-management",
    icon: "🚨",
  },
  {
    title: "Municipal Works",
    path: "/common-services/municipal-works/street-lighting",
    icon: "💡",
  },
  {
    title: "Environment & Sustainability",
    path: "/common-services/environment-sustainability/green-buildings",
    icon: "🌱",
  },
];

const CommonServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const user = JSON.parse(localStorage.getItem("user")); // No longer needed for this component's functionality

  // Filtered categories based on search term
  const filteredServices = commonServiceData.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12"> {/* Increased vertical padding */}
      {/* Header section */}
      <div className="mb-10 text-center"> {/* Increased bottom margin for more separation */}
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-3"> {/* Larger and bolder heading */}
          Public & Government Services <span role="img" aria-label="building">🏛️</span>
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"> {/* Adjusted text size and max-width for better readability */}
          From Ground Leveling to Government Approvals, we've got it all covered. Explore essential services for urban and public development.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-12 relative max-w-xl mx-auto"> {/* Increased max-width and margin-bottom */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input
          type="text"
          placeholder="Search for a service..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-14 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-base" /* Larger padding, rounded corners, focus ring */
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        )}
      </div>

      {/* Grid for the service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-6"> {/* Adjusted responsive columns and increased gap */}
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Link
              to={service.path}
              key={service.title}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center text-center border border-gray-100 dark:border-gray-700" /* Enhanced styling */
            >
              <div className="text-5xl mb-4 transform hover:rotate-6 transition-transform duration-300"> {/* Larger icon, added subtle rotate on hover */}
                {service.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight"> {/* Larger, bolder title with tight leading */}
                {service.title}
              </h3>
              {/* You could add a description here if your data had one */}
              {/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{service.description}</p> */}
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg">
            No services found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommonServices;