import { AppBar, BottomNav, Card, Chip, Button, Row, StatTile, SectionHeading } from "../../components/mobile/ui";
import { donorDashboard } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/donor/home" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/donor/requests" },
  { key: "camps", label: "Camps", icon: "🎪", path: "/m/donor/camps" },
  { key: "alerts", label: "Alerts", icon: "🔔", path: "/m/donor/alerts" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/donor/settings" },
];

export default function Screen1DonorDashboard({ navigate }) {
  const d = donorDashboard;
  return (
    <div className="m-screen">
      <AppBar title={d.greeting} subtitle={d.location} />
      <div className="m-screen__body">
        <Card>
          <Row label="Blood group" right={<Chip variant="default">{d.bloodGroup}</Chip>} />
          <Row label="Availability" right={<Chip variant="green">{d.availability}</Chip>} />
          <Row label="Last donation" right={<span className="m-row__right">{d.lastDonation}</span>} />
        </Card>

        <div className="m-statrow">
          {d.stats.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <SectionHeading>Open requests near you</SectionHeading>

        {d.openRequests.map((r) => (
          <Card key={r.id}>
            <div className="m-card-name">{r.hospital}</div>
            <Chip variant="default">{r.bloodGroup}</Chip>
            <small>
              {r.units} units · {r.urgency} · {r.distance}
            </small>
            <div className="m-btn-pair">
              <Button variant="primary" onClick={() => navigate("/m/donor/requests")}>Accept</Button>
              <Button variant="outline" onClick={() => navigate("/m/donor/requests")}>Reject</Button>
            </div>
          </Card>
        ))}
      </div>
      <BottomNav items={NAV} active="home" onNavigate={navigate} />
    </div>
  );
}
