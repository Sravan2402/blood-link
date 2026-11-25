import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Card, SectionHeader, StatusBadge } from "../../components/ui";
import { Table, FilterSelect, usePagination } from "../../components/kit";
import { bloodCamps } from "../../lib/mockData";
import { formatDate } from "../../lib/constants";

export default function Camps() {
  const { notify } = useToast();
  const [status, setStatus] = useState("");
  const [campsState, setCampsState] = useState(
    bloodCamps.map((c, i) => ({ ...c, approval: i === 4 ? "PENDING" : "APPROVED" })),
  );

  const filtered = campsState.filter((c) => {
    if (status === "pending") return c.approval === "PENDING";
    if (status === "approved") return c.approval === "APPROVED";
    return true;
  });
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const approve = (id) => {
    setCampsState((prev) => prev.map((c) => (c.id === id ? { ...c, approval: "APPROVED" } : c)));
    notify("Camp approved.", "success");
  };

  const columns = [
    { key: "title", label: "Camp" },
    { key: "organizer", label: "Organizer" },
    { key: "city", label: "City" },
    { key: "date", label: "Date", render: (c) => formatDate(c.date) },
    { key: "registered", label: "Registered", align: "center", render: (c) => `${c.registered}/${c.capacity}` },
    { key: "status", label: "Status", render: (c) => <StatusBadge status={c.status.toUpperCase()} /> },
    { key: "approval", label: "Approval", render: (c) => <StatusBadge status={c.approval === "APPROVED" ? "COMPLETED" : "OPEN"} /> },
    { key: "actions", label: "Action", render: (c) => (
      c.approval === "APPROVED" ? <span className="muted-note">Approved</span> : <button className="link-button" onClick={() => approve(c.id)}>Approve</button>
    ) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Camps" subtitle="Review and approve blood donation camps." />
      <div className="filter-bar">
        <FilterSelect label="Approval" value={status} onChange={setStatus} options={["pending", "approved"]} />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(c) => c.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
