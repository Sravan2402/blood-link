import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, SectionHeader, Spinner, StatCard, StatusBadge } from "../../components/ui";
import { DonutChart, LineChart } from "../../components/kit";
import { auditLogs, bloodCamps, bloodBanks, donationStats, fraudReports, stats, transfers } from "../../lib/mockData";
import { bloodGroupColor, formatDateTime, timeAgo } from "../../lib/constants";
import { navigate } from "../../router/useRoute";

export default function AdminDashboard() {
  const { isDemo } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemo) {
        setDashboard(stats);
      } else {
        const res = await api.get("/dashboard/admin");
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

  const d = dashboard || stats;
  const donutData = donationStats.byBloodGroup.map((g) => ({
    label: g.group,
    value: g.units,
    color: bloodGroupColor(g.group),
  }));

  return (
    <div className="page">
      <SectionHeader
        title="Admin Overview"
        subtitle="Platform-wide statistics and management."
        action={<Button onClick={() => navigate("/app/verifications")}>View verifications</Button>}
      />

      {error && <div className="alert alert--error">{error}</div>}

      {loading && !dashboard ? (
        <Spinner label="Loading dashboard…" />
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Total users" value={(d.total_donors || 0) + (d.total_hospitals || 0)} icon="👥" tone="primary" />
            <StatCard label="Donors" value={d.total_donors} icon="🧑" tone="info" />
            <StatCard label="Hospitals" value={d.total_hospitals} icon="🏥" tone="neutral" />
            <StatCard label="Blood banks" value={d.total_blood_banks ?? bloodBanks.length} icon="🏬" tone="neutral" />
            <StatCard label="Blood requests" value={d.total_blood_requests} icon="📋" tone="primary" />
            <StatCard label="Open requests" value={d.open_requests} icon="🟢" tone="warning" />
            <StatCard label="Completed" value={d.completed_requests} icon="✅" tone="success" />
            <StatCard label="Donations" value={d.total_donations} icon="🩸" tone="info" />
            <StatCard label="Units donated" value={d.total_units_donated} icon="🧪" tone="success" />
            <StatCard label="Camps" value={bloodCamps.length} icon="🎪" tone="neutral" />
            <StatCard label="Transfers" value={transfers.length} icon="🚚" tone="info" />
          </div>

          <div className="dash-row">
            <Card className="chart-card">
              <h3>Donations by blood group</h3>
              <DonutChart data={donutData} />
            </Card>
            <Card className="chart-card">
              <h3>Monthly donations</h3>
              <LineChart data={donationStats.monthly.map((m) => ({ label: m.month, value: m.donations }))} />
            </Card>
          </div>

          <div className="dash-row">
            <Card className="dash-card">
              <div className="dash-card__head">
                <h3>Recent activity</h3>
                <Button size="sm" variant="ghost" onClick={() => navigate("/app/audit-logs")}>All logs →</Button>
              </div>
              <div className="mini-notif-list">
                {auditLogs.slice(0, 5).map((a) => (
                  <div key={a.id} className="mini-notif">
                    <strong>{a.action}</strong>
                    <small>{a.target} · {timeAgo(a.at)}</small>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="dash-card">
              <div className="dash-card__head">
                <h3>Pending verifications</h3>
                <Button size="sm" variant="ghost" onClick={() => navigate("/app/verifications")}>Review →</Button>
              </div>
              <div className="mini-notif-list">
                <div className="mini-notif"><strong>Apollo Heart Institute</strong><small>Hospital · pending review</small></div>
                <div className="mini-notif"><strong>Nivaarana Blood Bank</strong><small>Blood bank · pending review</small></div>
                <div className="mini-notif"><strong>Winter Blood Camp</strong><small>Camp · awaiting approval</small></div>
              </div>
            </Card>
          </div>

          <Card className="dash-card">
            <div className="dash-card__head">
              <h3>Fraud & system reports</h3>
              <Button size="sm" variant="ghost" onClick={() => navigate("/app/reports")}>Reports →</Button>
            </div>
            <div className="movement-list">
              {fraudReports.map((f) => (
                <div key={f.id} className="movement-item">
                  <span className="movement-item__type movement-item__type--expired">⚠️ {f.reason}</span>
                  <span>by {f.reportedBy}</span>
                  <StatusBadge status={f.status === "RESOLVED" ? "COMPLETED" : "OPEN"} />
                  <small>{formatDateTime(f.at)}</small>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
