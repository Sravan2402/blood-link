import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { navigate } from "../router/useRoute";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Spinner,
  StatusBadge,
  UrgencyBadge,
} from "../components/ui";
import {
  bloodGroupColor,
  formatDate,
  formatDateTime,
} from "../lib/constants";

function DetailRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="detail-row">
      <span className="detail-row__label">{label}</span>
      <span className="detail-row__value">{value}</span>
    </div>
  );
}

export default function RequestDetail({ requestId }) {
  const { role } = useAuth();
  const { notify } = useToast();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Donor state
  const [responseMessage, setResponseMessage] = useState("");
  const [responding, setResponding] = useState(false);
  const [respondError, setRespondError] = useState("");

  // Hospital state
  const [responses, setResponses] = useState([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [matches, setMatches] = useState(null);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadRequest = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blood-requests/${requestId}`);
      setRequest(res.data.request);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load request.");
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const loadResponses = useCallback(async () => {
    if (role !== "HOSPITAL") return;
    setResponsesLoading(true);
    try {
      const res = await api.get(`/blood-requests/${requestId}/responses`);
      setResponses(res.data.responses || []);
    } catch {
      // Non-fatal — the hospital may not own this request.
    } finally {
      setResponsesLoading(false);
    }
  }, [requestId, role]);

  useEffect(() => {
    if (request?.status === "OPEN") loadResponses();
  }, [request, loadResponses]);

  const handleRespond = async (e) => {
    e.preventDefault();
    setResponding(true);
    setRespondError("");
    try {
      await api.post(`/blood-requests/${requestId}/respond`, {
        response_message: responseMessage,
      });
      notify("Your response has been submitted to the hospital.", "success");
      navigate("/requests");
    } catch (err) {
      setRespondError(err.response?.data?.message || "Failed to submit your response.");
    } finally {
      setResponding(false);
    }
  };

  const handleAcceptDonor = async (responseId) => {
    setBusy(true);
    try {
      await api.patch(`/blood-requests/responses/${responseId}/select`);
      notify("Donor selected. The request is now matched.", "success");
      await loadRequest();
      await loadResponses();
    } catch (err) {
      notify(err.response?.data?.message || "Could not select this donor.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleComplete = async () => {
    setBusy(true);
    try {
      await api.patch(`/blood-requests/${requestId}/complete`);
      notify("Request completed. Donation recorded.", "success");
      await loadRequest();
    } catch (err) {
      notify(err.response?.data?.message || "Could not complete the request.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this blood request? This cannot be undone.")) return;
    setBusy(true);
    try {
      await api.patch(`/blood-requests/${requestId}/cancel`);
      notify("Blood request cancelled.", "info");
      await loadRequest();
    } catch (err) {
      notify(err.response?.data?.message || "Could not cancel the request.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleFindDonors = async () => {
    setMatchesLoading(true);
    try {
      const res = await api.get(`/blood-requests/${requestId}/find-donors`);
      setMatches(res.data);
      notify(
        res.data.count > 0
          ? `${res.data.count} eligible donor(s) found within ${res.data.radius_km} km.`
          : "No eligible donors found within 20 km.",
        res.data.count > 0 ? "success" : "info",
      );
    } catch (err) {
      notify(err.response?.data?.message || "Could not find donors.", "error");
    } finally {
      setMatchesLoading(false);
    }
  };

  if (loading && !request) return <Spinner label="Loading request…" />;

  if (!request) {
    return (
      <div className="page">
        <Alert tone="error">{error || "Blood request not found."}</Alert>
        <Button variant="secondary" onClick={() => navigate("/requests")}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate("/requests")}>
        ← Back to requests
      </button>

      <div className="detail-layout">
        <div className="detail-main">
          <Card className="detail-card">
            <div className="detail-card__head">
              <span
                className="blood-pill"
                style={{
                  background: `${bloodGroupColor(request.blood_group)}1a`,
                  color: bloodGroupColor(request.blood_group),
                }}
              >
                🩸 {request.blood_group}
              </span>
              <UrgencyBadge urgency={request.urgency} />
              <StatusBadge status={request.status} />
            </div>

            <h2 className="detail-card__title">
              Blood request for {request.patient_name}
            </h2>

            <div className="detail-grid">
              <DetailRow label="Patient" value={request.patient_name} />
              <DetailRow
                label="Age / Gender"
                value={
                  [request.patient_age, request.patient_gender]
                    .filter(Boolean)
                    .join(" · ") || null
                }
              />
              <DetailRow label="Units required" value={request.units_required} />
              <DetailRow label="City" value={request.city} />
              <DetailRow label="Required before" value={formatDate(request.required_before)} />
              <DetailRow label="Posted" value={formatDateTime(request.created_at)} />
              <DetailRow label="Hospital address" value={request.hospital_address} />
            </div>
          </Card>

          {role === "DONOR" && (
            <Card className="detail-card">
              <h3>Respond to this request</h3>
              {request.status !== "OPEN" ? (
                <Alert tone="info">
                  This request is no longer open for responses.
                </Alert>
              ) : (
                <form onSubmit={handleRespond} className="respond-form">
                  <Alert tone="error" onClose={() => setRespondError("")}>
                    {respondError}
                  </Alert>
                  <Field
                    label="Message to the hospital"
                    htmlFor="response_message"
                    hint="Share availability, blood group confirmation, or any details."
                  >
                    <textarea
                      id="response_message"
                      rows={3}
                      placeholder="I'm available to donate. I'm O+ and can reach the hospital within an hour."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      className="input"
                    />
                  </Field>
                  <Button type="submit" disabled={responding}>
                    {responding ? "Submitting…" : "Send Response"}
                  </Button>
                </form>
              )}
            </Card>
          )}

          {role === "HOSPITAL" && request.status === "OPEN" && (
            <Card className="detail-card">
              <div className="detail-card__head">
                <h3>Donor responses</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleFindDonors}
                  disabled={matchesLoading}
                >
                  {matchesLoading ? "Searching…" : "Find matching donors"}
                </Button>
              </div>

              {responsesLoading ? (
                <Spinner label="Loading responses…" />
              ) : responses.length === 0 ? (
                <EmptyState
                  icon="⏳"
                  title="No responses yet"
                  message="Donors who are eligible and nearby will appear here once they respond."
                />
              ) : (
                <div className="response-list">
                  {responses.map((r) => (
                    <div key={r.response_id} className="response-item">
                      <div className="response-item__head">
                        <span className="response-item__name">{r.full_name}</span>
                        <Badge tone="neutral">{r.blood_group}</Badge>
                        <Badge tone="success">{r.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="response-item__message">
                        {r.response_message || "No message provided."}
                      </p>
                      <div className="response-item__meta">
                        <span>📞 {r.phone}</span>
                        <span>✉️ {r.email}</span>
                        <span>⏱️ {formatDateTime(r.responded_at)}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptDonor(r.response_id)}
                        disabled={busy || r.status !== "ACCEPTED_BY_DONOR"}
                      >
                        {r.status === "ACCEPTED_BY_DONOR"
                          ? "Select this donor"
                          : r.status === "SELECTED_BY_HOSPITAL"
                            ? "Selected"
                            : "Responded"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {matches && (
                <div className="matches">
                  <h4>
                    Eligible donors (radius {matches.radius_km} km)
                  </h4>
                  {matches.count === 0 ? (
                    <p className="matches__empty">
                      No eligible donors found within 20 km.
                    </p>
                  ) : (
                    <div className="match-list">
                      {matches.donors.map((d) => (
                        <div key={d.donor_id} className="match-item">
                          <span className="match-item__name">{d.full_name}</span>
                          <span className="match-item__meta">
                            🩸 {d.blood_group} · 📍 {Number(d.distance_km).toFixed(1)} km
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {role === "HOSPITAL" && request.status === "MATCHED" && (
            <Card className="detail-card">
              <h3>Complete this donation</h3>
              <p>
                A donor has been selected. Record the completed donation to
                finalize the request and add it to your donation history.
              </p>
              <Button onClick={handleComplete} disabled={busy}>
                {busy ? "Processing…" : "Mark as Completed"}
              </Button>
            </Card>
          )}

          {role === "ADMIN" && (
            <Card className="detail-card">
              <Alert tone="info">
                Read-only view of the blood request.
              </Alert>
            </Card>
          )}
        </div>

        <div className="detail-side">
          <Card className="detail-card detail-card--side">
            <h3>Actions</h3>
            {role === "HOSPITAL" && request.status === "OPEN" && (
              <Button
                variant="danger"
                className="danger-btn"
                onClick={handleCancel}
                disabled={busy}
              >
                Cancel request
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate("/requests")}>
              Back to list
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
