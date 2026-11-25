import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, Field, SectionHeader, StatCard } from "../../components/ui";
import { Table } from "../../components/kit";
import { bloodCamps } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor, formatDateTime } from "../../lib/constants";

const INITIAL = [
  { id: "dr-1", donor: "Ramesh", group: "O+", units: 1, camp: "c-004", at: "2026-10-18T10:15:00Z" },
  { id: "dr-2", donor: "Sita", group: "A+", units: 1, camp: "c-004", at: "2026-10-18T11:02:00Z" },
  { id: "dr-3", donor: "Gopal", group: "B+", units: 1, camp: "c-004", at: "2026-10-18T12:40:00Z" },
];

export default function DonationRecords() {
  const { notify } = useToast();
  const [records, setRecords] = useState(INITIAL);
  const [form, setForm] = useState({ donor: "", group: "O+", units: 1, camp: bloodCamps[0]?.id || "c-001" });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const add = () => {
    if (!form.donor) {
      notify("Enter the donor name.", "error");
      return;
    }
    const units = Number(form.units);
    if (!units || units < 1) {
      notify("Enter a valid number of units.", "error");
      return;
    }
    setRecords((prev) => [{ id: `dr-${Date.now()}`, donor: form.donor, group: form.group, units, camp: form.camp, at: new Date().toISOString() }, ...prev]);
    setForm({ donor: "", group: "O+", units: 1, camp: form.camp });
    notify(`Donation of ${units} ${form.group} recorded.`, "success");
  };

  const columns = [
    { key: "donor", label: "Donor" },
    { key: "group", label: "Group", render: (r) => <span className="blood-pill-sm" style={{ color: bloodGroupColor(r.group) }}>🩸 {r.group}</span> },
    { key: "units", label: "Units", align: "center" },
    { key: "camp", label: "Camp", render: (r) => bloodCamps.find((c) => c.id === r.camp)?.title || r.camp },
    { key: "at", label: "Date", render: (r) => formatDateTime(r.at) },
  ];

  const totalUnits = records.reduce((a, r) => a + r.units, 0);

  return (
    <div className="page">
      <SectionHeader title="Donation Records" subtitle="Record donations made at your camps." />

      <div className="stat-grid">
        <StatCard label="Donations" value={records.length} icon="🩸" tone="primary" />
        <StatCard label="Units collected" value={totalUnits} icon="🧪" tone="info" />
      </div>

      <Card className="form-card">
        <h3>Record a donation</h3>
        <div className="form-grid">
          <Field label="Donor name" htmlFor="donor">
            <input id="donor" value={form.donor} onChange={update("donor")} className="input" placeholder="Donor full name" />
          </Field>
          <Field label="Blood group" htmlFor="group">
            <select id="group" value={form.group} onChange={update("group")} className="input">
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Units" htmlFor="units">
            <input id="units" type="number" min="1" value={form.units} onChange={update("units")} className="input" />
          </Field>
          <Field label="Camp" htmlFor="camp">
            <select id="camp" value={form.camp} onChange={update("camp")} className="input">
              {bloodCamps.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </Field>
          <div className="form-actions">
            <Button onClick={add}>Record donation</Button>
          </div>
        </div>
      </Card>

      <Card className="table-card">
        <h3>Donation records</h3>
        <Table columns={columns} rows={records} rowKey={(r) => r.id} />
      </Card>
    </div>
  );
}
