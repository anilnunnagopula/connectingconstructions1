import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Search, Plus, Edit2, Trash2, X, Save,
  FolderOpen, AlertCircle, CheckCircle, ArrowLeft
} from "lucide-react";
import SupplierLayout from "../../layout/SupplierLayout";
import globalCategoriesData from "../../utils/Categories";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [selectedGlobal, setSelectedGlobal] = useState("");

  // Get Token Helper
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      return null;
    }
  }, []);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      toast.error("Authentication required");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Derived State: Filtered Categories
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, searchQuery]);

  // Handlers
  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({ name: category.name });
    setSelectedGlobal("");
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This might affect products linked to this category.`)) return;

    const token = getToken();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Delete failed");
      }
      
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nameToSubmit = editingId ? formData.name.trim() : (selectedGlobal || formData.name.trim());

    if (!nameToSubmit) {
      toast.error("Category name is required");
      return;
    }

    // Check duplicates locally
    if (!editingId && categories.some(c => c.name.toLowerCase() === nameToSubmit.toLowerCase())) {
        toast.error("Category already and exists");
        return;
    }

    setSubmitting(true);
    const token = getToken();
    const url = editingId 
        ? `${process.env.REACT_APP_API_URL}/api/supplier/categories/${editingId}`
        : `${process.env.REACT_APP_API_URL}/api/supplier/categories`;
    
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: nameToSubmit })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");

      toast.success(editingId ? "Category updated" : "Category added");
      setFormData({ name: "" });
      setSelectedGlobal("");
      setEditingId(null);
      setIsFormOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: "" });
    setSelectedGlobal("");
  };

  return (
    <SupplierLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                 Manage Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Organize your products with custom categories</p>
            </div>
            {!isFormOpen && (
                <button onClick={() => setIsFormOpen(true)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm font-medium">
                <Plus size={18}/> Add Category
                </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {isFormOpen && (
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {editingId ? "Edit Category" : "Add New Category"}
                    </h3>
                    <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={20}/>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!editingId && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quick Select</label>
                                <select 
                                    value={selectedGlobal} 
                                    onChange={(e) => {
                                        setSelectedGlobal(e.target.value);
                                        setFormData({ name: "" }); // Clear custom if selected
                                    }}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option value="">-- Choose from suggestions --</option>
                                    {globalCategoriesData.map((cat, i) => (
                                        <option key={i} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-center pt-6">
                                <span className="text-gray-400 font-medium">- OR -</span>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {editingId ? "Category Name" : "Custom Name"}
                        </label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => {
                                setFormData({ name: e.target.value });
                                setSelectedGlobal(""); // Clear select if typing
                            }}
                            placeholder="e.g. Premium Teak Wood"
                            disabled={!!selectedGlobal}
                            className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${selectedGlobal ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={cancelForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} 
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                            {submitting ? "Saving..." : <><Save size={18}/> Save Category</>}
                        </button>
                    </div>
                </form>
             </div>
          )}

          {/* Search & List */}
          <div className="relative mb-6">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
             <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm dark:text-white"
             />
          </div>

          {loading ? (
             <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading categories...</p>
             </div>
          ) : filteredCategories.length === 0 ? (
             <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <FolderOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4"/>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No categories found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
                    {searchQuery ? "Try a different search term" : "Start by adding your first category"}
                </p>
                {!searchQuery && (
                    <button onClick={() => setIsFormOpen(true)} className="text-blue-600 font-medium hover:underline">
                        Create New Category
                    </button>
                )}
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map(cat => (
                    <div key={cat._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl text-left border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition group flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <FolderOpen size={20}/>
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-white">{cat.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(cat)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition">
                                <Edit2 size={16}/>
                            </button>
                            <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition">
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
             </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
};

export default CategoriesPage;
