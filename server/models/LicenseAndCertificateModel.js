// server/models/LicenseAndCertificateModel.js
const mongoose = require("mongoose");

const licenseAndCertificateSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Assuming your User model
    required: true,
  },
  name: {
    // e.g., "GST Registration", "ISO 9001"
    type: String,
    required: true,
    trim: true,
  },
  issuingAuthority: {
    // e.g., "GST Department", "Bureau of Indian Standards"
    type: String,
    required: true,
    trim: true,
  },
  issueDate: {
    type: Date,
    default: null, // Optional
  },
  expiryDate: {
    type: Date,
    default: null, // Optional
  },
  documentUrl: {
    // URL from Cloudinary
    type: String,
    required: true,
  },
  status: {
    // Optional: e.g., "Active", "Expired", "Pending Review"
    type: String,
    enum: ["Active", "Expired", "Pending Review", "Rejected"],
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a unique compound index if a supplier should not have two licenses with the exact same name
// licenseAndCertificateSchema.index({ name: 1, supplier: 1 }, { unique: true });

module.exports = mongoose.model(
  "LicenseAndCertificate",
  licenseAndCertificateSchema
);
