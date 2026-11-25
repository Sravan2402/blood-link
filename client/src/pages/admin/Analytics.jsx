import { Card, SectionHeader, StatCard } from "../../components/ui";
import { BarChart, DonutChart, LineChart } from "../../components/kit";
import { donationStats, donorRanking, stats } from "../../lib/mockData";
import { bloodGroupColor } from "../../lib/constants";

export default function Analytics() {
  const byGroup = donationStats.byBloodGroup.map((g) => ({
    label: g.group,
    value: g.units,
    color: bloodGroupColor(g.group),
  }));

  const topDonors = donorRanking.slice(0, 6);
  const cityData = [
    { label: "Hyderabad", value: 85 },
    { label: "Secunderabad", value: 42 },
    { label: "Warangal", value: 28 },
    { label: "Nizamabad", value: 18 },
  ];

  return (
    <div className="page">
      <SectionHeader title="Analytics" subtitle="Platform-wide donation, donor, and campaign analytics." />

      <div className="stat-grid">
        <StatCard label="Total donors" value={stats.total_donors} icon="👥" tone="primary" />
        <StatCard label="Total donations" value={stats.total_donations} icon="🩸" tone="info" />
        <StatCard label="Units donated" value={stats.total_units_donated} icon="🧪" tone="success" />
        <StatCard label="Avg donations/donor" value={Math.round(stats.total_donations / stats.total_donors)} icon="📊" tone="neutral" />
      </div>

      <div className="dash-row">
        <Card className="chart-card">
          <h3>Donations by blood group</h3>
          <DonutChart data={byGroup} />
        </Card>
        <Card className="chart-card">
          <h3>Donations by group</h3>
          <BarChart data={byGroup.map((g) => ({ label: g.label, value: g.value }))} />
        </Card>
      </div>

      <div className="dash-row">
        <Card className="chart-card">
          <h3>Donation trend</h3>
          <LineChart data={donationStats.monthly.map((m) => ({ label: m.month, value: m.donations }))} color="var(--primary)" />
        </Card>
        <Card className="chart-card">
          <h3>Donations by city</h3>
          <BarChart data={cityData} />
        </Card>
      </div>

      <Card className="dash-card">
        <h3>Top donors</h3>
        <div className="ranking-list">
          {topDonors.map((d, i) => (
            <div key={d.donorId} className="ranking-row">
              <span className="ranking-row__rank">#{i + 1}</span>
              <div className="ranking-row__info">
                <strong>{d.donorName}</strong>
                <small>🩸 {d.bloodGroup} · {d.donations} donations · {d.totalUnits} units</small>
              </div>
              <span className="badge badge--success">{d.tier}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
