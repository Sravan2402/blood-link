import { useState } from "react";
import { Card, SectionHeader, StatusBadge } from "../../components/ui";
import { Table, FilterSelect, usePagination } from "../../components/kit";
import { transfers } from "../../lib/mockData";
import { formatDateTime } from "../../lib/constants";

export default function Transfers() {
  const [status, setStatus] = useState("");
  const filtered = transfers.filter((t) => !status || t.status === status);
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const columns = [
    { key: "id", label: "ID" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "group", label: "Group", render: (t) => <span className="blood-pill-sm">🩸 {t.group}</span> },
    { key: "component", label: "Component" },
    { key: "units", label: "Units", align: "center" },
    { key: "status", label: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "createdAt", label: "Created", render: (t) => formatDateTime(t.createdAt) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Transfers" subtitle="All blood transfers across blood banks and hospitals." />
      <div className="filter-bar">
        <FilterSelect label="Status" value={status} onChange={setStatus} options={["PENDING", "APPROVED", "DISPATCHED", "RECEIVED", "REJECTED"]} />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(t) => t.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
