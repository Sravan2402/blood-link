import { Card, SectionHeader, StatCard } from "../../components/ui";
import { BarChart, DonutChart, LineChart } from "../../components/kit";
import { stats, donationStats } from "../../lib/mockData";
import { bloodGroupColor } from "../../lib/constants";

export default function Stats() {
  const donutData = donationStats.byBloodGroup.map((g) => ({
    label: g.group,
    value: g.units,
    color: bloodGroupColor(g.group),
  }));

  return (
    <div className="public-page">
      <section className="page-hero">
        <span className="hero__eyebrow">Blood donation statistics</span>
        <h1>The impact of the BloodLink network</h1>
        <p className="hero__lead">
          Transparent, up-to-date numbers across donors, hospitals, requests,
          and donations — showing how the community is keeping blood available.
        </p>
      </section>

      <section className="section">
        <SectionHeader title="Platform overview" />
        <div className="stat-grid">
          <StatCard label="Total donors" value={stats.totalDonors.toLocaleString()} icon="🧑" tone="primary" />
          <StatCard label="Total hospitals" value={stats.totalHospitals} icon="🏥" tone="info" />
          <StatCard label="Total blood banks" value={stats.totalBloodBanks} icon="🏬" tone="neutral" />
          <StatCard label="Blood camps" value={stats.totalCamps} icon="🎪" tone="success" />
          <StatCard label="Blood requests" value={stats.totalRequests.toLocaleString()} icon="📋" tone="primary" />
          <StatCard label="Open requests" value={stats.openRequests} icon="🟢" tone="warning" />
          <StatCard label="Completed requests" value={stats.completedRequests.toLocaleString()} icon="✅" tone="success" />
          <StatCard label="Total donations" value={stats.totalDonations.toLocaleString()} icon="🩸" tone="info" />
        </div>
      </section>

      <section className="section section--tint">
        <SectionHeader title="Donations by blood group" subtitle="Units collected across all blood groups." />
        <Card className="chart-card">
          <DonutChart data={donutData} />
        </Card>
      </section>

      <section className="section">
        <SectionHeader title="Donations over the year" subtitle="Monthly donation trend." />
        <Card className="chart-card">
          <LineChart
            data={donationStats.monthly.map((m) => ({ label: m.month, value: m.donations }))}
          />
        </Card>
      </section>

      <section className="section section--tint">
        <SectionHeader title="Units collected over the year" />
        <Card className="chart-card">
          <BarChart data={donationStats.monthly.map((m) => ({ label: m.month, value: m.units }))} color="var(--info)" />
        </Card>
      </section>
    </div>
  );
}
