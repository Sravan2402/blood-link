import { AppBar, BottomNav, Card, Button, BarChart } from "../../components/mobile/ui";
import { aiInsights } from "../../lib/mobileData";

const NAV = [
  { key: "insights", label: "Insights", icon: "📊", path: "/m/ai/insights" },
  { key: "demand", label: "Demand", icon: "📈", path: "/m/ai/insights" },
  { key: "assistant", label: "Assistant", icon: "🤖", path: "/m/ai/insights" },
  { key: "alerts", label: "Alerts", icon: "🔔", path: "/m/ai/insights" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/ai/profile" },
];

export default function Screen13AIInsights({ navigate }) {
  const a = aiInsights;
  return (
    <div className="m-screen">
      <AppBar title="Insights" subtitle="Demand forecast" />
      <div className="m-screen__body">
        <Card>
          <div className="m-card-name">Predicted demand · next 7 days</div>
          <BarChart data={a.demand} />
        </Card>

        <Card variant="alert">
          <div className="m-card-name">Possible shortage</div>
          <small>{a.shortage}</small>
        </Card>

        <Card>
          <div className="m-card-name">Suggestion</div>
          <small>{a.suggestion}</small>
        </Card>

        <Card>
          <div className="m-card-name">Ask BloodLink assistant</div>
          <small>{a.assistantQuestion}</small>
          <Button variant="primary" onClick={() => navigate("/m/ai/insights")}>Ask</Button>
        </Card>
      </div>
      <BottomNav items={NAV} active="insights" onNavigate={navigate} />
    </div>
  );
}
