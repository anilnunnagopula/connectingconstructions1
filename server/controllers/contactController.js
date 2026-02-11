const Contact = require("../models/Contact");

/**
 * @desc    Submit a contact message
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message, userId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and message.",
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      message,
      user: userId || null, // Optional tracking of registered users
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      contact: newContact,
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
};

/**
 * @desc    Get all contact messages
 * @route   GET /api/admin/contacts
 * @access  Private (Admin)
 */
const getContactMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
};

const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
        
        if (!contact) return res.status(404).json({ message: "Message not found" });

        res.status(200).json({ success: true, message: "Status updated", contact });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateContactStatus
};
