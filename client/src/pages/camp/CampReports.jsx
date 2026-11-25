import { useToast } from "../../contexts/ToastContext";
import { Button, Card, SectionHeader, StatCard } from "../../components/ui";
import { BarChart, DonutChart } from "../../components/kit";
import { bloodCamps, campDonations } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor } from "../../lib/constants";

export default function CampReports() {
  const { notify } = useToast();

  const totalDonations = campDonations.length;
  const totalUnits = campDonations.reduce((a, d) => a + d.units, 0);
  const attendance = 4;

  const byGroup = BLOOD_GROUPS
    .map((g) => ({ label: g, value: campDonations.filter((d) => d.bloodGroup === g).reduce((a, d) => a + d.units, 0), color: bloodGroupColor(g) }))
    .filter((g) => g.value > 0);

  return (
    <div className="page">
      <SectionHeader
        title="Camp Reports"
        subtitle="Donation and attendance analytics for your camps."
        action={<Button onClick={() => notify("Camp report exported as PDF.", "success")}>📄 Export report</Button>}
      />

      <div className="stat-grid">
        <StatCard label="Camps organized" value={bloodCamps.length} icon="🎪" tone="primary" />
        <StatCard label="Donations" value={totalDonations} icon="🩸" tone="info" />
        <StatCard label="Units collected" value={totalUnits} icon="🧪" tone="success" />
        <StatCard label="Attendance" value={attendance} icon="✅" tone="neutral" />
      </div>

      <div className="dash-row">
        <Card className="chart-card">
          <h3>Donations by blood group</h3>
          <DonutChart data={byGroup} />
        </Card>
        <Card className="chart-card">
          <h3>Units by group</h3>
          <BarChart data={byGroup.map((g) => ({ label: g.label, value: g.value }))} />
        </Card>
      </div>

      <Card className="dash-card">
        <h3>Camps summary</h3>
        <div className="movement-list">
          {bloodCamps.map((c) => {
            const collected = campDonations.filter((d) => d.campId === c.id).reduce((a, d) => a + d.units, 0);
            return (
              <div key={c.id} className="movement-item">
                <span className="movement-item__type movement-item__type--collected">🎪 {c.title}</span>
                <span>👥 {c.registered}/{c.capacity}</span>
                <span>🩸 {collected} units</span>
                <small>{c.city}</small>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
