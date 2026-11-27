import { AppBar, BottomNav, Card, Field, MapView, Button } from "../../components/mobile/ui";
import { createRequestData } from "../../lib/mobileData";

const NAV = [
  { key: "home", label: "Home", icon: "⌂", path: "/m/hospital/home" },
  { key: "new", label: "New", icon: "➕", path: "/m/hospital/new" },
  { key: "requests", label: "Requests", icon: "📋", path: "/m/hospital/requests" },
  { key: "donors", label: "Donors", icon: "🧑", path: "/m/hospital/donors" },
  { key: "profile", label: "Profile", icon: "👤", path: "/m/hospital/profile" },
];

export default function Screen3CreateRequest({ navigate }) {
  return (
    <div className="m-screen">
      <AppBar title="New emergency request" subtitle={createRequestData.hospitalName} />
      <div className="m-screen__body">
        <Card>
          <Field label="Blood group">
            <select className="m-input">
              <option>A+</option>
              <option>A−</option>
              <option>B+</option>
              <option>B−</option>
              <option>AB+</option>
              <option>AB−</option>
              <option>O+</option>
              <option>O−</option>
            </select>
          </Field>
          <div className="m-field-row">
            <Field label="Units">
              <input className="m-input" type="number" placeholder="2" />
            </Field>
            <Field label="Urgency">
              <select className="m-input">
                <option>Critical</option>
                <option>High</option>
                <option>Normal</option>
              </select>
            </Field>
          </div>
          <Field label="Required by">
            <input className="m-input" type="datetime-local" />
          </Field>
          <Field label="City">
            <input className="m-input" placeholder="Hyderabad" />
          </Field>
          <Field label="Hospital location">
            <input className="m-input" value="pinned" readOnly />
          </Field>
        </Card>

        <MapView height={90} pins={[{ x: "50%", y: "50%", color: "red" }]} />

        <Button variant="primary" onClick={() => navigate("/m/hospital/requests")}>Post request</Button>
      </div>
      <BottomNav items={NAV} active="new" onNavigate={navigate} />
    </div>
  );
}
