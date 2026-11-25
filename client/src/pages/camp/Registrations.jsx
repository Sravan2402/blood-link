import { useMemo, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, SectionHeader, StatusBadge } from "../../components/ui";
import { Table } from "../../components/kit";
import { bloodCamps } from "../../lib/mockData";

const MOCK_REGISTRATIONS = [
  { id: "reg-1", name: "Ravi Kumar", phone: "+91 99991 00001", group: "O+", camp: "c-001", status: "REGISTERED" },
  { id: "reg-2", name: "Priya Sharma", phone: "+91 99991 00002", group: "A+", camp: "c-001", status: "REGISTERED" },
  { id: "reg-3", name: "Sneha Reddy", phone: "+91 99991 00004", group: "O+", camp: "c-001", status: "CHECKED_IN" },
  { id: "reg-4", name: "Karthik", phone: "+91 99991 00007", group: "O+", camp: "c-001", status: "REGISTERED" },
  { id: "reg-5", name: "Lakshmi", phone: "+91 99991 00008", group: "A+", camp: "c-001", status: "CHECKED_IN" },
];

export default function Registrations() {
  const { notify } = useToast();
  const [campId, setCampId] = useState(bloodCamps[0]?.id || "c-001");
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);

  const selectedCamp = bloodCamps.find((c) => c.id === campId);
  const filtered = useMemo(() => registrations.filter((r) => r.camp === campId), [registrations, campId]);

  const checkIn = (id) => {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status: "CHECKED_IN" } : r)));
    notify("Donor checked in.", "success");
  };

  const columns = [
    { key: "name", label: "Donor" },
    { key: "phone", label: "Phone" },
    { key: "group", label: "Group", render: (r) => <span className="blood-pill-sm">🩸 {r.group}</span> },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status === "CHECKED_IN" ? "COMPLETED" : "OPEN"} /> },
    { key: "actions", label: "Action", render: (r) => (
      <Button size="sm" variant={r.status === "CHECKED_IN" ? "secondary" : "primary"} disabled={r.status === "CHECKED_IN"} onClick={() => checkIn(r.id)}>
        {r.status === "CHECKED_IN" ? "Checked in" : "Check in"}
      </Button>
    ) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Registrations" subtitle="Manage donor registrations and check-ins for your camps." />

      <Card className="form-card">
        <label className="field">
          <span className="field__label">Select camp</span>
          <select className="input" value={campId} onChange={(e) => setCampId(e.target.value)}>
            {bloodCamps.map((c) => <option key={c.id} value={c.id}>{c.title} — {c.city}</option>)}
          </select>
        </label>
        {selectedCamp && (
          <p className="muted-note">📍 {selectedCamp.location} · 👥 {filtered.filter((r) => r.status === "CHECKED_IN").length}/{selectedCamp.capacity} checked in</p>
        )}
      </Card>

      <Card className="table-card">
        <h3>Donor list</h3>
        <Table columns={columns} rows={filtered} rowKey={(r) => r.id} />
      </Card>
    </div>
  );
}
