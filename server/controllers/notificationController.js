const pool = require("../config/db");

// Get all notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT
          notification_id,
          title,
          message,
          type,
          related_request_id,
          is_read,
          created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    console.log("Notifications fetched:", result.rows); // Debugging log
    res.status(200).json({
      success: true,
      count: result.rowCount,
      notifications: result.rows,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Get unread notifications
const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `SELECT
          notification_id,
          title,
          message,
          type,
          related_request_id,
          is_read,
          created_at
       FROM notifications
       WHERE user_id = $1
         AND is_read = false
       ORDER BY created_at DESC`,
      [userId],
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      notifications: result.rows,
    });
  } catch (error) {
    console.error("Get unread notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Mark one notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { notificationId } = req.params;

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE notification_id = $1
         AND user_id = $2
       RETURNING *`,
      [notificationId, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Mark notification error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE user_id = $1
         AND is_read = false`,
      [userId],
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      updated_count: result.rowCount,
    });
  } catch (error) {
    console.error("Mark all notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
