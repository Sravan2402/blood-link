import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, Field, SectionHeader, StatCard } from "../../components/ui";
import { Table } from "../../components/kit";
import { BLOOD_GROUPS, bloodGroupColor, formatDateTime } from "../../lib/constants";

const INITIAL = [
  { id: "col-1", donor: "Ravi Kumar", group: "O+", units: 1, at: "2026-11-20T09:00:00Z", note: "Camp collection" },
  { id: "col-2", donor: "Priya Sharma", group: "A+", units: 1, at: "2026-11-22T10:15:00Z", note: "Walk-in donor" },
  { id: "col-3", donor: "Sneha Reddy", group: "O+", units: 1, at: "2026-11-23T11:40:00Z", note: "Hospital collection" },
];

export default function BloodCollection() {
  const { notify } = useToast();
  const [records, setRecords] = useState(INITIAL);
  const [form, setForm] = useState({ donor: "", group: "O+", units: 1, note: "" });

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
    setRecords((prev) => [
      { id: `col-${Date.now()}`, donor: form.donor, group: form.group, units, at: new Date().toISOString(), note: form.note },
      ...prev,
    ]);
    setForm({ donor: "", group: "O+", units: 1, note: "" });
    notify(`Collection of ${units} ${form.group} recorded.`, "success");
  };

  const columns = [
    { key: "donor", label: "Donor" },
    { key: "group", label: "Group", render: (r) => <span className="blood-pill-sm" style={{ color: bloodGroupColor(r.group) }}>🩸 {r.group}</span> },
    { key: "units", label: "Units", align: "center" },
    { key: "note", label: "Note" },
    { key: "at", label: "Date", render: (r) => formatDateTime(r.at) },
  ];

  const totalUnits = records.reduce((a, r) => a + r.units, 0);

  return (
    <div className="page">
      <SectionHeader title="Blood Collection" subtitle="Record blood collected from donors and camps." />

      <div className="stat-grid">
        <StatCard label="Collections" value={records.length} icon="🩸" tone="primary" />
        <StatCard label="Units collected" value={totalUnits} icon="🧪" tone="info" />
      </div>

      <Card className="form-card">
        <h3>Record a collection</h3>
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
          <div className="form-span">
            <Field label="Note" htmlFor="note">
              <input id="note" value={form.note} onChange={update("note")} className="input" placeholder="Optional" />
            </Field>
          </div>
          <div className="form-actions">
            <Button onClick={add}>Record collection</Button>
          </div>
        </div>
      </Card>

      <Card className="table-card">
        <h3>Collection records</h3>
        <Table columns={columns} rows={records} rowKey={(r) => r.id} />
      </Card>
    </div>
  );
}
