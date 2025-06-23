import React from "react";
import { PlusCircle, RefreshCcw, Download, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActionShortcuts = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Product",
      icon: <PlusCircle className="w-5 h-5 mr-2" />,
      action: () => navigate("/supplier/add-product"),
    },
    {
      label: "Sync Inventory",
      icon: <RefreshCcw className="w-5 h-5 mr-2" />,
      action: () => alert("Inventory sync triggered ✅"),
    },
    {
      label: "Export CSV",
      icon: <Download className="w-5 h-5 mr-2" />,
      action: () => alert("Exporting product list..."),
    },
    {
      label: "Create Offer",
      icon: <Tag className="w-5 h-5 mr-2" />,
      action: () => alert("Redirect to Create Offer (to be implemented)"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center  mt-6 mb-6">
      {actions.map((btn, idx) => (
        <button
          key={idx}
          onClick={btn.action}
          className="flex items-center bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-pink-700 hover:scale-105 transition-transform"
        >
          {btn.icon}
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionShortcuts;
