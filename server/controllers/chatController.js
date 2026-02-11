const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, relatedOrder, relatedProduct } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, error: "Receiver and content are required" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      relatedOrder,
      relatedProduct,
      read: false,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name profilePictureUrl")
      .populate("receiver", "name profilePictureUrl");

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get messages between current user and another user
// @route   GET /api/chat/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name profilePictureUrl")
      .populate("receiver", "name profilePictureUrl");

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get list of conversations (users chatted with)
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Aggregate to find unique users involved in conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(currentUserId) },
            { receiver: new mongoose.Types.ObjectId(currentUserId) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(currentUserId)] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          user: {
            _id: "$userDetails._id",
            name: "$userDetails.name",
            profilePictureUrl: "$userDetails.profilePictureUrl",
            role: "$userDetails.role",
          },
          lastMessage: 1,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/read/:senderId
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const currentUserId = req.user.id;

    await Message.updateMany(
      { sender: senderId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
