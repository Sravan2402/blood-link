import { useToast } from "../../contexts/ToastContext";
import { Button, Card, SectionHeader, StatCard, StatusBadge } from "../../components/ui";
import { BarChart, DonutChart, LineChart } from "../../components/kit";

import { bloodBanks, donationStats } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor } from "../../lib/constants";

export default function BloodBankReports() {
  const { notify } = useToast();
  const bank = bloodBanks[0];

  const totalUnits = Object.values(bank.groups).reduce((a, b) => a + b, 0);
  const donutData = BLOOD_GROUPS.map((g) => ({
    label: g,
    value: bank.groups[g] || 0,
    color: bloodGroupColor(g),
  }));

  const lowStock = BLOOD_GROUPS.filter((g) => bank.groups[g] < 100);
  const expiring = [
    { group: "O+", units: 12, expiry: "2026-12-02" },
    { group: "A+", units: 8, expiry: "2026-12-05" },
    { group: "B+", units: 5, expiry: "2026-12-08" },
  ];

  return (
    <div className="page">
      <SectionHeader
        title="Reports"
        subtitle="Inventory analytics, expiry tracking, and trends."
        action={<Button onClick={() => notify("Report exported as CSV.", "success")}>📄 Export report</Button>}
      />

      <div className="stat-grid">
        <StatCard label="Total units" value={totalUnits} icon="📦" tone="primary" />
        <StatCard label="Low stock" value={lowStock.length} icon="⚠️" tone="warning" />
        <StatCard label="Expiring" value={expiring.length} icon="⏳" tone="warning" />
        <StatCard label="Components tracked" value={4} icon="🧪" tone="info" />
      </div>

      <div className="dash-row">
        <Card className="chart-card">
          <h3>Inventory by blood group</h3>
          <DonutChart data={donutData} />
        </Card>
        <Card className="chart-card">
          <h3>Units by group</h3>
          <BarChart data={BLOOD_GROUPS.map((g) => ({ label: g, value: bank.groups[g] || 0 }))} />
        </Card>
      </div>

      <Card className="chart-card">
        <h3>Collection & issue trend</h3>
        <LineChart
          data={donationStats.monthly.map((m) => ({ label: m.month, value: m.units }))}
          color="var(--success)"
        />
      </Card>

      <div className="dash-row">
        <Card className="dash-card">
          <h3>Low-stock alerts</h3>
          {lowStock.length === 0 ? (
            <p className="muted-note">No low-stock groups. 🎉</p>
          ) : (
            <div className="alert-list">
              {lowStock.map((g) => (
                <div key={g} className="alert-row">
                  <span className="blood-pill" style={{ background: `${bloodGroupColor(g)}1a`, color: bloodGroupColor(g) }}>🩸 {g}</span>
                  <span>{bank.groups[g]} units left</span>
                  <StatusBadge status="CANCELLED" />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="dash-card">
          <h3>Expiry tracking</h3>
          <div className="alert-list">
            {expiring.map((e) => (
              <div key={e.group} className="alert-row">
                <span className="blood-pill" style={{ background: `${bloodGroupColor(e.group)}1a`, color: bloodGroupColor(e.group) }}>🩸 {e.group}</span>
                <span>{e.units} units · expires {e.expiry}</span>
                <StatusBadge status="OPEN" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
