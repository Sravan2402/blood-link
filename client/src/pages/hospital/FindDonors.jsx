import { useMemo, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Button, Card, EmptyState, SectionHeader, StatusBadge } from "../../components/ui";
import { Avatar, FilterSelect, MapView, SearchBar } from "../../components/kit";
import { donors } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor, formatDistance } from "../../lib/constants";

const ALL_DONORS = [
  ...donors,
  { id: "d-007", name: "Karthik", bloodGroup: "O+", city: "Hyderabad", distanceKm: 3.2, eligibility: true, available: true, lastDonation: "2026-09-01", alcohol: false, priorityScore: 104 },
  { id: "d-008", name: "Lakshmi", bloodGroup: "A+", city: "Hyderabad", distanceKm: 5.0, eligibility: true, available: true, lastDonation: "2026-07-20", alcohol: false, priorityScore: 98 },
];

export default function FindDonors() {
  const { notify } = useToast();
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [radius, setRadius] = useState(5);

  const filtered = useMemo(() => {
    return ALL_DONORS.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !group || d.blood_group === group;
      const matchesRadius = d.distanceKm <= radius;
      return matchesSearch && matchesGroup && matchesRadius;
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [search, group, radius]);

  const mapMarkers = useMemo(
    () =>
      filtered.map((d, i) => {
        const angle = (i / Math.max(1, filtered.length)) * Math.PI * 2;
        const spread = (d.distanceKm / 20) * 0.4;
        return {
          id: d.id,
          label: d.name,
          lat: 17.4 + Math.cos(angle) * spread,
          lng: 78.4 + Math.sin(angle) * spread,
        };
      }),
    [filtered],
  );

  const expandRadius = () => {
    const next = radius >= 20 ? 5 : radius * 2;
    setRadius(next);
    notify(`Search radius expanded to ${next} km.`, "info");
  };

  return (
    <div className="page">
      <SectionHeader
        title="Find Donors"
        subtitle="Search eligible donors by blood group and distance, ranked by priority."
      />

      <div className="filter-bar filter-bar--wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search donors by name…" />
        <FilterSelect label="Blood group" value={group} onChange={setGroup} options={BLOOD_GROUPS} />
        <label className="filter-select">
          <span className="filter-select__label">Radius ({radius} km)</span>
          <select className="input filter-select__input" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={15}>15 km</option>
            <option value={20}>20 km</option>
          </select>
        </label>
        <Button variant="secondary" onClick={expandRadius}>Expand radius</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🧑" title="No donors found" message="Try widening the search radius or changing filters." />
      ) : (
        <div className="find-donors-layout">
          <div className="find-donors-list">
            {filtered.map((d) => (
              <Card key={d.id} className="donor-card">
                <div className="donor-card__head">
                  <Avatar name={d.name} size={44} />
                  <div className="donor-card__info">
                    <strong>{d.name}</strong>
                    <span className="blood-pill-sm" style={{ color: bloodGroupColor(d.blood_group) }}>🩸 {d.blood_group}</span>
                  </div>
                  <span className="donor-card__score">Priority {d.priorityScore}</span>
                </div>
                <div className="donor-card__meta">
                  <span>📍 {d.city} · {formatDistance(d.distanceKm)}</span>
                  <span>📅 Last donation: {d.lastDonation}</span>
                  <span>{d.alcohol ? "🍷 Recent alcohol" : "✅ No recent alcohol"}</span>
                </div>
                <div className="donor-card__footer">
                  <StatusBadge status={d.eligibility ? "OPEN" : "CANCELLED"} />
                  <StatusBadge status={d.available ? "COMPLETED" : "CANCELLED"} />
                  <Button size="sm" onClick={() => navigate("/app/donor-responses")}>View profile</Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="map-card">
            <h3>Nearby donors</h3>
            <MapView
              markers={mapMarkers}
              center={{ lat: 17.4, lng: 78.4 }}
              title="Nearby donors map"
            />
            <p className="map-note">📍 Hospital location at center. Markers show donors within {radius} km.</p>
          </Card>
        </div>
      )}
    </div>
  );
}
