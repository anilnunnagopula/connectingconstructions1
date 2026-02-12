import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Package, DollarSign, Award, FileText, Tag, MapPin,
  Image as ImageIcon, Plus, Trash2, Info, ChevronDown, ChevronUp
} from "lucide-react";
import SupplierLayout from "../../layout/SupplierLayout";
import categories, { getCategoryByName, getUnitsForCategory, getHsnForCategory, getGstForCategory, getTypeForCategory } from "../../utils/Categories";

// Common construction material brands
const BRANDS = {
  Cement: ["UltraTech", "ACC", "Ambuja", "Birla", "Dalmia", "JK Cement", "Shree", "Ramco"],
  "Steel & TMT": ["Tata Tiscon", "JSW", "SAIL", "Jindal", "Kamdhenu", "Vizag", "RINL"],
  Tiles: ["Kajaria", "Somany", "Nitco", "Johnson", "RAK", "Cera", "Orient Bell"],
  Paint: ["Asian Paints", "Berger", "Nerolac", "Dulux", "Indigo", "Shalimar"],
  Sanitary: ["Hindware", "Cera", "Jaquar", "Parryware", "Kohler", "Roca"],
};

// Common HSN codes for construction materials
const HSN_CODES = {
  Cement: "2523",
  "Steel & TMT": "7214",
  "Sand & Aggregates": "2505",
  Bricks: "6904",
  Tiles: "6907",
  Paint: "3209",
  Sanitary: "6910",
};

// Common certifications
const CERTIFICATIONS = [
  "ISI Marked",
  "BIS Certified",
  "ISO 9001:2015",
  "ISO 14001",
  "ASTM Standards",
  "CRS Certified",
  "BIS IS 1786:2008",
  "BIS IS 269:2015",
  "Eco-Friendly",
  "Green Pro Certified",
];

const AddProductEnhanced = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    pricing: true,
    brand: false,
    specs: false,
    variants: false,
    certs: false,
    images: false,
  });

  const [product, setProduct] = useState({
    // Basic Info
    name: "",
    category: "",
    description: "",
    productType: "material", // material, service, product

    // Pricing & Inventory
    price: "",
    unit: "bags",
    quantity: "",
    minOrderQuantity: 1,
    stepSize: 1,
    bulkPricing: [],

    // Brand & Quality
    brand: "",
    grade: "",
    packaging: "",

    // Technical Specifications
    specifications: {},

    // Product Variants
    variants: [],

    // Certifications & Compliance
    certifications: [],
    manufacturingDate: "",
    batchNumber: "",
    warranty: "",
    countryOfOrigin: "India",
    hsnCode: "",
    gstRate: 18,

    // Images & Location (existing)
    imageFiles: [],
    imageUrls: [],
    location: { text: "", lat: null, lng: null },
    contact: { mobile: "", email: "", address: "" },
    availability: true,
  });

  // Categories State
  const [allCategories, setAllCategories] = useState([]);

  // Fetch Custom Categories & Merge
  useEffect(() => {
    const fetchCustomCategories = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/categories`, {
           headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
           const customCats = await res.json();
           
           // Merge Global (utils) + Custom (API)
           // Avoid duplicates by name
           const globalNames = new Set(categories.map(c => c.name));
           const uniqueCustom = customCats.filter(c => !globalNames.has(c.name));
           
           // Create standardized objects for custom categories
           const customCatObjects = uniqueCustom.map(c => ({
               name: c.name,
               type: "material", // Default
               units: ["units", "pieces", "kg"], // Default options
               hsn: "",
               gst: 18
           }));

           setAllCategories([...categories, ...customCatObjects].sort((a,b) => a.name.localeCompare(b.name)));
        } else {
           setAllCategories(categories); // Fallback to global only
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setAllCategories(categories);
      }
    };
    
    fetchCustomCategories();
  }, []);

  // Bulk Pricing state
  const [newBulkTier, setNewBulkTier] = useState({
    minQuantity: "",
    maxQuantity: "",
    pricePerUnit: "",
  });

  // Specifications state
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  // Variants state
  const [newVariant, setNewVariant] = useState({
    name: "",
    options: [{ value: "", priceAdjustment: 0, stockQuantity: 0, sku: "" }],
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setProduct(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  // Auto-fill HSN, GST, unit, productType when category changes
  useEffect(() => {
    if (product.category) {
      const catData = getCategoryByName(product.category);
      if (catData) {
        setProduct(prev => ({
          ...prev,
          hsnCode: catData.hsn || prev.hsnCode,
          gstRate: catData.gst || prev.gstRate,
          productType: catData.type || prev.productType,
          unit: catData.units?.[0] || prev.unit,
        }));
      }
    }
  }, [product.category]);

  // === BULK PRICING BUILDER ===
  const addBulkPricingTier = () => {
    if (!newBulkTier.minQuantity || !newBulkTier.pricePerUnit) {
      toast.error("Please fill min quantity and price per unit");
      return;
    }

    const tier = {
      minQuantity: parseInt(newBulkTier.minQuantity),
      maxQuantity: newBulkTier.maxQuantity ? parseInt(newBulkTier.maxQuantity) : null,
      pricePerUnit: parseFloat(newBulkTier.pricePerUnit),
    };

    setProduct(prev => ({
      ...prev,
      bulkPricing: [...prev.bulkPricing, tier].sort((a, b) => a.minQuantity - b.minQuantity)
    }));

    setNewBulkTier({ minQuantity: "", maxQuantity: "", pricePerUnit: "" });
    toast.success("Bulk pricing tier added");
  };

  const removeBulkPricingTier = (index) => {
    setProduct(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter((_, i) => i !== index)
    }));
    toast.success("Tier removed");
  };

  // === SPECIFICATIONS BUILDER ===
  const addSpecification = () => {
    if (!newSpec.key || !newSpec.value) {
      toast.error("Please fill both specification key and value");
      return;
    }

    setProduct(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [newSpec.key]: newSpec.value }
    }));

    setNewSpec({ key: "", value: "" });
    toast.success("Specification added");
  };

  const removeSpecification = (key) => {
    setProduct(prev => {
      const specs = { ...prev.specifications };
      delete specs[key];
      return { ...prev, specifications: specs };
    });
    toast.success("Specification removed");
  };

  // === VARIANTS BUILDER ===
  const addVariant = () => {
    if (!newVariant.name || newVariant.options.length === 0) {
      toast.error("Please provide variant name and at least one option");
      return;
    }

    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { ...newVariant }]
    }));

    setNewVariant({
      name: "",
      options: [{ value: "", priceAdjustment: 0, stockQuantity: 0, sku: "" }]
    });
    toast.success("Variant added");
  };

  const removeVariant = (index) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
    toast.success("Variant removed");
  };

  const addVariantOption = () => {
    setNewVariant(prev => ({
      ...prev,
      options: [...prev.options, { value: "", priceAdjustment: 0, stockQuantity: 0, sku: "" }]
    }));
  };

  const removeVariantOption = (index) => {
    setNewVariant(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const updateVariantOption = (index, field, value) => {
    setNewVariant(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  // === CERTIFICATIONS ===
  const toggleCertification = (cert) => {
    setProduct(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  // === IMAGE UPLOAD ===
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }

    setProduct(prev => ({ ...prev, imageFiles: files }));
    toast.success(`${files.length} images selected`);
  };

  const uploadImagesToCloudinary = async (files) => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary not configured");
      return [];
    }

    const uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        const data = await response.json();
        if (response.ok && data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (err) {
        toast.error(`Error uploading ${file.name}`);
      }
    }

    return uploadedUrls;
  };

  // === SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first
      let imageUrls = [];
      if (product.imageFiles.length > 0) {
        toast.loading("Uploading images...");
        imageUrls = await uploadImagesToCloudinary(product.imageFiles);
        toast.dismiss();
      }

      // Prepare product data
      const productData = {
        name: product.name,
        category: product.category,
        description: product.description,
        productType: product.productType,
        price: parseFloat(product.price),
        unit: product.unit,
        quantity: parseInt(product.quantity),
        minOrderQuantity: parseInt(product.minOrderQuantity),
        stepSize: parseInt(product.stepSize),
        availability: product.availability,

        // Construction-specific fields
        brand: product.brand,
        grade: product.grade,
        packaging: product.packaging,
        specifications: product.specifications,
        bulkPricing: product.bulkPricing,
        variants: product.variants,
        certifications: product.certifications,
        manufacturingDate: product.manufacturingDate,
        batchNumber: product.batchNumber,
        warranty: product.warranty,
        countryOfOrigin: product.countryOfOrigin,
        hsnCode: product.hsnCode,
        gstRate: parseFloat(product.gstRate),

        // Images & Location
        imageUrls,
        location: product.location,
        contact: product.contact,
      };

      // Submit to backend
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("http://localhost:5000/api/supplier/myproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product added successfully!");
        navigate("/supplier/myproducts");
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SupplierLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add Construction Material
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Professional product listing with bulk pricing, variants, and technical specifications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* SECTION 1: BASIC INFORMATION */}
          <SectionCard
            icon={Package}
            title="Basic Information"
            expanded={expandedSections.basic}
            onToggle={() => toggleSection("basic")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., UltraTech OPC 43 Grade Cement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={product.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {allCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Type *
                </label>
                <select
                  value={product.productType}
                  onChange={(e) => handleChange("productType", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="material">Material (Bulk/Wholesale)</option>
                  <option value="product">Product (Retail)</option>
                  <option value="service">Service (Quote-based)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={product.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Detailed product description highlighting key features and benefits..."
                />
              </div>
            </div>
          </SectionCard>

          {/* SECTION 2: PRICING & INVENTORY */}
          <SectionCard
            icon={DollarSign}
            title="Pricing & Inventory"
            expanded={expandedSections.pricing}
            onToggle={() => toggleSection("pricing")}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit *
                  </label>
                  <select
                    value={product.unit}
                    onChange={(e) => handleChange("unit", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="bags">Bags</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="tonnes">Tonnes</option>
                    <option value="liters">Liters</option>
                    <option value="cubic_ft">Cubic Feet</option>
                    <option value="sq_ft">Square Feet</option>
                    <option value="pieces">Pieces</option>
                    <option value="units">Units</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={product.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Order Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={product.minOrderQuantity}
                    onChange={(e) => handleChange("minOrderQuantity", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Step Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={product.stepSize}
                    onChange={(e) => handleChange("stepSize", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Order increments (e.g., 10, 20, 30...)</p>
                </div>
              </div>

              {/* BULK PRICING BUILDER */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tag size={20} className="text-blue-600" />
                  Bulk Pricing Tiers (Wholesale Discounts)
                </h4>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="number"
                      min="1"
                      placeholder="Min Qty (e.g., 10)"
                      value={newBulkTier.minQuantity}
                      onChange={(e) => setNewBulkTier(prev => ({ ...prev, minQuantity: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Max Qty (optional)"
                      value={newBulkTier.maxQuantity}
                      onChange={(e) => setNewBulkTier(prev => ({ ...prev, maxQuantity: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price per unit (₹)"
                      value={newBulkTier.pricePerUnit}
                      onChange={(e) => setNewBulkTier(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addBulkPricingTier}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add Tier
                    </button>
                  </div>

                  {product.bulkPricing.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Price Tiers:</p>
                      {product.bulkPricing.map((tier, index) => (
                        <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {tier.minQuantity} - {tier.maxQuantity || "∞"} {product.unit}: ₹{tier.pricePerUnit}/{product.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeBulkPricingTier(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* SECTION 3: BRAND & QUALITY */}
          <SectionCard
            icon={Award}
            title="Brand & Quality Information"
            expanded={expandedSections.brand}
            onToggle={() => toggleSection("brand")}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand
                </label>
                {product.category && BRANDS[product.category] ? (
                  <select
                    value={product.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Brand</option>
                    {BRANDS[product.category].map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={product.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., UltraTech, Tata"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grade / Quality
                </label>
                <input
                  type="text"
                  value={product.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., OPC 43, Fe415, M-Sand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Packaging
                </label>
                <input
                  type="text"
                  value={product.packaging}
                  onChange={(e) => handleChange("packaging", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., 50kg bag, Loose, Bundled"
                />
              </div>
            </div>
          </SectionCard>

          {/* SECTION 4: TECHNICAL SPECIFICATIONS */}
          <SectionCard
            icon={FileText}
            title="Technical Specifications"
            expanded={expandedSections.specs}
            onToggle={() => toggleSection("specs")}
          >
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-2">
                <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Add specs like compressive strength, fineness, tensile strength, etc.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g., Compressive Strength)"
                    value={newSpec.key}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., 43 MPa)"
                    value={newSpec.value}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Spec
                  </button>
                </div>

                {Object.keys(product.specifications).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{key}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                        </div>
                        <button type="button" onClick={() => removeSpecification(key)} className="text-red-600 hover:text-red-800 ml-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* SECTION 5: PRODUCT VARIANTS */}
          <SectionCard
            icon={Package}
            title="Product Variants (Sizes, Colors, Finishes)"
            expanded={expandedSections.variants}
            onToggle={() => toggleSection("variants")}
          >
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg flex items-start gap-2">
                <Info size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900 dark:text-yellow-200">
                  Add variants like sizes (25kg/50kg), diameters (8mm/12mm), or colors. Each option can have its own price adjustment and stock.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                <input
                  type="text"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Variant Name (e.g., Weight, Diameter, Color)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Options:</p>
                  {newVariant.options.map((option, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <input type="text" placeholder="Value (e.g., 25kg)" value={option.value}
                        onChange={(e) => updateVariantOption(index, "value", e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" />
                      <input type="number" placeholder="Price +/- (₹)" value={option.priceAdjustment}
                        onChange={(e) => updateVariantOption(index, "priceAdjustment", parseFloat(e.target.value) || 0)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" />
                      <input type="number" placeholder="Stock" value={option.stockQuantity}
                        onChange={(e) => updateVariantOption(index, "stockQuantity", parseInt(e.target.value) || 0)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" />
                      <input type="text" placeholder="SKU (optional)" value={option.sku}
                        onChange={(e) => updateVariantOption(index, "sku", e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" />
                      <button type="button" onClick={() => removeVariantOption(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addVariantOption}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-500 hover:text-blue-600 transition">
                    + Add Option
                  </button>
                </div>

                <button type="button" onClick={addVariant}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Plus size={16} /> Save Variant
                </button>
              </div>

              {product.variants.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Saved Variants:</p>
                  {product.variants.map((variant, vIndex) => (
                    <div key={vIndex} className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-900 dark:text-white">{variant.name}</h5>
                        <button type="button" onClick={() => removeVariant(vIndex)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {variant.options.map((opt, oIndex) => (
                          <div key={oIndex} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                            <p className="font-medium text-gray-900 dark:text-white">{opt.value}</p>
                            <p className="text-gray-500">{opt.priceAdjustment > 0 ? `+₹${opt.priceAdjustment}` : opt.priceAdjustment < 0 ? `-₹${Math.abs(opt.priceAdjustment)}` : "Base price"}</p>
                            <p className="text-gray-500">Stock: {opt.stockQuantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          {/* SECTION 6: CERTIFICATIONS & COMPLIANCE */}
          <SectionCard
            icon={Award}
            title="Certifications & Compliance"
            expanded={expandedSections.certs}
            onToggle={() => toggleSection("certs")}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Certifications
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CERTIFICATIONS.map((cert) => (
                    <label key={cert} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${product.certifications.includes(cert) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                      <input type="checkbox" checked={product.certifications.includes(cert)} onChange={() => toggleCertification(cert)} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-900 dark:text-white">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HSN Code</label>
                  <input type="text" value={product.hsnCode} onChange={(e) => handleChange("hsnCode", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" placeholder="Auto-filled from category" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Rate (%)</label>
                  <select value={product.gstRate} onChange={(e) => handleChange("gstRate", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white">
                    <option value="0">0% (Exempt)</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Warranty</label>
                  <input type="text" value={product.warranty} onChange={(e) => handleChange("warranty", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" placeholder="e.g., 1 year, No warranty" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manufacturing Date</label>
                  <input type="date" value={product.manufacturingDate} onChange={(e) => handleChange("manufacturingDate", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Batch Number</label>
                  <input type="text" value={product.batchNumber} onChange={(e) => handleChange("batchNumber", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" placeholder="e.g., BATCH2026001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country of Origin</label>
                  <input type="text" value={product.countryOfOrigin} onChange={(e) => handleChange("countryOfOrigin", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" placeholder="India" />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* SECTION 7: IMAGES & LOCATION */}
          <SectionCard
            icon={ImageIcon}
            title="Images & Contact Information"
            expanded={expandedSections.images}
            onToggle={() => toggleSection("images")}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Images (Max 6)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" />
                {product.imageFiles.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">{product.imageFiles.length} image(s) selected</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Mobile *</label>
                  <input type="tel" required value={product.contact.mobile} onChange={(e) => handleContactChange("mobile", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Email *</label>
                  <input type="email" required value={product.contact.email} onChange={(e) => handleContactChange("email", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" placeholder="supplier@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                  <input type="text" required value={product.location.text} onChange={(e) => handleChange("location", { ...product.location, text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" placeholder="City, State" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                <textarea required rows={2} value={product.contact.address} onChange={(e) => handleContactChange("address", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white" placeholder="Complete address with pincode" />
              </div>
            </div>
          </SectionCard>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/supplier/myproducts")}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Adding Product..." : "Add Product"}
              <Package size={18} />
            </button>
          </div>
        </form>
      </div>
    </SupplierLayout>
  );
};

// Helper Component: Collapsible Section Card
const SectionCard = ({ icon: Icon, title, children, expanded, onToggle }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 hover:from-blue-100 hover:to-blue-200 dark:hover:from-gray-600 dark:hover:to-gray-700 transition"
    >
      <div className="flex items-center gap-3">
        <Icon className="text-blue-600 dark:text-blue-400" size={24} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {expanded && (
      <div className="p-6">
        {children}
      </div>
    )}
  </div>
);

export default AddProductEnhanced;
