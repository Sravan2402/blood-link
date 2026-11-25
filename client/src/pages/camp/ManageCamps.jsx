import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, EmptyState, SectionHeader, StatusBadge } from "../../components/ui";
import { Modal, ConfirmDialog } from "../../components/kit";
import { bloodCamps } from "../../lib/mockData";
import { formatDate } from "../../lib/constants";

export default function ManageCamps() {
  const { notify } = useToast();
  const [camps, setCamps] = useState(bloodCamps);
  const [editing, setEditing] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const saveEdit = () => {
    setCamps((prev) => prev.map((c) => (c.id === editing.id ? { ...editing } : c)));
    setEditing(null);
    notify("Camp updated.", "success");
  };

  const cancelCamp = () => {
    setCamps((prev) => prev.map((c) => (c.id === cancelTarget ? { ...c, status: "cancelled" } : c)));
    setCancelTarget(null);
    notify("Camp cancelled.", "info");
  };

  return (
    <div className="page">
      <SectionHeader title="Manage Camps" subtitle="Edit details or cancel your donation camps." />

      {camps.length === 0 ? (
        <EmptyState icon="🎪" title="No camps" message="Create a camp to get started." />
      ) : (
        <div className="camp-grid">
          {camps.map((c) => (
            <Card key={c.id} className="camp-card">
              <div className="camp-card__head">
                <span className="camp-card__poster">{c.poster}</span>
                <StatusBadge status={c.status.toUpperCase()} />
              </div>
              <h3>{c.title}</h3>
              <p className="camp-card__meta">📍 {c.location} · {c.city}</p>
              <p className="camp-card__meta">📅 {formatDate(c.date)} · {c.time}</p>
              <p className="camp-card__meta">👥 {c.registered}/{c.capacity} registered</p>
              <div className="camp-card__footer">
                <Button size="sm" variant="secondary" onClick={() => setEditing({ ...c })}>Edit</Button>
                <Button size="sm" onClick={() => setCancelTarget(c.id)} disabled={c.status === "completed"}>Cancel</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          title="Edit camp"
          onClose={() => setEditing(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={saveEdit}>Save changes</Button>
            </>
          }
        >
          <div className="form-grid">
            <label className="field">
              <span className="field__label">Camp title</span>
              <input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </label>
            <label className="field">
              <span className="field__label">City</span>
              <input className="input" value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} />
            </label>
            <div className="form-span">
              <label className="field">
                <span className="field__label">Location</span>
                <input className="input" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
              </label>
            </div>
            <label className="field">
              <span className="field__label">Date</span>
              <input type="date" className="input" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
            </label>
            <label className="field">
              <span className="field__label">Time</span>
              <input type="time" className="input" value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
            </label>
            <label className="field">
              <span className="field__label">Capacity</span>
              <input type="number" className="input" value={editing.capacity} onChange={(e) => setEditing({ ...editing, capacity: Number(e.target.value) })} />
            </label>
          </div>
        </Modal>
      )}

      {cancelTarget && (
        <ConfirmDialog
          title="Cancel camp?"
          message="Registered donors will be notified. This cannot be undone."
          confirmLabel="Cancel camp"
          onConfirm={cancelCamp}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}
