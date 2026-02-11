import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, CheckCircle, XCircle, AlertTriangle, Eye, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [resolvingId, setResolvingId] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, [page, filterStatus]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const baseURL = process.env.REACT_APP_API_URL;
      
      const query = `page=${page}&limit=20${filterStatus ? `&status=${filterStatus}` : ''}`;
      const res = await axios.get(`${baseURL}/api/complaints?${query}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      setComplaints(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Mark this complaint as ${status}?`)) return;
    
    try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const baseURL = process.env.REACT_APP_API_URL;

        await axios.patch(`${baseURL}/api/complaints/${id}`, 
            { status, adminNotes: adminNote },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(`Complaint marked as ${status}`);
        setResolvingId(null);
        setAdminNote("");
        fetchComplaints();
    } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'resolved': return 'text-green-600 bg-green-100';
          case 'dismissed': return 'text-gray-600 bg-gray-100';
          case 'investigating': return 'text-yellow-600 bg-yellow-100';
          default: return 'text-red-600 bg-red-100';
      }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Complaint Management</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select 
                className="border rounded p-2 text-sm dark:bg-gray-700 dark:text-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
              </select>
          </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
            <tr>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Entity</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Reason</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Description</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Reported By</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" className="p-10 text-center dark:text-white">Loading...</td></tr>
            ) : complaints.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center dark:text-white">No complaints found</td></tr>
            ) : (
                complaints.map(complaint => (
                    <React.Fragment key={complaint._id}>
                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <td className="p-4 dark:text-gray-200">
                                <span className="font-medium">{complaint.entityType}</span>
                                <br/>
                                <span className="text-xs text-gray-500">{complaint.entityId}</span>
                            </td>
                            <td className="p-4 dark:text-gray-200">{complaint.reason}</td>
                            <td className="p-4 dark:text-gray-300 text-sm max-w-xs truncate" title={complaint.description}>
                                {complaint.description}
                            </td>
                            <td className="p-4 dark:text-gray-200 text-sm">
                                {complaint.reportedBy?.name || "Unknown"}
                                <br/>
                                <span className="text-xs text-gray-500">{complaint.reportedBy?.email}</span>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                                    {complaint.status.toUpperCase()}
                                </span>
                            </td>
                            <td className="p-4">
                                {complaint.status !== 'resolved' && complaint.status !== 'dismissed' && (
                                    <button 
                                        onClick={() => setResolvingId(resolvingId === complaint._id ? null : complaint._id)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Resolve/Dismiss
                                    </button>
                                )}
                            </td>
                        </tr>
                        {/* Action Row */}
                        {resolvingId === complaint._id && (
                            <tr className="bg-blue-50 dark:bg-gray-900">
                                <td colSpan="6" className="p-4">
                                    <div className="flex gap-4 items-center">
                                        <input 
                                            type="text" 
                                            placeholder="Admin notes (optional)..." 
                                            className="border p-2 rounded flex-1 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                            value={adminNote}
                                            onChange={e => setAdminNote(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => handleStatusUpdate(complaint._id, 'investigating')}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                        >
                                            Investigate
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                        >
                                            Resolve
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(complaint._id, 'dismissed')}
                                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))
            )}
          </tbody>
        </table>
      </div>

       {/* Pagination Controls */}
       <div className="mt-4 flex justify-between items-center text-gray-700 dark:text-gray-300">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 dark:border-gray-600"
          >
              Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 dark:border-gray-600"
          >
              Next
          </button>
      </div>
    </div>
  );
};

export default ComplaintManagement;
