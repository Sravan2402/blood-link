import { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api";

function formatRelative(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const panelRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [allRes, unreadRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread"),
      ]);
      setNotifications(allRes.data.notifications || []);
      setUnreadCount(unreadRes.data.notifications?.length || 0);
      setError("");
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close the panel when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Non-fatal: the UI still reflects intent.
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Non-fatal.
    }
  };

  return (
    <div className="notification-bell" ref={panelRef}>
      <button
        className="icon-button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <span className="icon-button__bell">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-bell__badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-panel__header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="link-button" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          {error && <p className="notification-panel__error">{error}</p>}

          <div className="notification-panel__list">
            {loading && notifications.length === 0 ? (
              <p className="notification-panel__empty">Loading…</p>
            ) : notifications.length === 0 ? (
              <p className="notification-panel__empty">No notifications yet</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.notification_id}
                  className={`notification-item ${
                    notification.is_read ? "" : "notification-item--unread"
                  }`}
                  onClick={() => {
                    if (!notification.is_read) markAsRead(notification.notification_id);
                  }}
                >
                  <span className="notification-item__dot" />
                  <span className="notification-item__content">
                    <span className="notification-item__title">
                      {notification.title}
                    </span>
                    <span className="notification-item__message">
                      {notification.message}
                    </span>
                    <span className="notification-item__time">
                      {formatRelative(notification.created_at)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
