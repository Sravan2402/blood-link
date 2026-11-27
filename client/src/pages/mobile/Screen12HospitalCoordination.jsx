import { AppBar, BottomNav, Card, Chip, Button, Field } from "../../components/mobile/ui";
import { hospitalCoordination } from "../../lib/mobileData";

const NAV = [
  { key: "search", label: "Search", icon: "🔍", path: "/m/hospital/coordination" },
  { key: "inquiries", label: "Inquiries", icon: "❓", path: "/m/hospital/coordination" },
  { key: "transfers", label: "Transfers", icon: "🚚", path: "/m/hospital/coordination" },
  { key: "stock", label: "Stock", icon: "📦", path: "/m/hospital/coordination" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/hospital/profile" },
];

export default function Screen12HospitalCoordination({ navigate }) {
  const h = hospitalCoordination;
  return (
    <div className="m-screen">
      <AppBar title="Find blood" subtitle="Other hospitals" />
      <div className="m-screen__body">
        <Field label="Blood group">
          <select className="m-input">
            {["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </Field>
        <Button variant="primary" onClick={() => navigate("/m/hospital/coordination")}>Search availability</Button>

        {h.hospitals.map((hosp) => (
          <Card key={hosp.id}>
            <div className="m-card-name">{hosp.name}</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              <Chip variant="green">{hosp.units} units</Chip>
            </div>
            <small>
              {hosp.distance} · {hosp.verified ? "verified" : "unverified"}
            </small>
            <Button variant="outline" onClick={() => navigate("/m/hospital/coordination")}>Send inquiry</Button>
          </Card>
        ))}

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="m-card-name">Transfer #{h.transfer.id}</span>
            <Chip variant="purple">{h.transfer.status}</Chip>
          </div>
          <small>{h.transfer.bloodGroup} · {h.transfer.units} units</small>
        </Card>
      </div>
      <BottomNav items={NAV} active="search" onNavigate={navigate} />
    </div>
  );
}
