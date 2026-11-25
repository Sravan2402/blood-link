import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
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
  UrgencyBadge,
} from "../../components/ui";
import { Avatar, ProgressBar } from "../../components/kit";
import { bloodCamps as camps } from "../../lib/mockData";
import { formatDate, formatDistance, bloodGroupColor } from "../../lib/constants";

export default function DonorDashboard() {
  const { user, isDemo } = useAuth();
  const { notify } = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemo) {
        // Demo donors see realistic mock data.
        setDashboard({
          total_donations: 5,
          total_units_donated: 5,
          last_donation_date: "2026-10-14",
          eligibility_status: true,
          pending_responses: 1,
          selected_donations: 1,
          completed_donations: 5,
        });
        setRequests(camps.slice(0, 2).map((c, i) => ({ request_id: `d-${i}`, blood_group: "O+", hospital: c.organizer, city: c.city, units_required: 2, urgency: "HIGH", status: "OPEN", patient_name: "Trauma patient", distanceKm: [1.2, 3.4][i], required_before: c.date, created_at: c.date })));
      } else {
        const [dashRes, openRes] = await Promise.all([
          api.get("/dashboard/donor"),
          api.get("/blood-requests/open"),
        ]);
        setDashboard(dashRes.data.dashboard);
        setRequests(openRes.data.requests || []);
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

  const toggleAvailability = async () => {
    setBusy(true);
    try {
      if (isDemo) {
        setAvailability((a) => !a);
        notify("Availability updated.", "success");
        return;
      }
      const next = availability !== true;
      const res = await api.patch("/dashboard/donor/availability", { available: next });
      setAvailability(res.data.data.available_for_requests);
      notify(next ? "You are now available for requests." : "You are now unavailable.", next ? "success" : "info");
    } catch (err) {
      notify(err.response?.data?.message || "Could not update availability.", "error");
    } finally {
      setBusy(false);
    }
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      notify("Geolocation is not supported by your browser.", "error");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.patch("/dashboard/donor/location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          notify("Location updated successfully.", "success");
        } catch (err) {
          notify(err.response?.data?.message || "Could not update location.", "error");
        } finally {
          setBusy(false);
        }
      },
      () => { notify("Could not access your location.", "error"); setBusy(false); },
    );
  };

  const profileCompletion = 75;

  if (loading && !dashboard) return <Spinner label="Loading dashboard…" />;

  return (
    <div className="page">
      <SectionHeader
        title={`Welcome back, ${user?.full_name?.split(" ")[0] || "Donor"} 👋`}
        subtitle="Here's what's happening with your donations and blood requests."
        action={
          <Button onClick={() => navigate("/app/find-blood")}>Find blood requests →</Button>
        }
      />

      <Alert tone="error" onClose={() => setError("")}>{error}</Alert>

      {/* Profile summary + completion */}
      <div className="dash-row">
        <Card className="profile-summary-card">
          <div className="profile-summary">
            <Avatar name={user?.full_name} size={56} src={user?.profile_image} />
            <div>
              <h3>{user?.full_name}</h3>
              <p>{user?.email}</p>
              <StatusBadge status={dashboard?.eligibility_status ? "OPEN" : "CANCELLED"} />
            </div>
          </div>
          <div className="profile-completion">
            <div className="profile-completion__head">
              <span>Profile completion</span>
              <span>{profileCompletion}%</span>
            </div>
            <ProgressBar value={profileCompletion} tone="success" />
            <Button size="sm" variant="secondary" onClick={() => navigate("/app/profile")}>Complete profile</Button>
          </div>
        </Card>

        <Card className="availability-card">
          <h3>Availability</h3>
          <p>Toggle to receive notifications for matching blood requests near you.</p>
          <div className="dash-card__row">
            <StatusBadge status={availability === null ? "OPEN" : availability ? "OPEN" : "CANCELLED"} />
            <Button onClick={toggleAvailability} disabled={busy}>
              {availability ? "Become unavailable" : "I'm available to donate"}
            </Button>
          </div>
          <Button size="sm" variant="secondary" onClick={updateLocation} disabled={busy} className="dash-card__row">
            {busy ? "Working…" : "Update my location"}
          </Button>
        </Card>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard label="Total donations" value={dashboard?.total_donations ?? 0} icon="🩸" tone="primary" />
        <StatCard label="Units donated" value={dashboard?.total_units_donated ?? 0} icon="🧪" tone="info" />
        <StatCard label="Last donation" value={formatDate(dashboard?.last_donation_date)} icon="📅" tone="neutral" />
        <StatCard label="Next eligible" value={formatDate(addWeeks(dashboard?.last_donation_date))} icon="⏭️" tone="info" />
        <StatCard label="Pending responses" value={dashboard?.pending_responses ?? 0} icon="⏳" tone="warning" />
        <StatCard label="Accepted donations" value={dashboard?.selected_donations ?? 0} icon="⭐" tone="success" />
      </div>

      {/* Nearby + matching requests */}
      <div className="dash-row">
        <Card className="dash-card">
          <div className="dash-card__head">
            <h3>Nearby & matching requests</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate("/app/find-blood")}>View all →</Button>
          </div>
          {requests.length === 0 ? (
            <EmptyState icon="🩸" title="No open requests" message="Check back later for new requests." />
          ) : (
            <div className="mini-request-list">
              {requests.slice(0, 4).map((r) => (
                <button key={r.request_id} className="mini-request-row" onClick={() => navigate(`/app/requests/${r.request_id}`)}>
                  <span className="blood-pill" style={{ background: `${bloodGroupColor(r.blood_group || "O+")}1a`, color: bloodGroupColor(r.blood_group || "O+") }}>🩸 {r.blood_group || "O+"}</span>
                  <span className="mini-request-row__info">
                    <strong>{r.hospital || r.city}</strong>
                    <small>{r.city} · {formatDistance(r.distanceKm)} · {formatDate(r.required_before)}</small>
                  </span>
                  <UrgencyBadge urgency={r.urgency} />
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="dash-card">
          <h3>Upcoming blood camps</h3>
          <div className="mini-camp-list">
            {camps.filter((c) => c.status !== "completed").slice(0, 3).map((c) => (
              <div key={c.id} className="mini-camp-row">
                <span>{c.poster} {c.title}</span>
                <small>{formatDate(c.date)} · {c.city}</small>
                <Button size="sm" variant="secondary" onClick={() => navigate("/app/blood-camps")}>Details</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="quick-card">
        <div>
          <h3>Quick actions</h3>
          <p>Find a request, check your responses, or view your donation history.</p>
        </div>
        <div className="dash-card__row">
          <Button onClick={() => navigate("/app/find-blood")}>Find blood</Button>
          <Button variant="secondary" onClick={() => navigate("/app/my-responses")}>My responses</Button>
          <Button variant="secondary" onClick={() => navigate("/app/my-donations")}>My donations</Button>
        </div>
      </Card>
    </div>
  );
}

function addWeeks(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + 56);
  return d.toISOString();
}
