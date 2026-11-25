import { useAuth } from "../contexts/AuthContext";
import { navigate } from "../router/useRoute";
import { Button } from "../components/ui";

const FEATURES = [
  {
    icon: "🩸",
    title: "Real-time matching",
    text: "Hospitals post a blood request and eligible nearby donors are matched instantly.",
  },
  {
    icon: "📍",
    title: "Location-aware",
    text: "Donors share their location so requests find the closest available match.",
  },
  {
    icon: "🔔",
    title: "Instant alerts",
    text: "Get notified about new requests, donor responses, and donation milestones.",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      <section className="landing__hero">
        <span className="landing__eyebrow">🩸 Save lives, one drop at a time</span>
        <h1>
          The platform that connects <span>blood donors</span> with the
          hospitals that need them
        </h1>
        <p className="landing__lead">
          BloodLink matches hospitals with eligible blood donors in real time,
          cutting the time between a blood request and the donation that
          answers it.
        </p>
        <div className="landing__cta">
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started — Register"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/login")}
          >
            I already have an account
          </Button>
        </div>
      </section>

      <section className="landing__features">
        {FEATURES.map((feature) => (
          <div className="landing__feature card" key={feature.title}>
            <span className="landing__feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </section>

      <section className="landing__roles">
        <div className="landing__role card">
          <span className="landing__role-icon">🧑‍⚕️</span>
          <h3>For Donors</h3>
          <p>
            Toggle your availability, share your location, and respond to blood
            requests near you. Track every donation you make.
          </p>
        </div>
        <div className="landing__role card">
          <span className="landing__role-icon">🏥</span>
          <h3>For Hospitals</h3>
          <p>
            Post urgent blood requests, view responding donors, select the best
            match, and record completed donations — all in one place.
          </p>
        </div>
      </section>
    </div>
  );
}
