import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Alert, Button, Card, EmptyState, SectionHeader, Spinner } from "../../components/ui";
import { Tabs } from "../../components/kit";
import { timeAgo } from "../../lib/constants";

const MOCK_NOTIFICATIONS = [
  { notification_id: "n-101", title: "New Blood Request", message: "An O+ blood request has been created in Hyderabad. You are approximately 1.2 km away.", type: "BLOOD_REQUEST", is_read: false, created_at: new Date(Date.now() - 5 * 60000).toISOString(), related_request_id: "r-1" },
  { notification_id: "n-102", title: "Donor Selected", message: "You have been selected for an A+ blood request. Please coordinate with the hospital.", type: "DONOR_SELECTED", is_read: false, created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), related_request_id: "r-2" },
  { notification_id: "n-103", title: "Camp Reminder", message: "Your blood camp “Community Blood Donation Camp” is on Dec 5. See details.", type: "CAMP", is_read: true, created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString() },
  { notification_id: "n-104", title: "Blood Donation Completed", message: "The O+ blood request has been completed. Thank you for your donation.", type: "DONATION_COMPLETED", is_read: true, created_at: new Date(Date.now() - 3 * 86400000).toISOString(), related_request_id: "r-1" },
];

const TYPE_LABEL = {
  BLOOD_REQUEST: "Blood request",
  DONOR_RESPONSE: "Donor response",
  DONOR_SELECTED: "Selected",
  DONATION_COMPLETED: "Completed",
  CAMP: "Camp",
  REQUEST_CANCELLED: "Cancelled",
  SYSTEM: "System",
};

export default function Notifications() {
  const { isDemo } = useAuth();
  const { notify } = useToast();
  const [tab, setTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (isDemo) {
      setNotifications(MOCK_NOTIFICATIONS);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = notifications.filter((n) => {
    if (tab === "unread") return !n.is_read;
    if (tab === "read") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n)));
    if (!isDemo) {
      try { await api.patch(`/notifications/${id}/read`); } catch { /* non-fatal */ }
    }
  };

  const markAll = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (!isDemo) {
      try { await api.patch("/notifications/read-all"); } catch { /* non-fatal */ }
    }
    notify("All notifications marked as read.", "success");
  };

  const deleteOne = (id) => {
    setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
    notify("Notification removed.", "info");
  };

  const openRelated = (n) => {
    if (n.related_request_id) navigate(`/app/requests/${n.related_request_id}`);
    else navigate("/app/notifications");
  };

  return (
    <div className="page">
      <SectionHeader
        title="Notifications"
        subtitle={`${unreadCount} unread of ${notifications.length} total`}
        action={unreadCount > 0 ? <Button onClick={markAll}>Mark all as read</Button> : undefined}
      />

      <Alert tone="error" onClose={() => setError("")}>{error}</Alert>

      <Tabs
        tabs={[
          { key: "all", label: "All" },
          { key: "unread", label: `Unread (${unreadCount})` },
          { key: "read", label: "Read" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <Card className="notification-center">
        {loading ? (
          <Spinner label="Loading notifications…" />
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications" message="You're all caught up." />
        ) : (
          <div className="nc-list">
            {filtered.map((n) => (
              <div
                key={n.notification_id}
                className={`nc-item ${n.is_read ? "" : "nc-item--unread"}`}
              >
                <button className="nc-item__main" onClick={() => !n.is_read && markRead(n.notification_id)}>
                  <span className="nc-item__dot" />
                  <span className="nc-item__body">
                    <span className="nc-item__head">
                      <span className="nc-item__title">{n.title}</span>
                      <span className="nc-item__type">{TYPE_LABEL[n.type] || n.type}</span>
                    </span>
                    <span className="nc-item__message">{n.message}</span>
                    <span className="nc-item__time">{timeAgo(n.created_at)}</span>
                  </span>
                </button>
                <div className="nc-item__actions">
                  {n.related_request_id && (
                    <button className="link-button" onClick={() => openRelated(n)}>View</button>
                  )}
                  <button className="link-button" onClick={() => markRead(n.notification_id)}>Mark read</button>
                  <button className="link-button" onClick={() => deleteOne(n.notification_id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
