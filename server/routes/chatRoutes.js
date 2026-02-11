const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/send", sendMessage);
router.get("/conversations", getConversations);
router.get("/:userId", getMessages);
router.put("/read/:senderId", markAsRead);

module.exports = router;
