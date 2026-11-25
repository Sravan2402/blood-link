import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, SectionHeader, StatCard, StatusBadge } from "../../components/ui";
import { Avatar, SearchBar } from "../../components/kit";
import { bloodCamps } from "../../lib/mockData";

const MOCK_ATTENDANCE = [
  { id: "a-1", name: "Ravi Kumar", phone: "+91 99991 00001", status: "CHECKED_IN" },
  { id: "a-2", name: "Priya Sharma", phone: "+91 99991 00002", status: "REGISTERED" },
  { id: "a-3", name: "Sneha Reddy", phone: "+91 99991 00004", status: "CHECKED_IN" },
  { id: "a-4", name: "Karthik", phone: "+91 99991 00007", status: "REGISTERED" },
  { id: "a-5", name: "Lakshmi", phone: "+91 99991 00008", status: "CHECKED_IN" },
];

export default function Attendance() {
  const { notify } = useToast();
  const [campId, setCampId] = useState(bloodCamps[0]?.id || "c-001");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);

  const filtered = attendance.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search));
  const checkedIn = attendance.filter((a) => a.status === "CHECKED_IN").length;

  const checkIn = (id) => {
    setAttendance((prev) => prev.map((a) => (a.id === id ? { ...a, status: "CHECKED_IN" } : a)));
    notify("Donor checked in.", "success");
  };

  return (
    <div className="page">
      <SectionHeader title="Attendance" subtitle="Manage donor check-ins for your camps." />

      <div className="stat-grid">
        <StatCard label="Registered" value={attendance.length} icon="📝" tone="primary" />
        <StatCard label="Checked in" value={checkedIn} icon="✅" tone="success" />
        <StatCard label="Attendance rate" value={`${Math.round((checkedIn / attendance.length) * 100)}%`} icon="📊" tone="info" />
      </div>

      <Card className="form-card">
        <label className="field">
          <span className="field__label">Select camp</span>
          <select className="input" value={campId} onChange={(e) => setCampId(e.target.value)}>
            {bloodCamps.map((c) => <option key={c.id} value={c.id}>{c.title} — {c.city}</option>)}
          </select>
        </label>
        <div style={{ marginTop: 12 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone…" />
        </div>
      </Card>

      <Card>
        <h3>Donors</h3>
        <div className="attendance-list">
          {filtered.map((a) => (
            <div key={a.id} className="attendance-item">
              <Avatar name={a.name} size={40} />
              <div className="attendance-item__info">
                <strong>{a.name}</strong>
                <small>📞 {a.phone}</small>
              </div>
              <StatusBadge status={a.status === "CHECKED_IN" ? "COMPLETED" : "OPEN"} />
              <Button size="sm" variant={a.status === "CHECKED_IN" ? "secondary" : "primary"} disabled={a.status === "CHECKED_IN"} onClick={() => checkIn(a.id)}>
                {a.status === "CHECKED_IN" ? "Checked in" : "Check in"}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
