import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Edit,
  Eye,
  Copy,
  Upload,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  fetchProducts,
  duplicateProduct,
} from "../../services/dashboardService";
import SupplierLayout from "../../layout/SupplierLayout";
import categories from "../../utils/Categories";

/**
 * Production-Ready Product List Component
 * Features:
 * - Search, filter, sort
 * - Grid/List view toggle
 * - Pagination
 * - Bulk actions
 * - Stock management
 * - Responsive design
 */
const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ==================== STATE ====================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // View & Filters
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || "all",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "date-desc");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1,
  );

  // Bulk selection
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Categories from shared utils (with "All" prepended)
  const allCategories = [{ name: "All" }, ...categories];

  // ==================== LOAD PRODUCTS ====================
 const loadProducts = useCallback(async () => {
  setLoading(true);

  try {
    const filters = {
      search: searchQuery,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      sort: sortBy,
      page: currentPage,
      limit: 20,
    };

    const response = await fetchProducts(filters);
    
    console.log("🔍 Products Response:", response); // ADD THIS
    console.log("🔍 Products Data:", response.data); // ADD THIS

    if (!response.success) {
      throw new Error(response.error);
    }

    setProducts(response.data.products || []);
    setTotalPages(response.data.totalPages || 1);
    setTotalProducts(response.data.total || 0);
  } catch (error) {
    console.error("Load products error:", error);
    toast.error(error.message || "Failed to load products");
  } finally {
    setLoading(false);
  }
}, [searchQuery, selectedCategory, selectedStatus, sortBy, currentPage, setSearchParams]);
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ==================== ACTIONS ====================
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase());
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);

    // update URL only when user explicitly changes sort
    setSearchParams({ sort: value });
  };


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id || p.id));
    }
  };

  const handleDuplicate = async (productId) => {
    try {
      const response = await duplicateProduct(productId);
      if (!response.success) throw new Error(response.error);
      toast.success("Product duplicated! Edit the copy to update details.");
      loadProducts(); // Refresh product list
    } catch (error) {
      toast.error(error.message || "Failed to duplicate product");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedProducts.length} products?`)) return;

    toast.error("Bulk delete functionality - implement API call here");
    // Implement bulk delete API call
  };

  const handleBulkActivate = async () => {
    toast.error("Bulk activate functionality - implement API call here");
    // Implement bulk activate API call
  };

  // ==================== RENDER HELPERS ====================
  const getStockBadge = (stock = 0, threshold = 10) => {
    if (stock === 0 || stock == null) {
      return (
        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
          Out of Stock
        </span>
      );
    }
    if (stock <= threshold) {
      return (
        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
          Low Stock
        </span>
      );
    }
    return (
      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
        In Stock
      </span>
    );
  };

  const ProductCardGrid = ({ product }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {product.imageUrls && product.imageUrls[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={selectedProducts.includes(product._id || product.id)}
          onChange={() => toggleSelectProduct(product._id || product.id)}
          className="absolute top-3 left-3 w-5 h-5 cursor-pointer"
        />

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          {getStockBadge(product.quantity)}
        </div>

        {/* Product type badge */}
        {product.productType && (
          <div className="absolute bottom-3 left-3">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              product.productType === "material"
                ? "bg-blue-100 text-blue-700"
                : product.productType === "service"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {product.productType}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white truncate">
          {product.name}
        </h3>

        {/* Category & Brand */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.category && (
            <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
          {product.brand && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {product.brand}
            </span>
          )}
          {product.grade && (
            <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
              {product.grade}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-green-600">
            ₹{product.price?.toLocaleString()}
            {product.unit && <span className="text-sm font-normal text-gray-500">/{product.unit}</span>}
          </span>
          {product.productType !== "service" && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Qty: {product.quantity ?? 0}
            </span>
          )}
        </div>

        {/* Construction details row */}
        {(product.packaging || product.hsnCode) && (
          <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            {product.packaging && <span>Pkg: {product.packaging}</span>}
            {product.hsnCode && <span>HSN: {product.hsnCode}</span>}
            {product.gstRate != null && <span>GST: {product.gstRate}%</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/supplier/edit-product/${product._id || product.id}`)
            }
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDuplicate(product._id || product.id)}
            className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600 text-sm font-medium flex items-center justify-center"
            title="Duplicate Product"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              navigate(`/supplier/products/${product._id || product.id}`)
            }
            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 text-sm font-medium flex items-center justify-center"
            title="View Product"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ProductRowList = ({ product }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition border border-gray-100 dark:border-gray-700">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selectedProducts.includes(product._id || product.id)}
        onChange={() => toggleSelectProduct(product._id || product.id)}
        className="w-5 h-5 cursor-pointer"
      />

      {/* Image */}
      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
        {product.imageUrls && product.imageUrls[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {product.category || "N/A"}
          {product.brand && ` • ${product.brand}`}
          {product.grade && ` • ${product.grade}`}
        </p>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="text-xl font-bold text-green-600">
          ₹{product.price?.toLocaleString()}
          {product.unit && <span className="text-xs font-normal text-gray-500">/{product.unit}</span>}
        </p>
        {product.productType !== "service" && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Qty: {product.quantity ?? 0}
          </p>
        )}
      </div>

      {/* Stock Badge */}
      <div>{getStockBadge(product.quantity)}</div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() =>
            navigate(`/supplier/edit-product/${product._id || product.id}`)
          }
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDuplicate(product._id || product.id)}
          className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            navigate(`/supplier/products/${product._id || product.id}`)
          }
          className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // ==================== LOADING STATE ====================
  if (loading && products.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl h-80"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <SupplierLayout>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                My Products
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {totalProducts} product{totalProducts !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/supplier/bulk-upload")}
                className="bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 font-semibold flex items-center gap-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                Bulk Upload
              </button>
              <button
                onClick={() => navigate("/supplier/add-product")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
            {/* Search bar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, description..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              {/* View toggle */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600" : ""}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-600" : ""}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filters toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Category filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat.name} value={cat.name.toLowerCase()}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock-asc">Stock: Low to High</option>
                    <option value="stock-desc">Stock: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Bulk actions */}
          {selectedProducts.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg mb-6 flex items-center justify-between">
              <p className="text-blue-900 dark:text-blue-200 font-medium">
                {selectedProducts.length} product
                {selectedProducts.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkActivate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Activate
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Products display */}
          {products.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery ||
                selectedCategory !== "all" ||
                selectedStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding your first product"}
              </p>
              <button
                onClick={() => navigate("/supplier/add-product")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Add Product
              </button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCardGrid
                      key={product._id || product.id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {products.map((product) => (
                    <ProductRowList
                      key={product._id || product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white dark:bg-gray-800 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-white dark:bg-gray-800 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
};

export default ProductList;