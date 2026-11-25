import { navigate } from "../../router/useRoute";
import { Button, Card, SectionHeader } from "../../components/ui";
import { faqs } from "../../lib/mockData";

const WORKFLOW = [
  { icon: "🏥", title: "A hospital creates a request", text: "Specify blood group, units required, patient context, urgency, and the required-by date." },
  { icon: "🧬", title: "BloodLink matches donors", text: "Eligible, available donors with a compatible blood group in the hospital's city are identified using stored coordinates and the Haversine distance formula." },
  { icon: "📈", title: "Search radius expands", text: "If no donor is found, the search expands progressively — 2, 5, 10, 15, and 20 km — to find a match." },
  { icon: "⭐", title: "Donors are ranked", text: "Candidates get a priority score based on distance, recent donation, alcohol status, eligibility, and availability." },
  { icon: "🔔", title: "Donors are notified", text: "Matching donors receive an in-app notification with the request details and their approximate distance." },
  { icon: "📨", title: "Donors respond", text: "Donors accept and respond to the request with a message for the hospital." },
  { icon: "✅", title: "Hospital selects a donor", text: "The hospital reviews responses and selects the chosen donor; others are declined." },
  { icon: "🩸", title: "Donation is completed", text: "The request is marked completed and the donation is recorded in the donation history." },
];

const ROLE_GUIDE = [
  { icon: "🧑", title: "Donors", text: "Stay eligible, share your location, respond to nearby requests, and track your donations." },
  { icon: "🏥", title: "Hospitals", text: "Post requests, view matching donors, select responses, and complete donations." },
  { icon: "🏬", title: "Blood banks", text: "Manage inventory, collections, issues, and transfers across the network." },
  { icon: "🛡️", title: "Administrators", text: "Oversee users, verify organizations, monitor activity, and manage reports." },
];

export default function HowItWorks() {
  return (
    <div className="public-page">
      <section className="page-hero">
        <span className="hero__eyebrow">How BloodLink works</span>
        <h1>From emergency request to recorded donation</h1>
        <p className="hero__lead">
          BloodLink turns the chaotic process of finding blood into a fast,
          structured, location-aware workflow — end to end.
        </p>
      </section>

      <section className="section">
        <SectionHeader title="The request workflow" subtitle="Eight steps, from creation to completion." />
        <div className="steps-grid steps-grid--compact">
          {WORKFLOW.map((s, i) => (
            <div key={s.title} className="step-card">
              <span className="step-card__num">{i + 1}</span>
              <span className="step-card__icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tint">
        <SectionHeader title="Who BloodLink serves" />
        <div className="feature-grid">
          {ROLE_GUIDE.map((r) => (
            <Card key={r.title} className="feature-card">
              <span className="feature-card__icon">{r.icon}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader title="Matching & priority" subtitle="How donors are ranked for each request." />
        <div className="awareness-grid">
          <Card className="awareness-card">
            <h3>Matching criteria</h3>
            <ul>
              <li>✅ Compatible blood group</li>
              <li>✅ Donor is eligible</li>
              <li>✅ Donor is available for requests</li>
              <li>✅ Same city as the hospital</li>
              <li>✅ Has stored location coordinates</li>
            </ul>
          </Card>
          <Card className="awareness-card">
            <h3>Priority score</h3>
            <ul>
              <li>📏 Closer distance → higher score</li>
              <li>⏳ No recent donation → higher score</li>
              <li>🚫 No recent alcohol → higher score</li>
              <li>✅ Eligibility & availability weighted in</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="section section--tint">
        <SectionHeader title="Frequently asked" />
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-banner">
          <div>
            <h2>See it in action</h2>
            <p>Create a donor account or register your hospital.</p>
          </div>
          <Button size="lg" onClick={() => navigate("/register")}>Get started</Button>
        </div>
      </section>
    </div>
  );
}
