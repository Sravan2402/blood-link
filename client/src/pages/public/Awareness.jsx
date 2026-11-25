import { navigate } from "../../router/useRoute";
import { Button, Card, SectionHeader } from "../../components/ui";
import { donationStats, stats } from "../../lib/mockData";
import { BarChart } from "../../components/kit";

const FACTS = [
  { icon: "🩸", title: "1 donation helps 3 lives", text: "A single unit of blood can be separated into components to help multiple patients." },
  { icon: "⏱️", title: "The process takes ~30 min", text: "Registration, screening, donation, and refreshments — quick and safe." },
  { icon: "🧪", title: "Blood has a shelf life", text: "Red cells last about 42 days; platelets only 5–7 days — supply must be renewed." },
  { icon: "🔁", title: "Donors can give often", text: "Healthy adults can donate whole blood every 8 weeks." },
];

const MYTHS = [
  { myth: "Blood donation weakens you.", fact: "Your body replaces the volume within hours and red cells within weeks. Regular donors feel fine." },
  { myth: "I'm not eligible if I've travelled.", fact: "Most travel doesn't affect eligibility. Eligibility depends on health, medications, and recent history." },
  { myth: "It's too risky.", fact: "Donation is safe, uses sterile single-use equipment, and is performed by trained staff." },
  { myth: "Only rare blood groups matter.", fact: "All groups matter — common groups like O+ are in constant, high demand for emergencies." },
];

const ELIGIBILITY = [
  "Be in good general health and feel well.",
  "Be at least 18 years old (with parental consent in some cases).",
  "Have a minimum weight suitable for donation.",
  "Not have donated whole blood in the last 8 weeks.",
  "Not have consumed alcohol recently.",
  "Meet additional criteria based on medical history.",
];

export default function Awareness() {
  return (
    <div className="public-page">
      <section className="page-hero">
        <span className="hero__eyebrow">Blood donation awareness</span>
        <h1>Every drop can be the one that saves a life</h1>
        <p className="hero__lead">
          Blood donation is safe, simple, and profoundly impactful. Learn the
          facts, clear up the myths, and understand how to be an effective donor.
        </p>
        <div className="hero__cta">
          <Button size="lg" onClick={() => navigate("/register")}>Become a donor</Button>
        </div>
      </section>

      <section className="section">
        <SectionHeader title="Key facts" />
        <div className="feature-grid">
          {FACTS.map((f) => (
            <Card key={f.title} className="feature-card">
              <span className="feature-card__icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section section--tint">
        <SectionHeader title="Myths vs facts" />
        <div className="myth-grid">
          {MYTHS.map((m) => (
            <Card key={m.myth} className="myth-card">
              <span className="myth-card__myth">❌ {m.myth}</span>
              <span className="myth-card__fact">✅ {m.fact}</span>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader title="Am I eligible to donate?" subtitle="General eligibility guidelines." />
        <Card className="eligibility-card">
          <ul>
            {ELIGIBILITY.map((e) => (
              <li key={e}>✅ {e}</li>
            ))}
          </ul>
          <p className="eligibility-note">
            Final eligibility is confirmed during screening by trained staff.
          </p>
        </Card>
      </section>

      <section className="section section--tint">
        <SectionHeader title="Demand by blood group" subtitle="Donations collected across the platform." />
        <Card>
          <BarChart data={donationStats.byBloodGroup.map((g) => ({ label: g.group, value: g.units }))} />
        </Card>
      </section>

      <section className="section">
        <SectionHeader title="The impact so far" />
        <div className="stat-grid">
          <Card className="impact-card"><strong>{stats.totalDonors.toLocaleString()}</strong><span>registered donors</span></Card>
          <Card className="impact-card"><strong>{stats.totalDonations.toLocaleString()}</strong><span>donations made</span></Card>
          <Card className="impact-card"><strong>{stats.totalUnits.toLocaleString()}</strong><span>blood units collected</span></Card>
        </div>
        <div className="section-head section-head--center" style={{ marginTop: 24 }}>
          <Button size="lg" onClick={() => navigate("/register")}>Join the movement</Button>
        </div>
      </section>
    </div>
  );
}
