import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, EmptyState, Field, SectionHeader, StatusBadge } from "../../components/ui";
import { Modal, Table } from "../../components/kit";
import { transfers as initialTransfers } from "../../lib/mockData";
import { BLOOD_GROUPS, formatDateTime } from "../../lib/constants";

const COMPONENTS = ["Whole Blood", "Packed Cells", "Platelets", "Plasma"];

export default function BloodTransfers() {
  const { notify } = useToast();
  const [transfers, setTransfers] = useState(initialTransfers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    from: "Red Life Blood Bank",
    to: "City Care Hospital",
    group: "O+",
    component: "Whole Blood",
    units: 1,
    priority: "HIGH",
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const create = () => {
    const id = `t-${Math.floor(Math.random() * 1000)}`;
    setTransfers((prev) => [
      { id, ...form, units: Number(form.units), status: "PENDING", createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setOpen(false);
    setForm({ from: "Red Life Blood Bank", to: "City Care Hospital", group: "O+", component: "Whole Blood", units: 1, priority: "HIGH" });
    notify("Transfer request created.", "success");
  };

  const updateStatus = (id, status) => {
    setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    notify(`Transfer ${status.toLowerCase()}.`, "success");
  };

  const columns = [
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "group", label: "Group", render: (t) => <span className="blood-pill-sm">🩸 {t.group}</span> },
    { key: "component", label: "Component" },
    { key: "units", label: "Units", align: "center" },
    { key: "status", label: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "createdAt", label: "Created", render: (t) => formatDateTime(t.createdAt) },
    { key: "actions", label: "Actions", render: (t) => (
      <div className="row-actions">
        {t.status === "PENDING" && (
          <>
            <button className="link-button" onClick={() => updateStatus(t.id, "APPROVED")}>Approve</button>
            <button className="link-button" onClick={() => updateStatus(t.id, "REJECTED")}>Reject</button>
          </>
        )}
        {t.status === "APPROVED" && <button className="link-button" onClick={() => updateStatus(t.id, "DISPATCHED")}>Dispatch</button>}
        {t.status === "DISPATCHED" && <button className="link-button" onClick={() => updateStatus(t.id, "RECEIVED")}>Confirm received</button>}
        {(t.status === "REJECTED" || t.status === "RECEIVED") && <span className="muted-note">—</span>}
      </div>
    ) },
  ];

  return (
    <div className="page">
      <SectionHeader
        title="Blood Transfers"
        subtitle="Create and track blood transfers between blood banks and hospitals."
        action={<Button onClick={() => setOpen(true)}>➕ New transfer</Button>}
      />

      <Card className="table-card">
        {transfers.length === 0 ? (
          <EmptyState icon="🚚" title="No transfers" message="Create a transfer request to get started." />
        ) : (
          <Table columns={columns} rows={transfers} rowKey={(r) => r.id} />
        )}
      </Card>

      {open && (
        <Modal
          title="Create blood transfer"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={create}>Create transfer</Button>
            </>
          }
        >
          <div className="form-grid">
            <Field label="Sending (from)" htmlFor="from">
              <select id="from" value={form.from} onChange={update("from")} className="input">
                <option>Red Life Blood Bank</option>
                <option>Sakhi Blood Bank</option>
                <option>Jeevadatha Blood Bank</option>
                <option>Nivaarana Blood Bank</option>
              </select>
            </Field>
            <Field label="Receiving (to)" htmlFor="to">
              <select id="to" value={form.to} onChange={update("to")} className="input">
                <option>City Care Hospital</option>
                <option>Apollo Heart Institute</option>
                <option>Sunshine Multispeciality</option>
                <option>Regional Trauma Centre</option>
              </select>
            </Field>
            <Field label="Blood group" htmlFor="group">
              <select id="group" value={form.group} onChange={update("group")} className="input">
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Component" htmlFor="component">
              <select id="component" value={form.component} onChange={update("component")} className="input">
                {COMPONENTS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Units" htmlFor="units">
              <input id="units" type="number" min="1" value={form.units} onChange={update("units")} className="input" />
            </Field>
            <Field label="Priority" htmlFor="priority">
              <select id="priority" value={form.priority} onChange={update("priority")} className="input">
                {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
