import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Tag, Calendar, Percent, Layers, Box, Info,
  ChevronDown, ChevronUp, Save, ArrowLeft
} from "lucide-react";
import SupplierLayout from "../../layout/SupplierLayout";

const OfferFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState({
    name: "",
    description: "",
    code: "", // New field
    type: "PERCENTAGE",
    value: "",
    startDate: "",
    endDate: "",
    usageLimit: "", // New field
    applyTo: "ALL_PRODUCTS",
    selectedProducts: [],
    selectedCategories: [],
  });

  const [supplierProducts, setSupplierProducts] = useState([]);
  const [supplierCategories, setSupplierCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    rules: true,
    schedule: true,
    applicability: true,
  });

  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      return null;
    }
  }, []);

  const fetchDataForOfferForm = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      toast.error("Authentication required");
      navigate("/login");
      return;
    }

    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/supplier/myproducts`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${process.env.REACT_APP_API_URL}/api/supplier/categories`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!productsRes.ok) throw new Error("Failed to fetch products");
      if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setSupplierProducts(productsData.data || []);
      setSupplierCategories(Array.isArray(categoriesData) ? categoriesData : []);

      if (id) {
        const offerRes = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/offers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!offerRes.ok) throw new Error("Failed to fetch offer details");
        
        const offerData = await offerRes.json();
        setOffer({
          ...offerData,
          code: offerData.code || "",
          usageLimit: offerData.usageLimit || "",
          startDate: offerData.startDate ? new Date(offerData.startDate).toISOString().split("T")[0] : "",
          endDate: offerData.endDate ? new Date(offerData.endDate).toISOString().split("T")[0] : "",
          selectedProducts: Array.isArray(offerData.selectedProducts) ? offerData.selectedProducts.map(p => p._id) : [],
          selectedCategories: Array.isArray(offerData.selectedCategories) ? offerData.selectedCategories.map(c => c._id) : [],
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, getToken]);

  useEffect(() => {
    fetchDataForOfferForm();
  }, [fetchDataForOfferForm]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e, field) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selectedValues.push(options[i].value);
    }
    setOffer(prev => ({ ...prev, [field]: selectedValues }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    const token = getToken();

    // Validation
    if (!offer.name || !offer.type || !offer.value || !offer.startDate || !offer.endDate) {
      toast.error("Please fill all required fields");
      setFormSubmitting(false);
      return;
    }
    if (new Date(offer.startDate) >= new Date(offer.endDate)) {
      toast.error("Start date must be before end date");
      setFormSubmitting(false);
      return;
    }
    if (offer.applyTo === "SPECIFIC_PRODUCTS" && offer.selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      setFormSubmitting(false);
      return;
    }
    if (offer.applyTo === "SPECIFIC_CATEGORIES" && offer.selectedCategories.length === 0) {
        toast.error("Please select at least one category");
        setFormSubmitting(false);
        return;
    }

    try {
      const payload = { ...offer };
      if (payload.applyTo === "ALL_PRODUCTS") {
        delete payload.selectedProducts;
        delete payload.selectedCategories;
      } else if (payload.applyTo === "SPECIFIC_PRODUCTS") {
        delete payload.selectedCategories;
      } else if (payload.applyTo === "SPECIFIC_CATEGORIES") {
        delete payload.selectedProducts;
      }
      
      // Handle empty string for code/usageLimit appropriately
      if (!payload.code) delete payload.code;
      if (!payload.usageLimit) payload.usageLimit = null;

      const url = id 
        ? `${process.env.REACT_APP_API_URL}/api/supplier/offers/${id}`
        : `${process.env.REACT_APP_API_URL}/api/supplier/offers`;
      
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save offer");

      toast.success(id ? "Offer updated successfully" : "Offer created successfully");
      navigate("/supplier/offers");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <SupplierLayout>
      <div className="max-w-4xl mx-auto p-6 font-inter">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate("/supplier/offers")} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
             <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300"/>
          </button>
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{id ? "Edit Offer" : "Create New Offer"}</h1>
             <p className="text-gray-600 dark:text-gray-400 mt-1">Configure discounts and promotions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* BASIC DETAILS */}
            <SectionCard icon={Tag} title="Basic Details" expanded={expandedSections.basic} onToggle={() => toggleSection("basic")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Offer Name *</label>
                        <input required type="text" name="name" value={offer.name} onChange={handleChange}
                            placeholder="e.g. Summer Sale"
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Offer Code (Optional)</label>
                        <input type="text" name="code" value={offer.code} onChange={(e) => handleChange({...e, target: {...e.target, value: e.target.value.toUpperCase()}})}
                            placeholder="SUMMER20"
                            className="w-full px-4 py-2 border rounded-lg uppercase tracking-wide dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                            <p className="text-xs text-gray-500 mt-1">Codes must be unique.</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                        <textarea name="description" rows={3} value={offer.description} onChange={handleChange}
                             className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                </div>
            </SectionCard>

            {/* DISCOUNT RULES */}
            <SectionCard icon={Percent} title="Discount Rules" expanded={expandedSections.rules} onToggle={() => toggleSection("rules")}>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Type *</label>
                        <select name="type" value={offer.type} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Value *</label>
                        <input required type="number" name="value" value={offer.value} onChange={handleChange} min={0}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div>
                         <label className="block text-sm font-medium mb-1 dark:text-gray-300">Usage Limit (Optional)</label>
                         <input type="number" name="usageLimit" value={offer.usageLimit} onChange={handleChange} min={1}
                             placeholder="Total redemptions"
                             className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                 </div>
            </SectionCard>

            {/* SCHEDULE */}
            <SectionCard icon={Calendar} title="Schedule" expanded={expandedSections.schedule} onToggle={() => toggleSection("schedule")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Start Date *</label>
                        <input required type="date" name="startDate" value={offer.startDate} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">End Date *</label>
                        <input required type="date" name="endDate" value={offer.endDate} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                </div>
            </SectionCard>

            {/* APPLICABILITY */}
            <SectionCard icon={Layers} title="Applicability" expanded={expandedSections.applicability} onToggle={() => toggleSection("applicability")}>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Apply To *</label>
                        <select name="applyTo" value={offer.applyTo} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="ALL_PRODUCTS">All Products</option>
                            <option value="SPECIFIC_PRODUCTS">Specific Products</option>
                            <option value="SPECIFIC_CATEGORIES">Specific Categories</option>
                        </select>
                     </div>

                     {offer.applyTo === "SPECIFIC_PRODUCTS" && (
                         <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Select Products</label>
                            <select multiple value={offer.selectedProducts} onChange={(e) => handleMultiSelect(e, 'selectedProducts')}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white h-40">
                                {supplierProducts.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                         </div>
                     )}

                     {offer.applyTo === "SPECIFIC_CATEGORIES" && (
                         <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Select Categories</label>
                            <select multiple value={offer.selectedCategories} onChange={(e) => handleMultiSelect(e, 'selectedCategories')}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white h-40">
                                {supplierCategories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                             <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                         </div>
                     )}
                </div>
            </SectionCard>

            <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
                <button type="button" onClick={() => navigate("/supplier/offers")} 
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800">
                    Cancel
                </button>
                <button type="submit" disabled={formSubmitting} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                    <Save size={18}/> {formSubmitting ? "Saving..." : "Save Offer"}
                </button>
            </div>
        </form>
      </div>
    </SupplierLayout>
  );
};

const SectionCard = ({ icon: Icon, title, children, expanded, onToggle }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 mb-4">
    <button type="button" onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 hover:from-blue-100 dark:hover:from-gray-600 transition">
      <div className="flex items-center gap-3">
        <Icon className="text-blue-600 dark:text-blue-400" size={24} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {expanded ? <ChevronUp size={20} className="dark:text-gray-300"/> : <ChevronDown size={20} className="dark:text-gray-300"/>}
    </button>
    {expanded && <div className="p-6">{children}</div>}
  </div>
);

export default OfferFormPage;
