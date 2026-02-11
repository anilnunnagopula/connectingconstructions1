import React, { useEffect, useState } from "react";
import axios from "axios";
import { Activity, Server, Database, Cpu } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const SystemHealth = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchHealth = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            const token = storedUser ? JSON.parse(storedUser).token : null;
            const baseURL = process.env.REACT_APP_API_URL;
            
            const res = await axios.get(`${baseURL}/api/admin/health`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setHealth(res.data);
            
            // Add to history for graph (mocking history for now as we don't store it)
            setHistory(prev => {
                const newPoint = { 
                    time: new Date().toLocaleTimeString(), 
                    memory: parseInt(res.data.memory.rss) // Storing RSS in MB
                };
                const newHistory = [...prev, newPoint];
                if (newHistory.length > 20) newHistory.shift(); // Keep last 20 points
                return newHistory;
            });
            setLoading(false);
        } catch (error) {
            console.error("Health check failed", error);
            // Don't toast on every poll failure to avoid spam
            if(loading) toast.error("Failed to load system health"); 
        }
    };

    if (loading) return <div className="p-10 text-center dark:text-white">Loading System Health...</div>;
    if (!health) return <div className="p-10 text-center text-red-500">System Offline</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">System Health</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Online
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
                            <h3 className="text-2xl font-bold dark:text-white">
                                {(health.uptime / 3600).toFixed(2)} hrs
                            </h3>
                        </div>
                        <Activity className="text-blue-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Database</p>
                            <h3 className="text-lg font-bold uppercase dark:text-white">
                                {health.database.status}
                            </h3>
                            <p className="text-xs text-gray-400">{health.database.name}</p>
                        </div>
                        <Database className={health.database.status === 'connected' ? "text-green-500" : "text-red-500"} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Memory (RSS)</p>
                            <h3 className="text-2xl font-bold dark:text-white">{health.memory.rss}</h3>
                        </div>
                        <Server className="text-purple-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Server Info</p>
                            <h3 className="text-sm font-bold dark:text-white">{health.server.platform}</h3>
                            <p className="text-xs text-gray-400">{health.server.nodeVersion}</p>
                        </div>
                        <Cpu className="text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Live Memory Usage Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 dark:text-white">Live Memory Usage</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="memory" stroke="#8884d8" fill="#8884d8" name="Memory (MB)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
