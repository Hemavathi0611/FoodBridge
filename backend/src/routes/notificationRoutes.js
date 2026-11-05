
const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/auth");

// Get notifications for the logged-in user
router.get("/", protect, getMyNotifications);

// Mark a notification as read
router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;
