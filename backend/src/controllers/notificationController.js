
const Notification = require("../models/Notification");

// Get notifications for the logged-in user
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter(
        (notification) => !notification.isRead
      ).length,
      notifications,
    });
  } catch (error) {
    console.error("Notification fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch notifications.",
    });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
      },
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("Notification update error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update notification.",
    });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
};
