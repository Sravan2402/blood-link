
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, SectionHeader, StatCard, StatusBadge } from "../../components/ui";
import { Avatar, DonutChart, BarChart } from "../../components/kit";
import { bloodBanks, inventoryMovements, transfers } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor, formatDateTime } from "../../lib/constants";
import { navigate } from "../../router/useRoute";

export default function BloodBankDashboard() {
  const { user } = useAuth();
  const bank = bloodBanks[0];

  const totalUnits = Object.values(bank.groups).reduce((a, b) => a + b, 0);
  const donutData = BLOOD_GROUPS.map((g) => ({
    label: g,
    value: bank.groups[g] || 0,
    color: bloodGroupColor(g),
  }));

  const collected = inventoryMovements.filter((m) => m.type === "collected").reduce((a, m) => a + m.units, 0);
  const issued = inventoryMovements.filter((m) => m.type === "issued").reduce((a, m) => a + m.units, 0);

  return (
    <div className="page">
      <SectionHeader
        title={`Welcome, ${user?.full_name || bank.name} 👋`}
        subtitle="Blood bank inventory and operations overview."
        action={<Button onClick={() => navigate("/app/inventory")}>Manage inventory</Button>}
      />

      <div className="dash-row">
        <Card className="profile-summary-card">
          <div className="profile-summary">
            <Avatar name={bank.name} size={56} />
            <div>
              <h3>{bank.name}</h3>
              <p>📍 {bank.address}</p>
              <StatusBadge status={bank.open ? "OPEN" : "CANCELLED"} />
            </div>
          </div>
          <div className="profile-completion">
            <div className="profile-completion__head">
              <span>Registration</span>
              <span>BB-2021-0042</span>
            </div>
            <Button size="sm" variant="secondary" onClick={() => navigate("/app/profile")}>Edit profile</Button>
          </div>
        </Card>

        <Card className="inventory-summary">
          <h3>Stock summary</h3>
          <div className="inventory-summary__grid">
            <div><strong>{totalUnits}</strong><span>Total units</span></div>
            <div><strong>{collected}</strong><span>Collected</span></div>
            <div><strong>{issued}</strong><span>Issued</span></div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate("/app/blood-collection")}>Record collection</Button>
        </Card>
      </div>

      <div className="stat-grid">
        <StatCard label="Total units" value={totalUnits} icon="📦" tone="primary" />
        <StatCard label="Groups stocked" value={BLOOD_GROUPS.filter((g) => bank.groups[g] > 0).length} icon="🩸" tone="info" />
        <StatCard label="Collections (recent)" value={collected} icon="➕" tone="success" />
        <StatCard label="Issues (recent)" value={issued} icon="📤" tone="warning" />
        <StatCard label="Open transfers" value={transfers.filter((t) => t.status === "PENDING" || t.status === "APPROVED").length} icon="🚚" tone="neutral" />
        <StatCard label="Low stock" value={BLOOD_GROUPS.filter((g) => bank.groups[g] < 100).length} icon="⚠️" tone="warning" />
      </div>

      <div className="dash-row">
        <Card className="chart-card">
          <h3>Inventory by blood group</h3>
          <DonutChart data={donutData} />
        </Card>
        <Card className="chart-card">
          <h3>Collections vs Issues</h3>
          <BarChart
            data={[
              { label: "Collected", value: collected },
              { label: "Issued", value: issued },
              { label: "Expired", value: 1 },
            ]}
          />
        </Card>
      </div>

      <Card className="dash-card">
        <div className="dash-card__head">
          <h3>Recent inventory movements</h3>
          <Button size="sm" variant="ghost" onClick={() => navigate("/app/inventory")}>All →</Button>
        </div>
        <div className="movement-list">
          {inventoryMovements.map((m) => (
            <div key={m.id} className="movement-item">
              <span className={`movement-item__type movement-item__type--${m.type}`}>
                {m.type === "collected" ? "➕ Collected" : m.type === "issued" ? "📤 Issued" : "🗑️ Expired"}
              </span>
              <span className="blood-pill-sm" style={{ color: bloodGroupColor(m.group) }}>🩸 {m.group}</span>
              <span>{m.units} units</span>
              <small>{formatDateTime(m.at)}</small>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
