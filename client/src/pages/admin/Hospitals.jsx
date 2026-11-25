import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Card, SectionHeader, StatusBadge } from "../../components/ui";
import { Table, FilterSelect, usePagination, StarRating } from "../../components/kit";
import { hospitals } from "../../lib/mockData";

export default function Hospitals() {
  const { notify } = useToast();
  const [status, setStatus] = useState("");
  const [hospitalsState, setHospitalsState] = useState(
    hospitals.map((h, i) => ({ ...h, verified: i !== 3, verifiedStatus: i === 3 ? "PENDING" : "VERIFIED" })),
  );

  const filtered = hospitalsState.filter((h) => {
    if (status === "verified") return h.verified;
    if (status === "pending") return !h.verified;
    return true;
  });
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const verify = (id) => {
    setHospitalsState((prev) => prev.map((h) => (h.id === id ? { ...h, verified: true, verifiedStatus: "VERIFIED" } : h)));
    notify("Hospital verified.", "success");
  };

  const columns = [
    { key: "name", label: "Hospital" },
    { key: "city", label: "City" },
    { key: "registration", label: "Registration" },
    { key: "rating", label: "Rating", render: (h) => <StarRating value={h.rating} /> },
    { key: "unitsAvailable", label: "Units" },
    { key: "verifiedStatus", label: "Verification", render: (h) => <StatusBadge status={h.verified ? "COMPLETED" : "OPEN"} /> },
    { key: "actions", label: "Action", render: (h) => (
      h.verified ? <span className="muted-note">Verified</span> : <button className="link-button" onClick={() => verify(h.id)}>Verify</button>
    ) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Hospitals" subtitle="Review and verify hospital registrations." />
      <div className="filter-bar">
        <FilterSelect label="Verification" value={status} onChange={setStatus} options={["verified", "pending"]} />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(h) => h.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
