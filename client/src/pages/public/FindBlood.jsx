import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../router/useRoute";
import { Button, Card, EmptyState, UrgencyBadge, StatusBadge } from "../../components/ui";
import { SearchBar, FilterSelect, usePagination } from "../../components/kit";
import { BLOOD_GROUPS, URGENCIES, bloodGroupColor, formatDate, formatDistance } from "../../lib/constants";

const OPEN_REQUESTS = [
  { id: "r-1", group: "O+", hospital: "City Care Hospital", city: "Hyderabad", units: 2, urgency: "CRITICAL", distanceKm: 1.2, requiredBefore: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), status: "OPEN", patient: "Trauma case" },
  { id: "r-2", group: "A+", hospital: "Apollo Heart Institute", city: "Hyderabad", units: 1, urgency: "HIGH", distanceKm: 2.8, requiredBefore: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), status: "OPEN", patient: "Surgery" },
  { id: "r-3", group: "B+", hospital: "Sunshine Multispeciality", city: "Secunderabad", units: 3, urgency: "MEDIUM", distanceKm: 6.1, requiredBefore: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), status: "OPEN", patient: "Treatment" },
  { id: "r-4", group: "O-", hospital: "Regional Trauma Centre", city: "Warangal", units: 2, urgency: "CRITICAL", distanceKm: 12.4, requiredBefore: new Date(Date.now() + 4 * 3600 * 1000).toISOString(), status: "OPEN", patient: "Emergency" },
  { id: "r-5", group: "AB+", hospital: "City Care Hospital", city: "Hyderabad", units: 1, urgency: "LOW", distanceKm: 8.9, requiredBefore: new Date(Date.now() + 72 * 3600 * 1000).toISOString(), status: "OPEN", patient: "Scheduled" },
  { id: "r-6", group: "A-", hospital: "Apollo Heart Institute", city: "Hyderabad", units: 1, urgency: "HIGH", distanceKm: 4.3, requiredBefore: new Date(Date.now() + 20 * 3600 * 1000).toISOString(), status: "OPEN", patient: "Surgery" },
];

export default function FindBlood() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [urgency, setUrgency] = useState("");

  const filtered = useMemo(
    () =>
      OPEN_REQUESTS.filter((r) => {
        const matchesSearch =
          r.hospital.toLowerCase().includes(search.toLowerCase()) ||
          r.group.toLowerCase().includes(search.toLowerCase());
        const matchesGroup = !group || r.group === group;
        const matchesUrgency = !urgency || r.urgency === urgency;
        return matchesSearch && matchesGroup && matchesUrgency;
      }),
    [search, group, urgency],
  );

  const { page, setPage, pageSize, total, paged } = usePagination(filtered, 4);

  return (
    <div className="public-page">
      <section className="page-hero page-hero--compact">
        <span className="hero__eyebrow">Find blood</span>
        <h1>Browse open blood requests</h1>
        <p className="hero__lead">
          See blood requests across the network. Sign in as a donor to respond
          and help someone in need.
        </p>
        <div className="hero__cta">
          <Button size="lg" onClick={() => navigate(isAuthenticated ? "/app/find-blood" : "/register")}>
            {isAuthenticated ? "Open donor portal" : "Become a donor"}
          </Button>
        </div>
      </section>

      <section className="section">
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search hospital or blood group…" />
          <FilterSelect label="Blood group" value={group} onChange={setGroup} options={BLOOD_GROUPS} />
          <FilterSelect label="Urgency" value={urgency} onChange={setUrgency} options={URGENCIES} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="🩸" title="No matching requests" message="Try changing your search or filters." />
        ) : (
          <>
            <div className="request-list">
              {paged.map((r) => (
                <Card key={r.id} className="request-card">
                  <div className="request-card__head">
                    <span className="blood-pill" style={{ background: `${bloodGroupColor(r.group)}1a`, color: bloodGroupColor(r.group) }}>🩸 {r.group}</span>
                    <UrgencyBadge urgency={r.urgency} />
                    <StatusBadge status={r.status} />
                    <span className="request-card__distance">📍 {formatDistance(r.distanceKm)} away</span>
                  </div>
                  <div className="request-card__body">
                    <h3 className="request-card__title">{r.hospital}</h3>
                    <div className="request-card__meta">
                      <span>📍 {r.city}</span>
                      <span>🧪 {r.units} unit(s)</span>
                      <span>⏱️ {formatDate(r.requiredBefore)}</span>
                    </div>
                    <p className="request-card__address">{r.patient}</p>
                  </div>
                  <div className="request-card__footer">
                    <Button size="sm" onClick={() => navigate(isAuthenticated ? `/app/requests/${r.id}` : "/login")}>
                      {isAuthenticated ? "View & respond" : "Sign in to respond"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="pagination-wrap">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</Button>
              <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
              <Button variant="secondary" size="sm" disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(page + 1)}>Next →</Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
