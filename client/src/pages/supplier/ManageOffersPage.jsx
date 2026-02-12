import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Plus, Edit, Trash2, Copy, Tag, Calendar, 
  CheckCircle, Clock, XCircle, AlertTriangle 
} from 'lucide-react';
import SupplierLayout from '../../layout/SupplierLayout';

const ManageOffersPage = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Helper to get token
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      return null;
    }
  }, []);

  // Fetch Offers
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const token = getToken();

    if (!token) {
      toast.error("Authentication required");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/offers`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch offers");

      setOffers(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error loading offers");
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Actions
  const handleDelete = async (offerId, offerName) => {
    if (!window.confirm(`Delete offer "${offerName}"? This cannot be undone.`)) return;

    setDeletingId(offerId);
    const token = getToken();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/supplier/offers/${offerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to delete");
      }

      toast.success("Offer deleted successfully");
      fetchOffers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const getStatusBadge = (offer) => {
    let status = offer.status;
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);

    // Client-side status logic override for immediate feedback
    if (now > end) status = "Expired";
    else if (now < start) status = "Scheduled";
    else if (status === "Active" && offer.usageLimit && offer.usedCount >= offer.usageLimit) status = "Depleted";

    switch (status) {
      case "Active":
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"><CheckCircle size={12}/> Active</span>;
      case "Scheduled":
        return <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"><Clock size={12}/> Scheduled</span>;
      case "Expired":
        return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"><XCircle size={12}/> Expired</span>;
      case "Depleted":
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium"><AlertTriangle size={12}/> Depleted</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{status}</span>;
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <div className="p-10 text-center">Loading offers...</div>;

  return (
    <SupplierLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter p-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Offers</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage your verified discounts</p>
            </div>
            <button onClick={() => navigate("/supplier/create-offer")} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm font-medium">
              <Plus size={18}/> Create Offer
            </button>
          </div>

          {offers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag size={32}/>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Offers Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create your first offer to attract more customers and boost sales.
              </p>
              <button onClick={() => navigate("/supplier/create-offer")} className="text-blue-600 font-medium hover:underline">
                Create First Offer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map(offer => (
                <div key={offer._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1" title={offer.name}>{offer.name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{offer.description || "No description"}</p>
                    </div>
                    {getStatusBadge(offer)}
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-5 flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {offer.type === "PERCENTAGE" ? `${offer.value}%` : `₹${offer.value}`}
                            </span>
                            <span className="text-xs text-gray-500 uppercase font-semibold bg-gray-100 px-1.5 py-0.5 rounded">OFF</span>
                        </div>
                        {offer.code ? (
                            <button onClick={() => copyToClipboard(offer.code)} 
                                className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-xs font-mono font-medium transition text-gray-700 dark:text-gray-300" title="Copy Code">
                                {offer.code} <Copy size={12}/>
                            </button>
                        ) : (
                            <span className="text-xs text-gray-400 italic">No Code</span>
                        )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400"/>
                            <span>{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <Tag size={14} className="text-gray-400"/>
                             <span className="capitalize">{offer.applyTo.replace('_', ' ').toLowerCase()}</span>
                        </div>
                        {offer.usageLimit && (
                             <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                    <span className="bg-blue-500 h-1.5 rounded-full block" style={{width: `${Math.min((offer.usedCount/offer.usageLimit)*100, 100)}%`}}></span>
                                </span>
                                <span>{offer.usedCount}/{offer.usageLimit} Used</span>
                             </div>
                        )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                     <button onClick={() => navigate(`/supplier/offers/${offer._id}/edit`)} 
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition" title="Edit">
                        <Edit size={18}/>
                     </button>
                     <button onClick={() => handleDelete(offer._id, offer.name)} disabled={deletingId === offer._id}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition disabled:opacity-50" title="Delete">
                        <Trash2 size={18}/>
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

export default ManageOffersPage;