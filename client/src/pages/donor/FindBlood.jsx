import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../router/useRoute";
import { Alert, Button, EmptyState, SectionHeader, Spinner, UrgencyBadge, StatusBadge } from "../../components/ui";
import { SearchBar, FilterSelect, usePagination } from "../../components/kit";
import { BLOOD_GROUPS, URGENCIES, bloodGroupColor, formatDate, formatDistance } from "../../lib/constants";

const MOCK_REQUESTS = [
  { request_id: "m-1", blood_group: "O+", hospital_id: "h1", patient_name: "Trauma patient", patient_age: 34, patient_gender: "Male", city: "Hyderabad", hospital_address: "Road No. 10, Banjara Hills", units_required: 2, urgency: "CRITICAL", status: "OPEN", required_before: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), created_at: new Date().toISOString(), distanceKm: 1.2 },
  { request_id: "m-2", blood_group: "A+", hospital_id: "h2", patient_name: "Surgery patient", patient_age: 41, patient_gender: "Female", city: "Hyderabad", hospital_address: "Jubilee Hills", units_required: 1, urgency: "HIGH", status: "OPEN", required_before: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), created_at: new Date().toISOString(), distanceKm: 2.8 },
  { request_id: "m-3", blood_group: "B+", hospital_id: "h3", patient_name: "Treatment patient", patient_age: 55, patient_gender: "Male", city: "Secunderabad", hospital_address: "MG Road", units_required: 3, urgency: "MEDIUM", status: "OPEN", required_before: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), created_at: new Date().toISOString(), distanceKm: 6.1 },
  { request_id: "m-4", blood_group: "O-", hospital_id: "h4", patient_name: "Emergency patient", patient_age: 29, patient_gender: "Female", city: "Warangal", hospital_address: "Park Road", units_required: 2, urgency: "CRITICAL", status: "OPEN", required_before: new Date(Date.now() + 4 * 3600 * 1000).toISOString(), created_at: new Date().toISOString(), distanceKm: 12.4 },
  { request_id: "m-5", blood_group: "AB+", hospital_id: "h1", patient_name: "Scheduled patient", patient_age: 60, patient_gender: "Male", city: "Hyderabad", hospital_address: "Road No. 10", units_required: 1, urgency: "LOW", status: "OPEN", required_before: new Date(Date.now() + 72 * 3600 * 1000).toISOString(), created_at: new Date().toISOString(), distanceKm: 8.9 },
  { request_id: "m-6", blood_group: "A-", hospital_id: "h2", patient_name: "Surgery patient", patient_age: 45, patient_gender: "Male", city: "Hyderabad", hospital_address: "Jubilee Hills", units_required: 1, urgency: "HIGH", status: "OPEN", required_before: new Date(Date.now() + 20 * 3600 * 1000).toISOString(), created_at: new Date().toISOString(), distanceKm: 4.3 },
];

const SORT_OPTIONS = ["Urgency", "Distance", "Newest"];

export default function FindBlood() {
  const { isDemo } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const [city, setCity] = useState("");
  const [urgency, setUrgency] = useState("");
  const [sort, setSort] = useState("Urgency");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemo) {
        setRequests(MOCK_REQUESTS);
      } else {
        const res = await api.get("/blood-requests/open");
        setRequests(res.data.requests || []);
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    load();
  }, [load]);

  const cities = useMemo(
    () => [...new Set(requests.map((r) => r.city))],
    [requests],
  );

  const filtered = useMemo(() => {
    const result = requests.filter((r) => {
      const matchesSearch =
        (r.hospital_address || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.patient_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.city || "").toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !group || r.blood_group === group;
      const matchesCity = !city || r.city === city;
      const matchesUrgency = !urgency || r.urgency === urgency;
      return matchesSearch && matchesGroup && matchesCity && matchesUrgency;
    });
    const urgencyRank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    result.sort((a, b) => {
      if (sort === "Urgency") return urgencyRank[a.urgency] - urgencyRank[b.urgency];
      if (sort === "Distance") return (a.distanceKm || 999) - (b.distanceKm || 999);
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return result;
  }, [requests, search, group, city, urgency, sort]);

  const { page, setPage, pageSize, total, paged } = usePagination(filtered, 4);

  return (
    <div className="page">
      <SectionHeader title="Find Blood Requests" subtitle="Open blood requests near you, filterable by blood group, location, and urgency." />

      <Alert tone="error" onClose={() => setError("")}>{error}</Alert>

      <div className="filter-bar filter-bar--wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search patient, hospital, or city…" />
        <FilterSelect label="Blood group" value={group} onChange={setGroup} options={BLOOD_GROUPS} />
        <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
        <FilterSelect label="Urgency" value={urgency} onChange={setUrgency} options={URGENCIES} />
        <FilterSelect label="Sort by" value={sort} onChange={setSort} options={SORT_OPTIONS} allLabel="" />
      </div>

      {loading ? (
        <Spinner label="Loading blood requests…" />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🩸" title="No requests found" message="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="request-list">
            {paged.map((r) => (
              <div key={r.request_id} className="request-card card">
                <div className="request-card__head">
                  <span className="blood-pill" style={{ background: `${bloodGroupColor(r.blood_group)}1a`, color: bloodGroupColor(r.blood_group) }}>🩸 {r.blood_group}</span>
                  <UrgencyBadge urgency={r.urgency} />
                  <StatusBadge status={r.status} />
                  {r.distanceKm !== undefined && <span className="request-card__distance">📍 {formatDistance(r.distanceKm)} away</span>}
                </div>
                <div className="request-card__body">
                  <h3 className="request-card__title">{r.patient_name}{r.patient_age ? `, ${r.patient_age} yrs` : ""}</h3>
                  <div className="request-card__meta">
                    <span>📍 {r.city}</span>
                    <span>🧪 {r.units_required} unit(s)</span>
                    <span>⏱️ {formatDate(r.required_before)}</span>
                  </div>
                  <p className="request-card__address">{r.hospital_address}</p>
                </div>
                <div className="request-card__footer">
                  <Button size="sm" onClick={() => navigate(`/app/requests/${r.request_id}`)}>View & respond</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination-wrap">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</Button>
            <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
            <Button variant="secondary" size="sm" disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(page + 1)}>Next →</Button>
          </div>
        </>
      )}
    </div>
  );
}
