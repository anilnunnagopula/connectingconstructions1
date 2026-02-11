// client/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, ShoppingBag, DollarSign, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      
      const baseURL = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${baseURL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load admin dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async (type) => {
      try {
          const storedUser = localStorage.getItem("user");
          const token = storedUser ? JSON.parse(storedUser).token : null;
          const baseURL = process.env.REACT_APP_API_URL;
          
          const response = await axios.get(`${baseURL}/api/admin/export/${type}`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob',
          });

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          toast.success(`${type} exported successfully`);
      } catch (error) {
          console.error("Export failed:", error);
          toast.error("Failed to export data");
      }
  };

  if (loading) {
    return <div className="text-center py-10">Loading Dashboard...</div>;
  }

  if (!stats) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Admin Dashboard
        </h1>
        <div className="flex gap-2">
            <button 
                onClick={() => downloadCSV('users')}
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition text-sm font-medium"
            >
                Export Users
            </button>
            <button 
                onClick={() => downloadCSV('orders')}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition text-sm font-medium"
            >
                Export Orders
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-orange-500"
        />
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          icon={ShieldCheck}
          color="bg-red-500"
        />
        <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Revenue Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Revenue Trends</h3>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.revenueTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Top Categories</h3>
             <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topCategories} layout="vertical" margin={{ left: 10 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis type="number" />
                         <YAxis dataKey="_id" type="category" width={100} tick={{fontSize: 12}} />
                         <Tooltip cursor={{fill: 'transparent'}} />
                         <Legend />
                         <Bar dataKey="sales" fill="#82ca9d" name="Sales Count" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
