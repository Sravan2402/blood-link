import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../router/useRoute";
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Spinner,
  StatCard,
  SectionHeader,
  StatusBadge,
} from "../../components/ui";
import { Avatar } from "../../components/kit";
import { bloodCamps, donors, hospitals, notifications } from "../../lib/mockData";
import { timeAgo } from "../../lib/constants";

export default function HospitalDashboard() {
  const { user, isDemo } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemo) {
        setDashboard({
          total_blood_requests: 8,
          open_requests: 3,
          matched_requests: 2,
          completed_requests: 3,
          cancelled_requests: 0,
          total_donors_responded: 14,
          total_units_requested: 19,
        });
      } else {
        const res = await api.get("/dashboard/hospital");
        setDashboard(res.data.dashboard);
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !dashboard) return <Spinner label="Loading dashboard…" />;

  return (
    <div className="page">
      <SectionHeader
        title={`Welcome, ${user?.full_name?.split(" ")[0] || "Hospital"} 👋`}
        subtitle="Manage your blood requests, donor responses, and coordination."
        action={<Button onClick={() => navigate("/app/create-request")}>➕ New blood request</Button>}
      />

      <Alert tone="error" onClose={() => setError("")}>{error}</Alert>

      <div className="dash-row">
        <Card className="profile-summary-card">
          <div className="profile-summary">
            <Avatar name={user?.full_name || "Hospital"} size={56} src={user?.profile_image} />
            <div>
              <h3>{user?.full_name || user?.hospital_name}</h3>
              <p>{user?.email}</p>
              <StatusBadge status="OPEN" />
            </div>
          </div>
          <div className="profile-completion">
            <div className="profile-completion__head">
              <span>Requests this month</span>
              <span>{dashboard?.total_blood_requests ?? 0}</span>
            </div>
            <Button size="sm" variant="secondary" onClick={() => navigate("/app/my-requests")}>View requests</Button>
          </div>
        </Card>

        <Card className="inventory-summary">
          <h3>Blood inventory summary</h3>
          <div className="inventory-summary__grid">
            <div><strong>{donors.length * 4}</strong><span>Units on hand</span></div>
            <div><strong>3</strong><span>Low stock groups</span></div>
            <div><strong>{hospitals.length}</strong><span>Partner hospitals</span></div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate("/app/inventory")}>Manage inventory</Button>
        </Card>
      </div>

      <div className="stat-grid">
        <StatCard label="Total requests" value={dashboard?.total_blood_requests ?? 0} icon="📋" tone="primary" />
        <StatCard label="Open" value={dashboard?.open_requests ?? 0} icon="🟢" tone="success" />
        <StatCard label="Matched" value={dashboard?.matched_requests ?? 0} icon="🤝" tone="info" />
        <StatCard label="Completed" value={dashboard?.completed_requests ?? 0} icon="✅" tone="success" />
        <StatCard label="Pending responses" value={dashboard?.total_donors_responded ?? 0} icon="⏳" tone="warning" />
        <StatCard label="Selected donors" value={dashboard?.matched_requests ?? 0} icon="⭐" tone="info" />
        <StatCard label="Units requested" value={dashboard?.total_units_requested ?? 0} icon="🧪" tone="neutral" />
        <StatCard label="Nearby donors" value={donors.filter((d) => d.available).length} icon="🧑" tone="primary" />
      </div>

      <div className="dash-row">
        <Card className="dash-card">
          <div className="dash-card__head">
            <h3>Recent blood requests</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate("/app/my-requests")}>All →</Button>
          </div>
          <div className="mini-request-list">
            {donors.slice(0, 3).map((d, i) => (
              <button key={d.id} className="mini-request-row" onClick={() => navigate("/app/my-requests")}>
                <span className="blood-pill" style={{ background: "var(--primary-soft)", color: "var(--primary-dark)" }}>🩸 {["O+", "A+", "B+"][i]}</span>
                <span className="mini-request-row__info">
                  <strong>Request #{5000 + i}</strong>
                  <small>{["CRITICAL", "HIGH", "MEDIUM"][i]} · {["2", "1", "3"][i]} units</small>
                </span>
                <StatusBadge status={["OPEN", "MATCHED", "COMPLETED"][i]} />
              </button>
            ))}
          </div>
        </Card>

        <Card className="dash-card">
          <div className="dash-card__head">
            <h3>Recent notifications</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate("/app/notifications")}>All →</Button>
          </div>
          <div className="mini-notif-list">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.notification_id} className={`mini-notif ${n.is_read ? "" : "mini-notif--unread"}`}>
                <strong>{n.title}</strong>
                <small>{timeAgo(n.created_at)}</small>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="dash-row">
        <Card className="dash-card">
          <h3>Recent donor responses</h3>
          <div className="mini-donor-list">
            {donors.slice(0, 3).map((d) => (
              <button key={d.id} className="mini-donor-row" onClick={() => navigate("/app/donor-responses")}>
                <Avatar name={d.name} size={32} />
                <span className="mini-donor-row__info">
                  <strong>{d.name}</strong>
                  <small>🩸 {d.blood_group} · 📍 {d.distanceKm} km</small>
                </span>
                <StatusBadge status="ACCEPTED" />
              </button>
            ))}
          </div>
        </Card>

        <Card className="dash-card">
          <h3>Upcoming blood camps</h3>
          <div className="mini-camp-list">
            {bloodCamps.filter((c) => c.status !== "completed").slice(0, 3).map((c) => (
              <div key={c.id} className="mini-camp-row">
                <span>{c.poster} {c.title}</span>
                <small>{c.city}</small>
                <Button size="sm" variant="secondary" onClick={() => navigate("/app/blood-camps")}>Details</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="quick-card">
        <div>
          <h3>Quick actions</h3>
          <p>Post a request, find donors, or manage your hospital network.</p>
        </div>
        <div className="dash-card__row">
          <Button onClick={() => navigate("/app/create-request")}>New request</Button>
          <Button variant="secondary" onClick={() => navigate("/app/find-donors")}>Find donors</Button>
          <Button variant="secondary" onClick={() => navigate("/app/hospital-network")}>Hospital network</Button>
        </div>
      </Card>

      {(dashboard?.total_blood_requests ?? 0) === 0 && (
        <EmptyState
          icon="🏥"
          title="No blood requests yet"
          message="Create your first blood request and BloodLink will notify matching donors instantly."
          action={<Button onClick={() => navigate("/app/create-request")}>Create a request</Button>}
        />
      )}
    </div>
  );
}
