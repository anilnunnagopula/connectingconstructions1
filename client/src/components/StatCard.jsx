import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-md p-5 rounded-xl flex items-center justify-between hover:shadow-lg transition dark:bg-gray-800">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </h2>
      </div>
      
      <div className="text-3xl">{icon}</div>
    </div>
    
  );
};

export default StatCard;
