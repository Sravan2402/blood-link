
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, SectionHeader, StatCard, StatusBadge } from "../../components/ui";
import { Avatar } from "../../components/kit";
import { bloodCamps, campDonations } from "../../lib/mockData";
import { formatDate, formatDateTime } from "../../lib/constants";
import { navigate } from "../../router/useRoute";

export default function CampDashboard() {
  const { user } = useAuth();

  const totalCamps = bloodCamps.length;
  const upcoming = bloodCamps.filter((c) => c.status === "upcoming").length;
  const ongoing = bloodCamps.filter((c) => c.status === "ongoing").length;
  const totalRegistered = bloodCamps.reduce((a, c) => a + c.registered, 0);
  const totalCollected = campDonations.reduce((a, d) => a + d.units, 0);

  return (
    <div className="page">
      <SectionHeader
        title={`Welcome, ${user?.full_name || "Organizer"} 👋`}
        subtitle="Manage your blood donation camps and their donation records."
        action={<Button onClick={() => navigate("/app/create-camp")}>➕ Create camp</Button>}
      />

      <div className="dash-row">
        <Card className="profile-summary-card">
          <div className="profile-summary">
            <Avatar name={user?.full_name || "Organizer"} size={56} />
            <div>
              <h3>{user?.full_name || "Camp Organizer"}</h3>
              <p>{user?.organization || "Red Life Blood Bank"}</p>
              <StatusBadge status="COMPLETED" />
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate("/app/profile")}>Edit profile</Button>
        </Card>

        <Card className="inventory-summary">
          <h3>Camp overview</h3>
          <div className="inventory-summary__grid">
            <div><strong>{totalCamps}</strong><span>Total camps</span></div>
            <div><strong>{upcoming}</strong><span>Upcoming</span></div>
            <div><strong>{ongoing}</strong><span>Ongoing</span></div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate("/app/manage-camps")}>Manage camps</Button>
        </Card>
      </div>

      <div className="stat-grid">
        <StatCard label="Total camps" value={totalCamps} icon="🎪" tone="primary" />
        <StatCard label="Upcoming" value={upcoming} icon="📅" tone="info" />
        <StatCard label="Ongoing" value={ongoing} icon="⏱️" tone="success" />
        <StatCard label="Registrations" value={totalRegistered} icon="📝" tone="neutral" />
        <StatCard label="Units collected" value={totalCollected} icon="🩸" tone="primary" />
        <StatCard label="Completed camps" value={bloodCamps.filter((c) => c.status === "completed").length} icon="✅" tone="success" />
      </div>

      <div className="dash-row">
        <Card className="dash-card">
          <div className="dash-card__head">
            <h3>My camps</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate("/app/manage-camps")}>All →</Button>
          </div>
          <div className="mini-camp-list">
            {bloodCamps.slice(0, 4).map((c) => (
              <div key={c.id} className="mini-camp-row">
                <span>{c.poster} {c.title}</span>
                <small>{formatDate(c.date)} · {c.registered}/{c.capacity}</small>
                <StatusBadge status={c.status.toUpperCase()} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="dash-card">
          <h3>Recent donations</h3>
          <div className="movement-list">
            {campDonations.map((d) => (
              <div key={d.id} className="movement-item">
                <span className="movement-item__type movement-item__type--collected">➕ Donation</span>
                <span className="blood-pill-sm">🩸 {d.bloodGroup}</span>
                <span>{d.donorName} · {d.units} unit</span>
                <small>{formatDateTime(d.donatedAt)}</small>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="quick-card">
        <div>
          <h3>Quick actions</h3>
          <p>Create a camp, manage registrations, or record donations.</p>
        </div>
        <div className="dash-card__row">
          <Button onClick={() => navigate("/app/create-camp")}>Create camp</Button>
          <Button variant="secondary" onClick={() => navigate("/app/registrations")}>Registrations</Button>
          <Button variant="secondary" onClick={() => navigate("/app/donation-records")}>Donations</Button>
        </div>
      </Card>
    </div>
  );
}
