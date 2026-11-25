import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../router/useRoute";
import {
  Alert,
  Button,
  EmptyState,
  SectionHeader,
  Spinner,
} from "../../components/ui";
import { Tabs, usePagination } from "../../components/kit";
import BloodRequestCard from "../../components/BloodRequestCard";

const MOCK_REQUESTS = [
  { request_id: "h-1", blood_group: "O+", patient_name: "Trauma patient", patient_age: 34, city: "Hyderabad", hospital_address: "Road No. 10, Banjara Hills", units_required: 2, urgency: "CRITICAL", status: "OPEN", required_before: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), created_at: new Date().toISOString() },
  { request_id: "h-2", blood_group: "A+", patient_name: "Surgery patient", patient_age: 41, city: "Hyderabad", hospital_address: "Jubilee Hills", units_required: 1, urgency: "HIGH", status: "OPEN", required_before: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), created_at: new Date(Date.now() - 3600000).toISOString() },
  { request_id: "h-3", blood_group: "B+", patient_name: "Treatment patient", patient_age: 55, city: "Secunderabad", hospital_address: "MG Road", units_required: 3, urgency: "MEDIUM", status: "MATCHED", required_before: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), created_at: new Date(Date.now() - 7200000).toISOString() },
  { request_id: "h-4", blood_group: "O-", patient_name: "Emergency patient", patient_age: 29, city: "Warangal", hospital_address: "Park Road", units_required: 2, urgency: "CRITICAL", status: "COMPLETED", required_before: new Date(Date.now() - 2 * 3600000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString() },
  { request_id: "h-5", blood_group: "AB+", patient_name: "Scheduled patient", patient_age: 60, city: "Hyderabad", hospital_address: "Road No. 10", units_required: 1, urgency: "LOW", status: "CANCELLED", required_before: new Date(Date.now() + 72 * 3600 * 1000).toISOString(), created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
];

export default function MyRequests() {
  const { isDemo } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemo) {
        setRequests(MOCK_REQUESTS);
      } else {
        const res = await api.get("/blood-requests/my");
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

  const filtered = useMemo(() => {
    if (tab === "all") return requests;
    return requests.filter((r) => r.status === tab);
  }, [requests, tab]);

  const { page, pageSize, total, paged } = usePagination(filtered, 5);

  const counts = useMemo(() => {
    const c = { all: requests.length };
    requests.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [requests]);

  return (
    <div className="page">
      <SectionHeader
        title="My Requests"
        subtitle="All blood requests raised by your hospital."
        action={<Button onClick={() => navigate("/app/create-request")}>➕ New request</Button>}
      />

      <Alert tone="error" onClose={() => setError("")}>{error}</Alert>

      <Tabs
        tabs={[
          { key: "all", label: `All (${counts.all || 0})` },
          { key: "OPEN", label: `Open (${counts.OPEN || 0})` },
          { key: "MATCHED", label: `Matched (${counts.MATCHED || 0})` },
          { key: "COMPLETED", label: `Completed (${counts.COMPLETED || 0})` },
          { key: "CANCELLED", label: `Cancelled (${counts.CANCELLED || 0})` },
        ]}
        active={tab}
        onChange={setTab}
      />

      {loading ? (
        <Spinner label="Loading your requests…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No requests here"
          message={tab === "all" ? "Raise a blood request and matching donors will be notified instantly." : "No requests with this status."}
          action={tab === "all" ? <Button onClick={() => navigate("/app/create-request")}>Create a request</Button> : undefined}
        />
      ) : (
        <>
          <div className="request-list">
            {paged.map((r) => (
              <BloodRequestCard
                key={r.request_id}
                request={r}
                footer={
                  <Button size="sm" onClick={() => navigate(`/app/requests/${r.request_id}`)}>
                    Manage
                  </Button>
                }
              />
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
