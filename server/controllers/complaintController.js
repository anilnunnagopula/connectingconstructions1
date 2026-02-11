const Complaint = require("../models/Complaint");
const User = require("../models/User");

// Create a new complaint (User feature)
const createComplaint = async (req, res) => {
  try {
    const { entityType, entityId, reason, description } = req.body;

    // Validate inputs
    if (!entityType || !entityId || !reason || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaint = new Complaint({
      reportedBy: req.user._id,
      entityType,
      entityId,
      reason,
      description,
    });

    await complaint.save();
    res.status(201).json({ success: true, message: "Complaint submitted successfully", complaint });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all complaints (Admin feature)
const getComplaints = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) query.status = status;

    const complaints = await Complaint.find(query)
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update complaint status (Admin feature)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (status) complaint.status = status;
    if (adminNotes) complaint.adminNotes = adminNotes;
    
    if (status === "resolved" || status === "dismissed") {
        complaint.resolvedBy = req.user._id;
        complaint.resolvedAt = new Date();
    }

    await complaint.save();
    res.json({ success: true, message: "Complaint updated", complaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus
};
