import { useMemo, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, Field, SectionHeader, StatusBadge } from "../../components/ui";
import { Modal, Table, FilterSelect, ConfirmDialog } from "../../components/kit";
import { bloodBanks, inventoryMovements } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor, formatDateTime } from "../../lib/constants";

export default function BloodBankInventory() {
  const { notify } = useToast();
  const [inventory, setInventory] = useState({ ...bloodBanks[0].groups });
  const [movements, setMovements] = useState(inventoryMovements);
  const [groupFilter, setGroupFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ group: "O+", units: 1, note: "" });
  const [removeTarget, setRemoveTarget] = useState(null);

  const addMovement = (type, group, units, note) => {
    setMovements((prev) => [
      { id: `inv-${Date.now()}`, type, group, units, at: new Date().toISOString(), note },
      ...prev,
    ]);
  };

  const addStock = () => {
    const units = Number(addForm.units);
    if (!units || units < 1) {
      notify("Enter a valid number of units.", "error");
      return;
    }
    setInventory((prev) => ({ ...prev, [addForm.group]: (prev[addForm.group] || 0) + units }));
    addMovement("collected", addForm.group, units, addForm.note || "Added stock");
    setAddOpen(false);
    setAddForm({ group: "O+", units: 1, note: "" });
    notify(`${units} units of ${addForm.group} added to inventory.`, "success");
  };

  const updateStock = (group, delta) => {
    setInventory((prev) => {
      const next = Math.max(0, (prev[group] || 0) + delta);
      addMovement(delta > 0 ? "collected" : "issued", group, Math.abs(delta), delta > 0 ? "Adjusted +" : "Adjusted -");
      return { ...prev, [group]: next };
    });
  };

  const confirmRemove = (group) => {
    const units = inventory[group] || 0;
    setInventory((prev) => ({ ...prev, [group]: 0 }));
    addMovement("expired", group, units, "Removed from stock");
    setRemoveTarget(null);
    notify(`Removed ${units} units of ${group}.`, "info");
  };

  const filteredGroups = useMemo(
    () => BLOOD_GROUPS.filter((g) => !groupFilter || g === groupFilter),
    [groupFilter],
  );

  const columns = [
    {
      key: "group",
      label: "Blood group",
      render: (r) => <span className="blood-pill-sm" style={{ color: bloodGroupColor(r.group) }}>🩸 {r.group}</span>,
    },
    { key: "units", label: "Units", align: "center" },
    {
      key: "status",
      label: "Stock status",
      render: (r) => (r.units < 100 ? <StatusBadge status="CANCELLED" /> : <StatusBadge status="COMPLETED" />),
    },
    {
      key: "actions",
      label: "Manage",
      render: (r) => (
        <div className="row-actions">
          <button className="link-button" onClick={() => updateStock(r.group, 1)}>+ Add</button>
          <button className="link-button" onClick={() => updateStock(r.group, -1)}>− Remove 1</button>
          <button className="link-button" onClick={() => setRemoveTarget(r.group)}>Clear</button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <SectionHeader
        title="Inventory"
        subtitle="Add, update, and remove blood stock by blood group."
        action={<Button onClick={() => setAddOpen(true)}>➕ Add stock</Button>}
      />

      <div className="filter-bar">
        <FilterSelect label="Blood group" value={groupFilter} onChange={setGroupFilter} options={BLOOD_GROUPS} />
      </div>

      <Card className="table-card">
        <Table
          columns={columns}
          rows={filteredGroups.map((g) => ({ id: g, group: g, units: inventory[g] || 0 }))}
          rowKey={(r) => r.id}
        />
      </Card>

      <Card className="dash-card">
        <div className="dash-card__head">
          <h3>Inventory history</h3>
        </div>
        <div className="movement-list">
          {movements.map((m) => (
            <div key={m.id} className="movement-item">
              <span className={`movement-item__type movement-item__type--${m.type}`}>
                {m.type === "collected" ? "➕ Collected" : m.type === "issued" ? "📤 Issued" : "🗑️ Expired"}
              </span>
              <span className="blood-pill-sm" style={{ color: bloodGroupColor(m.group) }}>🩸 {m.group}</span>
              <span>{m.units} units</span>
              <small>{m.note}</small>
              <small>{formatDateTime(m.at)}</small>
            </div>
          ))}
        </div>
      </Card>

      {addOpen && (
        <Modal
          title="Add blood stock"
          onClose={() => setAddOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={addStock}>Add stock</Button>
            </>
          }
        >
          <div className="form-grid">
            <Field label="Blood group" htmlFor="group">
              <select id="group" value={addForm.group} onChange={(e) => setAddForm((p) => ({ ...p, group: e.target.value }))} className="input">
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Units" htmlFor="units">
              <input id="units" type="number" min="1" value={addForm.units} onChange={(e) => setAddForm((p) => ({ ...p, units: e.target.value }))} className="input" />
            </Field>
            <div className="form-span">
              <Field label="Note" htmlFor="note">
                <input id="note" value={addForm.note} onChange={(e) => setAddForm((p) => ({ ...p, note: e.target.value }))} className="input" placeholder="Optional" />
              </Field>
            </div>
          </div>
        </Modal>
      )}

      {removeTarget && (
        <ConfirmDialog
          title="Clear stock?"
          message={`This will remove all ${inventory[removeTarget] || 0} units of ${removeTarget} from inventory.`}
          confirmLabel="Clear stock"
          onConfirm={() => confirmRemove(removeTarget)}
          onCancel={() => setRemoveTarget(null)}
        />
      )}
    </div>
  );
}
