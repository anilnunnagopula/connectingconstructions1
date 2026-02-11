// client/src/pages/admin/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Shield, Ban, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const UserManagement = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(queryParams.get("search") || "");
  const [filterRole, setFilterRole] = useState(queryParams.get("role") || "");
  const [filterStatus, setFilterStatus] = useState(queryParams.get("status") || "");
  const [page, setPage] = useState(parseInt(queryParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const baseURL = process.env.REACT_APP_API_URL;
      const params = { page, search, role: filterRole, status: filterStatus };
      
      const res = await axios.get(`${baseURL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this user?`)) return;

    try {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const baseURL = process.env.REACT_APP_API_URL;
      await axios.patch(
        `${baseURL}/api/admin/users/${userId}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`User ${currentStatus ? 'suspended' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleTierUpdate = async (id, tier) => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const baseURL = process.env.REACT_APP_API_URL;

        await axios.patch(
            `${baseURL}/api/admin/suppliers/${id}/tier`,
            { tier },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(`Supplier tier updated to ${tier}`);
        fetchUsers();
      } catch (error) {
          console.error("Tier update error:", error);
          toast.error("Failed to update tier");
      }
  };

  const verifySupplier = async (userId, status) => {
      if (!window.confirm(`Mark supplier as ${status}?`)) return;

      try {
          const storedUser = localStorage.getItem("user");
          const token = storedUser ? JSON.parse(storedUser).token : null;
          const baseURL = process.env.REACT_APP_API_URL;
          await axios.patch(
              `${baseURL}/api/admin/suppliers/${userId}/verify`,
              { status },
              { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success(`Supplier marked as ${status}`);
          fetchUsers();
      } catch (error) {
          toast.error("Verification failed");
      }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        
        <select 
            className="p-2 border rounded-lg"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
        >
            <option value="">All Roles</option>
            <option value="customer">Customers</option>
            <option value="supplier">Suppliers</option>
            <option value="admin">Admins</option>
        </select>

        <select
            className="p-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
        >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending Verification</option>
        </select>
        
        <button 
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
            Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Verification</th>
              <th className="p-4 font-semibold text-gray-600">Joined</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" className="p-10 text-center">Loading...</td></tr>
            ) : users.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center">No users found</td></tr>
            ) : (
                users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                            <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </td>
                        <td className="p-4 capitalize">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                user.role === 'supplier' ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {user.isActive ? 'Active' : 'Suspended'}
                            </span>
                        </td>
                        <td className="p-4">
                            {user.role === 'supplier' ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    user.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                    user.verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {user.verificationStatus}
                                </span>
                            ) : '-'}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 flex gap-2">
                             {/* Suspend/Activate */}
                             {user.role !== 'admin' && (
                                <button
                                    onClick={() => toggleUserStatus(user._id, user.isActive)}
                                    title={user.isActive ? "Suspend User" : "Activate User"}
                                    className={`p-2 rounded ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                >
                                    {user.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
                                </button>
                             )}

                             {/* Verify Supplier */}
                             {user.role === 'supplier' && (
                                <div className="flex flex-col gap-2">
                                    {user.verificationStatus === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => verifySupplier(user._id, 'verified')}
                                                title="Approve Supplier"
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            >
                                                <Shield size={18} />
                                            </button>
                                            <button
                                                onClick={() => verifySupplier(user._id, 'rejected')}
                                                title="Reject Supplier"
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    )}
                                    <select
                                        className="text-xs border rounded p-1 dark:bg-gray-700 dark:text-white"
                                        value={user.supplierTier || 'standard'}
                                        onChange={(e) => handleTierUpdate(user._id, e.target.value)}
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="silver">Silver</option>
                                        <option value="gold">Gold</option>
                                        <option value="platinum">Platinum</option>
                                    </select>
                                </div>
                             )}
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
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

export default UserManagement;
