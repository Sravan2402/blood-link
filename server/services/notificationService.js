const pool = require("../config/db");

const createNotification = async ({
  userId,
  title,
  message,
  type,
  requestId = null,
}) => {
  try {
    const result = await pool.query(
      `INSERT INTO notifications
        (user_id, title, message, type, related_request_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, message, type, requestId],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Notification creation error:", error);
    throw error;
  }
};

module.exports = {
  createNotification,
};
