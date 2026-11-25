import { useState } from "react";
import { Card, SectionHeader } from "../../components/ui";
import { Table, FilterSelect, usePagination } from "../../components/kit";
import { auditLogs } from "../../lib/mockData";
import { formatDateTime } from "../../lib/constants";

export default function AuditLogs() {
  const [action, setAction] = useState("");

  const filtered = auditLogs.filter((a) => !action || a.action === action);
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const columns = [
    { key: "id", label: "ID" },
    { key: "action", label: "Action", render: (a) => <span className="badge badge--primary">{a.action}</span> },
    { key: "actor", label: "Actor" },
    { key: "target", label: "Target" },
    { key: "at", label: "Time", render: (a) => formatDateTime(a.at) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Audit Logs" subtitle="Track all platform activity and security events." />
      <div className="filter-bar">
        <FilterSelect
          label="Action"
          value={action}
          onChange={setAction}
          options={[...new Set(auditLogs.map((a) => a.action))]}
        />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(a) => a.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
