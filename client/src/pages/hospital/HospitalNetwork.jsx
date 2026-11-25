import { useMemo, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, EmptyState, SectionHeader, StatusBadge } from "../../components/ui";
import { MapView, SearchBar, FilterSelect, StarRating, Modal, Breadcrumbs } from "../../components/kit";
import { hospitals, coordinationMessages } from "../../lib/mockData";
import { formatDateTime } from "../../lib/constants";

export default function HospitalNetwork() {
  const { notify } = useToast();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [selected, setSelected] = useState(null);

  const cities = useMemo(() => [...new Set(hospitals.map((h) => h.city))], []);

  const filtered = useMemo(
    () =>
      hospitals.filter((h) => {
        const matchesSearch =
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.address.toLowerCase().includes(search.toLowerCase());
        const matchesCity = !city || h.city === city;
        return matchesSearch && matchesCity;
      }),
    [search, city],
  );

  const mapMarkers = useMemo(
    () =>
      filtered.map((h, i) => {
        const angle = (i / Math.max(1, filtered.length)) * Math.PI * 2;
        const radius = 0.08 + (i % 3) * 0.03;
        return {
          id: h.id,
          label: h.name,
          lat: 17.4 + Math.cos(angle) * radius,
          lng: 78.4 + Math.sin(angle) * radius,
        };
      }),
    [filtered],
  );

  const sendEnquiry = (h) => {
    notify(`Blood availability enquiry sent to ${h.name}.`, "success");
    setSelected(null);
  };

  return (
    <div className="page">
      <SectionHeader title="Hospital Network" subtitle="Coordinate with other hospitals — find availability and send enquiries." />

      <div className="filter-bar filter-bar--wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search hospitals…" />
        <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🏥" title="No hospitals found" message="Try a different search or city." />
      ) : (
        <div className="find-donors-layout">
          <div className="find-donors-list">
            {filtered.map((h) => (
              <Card key={h.id} className="hospital-card">
                <div className="hospital-card__head">
                  <span className="hospital-card__icon">🏥</span>
                  <div>
                    <strong>{h.name}</strong>
                    <span>📍 {h.address}</span>
                  </div>
                  <StatusBadge status={h.open ? "OPEN" : "CANCELLED"} />
                </div>
                <div className="hospital-card__meta">
                  <span>📞 {h.phone}</span>
                  <span>🏷️ {h.registration}</span>
                  <StarRating value={h.rating} />
                  <span>🩸 {h.unitsAvailable} units available</span>
                </div>
                <div className="hospital-card__footer">
                  <Button size="sm" onClick={() => setSelected(h)}>View profile</Button>
                  <Button size="sm" variant="secondary" onClick={() => sendEnquiry(h)}>Send enquiry</Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="map-card">
            <h3>Nearby hospitals</h3>
            <MapView markers={mapMarkers} center={{ lat: 17.4, lng: 78.4 }} title="Hospitals map" />
            <p className="map-note">📍 Your hospital at center. Markers show nearby network hospitals.</p>
          </Card>
        </div>
      )}

      <Card className="dash-card">
        <h3>Recent coordination messages</h3>
        <div className="message-list">
          {coordinationMessages.map((m) => (
            <div key={m.id} className={`message-item ${m.unread ? "message-item--unread" : ""}`}>
              <div className="message-item__head">
                <strong>{m.from} → {m.to}</strong>
                <small>{formatDateTime(m.at)}</small>
              </div>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <Breadcrumbs items={[{ label: "Hospital Network" }, { label: selected.name }]} />
          <div className="detail-grid">
            <div className="detail-row"><span className="detail-row__label">City</span><span className="detail-row__value">{selected.city}</span></div>
            <div className="detail-row"><span className="detail-row__label">Address</span><span className="detail-row__value">{selected.address}</span></div>
            <div className="detail-row"><span className="detail-row__label">Phone</span><span className="detail-row__value">{selected.phone}</span></div>
            <div className="detail-row"><span className="detail-row__label">Registration</span><span className="detail-row__value">{selected.registration}</span></div>
            <div className="detail-row"><span className="detail-row__label">Units available</span><span className="detail-row__value">{selected.unitsAvailable}</span></div>
            <div className="detail-row"><span className="detail-row__label">Rating</span><span className="detail-row__value">{selected.rating} / 5</span></div>
          </div>
          <div className="form-actions" style={{ marginTop: 16 }}>
            <Button onClick={() => sendEnquiry(selected)}>Send blood availability enquiry</Button>
            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
