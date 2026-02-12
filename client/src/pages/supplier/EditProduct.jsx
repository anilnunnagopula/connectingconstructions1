import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Package, DollarSign, Award, FileText, Tag, MapPin,
  Image as ImageIcon, Plus, Trash2, Info, ChevronDown, ChevronUp, Sparkles // Sparkles for AI
} from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import SupplierLayout from "../../layout/SupplierLayout";
import categories, { getCategoryByName } from "../../utils/Categories";

// Constants
const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const BRANDS = {
  Cement: ["UltraTech", "ACC", "Ambuja", "Birla", "Dalmia", "JK Cement", "Shree", "Ramco"],
  "Steel & TMT": ["Tata Tiscon", "JSW", "SAIL", "Jindal", "Kamdhenu", "Vizag", "RINL"],
  Tiles: ["Kajaria", "Somany", "Nitco", "Johnson", "RAK", "Cera", "Orient Bell"],
  Paint: ["Asian Paints", "Berger", "Nerolac", "Dulux", "Indigo", "Shalimar"],
  Sanitary: ["Hindware", "Cera", "Jaquar", "Parryware", "Kohler", "Roca"],
};
const CERTIFICATIONS = [
  "ISI Marked", "BIS Certified", "ISO 9001:2015", "ISO 14001",
  "ASTM Standards", "CRS Certified", "BIS IS 1786:2008", "BIS IS 269:2015",
  "Eco-Friendly", "Green Pro Certified",
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Map Loader
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: ["places", "maps"],
  });

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
    productType: "material",
    userKeywords: "", // For AI

    // Pricing & Inventory
    price: "",
    unit: "units",
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

    // Images & Location
    imageFiles: [], // New files to upload
    imageUrls: [], // Existing URLs
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

  // Builders State
  const [newBulkTier, setNewBulkTier] = useState({ minQuantity: "", maxQuantity: "", pricePerUnit: "" });
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [newVariant, setNewVariant] = useState({
    name: "",
    options: [{ value: "", priceAdjustment: 0, stockQuantity: 0, sku: "" }]
  });

  // === FETCH PRODUCT ===
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
           navigate("/login");
           return;
        }
        const user = JSON.parse(storedUser);

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (!res.ok) throw new Error("Failed to fetch product");
        
        const data = await res.json();
        
        // Merge fetched data with default structure
        setProduct(prev => ({
          ...prev,
          ...data,
          // Ensure arrays/objects are initialized
          bulkPricing: data.bulkPricing || [],
          specifications: data.specifications || {},
          variants: data.variants || [],
          certifications: data.certifications || [],
          imageUrls: data.imageUrls || [],
          location: data.location || { text: "", lat: null, lng: null },
          contact: data.contact || { mobile: "", email: "", address: "" },
          userKeywords: data.userKeywords || "", // Retrieve keywords if stored
        }));
      } catch (err) {
        toast.error(err.message);
        navigate("/supplier/myproducts");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);


  // === HANDLERS ===
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

  // --- Bulk Pricing ---
  const addBulkPricingTier = () => {
    if (!newBulkTier.minQuantity || !newBulkTier.pricePerUnit) {
      toast.error("Please fill min quantity and price per unit");
      return;
    }
    setProduct(prev => ({
      ...prev,
      bulkPricing: [...prev.bulkPricing, { ...newBulkTier, maxQuantity: newBulkTier.maxQuantity || null }]
        .sort((a, b) => a.minQuantity - b.minQuantity)
    }));
    setNewBulkTier({ minQuantity: "", maxQuantity: "", pricePerUnit: "" });
  };
  const removeBulkPricingTier = (index) => {
    setProduct(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter((_, i) => i !== index)
    }));
  };

  // --- Specs ---
  const addSpecification = () => {
    if (!newSpec.key || !newSpec.value) {
      toast.error("Required fields missing");
      return;
    }
    setProduct(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [newSpec.key]: newSpec.value }
    }));
    setNewSpec({ key: "", value: "" });
  };
  const removeSpecification = (key) => {
    setProduct(prev => {
      const specs = { ...prev.specifications };
      delete specs[key];
      return { ...prev, specifications: specs };
    });
  };

  // --- Variants ---
  const addVariant = () => {
    if (!newVariant.name || newVariant.options.length === 0) {
      toast.error("Required fields missing");
      return;
    }
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { ...newVariant }]
    }));
    setNewVariant({ name: "", options: [{ value: "", priceAdjustment: 0, stockQuantity: 0, sku: "" }] });
  };
  const removeVariant = (index) => {
    setProduct(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };
  const updateVariantOption = (idx, field, val) => {
    setNewVariant(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === idx ? { ...opt, [field]: val } : opt)
    }));
  };
  const addVariantOption = () => {
    setNewVariant(prev => ({
      ...prev,
      options: [...prev.options, { value: "", priceAdjustment: 0, stockQuantity: 0, sku: "" }]
    }));
  };
  const removeVariantOption = (idx) => {
    setNewVariant(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };

  // --- Certs ---
  const toggleCertification = (cert) => {
    setProduct(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  // --- Images ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate count
    if (product.imageUrls.length + product.imageFiles.length + files.length > MAX_IMAGES) {
      toast.error(`Max ${MAX_IMAGES} images allowed in total.`);
      return;
    }
    // Validate size
    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(`Image ${file.name} is too large (>${MAX_IMAGE_SIZE_MB}MB)`);
        return;
      }
    }
    setProduct(prev => ({ ...prev, imageFiles: [...prev.imageFiles, ...files] }));
  };
  
  const removeExistingImage = (index) => {
    setProduct(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };
  
  const removeNewImage = (index) => {
    setProduct(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const uploadImagesToCloudinary = async (files) => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) return [];

    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST", body: formData
        });
        const data = await res.json();
        if (data.secure_url) urls.push(data.secure_url);
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
    return urls;
  };

  // --- AI Gen ---
  const handleGenerateDescription = async () => {
    if (!product.name && !product.category) {
      toast.error("Enter Name and Category first");
      return;
    }
    setAiLoading(true);
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const prompt = `Generate a concise (under 100 words), engaging product description for a construction material.\nProduct: ${product.name}\nCategory: ${product.category}\nKeywords: ${product.userKeywords || ''}`;
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        handleChange("description", data.candidates[0].content.parts[0].text);
        toast.success("Description generated!");
      }
    } catch (err) {
      toast.error("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  // --- Map ---
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setProduct(prev => ({
      ...prev,
      location: { ...prev.location, lat, lng, text: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` }
    }));
  };

  // === SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Upload new images
      let newUrls = [];
      if (product.imageFiles.length > 0) {
        toast.loading("Uploading new images...");
        newUrls = await uploadImagesToCloudinary(product.imageFiles);
        toast.dismiss();
      }
      
      const finalImageUrls = [...product.imageUrls, ...newUrls];
      
      if (finalImageUrls.length === 0) {
        toast.error("At least one image is required");
        setSubmitting(false);
        return;
      }
      
      const payload = {
        ...product,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
        gstRate: parseFloat(product.gstRate),
        imageUrls: finalImageUrls,
        // Exclude imageFiles from payload
        imageFiles: undefined 
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success("Product updated successfully!");
        navigate("/supplier/myproducts");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading product...</div>;

  return (
    <SupplierLayout>
      <div className="max-w-5xl mx-auto p-6 font-inter">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Update product details, pricing, and specifications</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: BASIC INFO */}
          <SectionCard icon={Package} title="Basic Information" expanded={expandedSections.basic} onToggle={() => toggleSection("basic")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Product Name *</label>
                <input required type="text" value={product.name} onChange={(e) => handleChange("name", e.target.value)} 
                   className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category *</label>
                <select required value={product.category} onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Select Category</option>
                  {allCategories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Product Type</label>
                <select value={product.productType} onChange={(e) => handleChange("productType", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                   <option value="material">Material</option>
                   <option value="product">Product</option>
                   <option value="service">Service</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium dark:text-gray-300">Description *</label>
                   <button type="button" onClick={handleGenerateDescription} disabled={aiLoading} 
                     className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                     <Sparkles size={14} /> {aiLoading ? "Generating..." : "Generate with AI"}
                   </button>
                </div>
                <input type="text" placeholder="Keywords (optional)" value={product.userKeywords} onChange={(e) => handleChange("userKeywords", e.target.value)}
                   className="w-full mb-2 px-3 py-1 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <textarea required rows={4} value={product.description} onChange={(e) => handleChange("description", e.target.value)} 
                   className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
          </SectionCard>

          {/* SECTION 2: PRICING */}
          <SectionCard icon={DollarSign} title="Pricing & Inventory" expanded={expandedSections.pricing} onToggle={() => toggleSection("pricing")}>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Price (₹) *</label>
                  <input required type="number" step="0.01" value={product.price} onChange={(e) => handleChange("price", e.target.value)} 
                     className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Unit *</label>
                  <select value={product.unit} onChange={(e) => handleChange("unit", e.target.value)} 
                     className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                     {["bags", "kg", "tonnes", "liters", "cubic_ft", "sq_ft", "pieces", "units"].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Stock Qty *</label>
                  <input required type="number" value={product.quantity} onChange={(e) => handleChange("quantity", e.target.value)} 
                     className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
               </div>
             </div>
             
             {/* Bulk Pricing UI */}
             <div className="mt-4 pt-4 border-t dark:border-gray-700">
               <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 dark:text-white"><Tag size={16}/> Bulk Pricing</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                 <input placeholder="Min Qty" type="number" value={newBulkTier.minQuantity} onChange={e => setNewBulkTier({...newBulkTier, minQuantity: e.target.value})} className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
                 <input placeholder="Max Qty" type="number" value={newBulkTier.maxQuantity} onChange={e => setNewBulkTier({...newBulkTier, maxQuantity: e.target.value})} className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
                 <input placeholder="Price" type="number" value={newBulkTier.pricePerUnit} onChange={e => setNewBulkTier({...newBulkTier, pricePerUnit: e.target.value})} className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
                 <button type="button" onClick={addBulkPricingTier} className="bg-blue-600 text-white rounded-lg flex items-center justify-center"><Plus size={18}/></button>
               </div>
               {product.bulkPricing.map((tier, i) => (
                 <div key={i} className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-1">
                   <span className="text-sm dark:text-white">{tier.minQuantity} - {tier.maxQuantity || "+"} : ₹{tier.pricePerUnit}</span>
                   <button type="button" onClick={() => removeBulkPricingTier(i)} className="text-red-500"><Trash2 size={14}/></button>
                 </div>
               ))}
             </div>
          </SectionCard>

          {/* SECTION 3: BRAND */}
          <SectionCard icon={Award} title="Brand & Quality" expanded={expandedSections.brand} onToggle={() => toggleSection("brand")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Brand</label>
                <input type="text" value={product.brand} onChange={(e) => handleChange("brand", e.target.value)} 
                   className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Grade/Quality</label>
                <input type="text" value={product.grade} onChange={(e) => handleChange("grade", e.target.value)} 
                   className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
          </SectionCard>

          {/* SECTION 4: SPECS */}
          <SectionCard icon={FileText} title="Specifications" expanded={expandedSections.specs} onToggle={() => toggleSection("specs")}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
               <input placeholder="Spec Key" value={newSpec.key} onChange={e => setNewSpec({...newSpec, key: e.target.value})} className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
               <input placeholder="Value" value={newSpec.value} onChange={e => setNewSpec({...newSpec, value: e.target.value})} className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
               <button type="button" onClick={addSpecification} className="bg-blue-600 text-white rounded-lg">Add</button>
            </div>
            {Object.entries(product.specifications).map(([k, v]) => (
               <div key={k} className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded mb-1">
                 <span className="text-sm dark:text-white font-medium">{k}: {v}</span>
                 <button type="button" onClick={() => removeSpecification(k)} className="text-red-500"><Trash2 size={14}/></button>
               </div>
            ))}
          </SectionCard>

           {/* SECTION 5: VARIANTS */}
          <SectionCard icon={Package} title="Variants" expanded={expandedSections.variants} onToggle={() => toggleSection("variants")}>
             <input placeholder="Variant Name" value={newVariant.name} onChange={e => setNewVariant({...newVariant, name: e.target.value})} className="w-full mb-2 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"/>
             {/* Simplified Variant Adder for Brevity - User can expand if needed */}
             <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-3">
                {newVariant.options.map((opt, i) => (
                   <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                      <input placeholder="Value" value={opt.value} onChange={e => updateVariantOption(i, 'value', e.target.value)} className="px-2 py-1 border rounded dark:bg-gray-800 dark:text-white"/>
                      <input placeholder="Price +/-" type="number" value={opt.priceAdjustment} onChange={e => updateVariantOption(i, 'priceAdjustment', e.target.value)} className="px-2 py-1 border rounded dark:bg-gray-800 dark:text-white"/>
                      <input placeholder="Stock" type="number" value={opt.stockQuantity} onChange={e => updateVariantOption(i, 'stockQuantity', e.target.value)} className="px-2 py-1 border rounded dark:bg-gray-800 dark:text-white"/>
                      {i > 0 && <button type="button" onClick={() => removeVariantOption(i)} className="text-red-500 text-xs">Remove Icon</button>}
                   </div>
                ))}
                <div className="flex gap-2">
                   <button type="button" onClick={addVariantOption} className="text-xs text-blue-600 underline">Add Option</button>
                   <button type="button" onClick={addVariant} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Save Variant</button>
                </div>
             </div>
             {product.variants.map((v, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border p-2 rounded mb-2 flex justify-between">
                   <span className="font-semibold dark:text-white">{v.name} ({v.options.length} options)</span>
                   <button type="button" onClick={() => removeVariant(i)} className="text-red-600"><Trash2 size={14}/></button>
                </div>
             ))}
          </SectionCard>

          {/* SECTION 6: IMAGES & LOCATION */}
          <SectionCard icon={ImageIcon} title="Images & Location" expanded={expandedSections.images} onToggle={() => toggleSection("images")}>
            <div className="mb-4">
               <label className="block text-sm font-medium mb-2 dark:text-gray-300">Images</label>
               <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full mb-2 dark:text-white"/>
               <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {product.imageUrls.map((url, i) => (
                    <div key={`url-${i}`} className="relative h-20 w-20 border rounded overflow-hidden">
                       <img src={url} alt="product" className="h-full w-full object-cover"/>
                       <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl"><Trash2 size={12}/></button>
                    </div>
                  ))}
                  {product.imageFiles.map((file, i) => (
                    <div key={`file-${i}`} className="relative h-20 w-20 border rounded overflow-hidden opacity-70">
                       <div className="h-full w-full flex items-center justify-center bg-gray-100 text-xs text-center p-1">{file.name}</div>
                       <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl"><Trash2 size={12}/></button>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium mb-1 dark:text-gray-300">Location Text *</label>
                 <input required type="text" value={product.location.text} onChange={(e) => handleChange("location", {...product.location, text: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Map Pin (Optional)</label>
                  {isMapLoaded && (
                    <GoogleMap mapContainerStyle={{ width: "100%", height: "200px", borderRadius: "8px" }}
                      center={product.location.lat ? { lat: product.location.lat, lng: product.location.lng } : { lat: 17.385, lng: 78.486 }}
                      zoom={13} onClick={handleMapClick}>
                      {product.location.lat && <Marker position={{ lat: product.location.lat, lng: product.location.lng }} />}
                    </GoogleMap>
                  )}
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
             <button type="button" onClick={() => navigate("/supplier/myproducts")} className="px-6 py-2 border rounded-lg hover:bg-gray-50 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800">Cancel</button>
             <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {submitting ? "Updating..." : "Update Product"}
             </button>
          </div>
          
        </form>
      </div>
    </SupplierLayout>
  );
};

// SectionCard Component
const SectionCard = ({ icon: Icon, title, children, expanded, onToggle }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
    <button type="button" onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 hover:from-blue-100 dark:hover:from-gray-600 transition">
      <div className="flex items-center gap-3">
        <Icon className="text-blue-600 dark:text-blue-400" size={24} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {expanded ? <ChevronUp size={20} className="dark:text-gray-300"/> : <ChevronDown size={20} className="dark:text-gray-300"/>}
    </button>
    {expanded && <div className="p-6 transition-all duration-300 ease-in-out">{children}</div>}
  </div>
);

export default EditProduct;
