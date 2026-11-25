import { navigate } from "../../router/useRoute";
import { Button, Card, StatCard, SectionHeader } from "../../components/ui";
import { BarChart } from "../../components/kit";
import { stats, donationStats } from "../../lib/mockData";

const VALUES = [
  { icon: "🚑", title: "Speed in emergencies", text: "We measure success in minutes — how fast a compatible donor can be found and coordinated." },
  { icon: "🛡️", title: "Trust & verification", text: "Role-based access, verified organizations, and secure authentication keep the network reliable." },
  { icon: "❤️", title: "Community first", text: "BloodLink is built around donors and the hospitals that depend on them." },
  { icon: "📈", title: "Data-driven", text: "Transparent statistics and analytics help plan for demand and shortages." },
];

const TEAM = [
  { name: "G. Siri Chandana", role: "Student Developer", avatar: "👩" },
  { name: "S. Sravan Kumar", role: "Student Developer", avatar: "🧑" },
  { name: "Dr. T. Venkata Nagaraju", role: "Project Guide", avatar: "👨‍🏫" },
];

export default function About() {
  return (
    <div className="public-page">
      <section className="page-hero">
        <span className="hero__eyebrow">About BloodLink</span>
        <h1>Built to close the gap between need and available blood</h1>
        <p className="hero__lead">
          BloodLink is a real-time emergency blood donor finder system that
          centralizes blood requests and donor coordination, replacing slow,
          manual searches with instant, location-aware matching.
        </p>
      </section>

      <section className="section">
        <div className="awareness-grid">
          <Card className="awareness-card">
            <h3>Our mission</h3>
            <p>
              To ensure that during a medical emergency, any hospital can reach
              an eligible, available, compatible donor — fast — and complete the
              donation with full records and transparency.
            </p>
          </Card>
          <Card className="awareness-card">
            <h3>The problem we solve</h3>
            <p>
              Hospitals often rely on phone calls, social media, and messaging
              groups to find blood. These are slow and unreliable. BloodLink
              turns that process into a structured, instant workflow.
            </p>
          </Card>
        </div>
      </section>

      <section className="section section--tint">
        <SectionHeader title="Our values" />
        <div className="feature-grid">
          {VALUES.map((v) => (
            <Card key={v.title} className="feature-card">
              <span className="feature-card__icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader title="By the numbers" subtitle="The scale of the BloodLink network." />
        <div className="stat-grid">
          <StatCard label="Donors" value={stats.totalDonors.toLocaleString()} icon="🧑" tone="primary" />
          <StatCard label="Hospitals" value={stats.totalHospitals} icon="🏥" tone="info" />
          <StatCard label="Blood banks" value={stats.totalBloodBanks} icon="🏬" tone="neutral" />
          <StatCard label="Camps" value={stats.totalCamps} icon="🎪" tone="success" />
          <StatCard label="Requests" value={stats.totalRequests.toLocaleString()} icon="📋" tone="primary" />
          <StatCard label="Donations" value={stats.totalDonations.toLocaleString()} icon="🩸" tone="info" />
          <StatCard label="Units collected" value={stats.totalUnits.toLocaleString()} icon="🧪" tone="neutral" />
          <StatCard label="Completed" value={stats.completedRequests.toLocaleString()} icon="✅" tone="success" />
        </div>
      </section>

      <section className="section section--tint">
        <SectionHeader title="Monthly donation trend" />
        <Card>
          <BarChart
            data={donationStats.monthly.map((m) => ({ label: m.month, value: m.donations }))}
          />
        </Card>
      </section>

      <section className="section">
        <SectionHeader title="The team behind BloodLink" />
        <div className="partner-grid">
          {TEAM.map((t) => (
            <Card key={t.name} className="partner-card">
              <span className="partner-card__icon">{t.avatar}</span>
              <h3>{t.name}</h3>
              <p>{t.role}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-banner">
          <div>
            <h2>Want to be part of it?</h2>
            <p>Join as a donor or register your hospital to get started.</p>
          </div>
          <Button size="lg" onClick={() => navigate("/register")}>Get started</Button>
        </div>
      </section>
    </div>
  );
}
