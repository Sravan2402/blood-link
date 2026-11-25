import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../router/useRoute";
import { Card, EmptyState, SectionHeader, UrgencyBadge } from "../../components/ui";
import { Tabs, usePagination } from "../../components/kit";
import { bloodGroupColor, formatDateTime } from "../../lib/constants";

const MOCK_RESPONSES = [
  { response_id: "resp-1", request_id: "r-1", blood_group: "O+", patient_name: "Trauma patient", city: "Hyderabad", hospital: "City Care Hospital", urgency: "CRITICAL", units_required: 2, status: "SELECTED_BY_HOSPITAL", responded_at: "2026-11-24T07:50:00Z", response_message: "I'm available, can reach within an hour." },
  { response_id: "resp-2", request_id: "r-2", blood_group: "A+", patient_name: "Surgery patient", city: "Hyderabad", hospital: "Apollo Heart Institute", urgency: "HIGH", units_required: 1, status: "ACCEPTED_BY_DONOR", responded_at: "2026-11-23T10:15:00Z", response_message: "Available tomorrow morning." },
  { response_id: "resp-3", request_id: "r-3", blood_group: "B+", patient_name: "Treatment patient", city: "Secunderabad", hospital: "Sunshine Multispeciality", urgency: "MEDIUM", units_required: 3, status: "REJECTED_BY_HOSPITAL", responded_at: "2026-11-20T14:30:00Z", response_message: "I can donate 1 unit." },
  { response_id: "resp-4", request_id: "r-4", blood_group: "AB+", patient_name: "Scheduled patient", city: "Hyderabad", hospital: "City Care Hospital", urgency: "LOW", units_required: 1, status: "ACCEPTED_BY_DONOR", responded_at: "2026-11-18T09:00:00Z", response_message: "Will respond once I confirm my schedule." },
];

const STATUS_TONE = {
  ACCEPTED_BY_DONOR: "info",
  SELECTED_BY_HOSPITAL: "success",
  REJECTED_BY_HOSPITAL: "warning",
};

export default function MyResponses() {
  const { isDemo } = useAuth();
  const [tab, setTab] = useState("all");

  const filtered = useMemo(() => {
    if (tab === "selected") return MOCK_RESPONSES.filter((r) => r.status === "SELECTED_BY_HOSPITAL");
    if (tab === "pending") return MOCK_RESPONSES.filter((r) => r.status === "ACCEPTED_BY_DONOR");
    return MOCK_RESPONSES;
  }, [tab]);

  const { page, pageSize, total, paged } = usePagination(filtered, 5);

  return (
    <div className="page">
      <SectionHeader title="My Responses" subtitle="Requests you've responded to and their current status." />

      <Tabs
        tabs={[
          { key: "all", label: "All" },
          { key: "selected", label: "Selected" },
          { key: "pending", label: "Pending" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="📨"
          title="No responses yet"
          message="When you respond to a blood request, it will appear here."
          action={<button className="btn btn--primary" onClick={() => navigate("/app/find-blood")}>Find blood requests</button>}
        />
      ) : (
        <>
          <div className="response-list">
            {paged.map((r) => (
              <Card key={r.response_id} className="response-item">
                <div className="response-item__head">
                  <span className="blood-pill" style={{ background: `${bloodGroupColor(r.blood_group)}1a`, color: bloodGroupColor(r.blood_group) }}>🩸 {r.blood_group}</span>
                  <UrgencyBadge urgency={r.urgency} />
                  <span className="badge badge--neutral">{r.status.replace(/_/g, " ")}</span>
                </div>
                <h3 className="response-item__title">{r.patient_name} — {r.hospital}</h3>
                <p className="response-item__message">“{r.response_message}”</p>
                <div className="response-item__meta">
                  <span>📍 {r.city}</span>
                  <span>🧪 {r.units_required} unit(s)</span>
                  <span>⏱️ {formatDateTime(r.responded_at)}</span>
                </div>
                <div className="response-item__footer">
                  <span className={`badge badge--${STATUS_TONE[r.status]}`}>
                    {r.status === "SELECTED_BY_HOSPITAL" ? "Selected — awaiting completion" : r.status === "ACCEPTED_BY_DONOR" ? "Response pending" : "Not selected"}
                  </span>
                  <button className="link-button" onClick={() => navigate(`/app/requests/${r.request_id}`)}>View request →</button>
                </div>
              </Card>
            ))}
          </div>
          <div className="pagination-wrap">
            <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
          </div>
        </>
      )}
      {!isDemo && <p className="muted-note">Demo data is shown for this portal until the responses endpoint is available.</p>}
    </div>
  );
}
