import React from "react";
import { User, Mail, MapPin, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileWidget = () => {
  const navigate = useNavigate();
  const supplier = JSON.parse(localStorage.getItem("user")) || {
    name: "Supplier",
    email: "supplier@example.com",
    location: "Hyderabad, India",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full sm:w-96">
      <div className="flex items-center gap-4">
        <div className="bg-gray-300 rounded-full h-16 w-16 flex items-center justify-center text-2xl text-white font-bold">
          {supplier.name?.[0]?.toUpperCase() || "S"}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {supplier.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <MapPin className="w-4 h-4 mr-1" /> {supplier.location || "Not Set"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <Mail className="w-4 h-4 mr-1" /> {supplier.email}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/supplier/settings")}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
      >
        <Pencil className="w-4 h-4" /> Edit Profile
      </button>
    </div>
  );
};

export default ProfileWidget;
