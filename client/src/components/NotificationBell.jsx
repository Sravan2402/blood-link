import { useEffect, useState } from "react";
import api from "../services/api";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/notifications/unread", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUnreadCount(response.data.notifications?.length || 0);
    } catch (error) {
      console.error("Failed to fetch unread notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const handleOpen = () => {
    setOpen(!open);
  };
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        "/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div>
      <button onClick={handleOpen}>
        🔔
        {unreadCount > 0 && <span>{unreadCount}</span>}
      </button>

      {open && (
        <div>
          <div>
            <h3>Notifications</h3>

            {unreadCount > 0 && (
              <button onClick={markAllAsRead}>Mark all as read</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.notification_id}
                onClick={() => {
                  if (!notification.is_read) {
                    markAsRead(notification.notification_id);
                  }
                }}
              >
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <small>
                  {new Date(notification.created_at).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
