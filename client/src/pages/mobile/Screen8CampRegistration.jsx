import { AppBar, Card, Row, Button, MapView } from "../../components/mobile/ui";
import { campRegistration } from "../../lib/mobileData";

export default function Screen8CampRegistration({ navigate }) {
  const c = campRegistration;
  return (
    <div className="m-screen">
      <AppBar title={c.name} subtitle={c.address} onBack={() => navigate("/m/donor/camps")} />
      <div className="m-screen__body">
        <MapView height={110} fullWidth pins={c.pins} />

        <Card>
          {c.details.map((d) => (
            <Row key={d.label} label={d.label} right={<span className="m-row__right">{d.value}</span>} />
          ))}
        </Card>

        <Card variant="alert">
          <small>{c.note}</small>
        </Card>

        <div className="m-btn-pair">
          <Button variant="primary" onClick={() => navigate("/m/donor/camps")}>Register for camp</Button>
          <Button variant="outline" onClick={() => navigate("/m/donor/map")}>Get directions</Button>
        </div>
      </div>
    </div>
  );
}
