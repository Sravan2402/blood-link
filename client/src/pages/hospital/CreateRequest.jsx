import { useState } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Alert, Button, Card, Field, SectionHeader } from "../../components/ui";
import {
  BLOOD_GROUPS,
  GENDERS,
  URGENCIES,
  toISODatetime,
} from "../../lib/constants";

const EMPTY = {
  blood_group: "O+",
  units_required: 1,
  patient_name: "",
  patient_age: "",
  patient_gender: "Male",
  city: "",
  hospital_address: "",
  urgency: "HIGH",
  required_before: "",
};

export default function CreateRequest() {
  const { notify } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        units_required: Number(form.units_required),
        patient_age: form.patient_age ? Number(form.patient_age) : null,
        required_before: toISODatetime(form.required_before),
      };
      const res = await api.post("/blood-requests", payload);
      notify(
        `Request created — ${res.data.notified_donors ?? 0} matching donor(s) notified.`,
        "success",
      );
      navigate("/requests");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create the request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <SectionHeader
        title="New Blood Request"
        subtitle="Post a request and BloodLink will notify matching donors nearby."
      />

      <Card className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <Alert tone="error" onClose={() => setError("")}>
            {error}
          </Alert>

          <Field label="Blood group" htmlFor="blood_group">
            <select id="blood_group" value={form.blood_group} onChange={update("blood_group")} className="input">
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>

          <Field label="Units required" htmlFor="units_required">
            <input
              id="units_required"
              type="number"
              min="1"
              required
              value={form.units_required}
              onChange={update("units_required")}
              className="input"
            />
          </Field>

          <Field label="Patient name" htmlFor="patient_name">
            <input
              id="patient_name"
              required
              placeholder="Patient full name"
              value={form.patient_name}
              onChange={update("patient_name")}
              className="input"
            />
          </Field>

          <Field label="Patient age" htmlFor="patient_age">
            <input
              id="patient_age"
              type="number"
              min="0"
              placeholder="Age"
              value={form.patient_age}
              onChange={update("patient_age")}
              className="input"
            />
          </Field>

          <Field label="Patient gender" htmlFor="patient_gender">
            <select id="patient_gender" value={form.patient_gender} onChange={update("patient_gender")} className="input">
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>

          <Field label="Urgency" htmlFor="urgency">
            <select id="urgency" value={form.urgency} onChange={update("urgency")} className="input">
              {URGENCIES.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </Field>

          <Field label="City" htmlFor="city">
            <input
              id="city"
              required
              placeholder="e.g. Hyderabad"
              value={form.city}
              onChange={update("city")}
              className="input"
            />
          </Field>

          <Field label="Required before" htmlFor="required_before">
            <input
              id="required_before"
              type="datetime-local"
              value={form.required_before}
              onChange={update("required_before")}
              className="input"
            />
          </Field>

          <Field
            label="Hospital address"
            htmlFor="hospital_address"
            hint="Where the blood needs to be delivered"
          >
            <textarea
              id="hospital_address"
              required
              rows={3}
              placeholder="Full hospital address"
              value={form.hospital_address}
              onChange={update("hospital_address")}
              className="input"
            />
          </Field>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/requests")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting request…" : "Post Blood Request"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
