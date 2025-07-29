// pages/supplier/SyncInventoryPage.jsx
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Using axios for easier file uploads

const MAX_FILE_SIZE_MB = 10; // Max 10MB for the CSV/Excel file
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const SyncInventoryPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation: Check file type and size
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage(
          "Invalid file type. Please upload a CSV, XLS, or XLSX file."
        );
        setMessageType("error");
        setSelectedFile(null);
        e.target.value = null; // Clear input
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setMessage(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
        setMessageType("error");
        setSelectedFile(null);
        e.target.value = null;
        return;
      }
      setSelectedFile(file);
      setMessage(`File "${file.name}" selected.`);
      setMessageType("info");
    } else {
      setSelectedFile(null);
      setMessage("");
      setMessageType("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("");
    setMessageType("");
    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setMessageType("error");
      setUploading(false);
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("inventoryFile", selectedFile); // 'inventoryFile' should match the name in your backend multer config

    try {
      // This endpoint will be handled by your backend's syncInventory controller
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/supplier/inventory/sync`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Axios handles this automatically with FormData
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Inventory synced successfully!");
      setMessageType("success");
      setSelectedFile(null); // Clear selected file
      document.getElementById("inventoryFileInput").value = ""; // Clear input visually
      // Optionally, navigate back or show a detailed report
    } catch (err) {
      console.error("Error syncing inventory:", err);
      let errorMessage = "Failed to sync inventory.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          🔄 Sync Inventory
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

        <div className="text-gray-700 dark:text-gray-300 mb-6">
          <p className="mb-4">
            Upload a CSV or Excel file to quickly update your product quantities
            and prices. Ensure your file has columns like "Product ID",
            "Quantity", and "Price".
          </p>
          <p className="font-semibold">Recommended CSV/Excel format:</p>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-xs overflow-auto">
            ProductID,Quantity,Price
            <br />
            60d0fe4f5c9a7d0015f8a123,150,500
            <br />
            60d0fe4f5c9a7d0015f8a456,200,1200
          </pre>
          <p className="mt-4 text-red-500 dark:text-red-300">
            <span className="font-semibold">Warning:</span> Incorrect file
            format may lead to data discrepancies. Consider exporting your
            products first for a template.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="inventoryFileInput"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Select Inventory File (CSV, XLS, XLSX)
            </label>
            <input
              type="file"
              id="inventoryFileInput"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Syncing..." : "⬆️ Upload & Sync"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncInventoryPage;
