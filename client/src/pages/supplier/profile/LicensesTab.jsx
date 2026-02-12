import React, { useState, useEffect, useCallback } from "react";
import { FileText, Plus, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const LicensesTab = ({ token }) => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [newLicense, setNewLicense] = useState({
    name: "",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
    documentFile: null,
  });

  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/supplier/license-and-certificates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLicenses(response.data);
    } catch (err) {
      console.error("Error fetching licenses:", err);
      toast.error("Failed to load licenses.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchLicenses();
  }, [fetchLicenses, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLicense((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`File is too large (max ${MAX_FILE_SIZE_MB}MB).`);
        e.target.value = null;
        return;
      }
      setNewLicense((prev) => ({ ...prev, documentFile: file }));
      toast.success(`Selected: ${file.name}`);
    }
  };

  const uploadFileToCloudinary = async (file) => {
    if (!file) return null;
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary not configured.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("resource_type", "auto");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Document upload failed.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newLicense.name || !newLicense.issuingAuthority || !newLicense.documentFile) {
      toast.error("Please fill required fields and upload document.");
      return;
    }

    setSubmitting(true);
    toast.loading("Uploading document...", { id: "upload" });

    try {
      const documentUrl = await uploadFileToCloudinary(newLicense.documentFile);
      if (!documentUrl) throw new Error("Upload failed");

      const licenseData = {
        name: newLicense.name,
        issuingAuthority: newLicense.issuingAuthority,
        issueDate: newLicense.issueDate || undefined,
        expiryDate: newLicense.expiryDate || undefined,
        documentUrl,
      };

      await axios.post(
        `${baseURL}/api/supplier/license-and-certificates`,
        licenseData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("License added successfully!", { id: "upload" });
      setNewLicense({
        name: "",
        issuingAuthority: "",
        issueDate: "",
        expiryDate: "",
        documentFile: null,
      });
      document.getElementById("documentFile").value = "";
      fetchLicenses();
    } catch (err) {
      console.error("Error adding license:", err);
      toast.error("Failed to add license.", { id: "upload" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this license?")) return;
    
    try {
      await axios.delete(
        `${baseURL}/api/supplier/license-and-certificates/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("License deleted.");
      fetchLicenses();
    } catch (err) {
      toast.error("Failed to delete license.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <FileText className="text-blue-600" size={24} />
        Licenses & Certificates
      </h2>

      {/* Add New Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus size={18} /> Add New Document
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Document Name (e.g. GST)"
            value={newLicense.name}
            onChange={handleInputChange}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
          <input
            type="text"
            name="issuingAuthority"
            placeholder="Issuing Authority"
            value={newLicense.issuingAuthority}
            onChange={handleInputChange}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
          <input
            type="date"
            name="issueDate"
            value={newLicense.issueDate}
            onChange={handleInputChange}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="relative">
             <input
              type="date"
              name="expiryDate"
              value={newLicense.expiryDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-500 pointer-events-none">Expiry</span>
          </div>
          
          <div className="md:col-span-2">
            <input
              type="file"
              id="documentFile"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium"
        >
          {submitting ? "Uploading..." : "Add Document"}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading documents...</p>
      ) : licenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          <p>No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {licenses.map((license) => (
            <div
              key={license._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="mb-3 sm:mb-0">
                <h4 className="font-bold text-gray-900 dark:text-white">{license.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {license.issuingAuthority} • 
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    license.status === 'expired' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {license.status || 'Active'}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                   Expires: {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {license.documentUrl && (
                  <a
                    href={license.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <ExternalLink size={16} /> View
                  </a>
                )}
                <button
                  onClick={() => handleDelete(license._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LicensesTab;
