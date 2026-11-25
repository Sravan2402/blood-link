import { useAuth } from "../contexts/AuthContext";
import { navigate } from "../router/useRoute";
import {
  Button,
  Card,
  StatusBadge,
  UrgencyBadge,
} from "./ui";
import { formatDate, formatDateTime, bloodGroupColor } from "../lib/constants";

export default function BloodRequestCard({ request, footer }) {
  const { role } = useAuth();

  const open = () => navigate(`/requests/${request.request_id}`);

  return (
    <Card className="request-card">
      <div className="request-card__head">
        <span
          className="blood-pill"
          style={{ background: `${bloodGroupColor(request.blood_group)}1a`, color: bloodGroupColor(request.blood_group) }}
        >
          🩸 {request.blood_group}
        </span>
        <UrgencyBadge urgency={request.urgency} />
        <StatusBadge status={request.status} />
      </div>

      <div className="request-card__body">
        <h3 className="request-card__title">
          {request.patient_name}
          {request.patient_age ? `, ${request.patient_age} yrs` : ""}
        </h3>
        <div className="request-card__meta">
          <span>📍 {request.city}</span>
          <span>🧪 {request.units_required} unit(s)</span>
          {request.patient_gender && (
            <span>{request.patient_gender}</span>
          )}
        </div>
        {request.hospital_address && (
          <p className="request-card__address">{request.hospital_address}</p>
        )}
        <p className="request-card__time">
          Needed by {formatDate(request.required_before)} · Posted{" "}
          {formatDateTime(request.created_at)}
        </p>
      </div>

      <div className="request-card__footer">
        {footer}
        <Button variant="ghost" size="sm" onClick={open}>
          {role === "HOSPITAL" ? "View responses" : "Details"} →
        </Button>
      </div>
    </Card>
  );
}
