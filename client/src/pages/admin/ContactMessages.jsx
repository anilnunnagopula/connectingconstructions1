import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, Mail, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchMessages();
  }, [page, filterStatus]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const baseURL = process.env.REACT_APP_API_URL;
      
      const query = `page=${page}&limit=20${filterStatus ? `&status=${filterStatus}` : ''}`;
      const res = await axios.get(`${baseURL}/api/admin/contacts?${query}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const baseURL = process.env.REACT_APP_API_URL;

        await axios.patch(`${baseURL}/api/admin/contacts/${id}`, 
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(`Message marked as ${status}`);
        fetchMessages();
    } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update status");
    }
  }

  const getStatusColor = (status) => {
      switch(status) {
          case 'resolved': return 'text-green-600 bg-green-100';
          case 'read': return 'text-blue-600 bg-blue-100';
          default: return 'text-yellow-600 bg-yellow-100';
      }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Contact Messages</h1>

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
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="resolved">Resolved</option>
              </select>
          </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
             <div className="p-10 text-center dark:text-white">Loading...</div>
        ) : messages.length === 0 ? (
             <div className="p-10 text-center dark:text-white">No messages found</div>
        ) : (
            messages.map(msg => (
                <div key={msg._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{msg.name}</h3>
                                <p className="text-sm text-gray-500">{msg.email}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(msg.status)}`}>
                            {msg.status.toUpperCase()}
                        </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded">
                        {msg.message}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4 dark:border-gray-700">
                        <div className="flex items-center gap-1">
                            <Clock size={16} />
                            {new Date(msg.createdAt).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                            {msg.status === 'new' && (
                                <button 
                                    onClick={() => handleStatusUpdate(msg._id, 'read')}
                                    className="text-blue-600 hover:underline"
                                >
                                    Mark as Read
                                </button>
                            )}
                            {msg.status !== 'resolved' && (
                                <button 
                                    onClick={() => handleStatusUpdate(msg._id, 'resolved')}
                                    className="text-green-600 hover:underline flex items-center gap-1"
                                >
                                    <CheckCircle size={14} /> Resolve
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Pagination */}
       <div className="mt-6 flex justify-between items-center text-gray-700 dark:text-gray-300">
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

export default ContactMessages;
