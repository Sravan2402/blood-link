import { useMemo, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Button, Card, EmptyState, SectionHeader, StatusBadge } from "../../components/ui";
import { Avatar, Tabs, usePagination } from "../../components/kit";
import { formatDateTime } from "../../lib/constants";

const MOCK_RESPONSES = [
  { response_id: "resp-1", request_id: "h-1", request_group: "O+", full_name: "Ravi Kumar", blood_group: "O+", phone: "+91 99991 00001", email: "ravi@example.com", response_message: "I'm available now, can reach within 30 minutes.", status: "ACCEPTED_BY_DONOR", responded_at: "2026-11-24T07:50:00Z", distanceKm: 1.2 },
  { response_id: "resp-2", request_id: "h-1", request_group: "O+", full_name: "Sneha Reddy", blood_group: "O+", phone: "+91 99991 00004", email: "sneha@example.com", response_message: "Available in the evening after work.", status: "ACCEPTED_BY_DONOR", responded_at: "2026-11-24T07:55:00Z", distanceKm: 6.1 },
  { response_id: "resp-3", request_id: "h-2", request_group: "A+", full_name: "Priya Sharma", blood_group: "A+", phone: "+91 99991 00002", email: "priya@example.com", response_message: "Yes, I can donate tomorrow morning.", status: "SELECTED_BY_HOSPITAL", responded_at: "2026-11-23T10:15:00Z", distanceKm: 2.8 },
  { response_id: "resp-4", request_id: "h-2", request_group: "A+", full_name: "Anjali Verma", blood_group: "A+", phone: "+91 99991 00006", email: "anjali@example.com", response_message: "I'm available and eligible.", status: "REJECTED_BY_HOSPITAL", responded_at: "2026-11-23T10:20:00Z", distanceKm: 12.4 },
  { response_id: "resp-5", request_id: "h-1", request_group: "O+", full_name: "Karthik", blood_group: "O+", phone: "+91 99991 00007", email: "karthik@example.com", response_message: "Reaching in an hour.", status: "ACCEPTED_BY_DONOR", responded_at: "2026-11-24T08:02:00Z", distanceKm: 3.2 },
];

export default function DonorResponses() {
  const { notify } = useToast();
  const [tab, setTab] = useState("all");
  const [responses, setResponses] = useState(MOCK_RESPONSES);

  const filtered = useMemo(() => {
    if (tab === "pending") return responses.filter((r) => r.status === "ACCEPTED_BY_DONOR");
    if (tab === "selected") return responses.filter((r) => r.status === "SELECTED_BY_HOSPITAL");
    return responses;
  }, [responses, tab]);

  const { page, pageSize, total, paged } = usePagination(filtered, 4);

  const select = (r) => {
    setResponses((prev) => prev.map((x) => (x.response_id === r.response_id ? { ...x, status: "SELECTED_BY_HOSPITAL" } : x.response_id === r.request_id ? x : x)));
    setResponses((prev) => prev.map((x) => (x.request_id === r.request_id && x.status === "ACCEPTED_BY_DONOR" ? { ...x, status: x.response_id === r.response_id ? "SELECTED_BY_HOSPITAL" : "REJECTED_BY_HOSPITAL" } : x)));
    notify(`${r.full_name} selected. Request is now matched.`, "success");
  };

  const reject = (r) => {
    setResponses((prev) => prev.map((x) => (x.response_id === r.response_id ? { ...x, status: "REJECTED_BY_HOSPITAL" } : x)));
    notify(`Response from ${r.full_name} declined.`, "info");
  };

  return (
    <div className="page">
      <SectionHeader title="Donor Responses" subtitle="Review and select donors who responded to your requests." />

      <Tabs
        tabs={[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "selected", label: "Selected" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {filtered.length === 0 ? (
        <EmptyState icon="📨" title="No donor responses" message="Responses from donors will appear here." />
      ) : (
        <>
          <div className="response-list">
            {paged.map((r) => (
              <Card key={r.response_id} className="response-item response-item--full">
                <div className="response-item__head">
                  <Avatar name={r.full_name} size={40} />
                  <div className="response-item__name-block">
                    <strong>{r.full_name}</strong>
                    <span className="blood-pill-sm">🩸 {r.blood_group} · 📍 {r.distanceKm} km</span>
                  </div>
                  <StatusBadge status={r.status === "SELECTED_BY_HOSPITAL" ? "MATCHED" : r.status === "REJECTED_BY_HOSPITAL" ? "CANCELLED" : "OPEN"} />
                </div>
                <p className="response-item__message">“{r.response_message}”</p>
                <div className="response-item__meta">
                  <span>📞 {r.phone}</span>
                  <span>✉️ {r.email}</span>
                  <span>⏱️ {formatDateTime(r.responded_at)}</span>
                  <span>📋 Request #{r.request_id}</span>
                </div>
                <div className="response-item__footer">
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/app/requests/${r.request_id}`)}>View request</Button>
                  {r.status === "ACCEPTED_BY_DONOR" ? (
                    <>
                      <Button size="sm" variant="danger" onClick={() => reject(r)}>Reject</Button>
                      <Button size="sm" onClick={() => select(r)}>Select donor</Button>
                    </>
                  ) : (
                    <span className="muted-note">{r.status === "SELECTED_BY_HOSPITAL" ? "Selected" : "Declined"}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <div className="pagination-wrap">
            <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
          </div>
        </>
      )}
    </div>
  );
}
