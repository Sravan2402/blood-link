import { AppBar, BottomNav, Card, Chip, Button, StatTile, SectionHeading } from "../../components/mobile/ui";
import { adminVerification } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/admin/home" },
  { key: "users", label: "Users", icon: "👥", path: "/m/admin/verify" },
  { key: "verify", label: "Verify", icon: "✅", path: "/m/admin/verify" },
  { key: "reports", label: "Reports", icon: "📊", path: "/m/admin/reports" },
  { key: "logs", label: "Logs", icon: "📜", path: "/m/admin/logs" },
];

export default function Screen14AdminVerification({ navigate }) {
  const a = adminVerification;
  return (
    <div className="m-screen">
      <AppBar title="Admin" subtitle="Facility verification" />
      <div className="m-screen__body">
        <div className="m-statrow">
          {a.stats.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <SectionHeading>Pending facilities</SectionHeading>

        {a.facilities.map((f) => (
          <Card key={f.id}>
            <div className="m-card-name">{f.name}</div>
            <Chip variant="default">{f.status}</Chip>
            <small>{f.info}</small>
            <div className="m-btn-pair">
              <Button variant="primary" onClick={() => navigate("/m/admin/verify")}>Approve</Button>
              <Button variant="outline" onClick={() => navigate("/m/admin/verify")}>Reject</Button>
            </div>
          </Card>
        ))}

        <Card>
          <div className="m-card-name">Reported request</div>
          <small>{a.reported.description}</small>
          <small>{a.reported.count} report</small>
          <Button variant="outline" onClick={() => navigate("/m/admin/reports")}>Investigate</Button>
        </Card>
      </div>
      <BottomNav items={NAV} active="verify" onNavigate={navigate} />
    </div>
  );
}
