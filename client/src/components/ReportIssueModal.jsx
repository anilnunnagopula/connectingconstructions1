import React, { useState } from 'react';
import axios from 'axios';
import { X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportIssueModal = ({ isOpen, onClose, entityType, entityId, entityName }) => {
  const [reason, setReason] = useState('Incorrect Product Info');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const baseURL = process.env.REACT_APP_API_URL;

      await axios.post(`${baseURL}/api/complaints`, 
        {
          entityType,
          entityId,
          reason,
          description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Report submitted successfully');
      onClose();
      setDescription('');
      setReason('Incorrect Product Info');
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="bg-red-50 dark:bg-red-900/20 p-4 flex justify-between items-center border-b border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <h2 className="font-semibold">Report Issue</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Reporting: <span className="font-semibold text-gray-900 dark:text-white">{entityName}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              >
                <option>Incorrect Product Info</option>
                <option>Fake/Counterfeit</option>
                <option>Harassment</option>
                <option>Scam/Fraud</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                placeholder="Please provide more details..."
                className="w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;
