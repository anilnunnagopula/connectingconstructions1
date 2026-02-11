const express = require("express");
const router = express.Router();
const {
  createAlert,
  getAlerts,
  deleteAlert,
} = require("../controllers/productAlertController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/", createAlert);
router.get("/", getAlerts);
router.delete("/:id", deleteAlert);

module.exports = router;
