// pages/supplier/LicenseAndCertificatesPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Define constants for file limits
const MAX_FILE_SIZE_MB = 10; // Max 10MB per document
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

const LicenseAndCertificatesPage = () => {
  const navigate = useNavigate();
  const [licenses, setLicenses] = useState([]);
  const [newLicense, setNewLicense] = useState({
    name: "",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
    documentFile: null, // To hold the File object
  });
  const [loading, setLoading] = useState(true); // Initial loading for fetching data
  const [formSubmitting, setFormSubmitting] = useState(false); // For add/delete operations
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Helper to get token
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  // Helper to format date for input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // toISOString returns "YYYY-MM-DDTHH:mm:ss.sssZ", we need "YYYY-MM-DD"
    return date.toISOString().split("T")[0];
  };

  // --- Fetch Licenses and Certificates ---
  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/license-and-certificates`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to fetch licenses."
        );
      }

      setLicenses(data); // Assuming data is an array of license objects
      setMessage("Licenses loaded successfully.");
      setMessageType("success");
    } catch (err) {
      console.error("Error fetching licenses:", err);
      setMessage(err.message || "Error loading licenses.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  // Handle message timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLicense((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setMessage(
          `File "${file.name}" is too large (max ${MAX_FILE_SIZE_MB}MB).`
        );
        setMessageType("error");
        setNewLicense((prev) => ({ ...prev, documentFile: null })); // Clear file selection
        e.target.value = null; // Clear input
        return;
      }
      setNewLicense((prev) => ({ ...prev, documentFile: file }));
      setMessage(`File "${file.name}" selected for upload.`);
      setMessageType("info");
    } else {
      setNewLicense((prev) => ({ ...prev, documentFile: null }));
      setMessage("");
      setMessageType("");
    }
  };

  // Upload file to Cloudinary (reused logic)
  const uploadFileToCloudinary = async (file) => {
    if (!file) return null;

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary credentials not set in environment variables.");
      setMessage("Document upload failed: Cloudinary not configured.");
      setMessageType("error");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("resource_type", "auto"); // Auto-detect image/video/raw (for PDFs)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, // Changed to /auto/upload for general files
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok && data.secure_url) {
        return data.secure_url;
      } else {
        setMessage(
          `Document upload failed: ${
            data.error ? data.error.message : "Unknown Cloudinary error."
          }`
        );
        setMessageType("error");
        console.error("Cloudinary upload error:", data);
        return null;
      }
    } catch (err) {
      setMessage(`Document upload failed due to network error.`);
      setMessageType("error");
      console.error("Cloudinary fetch error:", err);
      return null;
    }
  };

  // Handle form submission (Add New License)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setFormSubmitting(false);
      navigate("/login");
      return;
    }

    if (
      !newLicense.name ||
      !newLicense.issuingAuthority ||
      !newLicense.documentFile
    ) {
      setMessage(
        "Please fill in Name, Issuing Authority, and upload a Document."
      );
      setMessageType("error");
      setFormSubmitting(false);
      return;
    }

    let documentUrl = null;
    setMessage("Uploading document to Cloudinary...");
    setMessageType("info");
    documentUrl = await uploadFileToCloudinary(newLicense.documentFile);

    if (!documentUrl) {
      setMessage("Document upload failed. Cannot add license.");
      setMessageType("error");
      setFormSubmitting(false);
      return;
    }

    try {
      const licenseData = {
        name: newLicense.name,
        issuingAuthority: newLicense.issuingAuthority,
        issueDate: newLicense.issueDate || undefined, // Send as undefined if not set
        expiryDate: newLicense.expiryDate || undefined, // Send as undefined if not set
        documentUrl: documentUrl, // Use the uploaded URL
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/license-and-certificates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(licenseData),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to add license.");
      }

      setMessage("License added successfully!");
      setMessageType("success");
      // Reset form
      setNewLicense({
        name: "",
        issuingAuthority: "",
        issueDate: "",
        expiryDate: "",
        documentFile: null,
      });
      // Clear file input visually
      document.getElementById("documentFile").value = "";
      fetchLicenses(); // Re-fetch licenses to update list
    } catch (err) {
      console.error("Error adding license:", err);
      setMessage(err.message || "Failed to add license.");
      setMessageType("error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete License
  const handleDelete = async (licenseId, licenseName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the license "${licenseName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setFormSubmitting(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setFormSubmitting(false);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/supplier/license-and-certificates/${licenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to delete license."
        );
      }

      setMessage(`License "${licenseName}" deleted successfully!`);
      setMessageType("success");
      fetchLicenses(); // Re-fetch licenses to update list
    } catch (err) {
      console.error("Error deleting license:", err);
      setMessage(err.message || "Failed to delete license.");
      setMessageType("error");
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
          Loading licenses and certificates...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          📃 Licenses & Certificates
        </h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium shadow-md ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : messageType === "error"
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
            } transition-colors duration-300`}
          >
            {message}
          </div>
        )}

        {/* Add New License Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Add New License/Certificate
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name/Type (e.g., GST Registration)
              </label>
              <input
                type="text"
                name="name"
                value={newLicense.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={formSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issuing Authority
              </label>
              <input
                type="text"
                name="issuingAuthority"
                value={newLicense.issuingAuthority}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={formSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={newLicense.issueDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                disabled={formSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={newLicense.expiryDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                disabled={formSubmitting}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document (PDF, JPG, PNG - Max {MAX_FILE_SIZE_MB}MB)
              </label>
              <input
                type="file"
                id="documentFile" // Used for clearing input
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
                disabled={formSubmitting}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={formSubmitting}
          >
            {formSubmitting
              ? "Adding License..."
              : "➕ Add License/Certificate"}
          </button>
        </form>

        {/* Licenses List */}
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Your Licenses & Certificates ({licenses.length})
        </h3>
        {licenses.length === 0 ? (
          <div className="text-center py-10 text-gray-600 dark:text-gray-300">
            <p className="text-lg">
              No licenses or certificates added yet. Use the form above to add
              your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {licenses.map((license) => (
              <div
                key={license._id}
                className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-grow mb-4 md:mb-0">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {license.name}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Issued by:</span>{" "}
                    {license.issuingAuthority}
                  </p>
                  {(license.issueDate || license.expiryDate) && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Dates:</span>{" "}
                      {license.issueDate
                        ? new Date(license.issueDate).toLocaleDateString()
                        : "N/A"}
                      {" - "}
                      {license.expiryDate
                        ? new Date(license.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  )}
                  {license.status && (
                    <span
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        license.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : license.status === "Expired"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {license.status}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3 items-center">
                  {license.documentUrl && (
                    <a
                      href={license.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1"
                      title="View Document"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3-3m0 0l3 3m-3-3v2.25A2.25 2.25 0 0012 21h3.75A2.25 2.25 0 0018 18.75V10.5m-10.5 6L12 10.5M12 10.5L14.25 7.125"
                        />
                      </svg>
                      View
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(license._id, license.name)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors duration-200 flex items-center gap-1"
                    title="Delete License"
                    disabled={formSubmitting}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165M12 2.25L12 2.25c-1.103 0-2.203.15-3.303.447L12 2.25c-1.103 0-2.203.15-3.303.447"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseAndCertificatesPage;
