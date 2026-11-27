import { AppBar, BottomNav, Card } from "../../components/mobile/ui";
import { notifications } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/donor/home" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/donor/requests" },
  { key: "camps", label: "Camps", icon: "🎪", path: "/m/donor/camps" },
  { key: "alerts", label: "Alerts", icon: "🔔", path: "/m/donor/alerts" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/donor/settings" },
];

export default function Screen9Notifications({ navigate }) {
  const n = notifications;
  return (
    <div className="m-screen">
      <AppBar title="Notifications" subtitle={`${n.unread} unread`} />
      <div className="m-screen__body">
        {n.items.map((item) => (
          <Card key={item.id} unread={item.unread}>
            <div className="m-card-name">{item.title}</div>
            <small>{item.text}</small>
            <small>{item.time}</small>
          </Card>
        ))}
      </div>
      <BottomNav items={NAV} active="alerts" onNavigate={navigate} />
    </div>
  );
}
