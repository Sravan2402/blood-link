import { useMemo, useState } from "react";
import { Card, SectionHeader, StatusBadge, StatCard } from "../../components/ui";
import { FilterSelect, Table } from "../../components/kit";
import { BLOOD_GROUPS, bloodGroupColor, formatDateTime } from "../../lib/constants";

const ISSUED = [
  { id: "iss-1", group: "O+", to: "City Care Hospital", units: 2, at: "2026-11-21T11:30:00Z", component: "Whole Blood", status: "ISSUED" },
  { id: "iss-2", group: "A+", to: "Apollo Heart Institute", units: 1, at: "2026-11-22T14:00:00Z", component: "Packed Cells", status: "ISSUED" },
  { id: "iss-3", group: "B+", to: "Sunshine Multispeciality", units: 3, at: "2026-11-23T09:15:00Z", component: "Whole Blood", status: "ISSUED" },
  { id: "iss-4", group: "AB+", to: "Regional Trauma Centre", units: 1, at: "2026-11-24T08:45:00Z", component: "Platelets", status: "ISSUED" },
];

export default function BloodIssues() {
  const [group, setGroup] = useState("");

  const filtered = useMemo(
    () => ISSUED.filter((i) => !group || i.group === group),
    [group],
  );

  const columns = [
    { key: "group", label: "Group", render: (r) => <span className="blood-pill-sm" style={{ color: bloodGroupColor(r.group) }}>🩸 {r.group}</span> },
    { key: "component", label: "Component" },
    { key: "to", label: "Issued to" },
    { key: "units", label: "Units", align: "center" },
    { key: "status", label: "Status", render: () => <StatusBadge status="COMPLETED" /> },
    { key: "at", label: "Issued at", render: (r) => formatDateTime(r.at) },
  ];

  const totalUnits = ISSUED.reduce((a, i) => a + i.units, 0);

  return (
    <div className="page">
      <SectionHeader title="Blood Issues" subtitle="Records of blood issued from your bank to hospitals." />

      <div className="stat-grid">
        <StatCard label="Issue records" value={ISSUED.length} icon="📤" tone="primary" />
        <StatCard label="Units issued" value={totalUnits} icon="🧪" tone="info" />
      </div>

      <div className="filter-bar">
        <FilterSelect label="Blood group" value={group} onChange={setGroup} options={BLOOD_GROUPS} />
      </div>

      <Card className="table-card">
        <Table columns={columns} rows={filtered} rowKey={(r) => r.id} />
      </Card>
    </div>
  );
}
