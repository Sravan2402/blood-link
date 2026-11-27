import { AppBar, BottomNav, Card, Button, ToggleRow, LinkRow } from "../../components/mobile/ui";
import { useState } from "react";
import { settings } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/donor/home" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/donor/requests" },
  { key: "camps", label: "Camps", icon: "🎪", path: "/m/donor/camps" },
  { key: "alerts", label: "Alerts", icon: "🔔", path: "/m/donor/alerts" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/donor/settings" },
];

export default function Screen16Settings({ navigate }) {
  const [toggles, setToggles] = useState(settings.toggles);

  const toggle = (key) => {
    setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, on: !t.on } : t)));
  };

  return (
    <div className="m-screen">
      <AppBar title="Settings" subtitle="Account and privacy" />
      <div className="m-screen__body">
        <Card>
          {toggles.map((t) => (
            <ToggleRow key={t.key} label={t.label} on={t.on} onClick={() => toggle(t.key)} />
          ))}
        </Card>

        <Card>
          <LinkRow label="My donations" onClick={() => navigate("/m/donor/history")} />
          {settings.links.map((l) => (
            <LinkRow key={l.key} label={l.label} onClick={() => navigate("/m/donor/home")} />
          ))}
        </Card>

        <Button variant="outline" onClick={() => navigate("/m/login")}>Log out</Button>
      </div>
      <BottomNav items={NAV} active="profile" onNavigate={navigate} />
    </div>
  );
}
