// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// const MyProducts = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");

//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setMessage("");
//     setMessageType("");

//     let supplierEmail = null;
//     let token = null;

//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         supplierEmail = user.email;
//         token = user.token;
//       }
//     } catch (err) {
//       console.error("Error parsing user from localStorage:", err);
//       setError("Failed to retrieve user information. Please log in again.");
//       setMessageType("error");
//       setLoading(false);
//       navigate("/login");
//       return;
//     }

//     if (!supplierEmail || !token) {
//       setError("Supplier not logged in. Please log in to view products.");
//       setMessageType("error");
//       setLoading(false);
//       navigate("/login");
//       return;
//     }

//     try {
//       const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/myproducts`; // Fetching only supplier's products
//       console.log("Fetching products from:", apiUrl);

//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Include the authentication token
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || data.error || "Failed to fetch products."
//         );
//       }

//       setProducts(data.data);
//       setMessage("Products loaded successfully!");
//       setMessageType("success");
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setError(
//         err.message || "An unexpected error occurred while fetching products."
//       );
//       setMessageType("error");
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage("");
//         setMessageType("");
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const handleDeleteProduct = async (productId, productName) => {
//     // START of the requested block
//     if (
//       window.confirm(
//         `Are you sure you want to delete "${productName}"? This action cannot be undone.`
//       )
//     ) {
//       setLoading(true); // Maybe a local loading for the card or a global overlay
//       setMessage("");
//       setMessageType("");

//       let token = null;
//       try {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           const user = JSON.parse(storedUser);
//           token = user.token;
//         }
//       } catch (err) {
//         console.error("Error parsing user from localStorage for delete:", err);
//         setMessage("Authentication error. Please log in again.");
//         setMessageType("error");
//         setLoading(false);
//         navigate("/login");
//         return;
//       }

//       if (!token) {
//         setMessage("Not authenticated to delete products. Please log in.");
//         setMessageType("error");
//         setLoading(false);
//         navigate("/login");
//         return;
//       }

//       try {
//         const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${productId}`;
//         const response = await fetch(apiUrl, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Include the token for deletion
//           },
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(
//             data.message || data.error || "Failed to delete product."
//           );
//         }

//         setProducts((prevProducts) =>
//           prevProducts.filter((product) => product._id !== productId)
//         );
//         setMessage(`"${productName}" deleted successfully!`);
//         setMessageType("success");
//       } catch (err) {
//         console.error("Error deleting product:", err);
//         setMessage(
//           err.message || "Failed to delete product. Please try again."
//         );
//         setMessageType("error");
//       } finally {
//         setLoading(false); // Reset loading
//       }
//     }
//   };

//   const handleToggleAvailability = async (productId, currentAvailability) => {
//     setLoading(true); // Global loading for simplicity, could be per-card
//     setMessage("");
//     setMessageType("");

//     let token = null;
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         token = user.token;
//       }
//     } catch (err) {
//       console.error(
//         "Error parsing user from localStorage for availability toggle:",
//         err
//       );
//       setMessage("Authentication error. Please log in again.");
//       setMessageType("error");
//       setLoading(false);
//       navigate("/login");
//       return;
//     }

//     if (!token) {
//       setMessage("Not authenticated to update product. Please log in.");
//       setMessageType("error");
//       setLoading(false);
//       navigate("/login");
//       return;
//     }

//     try {
//       const newAvailability = !currentAvailability;
//       const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${productId}`;
//       const response = await fetch(apiUrl, {
//         method: "PUT", // Assuming your updateProduct endpoint handles PUT requests
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ availability: newAvailability }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || data.error || "Failed to update product availability."
//         );
//       }

//       setProducts((prevProducts) =>
//         prevProducts.map((product) =>
//           product._id === productId
//             ? { ...product, availability: newAvailability }
//             : product
//         )
//       );
//       setMessage(
//         `Product availability updated to ${
//           newAvailability ? "Available" : "Not Available"
//         }!`
//       );
//       setMessageType("success");
//     } catch (err) {
//       console.error("Error toggling product availability:", err);
//       setMessage(
//         err.message || "Failed to update availability. Please try again."
//       );
//       setMessageType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-400"></div>
//         <p className="mt-4 text-lg font-medium">Loading your products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
//         <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-8 rounded-lg shadow-xl text-center border border-red-200 dark:border-red-700">
//           <p className="font-bold text-2xl mb-4">Error Loading Products!</p>
//           <p className="text-lg mb-6">{error}</p>
//           <button
//             onClick={() => fetchProducts()}
//             className="mt-6 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
//           >
//             🔄 Retry Loading Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans">
//       <div className="max-w-7xl mx-auto p-4 md:p-10 lg:p-12">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight leading-tight">
//             My Products
//           </h2>
//         </div>

//         {message && (
//           <div
//             className={`mb-8 p-4 rounded-lg text-center font-medium shadow-md ${
//               messageType === "success"
//                 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
//                 : messageType === "info"
//                 ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
//                 : messageType === "warning"
//                 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
//                 : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
//             } transition-colors duration-300`}
//           >
//             {message}
//           </div>
//         )}

//         {products.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-colors duration-300 border border-gray-100 dark:border-gray-700">
//             <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-8">
//               It looks like you haven't added any products yet.
//             </p>
//             <button
//               onClick={() => navigate("/add-product")}
//               className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-10 py-4 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-70"
//             >
//               <span className="mr-2 text-2xl">✨</span> Add Your First Product
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {" "}
//             {/* Adjusted to 3 columns on large screens */}
//             {products.map((product) => (
//               <div
//                 key={product._id}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col border border-gray-100 dark:border-gray-700"
//               >
//                 {/* Made image and main content clickable */}
//                 <div
//                   className="cursor-pointer" // Add cursor pointer to indicate clickability
//                   onClick={() => navigate(`/supplier/product/${product._id}`)} // Navigate to product detail page
//                 >
//                   <div className="relative">
//                     {product.imageUrls && product.imageUrls.length > 0 ? (
//                       <img
//                         src={product.imageUrls[0]}
//                         alt={product.name}
//                         className="w-full h-56 object-cover rounded-t-xl"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src =
//                             "https://placehold.co/600x400/e0e0e0/555555?text=No+Image+Available";
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 rounded-t-xl flex items-center justify-center text-gray-500 dark:text-gray-400 text-base font-semibold">
//                         No Image Available
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-6 flex flex-col flex-grow">
//                     <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
//                       {product.name}
//                     </h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
//                       <span className="font-semibold mr-2">Category:</span>{" "}
//                       <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
//                         {product.category}
//                       </span>
//                     </p>
//                     <p className="text-base text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
//                       {product.description || "No description provided."}
//                     </p>

//                     <div className="mt-auto">
//                       <p className="text-3xl font-extrabold text-green-600 dark:text-green-400 mb-2">
//                         ₹{parseFloat(product.price).toLocaleString("en-IN")}
//                       </p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center">
//                         <span className="font-semibold mr-1">Quantity:</span>{" "}
//                         {product.quantity} units
//                       </p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center">
//                         <span className="font-semibold mr-1">Location:</span>{" "}
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4 mr-1 text-red-500"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         {product.location?.text || "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Consolidated Actions Row */}
//                 <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center space-x-2">
//                   {/* Availability Toggle */}
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                       {product.availability ? "Available" : "Not Available"}
//                     </span>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={product.availability}
//                         onChange={() =>
//                           handleToggleAvailability(
//                             product._id,
//                             product.availability
//                           )
//                         }
//                         className="sr-only peer"
//                         disabled={loading} // Disable toggle while another operation is ongoing
//                       />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>

//                   {/* Edit Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent card click from triggering
//                       navigate(`/supplier/edit-product/${product._id}`);
//                     }}
//                     className="flex-grow-0 flex-shrink-0 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                     title="Edit Product"
//                     disabled={loading} // Disable while another operation is ongoing
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="w-5 h-5"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
//                       />
//                     </svg>
//                   </button>

//                   {/* Delete Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent card click from triggering
//                       handleDeleteProduct(product._id, product.name);
//                     }}
//                     className="flex-grow-0 flex-shrink-0 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
//                     title="Delete Product"
//                     disabled={loading} // Disable while another operation is ongoing
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="w-5 h-5"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165M12 2.25L12 2.25c-1.103 0-2.203.15-3.303.447L12 2.25c-1.103 0-2.203.15-3.303.447"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyProducts;
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
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  fetchProducts,
  updateProductStock,
} from "../../services/dashboardService";
import SupplierLayout from "../../layout/SupplierLayout"; // Import SupplierLayout

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

  // Categories (hardcoded for now, fetch from API in production)
  const categories = [
    "All",
    "Cement",
    "Steel",
    "Bricks",
    "Sand",
    "Aggregates",
    "Paints",
    "Tiles",
    "Wood",
    "Electrical",
    "Plumbing",
    "Tools",
    "Other",
  ];

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
  const getStockBadge = (stock, threshold = 10) => {
    if (stock === 0) {
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
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
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
          {getStockBadge(product.stock, product.lowStockThreshold)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          SKU: {product.sku || "N/A"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            ₹{product.price?.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Stock: {product.stock}
          </span>
        </div>

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
            onClick={() =>
              navigate(`/supplier/products/${product._id || product.id}`)
            }
            className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium flex items-center justify-center gap-1"
          >
            <Eye className="w-4 h-4" />
            View
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
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
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
          SKU: {product.sku || "N/A"} • Category: {product.category || "N/A"}
        </p>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="text-xl font-bold text-green-600">
          ₹{product.price?.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stock: {product.stock}
        </p>
      </div>

      {/* Stock Badge */}
      <div>{getStockBadge(product.stock, product.lowStockThreshold)}</div>

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
            <button
              onClick={() => navigate("/supplier/add-product")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
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
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
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