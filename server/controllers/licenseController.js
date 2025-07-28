// server/controllers/licenseController.js
const LicenseAndCertificate = require("../models/LicenseAndCertificateModel"); // Assuming your model

// @desc    Get all licenses/certificates for authenticated supplier
// @route   GET /api/supplier/license-and-certificates
// @access  Private (Supplier only)
exports.getLicenses = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const licenses = await LicenseAndCertificate.find({
      supplier: supplierId,
    }).sort({ createdAt: -1 });
    res.status(200).json(licenses);
  } catch (error) {
    console.error("Error fetching licenses:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch licenses", error: error.message });
  }
};

// @desc    Add a new license/certificate
// @route   POST /api/supplier/license-and-certificates
// @access  Private (Supplier only)
exports.addLicense = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const { name, issuingAuthority, issueDate, expiryDate, documentUrl } =
      req.body;

    if (!name || !issuingAuthority || !documentUrl) {
      return res
        .status(400)
        .json({
          message: "Name, Issuing Authority, and Document URL are required.",
        });
    }

    const newLicense = new LicenseAndCertificate({
      supplier: supplierId,
      name,
      issuingAuthority,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      documentUrl,
    });

    await newLicense.save();
    res.status(201).json(newLicense);
  } catch (error) {
    console.error("Error adding license:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to add license", error: error.message });
  }
};

// @desc    Delete a license/certificate
// @route   DELETE /api/supplier/license-and-certificates/:id
// @access  Private (Supplier only)
exports.deleteLicense = async (req, res) => {
  try {
    const licenseId = req.params.id;
    const supplierId = req.user.id;

    const license = await LicenseAndCertificate.findOneAndDelete({
      _id: licenseId,
      supplier: supplierId,
    });

    if (!license) {
      return res
        .status(404)
        .json({ message: "License not found or you do not own this license." });
    }
    res.status(200).json({ message: "License deleted successfully." });
  } catch (error) {
    console.error("Error deleting license:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid License ID format." });
    }
    res
      .status(500)
      .json({ message: "Failed to delete license", error: error.message });
  }
};
