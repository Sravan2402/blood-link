import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Card, SectionHeader, StatusBadge } from "../../components/ui";
import { Table, FilterSelect, usePagination, StarRating } from "../../components/kit";
import { bloodBanks } from "../../lib/mockData";

export default function BloodBanks() {
  const { notify } = useToast();
  const [status, setStatus] = useState("");
  const [banksState, setBanksState] = useState(
    bloodBanks.map((b, i) => ({ ...b, verified: i !== 3, verifiedStatus: i === 3 ? "PENDING" : "VERIFIED" })),
  );

  const filtered = banksState.filter((b) => {
    if (status === "verified") return b.verified;
    if (status === "pending") return !b.verified;
    return true;
  });
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const verify = (id) => {
    setBanksState((prev) => prev.map((b) => (b.id === id ? { ...b, verified: true, verifiedStatus: "VERIFIED" } : b)));
    notify("Blood bank verified.", "success");
  };

  const columns = [
    { key: "name", label: "Blood bank" },
    { key: "city", label: "City" },
    { key: "unitsAvailable", label: "Units" },
    { key: "rating", label: "Rating", render: (b) => <StarRating value={b.rating} /> },
    { key: "open", label: "Status", render: (b) => <StatusBadge status={b.open ? "OPEN" : "CANCELLED"} /> },
    { key: "verifiedStatus", label: "Verification", render: (b) => <StatusBadge status={b.verified ? "COMPLETED" : "OPEN"} /> },
    { key: "actions", label: "Action", render: (b) => (
      b.verified ? <span className="muted-note">Verified</span> : <button className="link-button" onClick={() => verify(b.id)}>Verify</button>
    ) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Blood Banks" subtitle="Review and verify blood bank registrations." />
      <div className="filter-bar">
        <FilterSelect label="Verification" value={status} onChange={setStatus} options={["verified", "pending"]} />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(b) => b.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
