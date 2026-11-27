import { useState } from "react";
import { AppBar, BottomNav, Card, Chip, Button, Avatar, MapView } from "../../components/mobile/ui";
import { nearbyDonors } from "../../lib/mobileData";

const RADII = ["2 km", "5 km", "10 km", "15 km", "20 km"];

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/hospital/home" },
  { key: "new", label: "New", icon: "➕", path: "/m/hospital/new" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/hospital/requests" },
  { key: "donors", label: "Donors", icon: "🧑", path: "/m/hospital/donors" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/hospital/profile" },
];

export default function Screen5NearbyDonors({ navigate }) {
  const n = nearbyDonors;
  const [radius, setRadius] = useState(n.radius);

  return (
    <div className="m-screen">
      <AppBar title="Nearby donors" subtitle={`Request #${n.requestId} · ${n.bloodGroup}`} />
      <div className="m-screen__body">
        <div className="m-role-chips" style={{ justifyContent: "space-between" }}>
          {RADII.map((r) => (
            <Chip key={r} selected={radius === r} onClick={() => setRadius(r)}>
              {r}
            </Chip>
          ))}
        </div>

        <MapView height={110} pins={n.pins} radius />

        {n.donors.map((d) => (
          <Card key={d.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Avatar name={d.name} color="primary" />
              <div>
                <div className="m-card-name">{d.name}</div>
                <Chip variant="default">{d.bloodGroup}</Chip>
              </div>
            </div>
            <small>{d.distance} · score {d.score}</small>
            <Button variant="outline" onClick={() => navigate("/m/hospital/requests")}>Select</Button>
          </Card>
        ))}
      </div>
      <BottomNav items={NAV} active="donors" onNavigate={navigate} />
    </div>
  );
}
