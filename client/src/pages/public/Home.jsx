import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../router/useRoute";
import { Button, Card, StatCard, UrgencyBadge, StatusBadge } from "../../components/ui";
import { BarChart, StarRating } from "../../components/kit";
import { bloodCamps, bloodBanks, hospitals, stats, testimonials } from "../../lib/mockData";
import { bloodGroupColor, formatDate } from "../../lib/constants";

const FEATURES = [
  { icon: "⚡", title: "Real-time matching", text: "Requests instantly match eligible, available donors nearby using blood-group compatibility and distance." },
  { icon: "📍", title: "Progressive radius search", text: "The donor search expands from 2 km to 20 km so emergencies find a match fast." },
  { icon: "🎯", title: "Priority ranking", text: "Donors are ranked by distance, eligibility, availability, donation history, and alcohol status." },
  { icon: "🔔", title: "Instant notifications", text: "Donors and hospitals stay coordinated with in-app alerts for requests, responses, and milestones." },
];

const STEPS = [
  { icon: "🏥", title: "Hospital posts a request", text: "A hospital creates a blood request with the required blood group, units, and urgency." },
  { icon: "🔎", title: "BloodLink finds donors", text: "Eligible, available donors with a compatible group nearby are matched and ranked by priority." },
  { icon: "📨", title: "Donors respond", text: "Matched donors are notified and can respond to the request in seconds." },
  { icon: "🩸", title: "Donation completed", text: "The hospital selects a donor, completes the donation, and it's recorded in history." },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="public-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow">🩸 Real-time emergency blood donor finder</span>
          <h1>
            Find compatible blood donors <span>in minutes</span>, not hours
          </h1>
          <p className="hero__lead">
            BloodLink connects hospitals with eligible, available donors near
            them — matching by blood group, location, and priority, and
            coordinating the request from notification to donation.
          </p>
          <div className="hero__cta">
            <Button size="lg" onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/register")}>
              {isAuthenticated ? "Open your portal" : "Join BloodLink — Free"}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate("/how-it-works")}>
              See how it works
            </Button>
          </div>
          <div className="hero__trust">
            <div><strong>{(stats.totalDonors / 1000).toFixed(1)}k+</strong><span>Donors</span></div>
            <div><strong>{stats.totalHospitals}</strong><span>Hospitals</span></div>
            <div><strong>{stats.completedRequests.toLocaleString()}</strong><span>Donations</span></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="stat-grid">
          <StatCard label="Total donors" value={stats.totalDonors.toLocaleString()} icon="🧑" tone="primary" />
          <StatCard label="Hospitals" value={stats.totalHospitals} icon="🏥" tone="info" />
          <StatCard label="Blood banks" value={stats.totalBloodBanks} icon="🏬" tone="neutral" />
          <StatCard label="Blood requests" value={stats.totalRequests.toLocaleString()} icon="📋" tone="primary" />
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section-head">
          <h2>Everything blood donation needs</h2>
          <p>A complete platform for requesting, matching, and completing blood donations.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <Card key={f.title} className="feature-card">
              <span className="feature-card__icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section section--tint">
        <div className="section-head">
          <h2>How BloodLink works</h2>
          <p>Four steps from an emergency request to a recorded donation.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={s.title} className="step-card">
              <span className="step-card__num">{i + 1}</span>
              <span className="step-card__icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="section-head section-head--center">
          <Button onClick={() => navigate("/how-it-works")}>Learn the full workflow</Button>
        </div>
      </section>

      {/* Awareness + chart */}
      <section className="section">
        <div className="section-head">
          <h2>Blood donation awareness</h2>
          <p>Donations by blood group across the platform this year.</p>
        </div>
        <div className="awareness-grid">
          <Card className="awareness-card">
            <h3>Why every drop counts</h3>
            <ul>
              <li>🩸 One donation can help up to <strong>3 patients</strong>.</li>
              <li>🚑 Blood has a short shelf life — supply must be continuously renewed.</li>
              <li>🏥 Accidents, surgeries, and illnesses create constant, unpredictable demand.</li>
              <li>❤️ Regular donors keep blood banks ready for emergencies.</li>
            </ul>
            <Button variant="secondary" onClick={() => navigate("/awareness")}>Read more</Button>
          </Card>
          <Card className="awareness-card">
            <h3>Donations by blood group</h3>
            <BarChart
              data={[
                { label: "O+", value: 9820 },
                { label: "A+", value: 6240 },
                { label: "B+", value: 4380 },
                { label: "AB+", value: 2890 },
                { label: "O-", value: 1960 },
                { label: "A-", value: 1120 },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* Emergency requests preview */}
      <section className="section section--tint">
        <div className="section-head">
          <h2>Live emergency requests</h2>
          <p>Open blood requests needing donors right now.</p>
        </div>
        <div className="mini-request-grid">
          {bloodCamps && bloodCamps.slice(0, 1).length > 0 && (
            <Card className="mini-request">
              <div className="mini-request__head">
                <span className="blood-pill" style={{ background: `${bloodGroupColor("O+")}1a`, color: bloodGroupColor("O+") }}>🩸 O+</span>
                <UrgencyBadge urgency="CRITICAL" />
              </div>
              <h3>Emergency request · City Care Hospital</h3>
              <p>📍 Hyderabad · 🧪 2 units needed · {formatDate(new Date().toISOString())}</p>
              <Button size="sm" onClick={() => navigate(isAuthenticated ? "/app/find-blood" : "/login")}>
                Help now
              </Button>
            </Card>
          )}
          <Card className="mini-request">
            <div className="mini-request__head">
              <span className="blood-pill" style={{ background: `${bloodGroupColor("A+")}1a`, color: bloodGroupColor("A+") }}>🩸 A+</span>
              <UrgencyBadge urgency="HIGH" />
            </div>
            <h3>Emergency request · Apollo Heart Institute</h3>
            <p>📍 Hyderabad · 🧪 1 unit needed · Required within 24h</p>
            <Button size="sm" onClick={() => navigate(isAuthenticated ? "/app/find-blood" : "/login")}>
              Help now
            </Button>
          </Card>
          <Card className="mini-request">
            <div className="mini-request__head">
              <span className="blood-pill" style={{ background: `${bloodGroupColor("B+")}1a`, color: bloodGroupColor("B+") }}>🩸 B+</span>
              <UrgencyBadge urgency="MEDIUM" />
            </div>
            <h3>Emergency request · Sunshine Multispeciality</h3>
            <p>📍 Secunderabad · 🧪 3 units needed · Required within 48h</p>
            <Button size="sm" onClick={() => navigate(isAuthenticated ? "/app/find-blood" : "/login")}>
              Help now
            </Button>
          </Card>
        </div>
        <div className="section-head section-head--center">
          <Button variant="secondary" onClick={() => navigate("/find-blood")}>View all requests</Button>
        </div>
      </section>

      {/* Blood camps preview */}
      <section className="section">
        <div className="section-head">
          <h2>Upcoming blood camps</h2>
          <p>Camps near you where you can donate and make a difference.</p>
        </div>
        <div className="camp-grid">
          {bloodCamps.slice(0, 3).map((camp) => (
            <Card key={camp.id} className="camp-card">
              <span className="camp-card__poster">{camp.poster}</span>
              <h3>{camp.title}</h3>
              <p className="camp-card__meta">📍 {camp.location}</p>
              <p className="camp-card__meta">📅 {formatDate(camp.date)} · {camp.time}</p>
              <div className="camp-card__footer">
                <StatusBadge status={camp.status.toUpperCase()} />
                <Button size="sm" onClick={() => navigate("/blood-camps")}>Details</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured hospitals & blood banks */}
      <section className="section section--tint">
        <div className="section-head">
          <h2>Featured hospitals & blood banks</h2>
          <p>Trusted partners on the BloodLink network.</p>
        </div>
        <div className="partner-grid">
          {hospitals.slice(0, 4).map((h) => (
            <Card key={h.id} className="partner-card">
              <div className="partner-card__icon">🏥</div>
              <h3>{h.name}</h3>
              <p>📍 {h.city}</p>
              <StarRating value={h.rating} />
            </Card>
          ))}
          {bloodBanks.slice(0, 4).map((b) => (
            <Card key={b.id} className="partner-card">
              <div className="partner-card__icon">🏬</div>
              <h3>{b.name}</h3>
              <p>📍 {b.city} · {b.unitsAvailable} units</p>
              <StarRating value={b.rating} />
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="section-head">
          <h2>What people say</h2>
          <p>Stories from the BloodLink community.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <Card key={t.name} className="testimonial-card">
              <p className="testimonial-card__quote">“{t.text}”</p>
              <div className="testimonial-card__author">
                <span className="testimonial-card__avatar">{t.avatar}</span>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ preview */}
      <section className="section section--tint">
        <div className="section-head">
          <h2>Frequently asked questions</h2>
          <p>Quick answers about how BloodLink works.</p>
        </div>
        <div className="faq-grid">
          {[
            { q: "How does BloodLink find donors near a hospital?", a: "It matches eligible, available donors with a compatible blood group in the hospital's city using stored coordinates and the Haversine distance formula." },
            { q: "Do I need to share my live location?", a: "No. BloodLink uses the location stored in your profile and does not track you continuously." },
            { q: "How is a donor's priority decided?", a: "By a priority score considering distance, recent donation, alcohol status, eligibility, and availability." },
          ].map((f) => (
            <Card key={f.q} className="faq-card">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </Card>
          ))}
        </div>
        <div className="section-head section-head--center">
          <Button variant="secondary" onClick={() => navigate("/how-it-works")}>Read all FAQs</Button>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="cta-banner">
          <div>
            <h2>Ready to help save lives?</h2>
            <p>Register as a donor, or manage requests for your hospital or blood bank.</p>
          </div>
          <Button size="lg" onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/register")}>
            Get started
          </Button>
        </div>
      </section>
    </div>
  );
}
