import { AppBar, BottomNav, Card, Chip } from "../../components/mobile/ui";
import { donationHistory } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/donor/home" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/donor/requests" },
  { key: "camps", label: "Camps", icon: "🎪", path: "/m/donor/camps" },
  { key: "alerts", label: "Alerts", icon: "🔔", path: "/m/donor/alerts" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/donor/settings" },
];

export default function Screen17DonationHistory({ navigate }) {
  const h = donationHistory;
  return (
    <div className="m-screen">
      <AppBar title="My donations" subtitle={h.count} />
      <div className="m-screen__body">
        {h.donations.map((d) => (
          <Card key={d.id}>
            <div className="m-card-name">{d.place}</div>
            <Chip variant="green">{d.status}</Chip>
            <small>
              {d.date} · {d.units} unit · {d.group}
            </small>
          </Card>
        ))}

        <Card variant="alert">
          <small style={{ textAlign: "center" }}>{h.note}</small>
        </Card>
      </div>
      <BottomNav items={NAV} active="profile" onNavigate={navigate} />
    </div>
  );
}
