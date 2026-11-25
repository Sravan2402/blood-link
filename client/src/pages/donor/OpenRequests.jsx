import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import {
  Alert,
  Button,
  EmptyState,
  Spinner,
  SectionHeader,
} from "../../components/ui";
import BloodRequestCard from "../../components/BloodRequestCard";
import { navigate } from "../../router/useRoute";

export default function OpenRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/blood-requests/open");
      setRequests(res.data.requests || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page">
      <SectionHeader
        title="Find Blood"
        subtitle="Open blood requests matching donors near you."
      />

      <Alert tone="error" onClose={() => setError("")}>
        {error}
      </Alert>

      {loading ? (
        <Spinner label="Loading blood requests…" />
      ) : requests.length === 0 ? (
        <EmptyState
          icon="🩸"
          title="No open requests"
          message="There are no open blood requests right now. Check back soon."
          action={
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              Back to dashboard
            </Button>
          }
        />
      ) : (
        <div className="request-list">
          {requests.map((request) => (
            <BloodRequestCard
              key={request.request_id}
              request={request}
              footer={
                <Button
                  size="sm"
                  onClick={() => navigate(`/requests/${request.request_id}`)}
                >
                  Respond
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
