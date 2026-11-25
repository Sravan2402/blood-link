import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Card, SectionHeader, StatusBadge } from "../../components/ui";
import { Table, FilterSelect, usePagination } from "../../components/kit";
import { donors } from "../../lib/mockData";
import { formatDate } from "../../lib/constants";

export default function Donors() {
  const { notify } = useToast();
  const [eligibility, setEligibility] = useState("");
  const [donorsState, setDonorsState] = useState(donors);

  const filtered = donorsState.filter((d) => {
    if (eligibility === "eligible") return d.eligibility;
    if (eligibility === "ineligible") return !d.eligibility;
    return true;
  });
  const { page, pageSize, total, paged } = usePagination(filtered, 8);

  const toggleEligibility = (id) => {
    setDonorsState((prev) => prev.map((d) => (d.id === id ? { ...d, eligibility: !d.eligibility } : d)));
    notify("Donor eligibility updated.", "success");
  };

  const columns = [
    { key: "name", label: "Donor" },
    { key: "bloodGroup", label: "Group", render: (d) => <span className="blood-pill-sm">🩸 {d.bloodGroup}</span> },
    { key: "city", label: "City" },
    { key: "lastDonation", label: "Last donation", render: (d) => formatDate(d.lastDonation) },
    { key: "eligibility", label: "Eligibility", render: (d) => <StatusBadge status={d.eligibility ? "OPEN" : "CANCELLED"} /> },
    { key: "available", label: "Available", render: (d) => <StatusBadge status={d.available ? "COMPLETED" : "CANCELLED"} /> },
    { key: "actions", label: "Action", render: (d) => (
      <button className="link-button" onClick={() => toggleEligibility(d.id)}>
        {d.eligibility ? "Revoke eligibility" : "Approve eligibility"}
      </button>
    ) },
  ];

  return (
    <div className="page">
      <SectionHeader title="Donors" subtitle="Manage donor accounts and eligibility." />
      <div className="filter-bar">
        <FilterSelect label="Eligibility" value={eligibility} onChange={setEligibility} options={["eligible", "ineligible"]} />
      </div>
      <Card className="table-card">
        <Table columns={columns} rows={paged} rowKey={(d) => d.id} />
      </Card>
      <div className="pagination-wrap">
        <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
      </div>
    </div>
  );
}
