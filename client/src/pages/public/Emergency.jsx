import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Button, Card, EmptyState, UrgencyBadge } from "../../components/ui";
import { SearchBar, FilterSelect } from "../../components/kit";
import { bloodGroupColor, formatDate, formatDistance } from "../../lib/constants";

const EMERGENCY_REQUESTS = [
  { id: "er-1", group: "O+", hospital: "City Care Hospital", city: "Hyderabad", units: 2, urgency: "CRITICAL", distanceKm: 1.2, requiredBefore: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), patient: "Male, 34 — Trauma case" },
  { id: "er-2", group: "A+", hospital: "Apollo Heart Institute", city: "Hyderabad", units: 1, urgency: "HIGH", distanceKm: 2.8, requiredBefore: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), patient: "Female, 41 — Surgery" },
  { id: "er-3", group: "B+", hospital: "Sunshine Multispeciality", city: "Secunderabad", units: 3, urgency: "MEDIUM", distanceKm: 6.1, requiredBefore: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), patient: "Male, 55 — Treatment" },
  { id: "er-4", group: "O-", hospital: "Regional Trauma Centre", city: "Warangal", units: 2, urgency: "CRITICAL", distanceKm: 12.4, requiredBefore: new Date(Date.now() + 4 * 3600 * 1000).toISOString(), patient: "Female, 29 — Emergency" },
  { id: "er-5", group: "AB+", hospital: "City Care Hospital", city: "Hyderabad", units: 1, urgency: "LOW", distanceKm: 8.9, requiredBefore: new Date(Date.now() + 72 * 3600 * 1000).toISOString(), patient: "Male, 60 — Scheduled" },
];

const URGENCIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function Emergency() {
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();
  const [search, setSearch] = useState("");
  const [urgency, setUrgency] = useState("");

  const filtered = useMemo(() => {
    return EMERGENCY_REQUESTS.filter((r) => {
      const matchesSearch =
        r.hospital.toLowerCase().includes(search.toLowerCase()) ||
        r.group.toLowerCase().includes(search.toLowerCase());
      const matchesUrgency = !urgency || r.urgency === urgency;
      return matchesSearch && matchesUrgency;
    });
  }, [search, urgency]);

  const respond = (request, action) => {
    if (!isAuthenticated) {
      notify("Please sign in to respond to a request.", "info");
      navigate("/login");
      return;
    }
    notify(
      action === "accept"
        ? `Response sent for the ${request.group} request at ${request.hospital}.`
        : `Request marked as not available.`,
      action === "accept" ? "success" : "info",
    );
  };

  return (
    <div className="public-page">
      <section className="page-hero page-hero--compact">
        <span className="hero__eyebrow">🚑 Emergency blood requests</span>
        <h1>Urgent requests that need donors now</h1>
        <p className="hero__lead">
          These are time-critical blood requests across the network. If you are
          eligible and nearby, your response could save a life.
        </p>
      </section>

      <section className="section">
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search hospital or blood group…" />
          <FilterSelect label="Urgency" value={urgency} onChange={setUrgency} options={URGENCIES} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="🩸" title="No emergency requests" message="There are no urgent requests matching your filters right now." />
        ) : (
          <div className="request-list">
            {filtered.map((r) => (
              <Card key={r.id} className="request-card">
                <div className="request-card__head">
                  <span className="blood-pill" style={{ background: `${bloodGroupColor(r.group)}1a`, color: bloodGroupColor(r.group) }}>
                    🩸 {r.group}
                  </span>
                  <UrgencyBadge urgency={r.urgency} />
                  <span className="request-card__distance">📍 {formatDistance(r.distanceKm)} away</span>
                </div>
                <div className="request-card__body">
                  <h3 className="request-card__title">{r.hospital}</h3>
                  <div className="request-card__meta">
                    <span>📍 {r.city}</span>
                    <span>🧪 {r.units} unit(s) needed</span>
                    <span>⏱️ Required by {formatDate(r.requiredBefore)}</span>
                  </div>
                  <p className="request-card__address">{r.patient}</p>
                </div>
                <div className="request-card__footer">
                  <Button size="sm" variant="secondary" onClick={() => respond(r, "reject")}>
                    Not available
                  </Button>
                  <Button size="sm" onClick={() => respond(r, "accept")}>
                    Accept request
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="section-head section-head--center" style={{ marginTop: 24 }}>
          <Button onClick={() => navigate(isAuthenticated ? "/app/find-blood" : "/register")}>
            {isAuthenticated ? "Open donor portal" : "Become a donor"}
          </Button>
        </div>
      </section>
    </div>
  );
}
