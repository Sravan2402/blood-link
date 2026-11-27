import { AppBar, BottomNav, Card, Button, InventoryChart } from "../../components/mobile/ui";
import { bloodBankInventory } from "../../lib/mobileData";

const NAV = [
  { key: "stock", label: "Stock", icon: "📦", path: "/m/bloodbank/stock" },
  { key: "add", label: "Add", icon: "➕", path: "/m/bloodbank/stock" },
  { key: "expiry", label: "Expiry", icon: "⏳", path: "/m/bloodbank/stock" },
  { key: "inquiries", label: "Inquiries", icon: "❓", path: "/m/bloodbank/inquiries" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/bloodbank/profile" },
];

export default function Screen11BloodBankInventory({ navigate }) {
  const i = bloodBankInventory;
  return (
    <div className="m-screen">
      <AppBar title="Inventory" subtitle={i.bankName} />
      <div className="m-screen__body">
        <Card variant="alert">
          <small style={{ color: "var(--primary-dark)", fontWeight: 700 }}>Low stock: {i.lowStock}</small>
        </Card>

        <Card>
          <InventoryChart data={i.inventory} />
        </Card>

        <Card>
          <div className="m-card-name">Expiring soon</div>
          {i.expiring.map((e, idx) => (
            <small key={idx}>{e}</small>
          ))}
        </Card>

        <Button variant="primary" onClick={() => navigate("/m/bloodbank/stock")}>Add / update stock</Button>
      </div>
      <BottomNav items={NAV} active="stock" onNavigate={navigate} />
    </div>
  );
}
