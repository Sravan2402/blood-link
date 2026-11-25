import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Card, SectionHeader, StatusBadge } from "../../components/ui";
import { Table, FilterSelect, usePagination } from "../../components/kit";
import { donors, hospitals, bloodBanks } from "../../lib/mockData";
import { ROLE_LABEL } from "../../lib/constants";

const USERS = [
  ...donors.map((d, i) => ({ id: `u-${d.id}`, name: d.name, email: d.email, role: "DONOR", status: i % 4 === 0 ? "SUSPENDED" : "ACTIVE", verified: i % 3 === 0 })),
  ...hospitals.map((h) => ({ id: `u-${h.id}`, name: h.name, email: `${h.name.split(" ")[0].toLowerCase()}@bloodlink.org`, role: "HOSPITAL", status: "ACTIVE", verified: true })),
  ...bloodBanks.map((b) => ({ id: `u-${b.id}`, name: b.name, email: `${b.name.split(" ")[0].toLowerCase()}@bloodlink.org`, role: "BLOOD_BANK", status: "ACTIVE", verified: true })),
  { id: "u-admin", name: "Admin", email: "admin@bloodlink.org", role: "ADMIN", status: "ACTIVE", verified: true },
];

export default function Users() {
  const { notify } = useToast();
  const [role, setRole] = useState("");
  const [users, setUsers] = useState(USERS);

  const filtered = users.filter((u) => !role || u.role === role);
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const toggleSuspend = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : u)));
    const u = users.find((x) => x.id === id);
    notify(`${u.name} ${u.status === "SUSPENDED" ? "reactivated" : "suspended"}.`, u.status === "SUSPENDED" ? "success" : "info");
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (u) => ROLE_LABEL[u.role] || u.role },
    { key: "verified", label: "Verified", render: (u) => <StatusBadge status={u.verified ? "COMPLETED" : "CANCELLED"} /> },
    { key: "status", label: "Status", render: (u) => <StatusBadge status={u.status === "ACTIVE" ? "OPEN" : "CANCELLED"} /> },
    { key: "actions", label: "Action", render: (u) => (
      <button className="link-button" onClick={() => toggleSuspend(u.id)}>
        {u.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
      </button>
    ) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Users" subtitle="Manage all platform users and their status." />
      <div className="filter-bar">
        <FilterSelect label="Role" value={role} onChange={setRole} options={Object.keys(ROLE_LABEL)} />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(u) => u.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
