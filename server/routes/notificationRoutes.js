const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware.js");
const {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController.js");

router.get("/", authMiddleware, getNotifications);

router.get("/unread", authMiddleware, getUnreadNotifications);

router.patch("/:notificationId/read", authMiddleware, markNotificationAsRead);

router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

module.exports = router;
