const Announcement = require("../models/Announcement");

/**
 * @desc    Create a new announcement
 * @route   POST /api/admin/announcements
 * @access  Private (Admin)
 */
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, targetRole, type, isActive, expiresAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const announcement = await Announcement.create({
      title,
      content,
      targetRole,
      type,
      isActive,
      expiresAt: expiresAt || null,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Announcement created", data: announcement });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Get all announcements (Admin view)
 * @route   GET /api/admin/announcements
 * @access  Private (Admin)
 */
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (error) {
    console.error("Error fetching all announcements:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Get active announcements for current user
 * @route   GET /api/announcements
 * @access  Public / Private
 */
const getActiveAnnouncements = async (req, res) => {
  try {
    const { role } = req.query; // Optional role filter if sent by frontend
    const query = { isActive: true };

    if (role) {
        query.targetRole = { $in: ["all", role] };
    }

    // Filter out expired if not handled by TTL index yet
    const announcements = await Announcement.find({
        ...query,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Delete an announcement
 * @route   DELETE /api/admin/announcements/:id
 * @access  Private (Admin)
 */
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    await announcement.deleteOne();
    res.json({ success: true, message: "Announcement removed" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Toggle active status
 * @route   PATCH /api/admin/announcements/:id/toggle
 * @access  Private (Admin)
 */
const toggleAnnouncementStatus = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) return res.status(404).json({ message: "Not found" });

        announcement.isActive = !announcement.isActive;
        await announcement.save();

        res.json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getActiveAnnouncements,
  deleteAnnouncement,
  toggleAnnouncementStatus
};
