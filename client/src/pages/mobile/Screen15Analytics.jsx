import { AppBar, BottomNav, Card, StatTile, BarChart, Row, SectionHeading } from "../../components/mobile/ui";
import { analytics } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/admin/home" },
  { key: "users", label: "Users", icon: "👥", path: "/m/admin/reports" },
  { key: "verify", label: "Verify", icon: "✅", path: "/m/admin/reports" },
  { key: "reports", label: "Reports", icon: "📊", path: "/m/admin/reports" },
  { key: "logs", label: "Logs", icon: "📜", path: "/m/admin/reports" },
];

export default function Screen15Analytics({ navigate }) {
  const a = analytics;
  return (
    <div className="m-screen">
      <AppBar title="Reports" subtitle="Last 30 days" />
      <div className="m-screen__body">
        <div className="m-statrow">
          {a.stats.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <SectionHeading>Requests by status</SectionHeading>
        <Card>
          <BarChart data={a.byStatus} />
        </Card>

        <SectionHeading>Demand by blood group</SectionHeading>
        <Card>
          <BarChart data={a.demandByGroup} />
        </Card>

        <Card>
          {a.extra.map((e) => (
            <Row key={e.label} label={e.label} right={<span className="m-row__right">{e.value}</span>} />
          ))}
        </Card>
      </div>
      <BottomNav items={NAV} active="reports" onNavigate={navigate} />
    </div>
  );
}
