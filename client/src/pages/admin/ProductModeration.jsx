// client/src/pages/admin/ProductModeration.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const ProductModeration = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Todo: Add backend endpoint for products with cleanup actions
  // For now using the public endpoint with client-side filtering as a placeholder
  // Ideally, we need GET /api/admin/products

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      
      const baseURL = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${baseURL}/api/products?page=${page}&limit=20`, {
         // Although public, we might want to pass token if needed later, but standard get products is public. 
         // But let's keep consistency if we change to admin route later. 
         // For now, the endpoint is public so it doesn't strictly need auth, 
         // but if we switch to /api/admin/products it will.
      });
      // API returns: { success: true, data: [...], pagination: { ... } }
      setProducts(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      setProducts([]); // Fallback to avoid undefined errors
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Delete this product? This cannot be undone.")) return;
      
      try {
          const storedUser = localStorage.getItem("user");
          const token = storedUser ? JSON.parse(storedUser).token : null;
          const baseURL = process.env.REACT_APP_API_URL;
          await axios.delete(`${baseURL}/api/admin/products/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          toast.success("Product deleted successfully");
          setProducts(products.filter(p => p._id !== id));
      } catch (error) {
          console.error("Delete error:", error);
          toast.error("Failed to delete product");
      }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Product Moderation</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Supplier</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                 <tr><td colSpan="5" className="p-10 text-center">Loading...</td></tr>
            ) : products.length === 0 ? (
                 <tr><td colSpan="5" className="p-10 text-center">No products found</td></tr>
            ) : (
                products.map(product => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 flex items-center gap-3">
                            <img 
                                src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                                alt={product.name} 
                                className="w-10 h-10 rounded object-cover"
                            />
                            <span className="font-medium text-gray-900">{product.name}</span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                            {product.supplier?.name || "Unknown"}
                            {product.supplier?.isVerified && (
                                <span className="ml-1 text-blue-500" title="Verified Supplier">✓</span>
                            )}
                        </td>
                        <td className="p-4 text-sm text-gray-600">{product.category}</td>
                        <td className="p-4 text-sm font-semibold">₹{product.price}</td>
                        <td className="p-4 flex gap-2">
                             <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View">
                                 <Eye size={18} />
                             </button>
                             <button 
                                onClick={() => handleDelete(product._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded" 
                                title="Delete"
                             >
                                 <Trash2 size={18} />
                             </button>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
              Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
              Next
          </button>
      </div>
    </div>
  );
};

export default ProductModeration;
