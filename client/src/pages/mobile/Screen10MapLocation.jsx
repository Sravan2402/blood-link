import { AppBar, BottomNav, Card, Button, MapView } from "../../components/mobile/ui";
import { mapLocation } from "../../lib/mobileData";

const NAV = [
  { key: "map", label: "Map", icon: "📍", path: "/m/donor/map" },
  { key: "list", label: "List", icon: "📋", path: "/m/donor/map" },
  { key: "camps", label: "Camps", icon: "🎪", path: "/m/donor/camps" },
  { key: "alerts", label: "Alerts", icon: "🔔", path: "/m/donor/alerts" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/donor/settings" },
];

export default function Screen10MapLocation({ navigate }) {
  const m = mapLocation;
  return (
    <div className="m-screen">
      <AppBar title="Nearby map" subtitle={`Radius ${m.radius}`} />
      <div className="m-screen__body">
        <MapView height={380} fullWidth pins={m.pins} radius />

        <Card>
          <div className="m-legend">
            <span className="m-legend__chip"><span className="m-legend__dot" style={{ background: "var(--primary)" }} />Donors</span>
            <span className="m-legend__chip"><span className="m-legend__dot" style={{ background: "var(--green)" }} />Camps</span>
            <span className="m-legend__chip"><span className="m-legend__dot" style={{ background: "var(--purple)" }} />Hospitals</span>
          </div>
          <small>{Object.values(m.counts).reduce((a, b) => a + b, 0)} shown</small>
        </Card>

        <Button variant="primary" onClick={() => navigate("/m/donor/home")}>Open navigation</Button>
      </div>
      <BottomNav items={NAV} active="list" onNavigate={navigate} />
    </div>
  );
}
