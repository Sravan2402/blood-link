import { AppBar, BottomNav, Card, Chip, Button, StatTile, Avatar, SectionHeading } from "../../components/mobile/ui";
import { organizerAttendance } from "../../lib/mobileData";

const NAV = [
  { key: "camps", label: "Camps", icon: "🎪", path: "/m/organizer/camps" },
  { key: "new", label: "New", icon: "➕", path: "/m/organizer/camps" },
  { key: "people", label: "People", icon: "👥", path: "/m/organizer/attendance" },
  { key: "reports", label: "Reports", icon: "📊", path: "/m/organizer/reports" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/organizer/profile" },
];

export default function Screen18OrganizerAttendance({ navigate }) {
  const o = organizerAttendance;
  return (
    <div className="m-screen">
      <AppBar title="Organizer" subtitle={o.campName} />
      <div className="m-screen__body">
        <div className="m-statrow">
          {o.stats.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <SectionHeading>Attendees</SectionHeading>

        {o.attendees.map((a) => (
          <Card key={a.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Avatar name={a.name} color={a.avatar} />
              <div>
                <div className="m-card-name">{a.name}</div>
                <Chip variant="default">{a.bloodGroup}</Chip>
              </div>
            </div>
            <Chip variant={a.status === "Attended" ? "green" : "default"}>{a.status}</Chip>
            <div className="m-btn-pair">
              <Button variant="primary" onClick={() => navigate("/m/organizer/attendance")}>Mark attendance</Button>
              <Button variant="outline" onClick={() => navigate("/m/organizer/attendance")}>Record donation</Button>
            </div>
          </Card>
        ))}
      </div>
      <BottomNav items={NAV} active="camps" onNavigate={navigate} />
    </div>
  );
}
