// src/utils/Categories.jsx
// Construction Materials & Services Marketplace Categories

const categories = [
  // === MATERIALS (Buyable bulk products) ===
  { name: "Cement", type: "material", hsn: "2523", gst: 28, units: ["bags", "kg", "tonnes"] },
  { name: "Reinforcement Bars", type: "material", hsn: "7214", gst: 18, units: ["tonnes", "kg", "pieces"] },
  { name: "Bricks", type: "material", hsn: "6904", gst: 5, units: ["pieces", "units"] },
  { name: "Sand", type: "material", hsn: "2505", gst: 5, units: ["tonnes", "cubic_ft"] },
  { name: "Aggregates", type: "material", hsn: "2517", gst: 5, units: ["tonnes", "cubic_ft"] },
  { name: "RMC", type: "material", hsn: "3824", gst: 28, units: ["cubic_ft"] },
  { name: "Tiles & Marbles", type: "material", hsn: "6907", gst: 28, units: ["sq_ft", "pieces"] },
  { name: "Granite Stones", type: "material", hsn: "6802", gst: 28, units: ["sq_ft", "pieces"] },
  { name: "Paints & Works", type: "material", hsn: "3209", gst: 28, units: ["liters", "kg"] },
  { name: "Admixtures", type: "material", hsn: "3824", gst: 18, units: ["liters", "kg"] },
  { name: "Dust", type: "material", hsn: "2505", gst: 5, units: ["tonnes", "cubic_ft"] },
  { name: "Morrum (Red Sand)", type: "material", hsn: "2505", gst: 5, units: ["tonnes", "cubic_ft"] },
  { name: "Electricals", type: "material", hsn: "8544", gst: 18, units: ["pieces", "units"] },
  { name: "Plumbing", type: "material", hsn: "7307", gst: 18, units: ["pieces", "units"] },
  { name: "Water Tankers", type: "material", hsn: "8704", gst: 28, units: ["liters", "units"] },

  // === PRODUCTS (Equipment / Retail) ===
  { name: "Portable Cabins", type: "product", hsn: "9406", gst: 18, units: ["units"] },
  { name: "Trucks", type: "product", units: ["units"] },
  { name: "Earth Movers", type: "product", units: ["units"] },
  { name: "Bull Dozers", type: "product", units: ["units"] },
  { name: "Cranes & Lifters", type: "product", units: ["units"] },

  // === SERVICES (Quote-based / Labour) ===
  { name: "Plan & Design", type: "service" },
  { name: "Vastu", type: "service" },
  { name: "Surveyors", type: "service" },
  { name: "Legal Guidance", type: "service" },
  { name: "Labours", type: "service" },
  { name: "Mason", type: "service" },
  { name: "Contractors", type: "service" },
  { name: "Interiors", type: "service" },
  { name: "Exteriors", type: "service" },
  { name: "Elevation", type: "service" },
  { name: "Furniture Carpenter Works", type: "service" },
  { name: "Renovation Works", type: "service" },
  { name: "Demolition Works", type: "service" },
  { name: "Dismantling", type: "service" },
  { name: "Form Works", type: "service" },
  { name: "DPC Works", type: "service" },
  { name: "GIT Works", type: "service" },
  { name: "Ground Improvement Works", type: "service" },
  { name: "Roads & Pavements", type: "service" },
  { name: "Elevator Works", type: "service" },
  { name: "Borewells", type: "service" },
  { name: "Health Monitoring", type: "service" },
  { name: "Material Testing", type: "service" },
  { name: "Real Estates", type: "service" },
  { name: "Revit Software Works", type: "service" },
  { name: "STAAD Pro Works", type: "service" },
  { name: "Augmented Reality", type: "service" },
  { name: "GIS", type: "service" },

  // === OTHER ===
  { name: "Others", type: "product", units: ["units", "pieces", "kg"] },
];

// Helper: Get all category names (backward compatible)
export const getCategoryNames = () => categories.map((c) => c.name);

// Helper: Get categories by type
export const getMaterialCategories = () => categories.filter((c) => c.type === "material");
export const getServiceCategories = () => categories.filter((c) => c.type === "service");
export const getProductCategories = () => categories.filter((c) => c.type === "product");

// Helper: Get category details by name
export const getCategoryByName = (name) => categories.find((c) => c.name === name);

// Helper: Get default units for a category
export const getUnitsForCategory = (categoryName) => {
  const cat = categories.find((c) => c.name === categoryName);
  return cat?.units || ["units", "pieces", "kg"];
};

// Helper: Get HSN code for a category
export const getHsnForCategory = (categoryName) => {
  const cat = categories.find((c) => c.name === categoryName);
  return cat?.hsn || "";
};

// Helper: Get GST rate for a category
export const getGstForCategory = (categoryName) => {
  const cat = categories.find((c) => c.name === categoryName);
  return cat?.gst || 18;
};

// Helper: Get product type for a category
export const getTypeForCategory = (categoryName) => {
  const cat = categories.find((c) => c.name === categoryName);
  return cat?.type || "product";
};

export default categories;
