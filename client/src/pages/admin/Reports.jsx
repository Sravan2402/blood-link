
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, SectionHeader, StatCard, StatusBadge } from "../../components/ui";
import { BarChart, LineChart } from "../../components/kit";
import { auditLogs, donationStats, fraudReports, stats } from "../../lib/mockData";
import { formatDateTime } from "../../lib/constants";

export default function Reports() {
  const { notify } = useToast();

  return (
    <div className="page">
      <SectionHeader
        title="Reports & Analytics"
        subtitle="Platform activity, donation trends, and fraud reports."
        action={<Button onClick={() => notify("Report exported as CSV.", "success")}>📄 Export</Button>}
      />

      <div className="stat-grid">
        <StatCard label="Total users" value={stats.total_donors + stats.total_hospitals} icon="👥" tone="primary" />
        <StatCard label="Total donations" value={stats.total_donations} icon="🩸" tone="info" />
        <StatCard label="Blood requests" value={stats.total_blood_requests} icon="📋" tone="neutral" />
        <StatCard label="Camps" value={5} icon="🎪" tone="neutral" />
      </div>

      <div className="dash-row">
        <Card className="chart-card">
          <h3>Monthly donations</h3>
          <LineChart data={donationStats.monthly.map((m) => ({ label: m.month, value: m.donations }))} color="var(--primary)" />
        </Card>
        <Card className="chart-card">
          <h3>Units by blood group</h3>
          <BarChart data={donationStats.byBloodGroup.map((g) => ({ label: g.group, value: g.units }))} />
        </Card>
      </div>

      <Card className="dash-card">
        <h3>Fraud & system reports</h3>
        <div className="movement-list">
          {fraudReports.map((f) => (
            <div key={f.id} className="movement-item">
              <span className="movement-item__type movement-item__type--expired">⚠️ {f.reason}</span>
              <span>{f.reportedBy}</span>
              <StatusBadge status={f.status === "RESOLVED" ? "COMPLETED" : "OPEN"} />
              <small>{formatDateTime(f.at)}</small>
            </div>
          ))}
        </div>
      </Card>

      <Card className="dash-card">
        <h3>Recent audit activity</h3>
        <div className="movement-list">
          {auditLogs.slice(0, 8).map((a) => (
            <div key={a.id} className="movement-item">
              <span className="movement-item__type movement-item__type--collected">📋 {a.action}</span>
              <span>{a.target}</span>
              <small>{formatDateTime(a.at)}</small>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
