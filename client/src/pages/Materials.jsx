import React, { useState } from "react";
import { Link } from "react-router-dom";
import categories from "../utils/Categories";

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const filteredCategories = categories.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-4 pb-10 px-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <h2 className="text-xl md:text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-white tracking-wide">
        🏗️ Explore Construction Categories
      </h2>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-10 relative max-w-md mx-auto">
        <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300 animate-pulse">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500 dark:text-gray-300"
          >
            ❌
          </button>
        )}
      </div>

      {/* 📦 Material Cards */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredCategories.map((item, idx) => {
            const linkPath =
              user?.role === "customer"
                ? `/customer/category/${encodeURIComponent(item)}`
                : `/category/${encodeURIComponent(item)}`;

            return (
              <Link
                key={idx}
                to={linkPath}
                className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 px-6 pt-6 pb-1 rounded-xl cursor-pointer flex flex-col group"
              >
              <div
                className={`h-40 overflow-hidden rounded-md border border-black dark:border-white transition-transform duration-300 group-hover:scale-[1.02] ${
                  user ? "mb-2" : "mb-2"
                }`}
              >
                <img
                  src={`${
                    process.env.PUBLIC_URL
                  }/categories/${item.toLowerCase()}.jpg`}
                  alt={item}
                  onError={(e) =>
                    (e.target.src = `${process.env.PUBLIC_URL}/categories/default.jpg`)
                  }
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <h3
                className={`text-lg font-bold text-gray-800 dark:text-white tracking-wide ${
                  user ? "mb-0" : "mb-0"
                }`}
              >
                {item}
              </h3>

              {user && (
                <p className=" text-xs text-gray-500 dark:text-gray-400 italic mb-2 truncate">
                  Tap to explore products under {item}
                </p>
              )}
            </Link>
          );
        })}
        </div>
      ) : (
        <div className="text-center text-red-500 text-3xl mt-10 font-semibold">
          😕 Oops! No materials found.
        </div>
      )}
    </div>
  );
};

export default Materials;
