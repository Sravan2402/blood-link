import { useState } from "react";
import { Card, SectionHeader, StatusBadge, UrgencyBadge } from "../../components/ui";
import { Table, FilterSelect, usePagination } from "../../components/kit";
import { formatDate } from "../../lib/constants";

const REQUESTS = [
  { id: "r-1", hospital: "City Care Hospital", group: "O+", patient: "Trauma patient", units: 2, urgency: "CRITICAL", status: "OPEN", city: "Hyderabad", created: "2026-11-24T07:40:00Z" },
  { id: "r-2", hospital: "Apollo Heart Institute", group: "A+", patient: "Surgery patient", units: 1, urgency: "HIGH", status: "OPEN", city: "Hyderabad", created: "2026-11-24T07:10:00Z" },
  { id: "r-3", hospital: "Sunshine Multispeciality", group: "B+", patient: "Treatment patient", units: 3, urgency: "MEDIUM", status: "MATCHED", city: "Secunderabad", created: "2026-11-23T15:00:00Z" },
  { id: "r-4", hospital: "Regional Trauma Centre", group: "O-", patient: "Emergency patient", units: 2, urgency: "CRITICAL", status: "COMPLETED", city: "Warangal", created: "2026-11-22T09:30:00Z" },
  { id: "r-5", hospital: "City Care Hospital", group: "AB+", patient: "Scheduled patient", units: 1, urgency: "LOW", status: "CANCELLED", city: "Hyderabad", created: "2026-11-20T11:00:00Z" },
];

export default function Requests() {
  const [status, setStatus] = useState("");
  const filtered = REQUESTS.filter((r) => !status || r.status === status);
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const columns = [
    { key: "id", label: "Request" },
    { key: "hospital", label: "Hospital" },
    { key: "group", label: "Group", render: (r) => <span className="blood-pill-sm">🩸 {r.group}</span> },
    { key: "patient", label: "Patient" },
    { key: "units", label: "Units", align: "center" },
    { key: "urgency", label: "Urgency", render: (r) => <UrgencyBadge urgency={r.urgency} /> },
    { key: "city", label: "City" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "created", label: "Created", render: (r) => formatDate(r.created) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Blood Requests" subtitle="All blood requests across the platform." />
      <div className="filter-bar">
        <FilterSelect label="Status" value={status} onChange={setStatus} options={["OPEN", "MATCHED", "COMPLETED", "CANCELLED"]} />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(r) => r.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
