import { useToast } from "../../contexts/ToastContext";
import { Button, Card, SectionHeader, StatusBadge } from "../../components/ui";
import { BarChart } from "../../components/kit";
import { bloodBanks } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor } from "../../lib/constants";

const inventory = bloodBanks[0].groups;

export default function Inventory() {
  const { notify } = useToast();

  const lowStock = BLOOD_GROUPS.filter((g) => inventory[g] < 100);
  const expiring = [
    { group: "O+", units: 12, expiry: "2026-12-02" },
    { group: "A+", units: 8, expiry: "2026-12-05" },
  ];

  const chartData = BLOOD_GROUPS.map((g) => ({ label: g, value: inventory[g] || 0 }));

  return (
    <div className="page">
      <SectionHeader
        title="Inventory"
        subtitle="Blood stock available at your hospital, by blood group."
        action={<Button onClick={() => notify("Open the blood collection form to add stock.", "info")}>Add stock</Button>}
      />

      <div className="stat-grid">
        <Card className="impact-card"><strong>{Object.values(inventory).reduce((a, b) => a + b, 0)}</strong><span>Total units</span></Card>
        <Card className="impact-card"><strong>{BLOOD_GROUPS.filter((g) => inventory[g] > 0).length}</strong><span>Groups stocked</span></Card>
        <Card className="impact-card"><strong>{lowStock.length}</strong><span>Low-stock groups</span></Card>
        <Card className="impact-card"><strong>{expiring.length}</strong><span>Expiring soon</span></Card>
      </div>

      <Card className="chart-card">
        <h3>Units by blood group</h3>
        <BarChart data={chartData} />
      </Card>

      <div className="dash-row">
        <Card className="dash-card">
          <h3>Blood group inventory</h3>
          <div className="inventory-grid">
            {BLOOD_GROUPS.map((g) => (
              <div
                key={g}
                className={`inventory-cell ${inventory[g] < 100 ? "inventory-cell--low" : ""}`}
                style={{ borderColor: bloodGroupColor(g) }}
              >
                <span className="inventory-cell__group">🩸 {g}</span>
                <span className="inventory-cell__units">{inventory[g]} units</span>
                {inventory[g] < 100 && <StatusBadge status="CANCELLED" />}
              </div>
            ))}
          </div>
        </Card>

        <div className="inventory-side">
          <Card className="dash-card">
            <h3>Low-stock alerts</h3>
            {lowStock.length === 0 ? (
              <p className="muted-note">No low-stock groups. 🎉</p>
            ) : (
              <div className="alert-list">
                {lowStock.map((g) => (
                  <div key={g} className="alert-row">
                    <span className="blood-pill" style={{ background: `${bloodGroupColor(g)}1a`, color: bloodGroupColor(g) }}>🩸 {g}</span>
                    <span>{inventory[g]} units left</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card className="dash-card">
            <h3>Expiring soon</h3>
            <div className="alert-list">
              {expiring.map((e) => (
                <div key={e.group} className="alert-row">
                  <span className="blood-pill" style={{ background: `${bloodGroupColor(e.group)}1a`, color: bloodGroupColor(e.group) }}>🩸 {e.group}</span>
                  <span>{e.units} units · expires {e.expiry}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
