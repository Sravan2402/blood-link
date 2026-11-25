import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  Alert,
  Card,
  EmptyState,
  Spinner,
  SectionHeader,
} from "../components/ui";
import { formatDate } from "../lib/constants";

export default function DonationHistory() {
  const { role } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const endpoint =
    role === "HOSPITAL"
      ? "/blood-requests/hospitals/my-donations"
      : "/blood-requests/donors/my-donations";

  const isHospital = role === "HOSPITAL";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      setDonations(res.data.donations || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page">
      <SectionHeader
        title={isHospital ? "Donation Records" : "Donation History"}
        subtitle={
          isHospital
            ? "Every donation recorded against your hospital's requests."
            : "Your complete history of blood donations."
        }
      />

      <Alert tone="error" onClose={() => setError("")}>
        {error}
      </Alert>

      {loading ? (
        <Spinner label="Loading history…" />
      ) : donations.length === 0 ? (
        <EmptyState
          icon={isHospital ? "🩸" : "📋"}
          title="No donations recorded yet"
          message={
            isHospital
              ? "Completed blood requests will be listed here."
              : "Once you complete a donation, it will appear here."
          }
        />
      ) : (
        <Card className="table-card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Blood group</th>
                  <th>Units</th>
                  {isHospital && <th>Patient</th>}
                  <th>City</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.donation_id}>
                    <td>
                      {isHospital
                        ? d.donor_name
                        : d.hospital_name || "—"}
                    </td>
                    <td>
                      <span className="blood-pill-sm">🩸 {d.blood_group}</span>
                    </td>
                    <td>{d.units_donated}</td>
                    {isHospital && <td>{d.patient_name || "—"}</td>}
                    <td>{d.city || "—"}</td>
                    <td>{formatDate(d.donated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
