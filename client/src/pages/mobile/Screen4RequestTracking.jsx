import { AppBar, BottomNav, Card, Chip, Button, Row, Stepper, Avatar, SectionHeading } from "../../components/mobile/ui";
import { requestTracking } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/hospital/home" },
  { key: "new", label: "New", icon: "➕", path: "/m/hospital/new" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/hospital/requests" },
  { key: "donors", label: "Donors", icon: "🧑", path: "/m/hospital/donors" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/hospital/profile" },
];

export default function Screen4RequestTracking({ navigate }) {
  const t = requestTracking;
  return (
    <div className="m-screen">
      <AppBar title={`Request #${t.id}`} subtitle={`${t.bloodGroup} · ${t.units} units`} />
      <div className="m-screen__body">
        <Card>
          <Stepper steps={["OPEN", "ACCEPTED", "COMPLETED"]} current={t.step} />
          <Row label="Status" right={<Chip variant="green">Accepted</Chip>} />
          <Row label="Required by" right={<span className="m-row__right">{t.requiredBy}</span>} />
          <Row label="Responses" right={<span className="m-row__right">{t.responses}</span>} />
        </Card>

        <SectionHeading>Donor responses</SectionHeading>

        {t.donorResponses.map((r) => (
          <Card key={r.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Avatar name={r.name} color={r.avatar} />
              <div>
                <div className="m-card-name">{r.name}</div>
                <Chip variant={r.status === "Accepted" ? "green" : "default"}>{r.status}</Chip>
              </div>
            </div>
            <small>{r.distance} · last donation 12 Jun 2026</small>
            {r.status === "Accepted" && (
              <Button variant="primary" onClick={() => navigate("/m/hospital/donors")}>Select donor</Button>
            )}
          </Card>
        ))}

        <div className="m-btn-pair">
          <Button variant="outline" onClick={() => navigate("/m/hospital/requests")}>Mark donation completed</Button>
          <Button variant="outline" onClick={() => navigate("/m/hospital/requests")}>Cancel request</Button>
        </div>
      </div>
      <BottomNav items={NAV} active="requests" onNavigate={navigate} />
    </div>
  );
}
