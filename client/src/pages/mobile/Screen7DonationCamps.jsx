import { AppBar, BottomNav, Card, Chip, Field, MapView } from "../../components/mobile/ui";
import { donationCamps } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/donor/home" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/donor/requests" },
  { key: "camps", label: "Camps", icon: "🎪", path: "/m/donor/camps" },
  { key: "alerts", label: "Alerts", icon: "🔔", path: "/m/donor/alerts" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/donor/settings" },
];

export default function Screen7DonationCamps({ navigate }) {
  const c = donationCamps;
  return (
    <div className="m-screen">
      <AppBar title="Donation camps" subtitle={c.location} />
      <div className="m-screen__body">
        <Field label="Search">
          <input className="m-input" placeholder="City, date or distance" />
        </Field>

        <MapView height={100} pins={c.pins} />

        {c.camps.map((camp) => (
          <Card key={camp.id} onClick={() => navigate("/m/donor/camp-detail")}>
            <div className="m-card-name">{camp.name}</div>
            <Chip variant={camp.status === "Open" ? "green" : "default"}>{camp.status}</Chip>
            <small>
              {camp.date} · {camp.time} · {camp.place}
            </small>
          </Card>
        ))}
      </div>
      <BottomNav items={NAV} active="camps" onNavigate={navigate} />
    </div>
  );
}
