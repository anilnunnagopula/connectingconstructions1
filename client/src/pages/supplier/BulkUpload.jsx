import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Info,
} from "lucide-react";
import {
  bulkUploadProducts,
  downloadBulkTemplate,
  downloadCSV,
} from "../../services/dashboardService";
import SupplierLayout from "../../layout/SupplierLayout";

const BulkUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const validateAndSetFile = (f) => {
    const validTypes = [".csv", ".xlsx", ".xls"];
    const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();

    if (!validTypes.includes(ext)) {
      toast.error("Please upload a .csv, .xlsx, or .xls file");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setFile(f);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResults(null);

    try {
      const response = await bulkUploadProducts(file);
      if (!response.success) throw new Error(response.error);

      const data = response.data.data || response.data;
      setResults(data);

      if (data.created > 0) {
        toast.success(`${data.created} products created successfully!`);
      }
      if (data.errors?.length > 0) {
        toast.error(`${data.errors.length} rows had errors`);
      }
    } catch (error) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await downloadBulkTemplate();
      if (!response.success) throw new Error(response.error);
      downloadCSV(response.data, "bulk_products_template.csv");
      toast.success("Template downloaded!");
    } catch (error) {
      toast.error(error.message || "Failed to download template");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <SupplierLayout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/supplier/my-products")}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Bulk Product Upload
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Upload multiple products at once using CSV or Excel
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p className="font-semibold">How to use bulk upload:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Download the CSV template below</li>
                  <li>Fill in your product data (name, category, price are required)</li>
                  <li>Upload the file and review results</li>
                </ol>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                  Required columns: <strong>name, category, price</strong> |
                  Optional: productType, quantity, unit, description, brand, grade, packaging, hsnCode, gstRate, minOrderQuantity, warranty, certifications
                </p>
              </div>
            </div>
          </div>

          {/* Download Template */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    CSV Template
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download with sample data and all column headers
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Upload File
            </h3>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : file
                  ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-750"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="space-y-2">
                  <FileSpreadsheet className="w-12 h-12 text-green-600 mx-auto" />
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); resetUpload(); }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports CSV, XLSX, XLS (max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {file && !results && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Products
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          {results && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Upload Results
              </h3>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {results.total}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Rows</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{results.created}</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Created</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {results.errors?.length || 0}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">Errors</p>
                </div>
              </div>

              {/* Error details */}
              {results.errors?.length > 0 && (
                <div className="border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
                  <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800 dark:text-red-200 text-sm">
                      Errors ({results.errors.length})
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {results.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 text-sm border-t border-red-100 dark:border-red-800 flex items-start gap-2"
                      >
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Row {err.row}:</strong> {err.error}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
                >
                  Upload Another File
                </button>
                <button
                  onClick={() => navigate("/supplier/my-products")}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-medium text-sm"
                >
                  View Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
};

export default BulkUpload;
