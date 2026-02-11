import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Megaphone, Calendar, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      title: "",
      content: "",
      targetRole: "all",
      type: "info",
      expiresAt: ""
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const baseURL = process.env.REACT_APP_API_URL;
      
      const res = await axios.get(`${baseURL}/api/admin/announcements`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnnouncements(res.data.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
      e.preventDefault();
      try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const baseURL = process.env.REACT_APP_API_URL;

        await axios.post(`${baseURL}/api/admin/announcements`, 
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Announcement posted!");
        setIsModalOpen(false);
        setFormData({ title: "", content: "", targetRole: "all", type: "info", expiresAt: "" });
        fetchAnnouncements();
      } catch (error) {
          toast.error("Failed to create announcement");
      }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this announcement?")) return;
      try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const baseURL = process.env.REACT_APP_API_URL;

        await axios.delete(`${baseURL}/api/admin/announcements/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("Announcement deleted");
        fetchAnnouncements();
      } catch (error) {
          toast.error("Failed to delete announcement");
      }
  };

  const handleToggleStatus = async (id) => {
    try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const baseURL = process.env.REACT_APP_API_URL;

        await axios.patch(`${baseURL}/api/admin/announcements/${id}/toggle`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("Status updated");
        fetchAnnouncements();
      } catch (error) {
          toast.error("Failed to update status");
      }
  }

  const getTypeColor = (type) => {
      switch(type) {
          case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
          case 'success': return 'bg-green-100 text-green-800 border-green-200';
          default: return 'bg-blue-100 text-blue-800 border-blue-200';
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Announcements</h1>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
            <Plus size={20} />
            Post New
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
             <div className="p-10 text-center dark:text-white">Loading...</div>
        ) : announcements.length === 0 ? (
             <div className="p-10 text-center dark:text-white bg-white dark:bg-gray-800 rounded-lg">No announcements found. Post one to get started!</div>
        ) : (
            announcements.map(item => (
                <div key={item._id} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 ${item.isActive ? 'border-blue-500' : 'border-gray-300'} hover:shadow-md transition`}>
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getTypeColor(item.type)}`}>
                                    {item.type}
                                </span>
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">
                                    Target: {item.targetRole.toUpperCase()}
                                </span>
                                {!item.isActive && (
                                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold">INACTIVE</span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.content}</p>
                            
                            {item.expiresAt && (
                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                    <Calendar size={14} />
                                    Expires: {new Date(item.expiresAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                            <button 
                                onClick={() => handleToggleStatus(item._id)}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                title={item.isActive ? "Deactivate" : "Activate"}
                            >
                                {item.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                title="Delete"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">Post Announcement</h2>
                  <form onSubmit={handleCreate} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                          <input 
                            type="text" 
                            required
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Type</label>
                            <select 
                                className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="success">Success</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Target Role</label>
                            <select 
                                className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                value={formData.targetRole}
                                onChange={e => setFormData({...formData, targetRole: e.target.value})}
                            >
                                <option value="all">All Users</option>
                                <option value="customer">Customers</option>
                                <option value="supplier">Suppliers</option>
                            </select>
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Content</label>
                          <textarea 
                            rows="4"
                            required
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                          ></textarea>
                      </div>

                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Expires At (Optional)</label>
                          <input 
                            type="date" 
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            value={formData.expiresAt}
                            onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                          />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                          <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                              Post Announcement
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Announcements;
