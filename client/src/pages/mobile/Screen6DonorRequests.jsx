import { AppBar, BottomNav, Card, Chip, Button } from "../../components/mobile/ui";
import { donorRequests } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/donor/home" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/donor/requests" },
  { key: "camps", label: "Camps", icon: "🎪", path: "/m/donor/camps" },
  { key: "alerts", label: "Alerts", icon: "🔔", path: "/m/donor/alerts" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/donor/settings" },
];

export default function Screen6DonorRequests({ navigate }) {
  const r = donorRequests;
  return (
    <div className="m-screen">
      <AppBar title="Blood requests" subtitle={`Compatible with ${r.bloodGroup}`} />
      <div className="m-screen__body">
        {r.requests.map((req) => (
          <Card key={req.id}>
            <div className="m-card-name">{req.hospital}</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <Chip variant="default">{req.bloodGroup}</Chip>
              <Chip variant={req.urgency === "Urgent" ? "red" : "green"}>{req.urgency}</Chip>
            </div>
            <small>
              {req.units} units · {req.distance} · by {req.requiredBy}
            </small>
            <div className="m-btn-pair">
              <Button variant="primary" onClick={() => navigate("/m/donor/home")}>Accept</Button>
              <Button variant="outline" onClick={() => navigate("/m/donor/home")}>Reject</Button>
            </div>
          </Card>
        ))}
      </div>
      <BottomNav items={NAV} active="requests" onNavigate={navigate} />
    </div>
  );
}
