import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, SectionHeader, StatusBadge } from "../../components/ui";
import { Table, FilterSelect, usePagination } from "../../components/kit";
import { bloodBanks, bloodCamps, hospitals } from "../../lib/mockData";

const VERIFICATIONS = [
  ...hospitals.map((h, i) => ({ id: `v-h-${h.id}`, name: h.name, type: "HOSPITAL", details: `Reg. ${h.registration} · ${h.city}`, verified: i !== 3 })),
  ...bloodBanks.map((b, i) => ({ id: `v-b-${b.id}`, name: b.name, type: "BLOOD_BANK", details: `Reg. ${b.registration} · ${b.city}`, verified: i !== 3 })),
  ...bloodCamps.map((c, i) => ({ id: `v-c-${c.id}`, name: c.title, type: "CAMP", details: `${c.location} · ${c.city}`, verified: i !== 4 })),
];

export default function Verifications() {
  const { notify } = useToast();
  const [type, setType] = useState("");
  const [items, setItems] = useState(VERIFICATIONS);

  const filtered = items.filter((v) => !type || v.type === type);
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const verify = (id) => {
    setItems((prev) => prev.map((v) => (v.id === id ? { ...v, verified: true } : v)));
    const item = items.find((x) => x.id === id);
    notify(`${item.name} verified successfully.`, "success");
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "details", label: "Details" },
    { key: "verified", label: "Verification", render: (v) => <StatusBadge status={v.verified ? "COMPLETED" : "OPEN"} /> },
    { key: "actions", label: "Action", render: (v) => (
      v.verified ? <span className="muted-note">Verified</span> : <Button size="sm" onClick={() => verify(v.id)}>Verify</Button>
    ) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Verifications" subtitle="Approve pending hospital, blood bank, and camp registrations." />
      <div className="filter-bar">
        <FilterSelect label="Type" value={type} onChange={setType} options={["HOSPITAL", "BLOOD_BANK", "CAMP"]} />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(v) => v.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
