import { useMemo, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Button, Card, EmptyState, SectionHeader, StatusBadge } from "../../components/ui";
import { Tabs, usePagination } from "../../components/kit";
import { bloodCamps } from "../../lib/mockData";
import { formatDate } from "../../lib/constants";

export default function BloodCamps() {
  const { notify } = useToast();
  const [tab, setTab] = useState("available");
  const [registered, setRegistered] = useState([]);

  const available = useMemo(() => bloodCamps.filter((c) => c.status !== "completed"), []);
  const myCamps = useMemo(() => bloodCamps.filter((c) => registered.includes(c.id)), [registered]);

  const register = (camp) => {
    if (registered.includes(camp.id)) return;
    setRegistered((prev) => [...prev, camp.id]);
    notify(`Registered for “${camp.title}”.`, "success");
  };

  const cancel = (campId) => {
    setRegistered((prev) => prev.filter((id) => id !== campId));
    notify("Registration cancelled.", "info");
  };

  const list = tab === "available" ? available : myCamps;
  const { page, pageSize, total, paged } = usePagination(list, 4);

  return (
    <div className="page">
      <SectionHeader title="Blood Camps" subtitle="Register for donation camps and track your participation." />

      <Tabs
        tabs={[
          { key: "available", label: `Available (${available.length})` },
          { key: "mine", label: `My Camps (${myCamps.length})` },
        ]}
        active={tab}
        onChange={setTab}
      />

      {list.length === 0 ? (
        <EmptyState
          icon="🎪"
          title={tab === "mine" ? "No registered camps" : "No camps available"}
          message={tab === "mine" ? "Register for a camp from the Available tab." : "Check back soon for new camps."}
        />
      ) : (
        <>
          <div className="camp-grid">
            {paged.map((camp) => {
              const isMine = registered.includes(camp.id);
              return (
                <Card key={camp.id} className="camp-card">
                  <div className="camp-card__head">
                    <span className="camp-card__poster">{camp.poster}</span>
                    <StatusBadge status={camp.status.toUpperCase()} />
                  </div>
                  <h3>{camp.title}</h3>
                  <p className="camp-card__meta">📍 {camp.location} · {camp.city}</p>
                  <p className="camp-card__meta">📅 {formatDate(camp.date)} · {camp.time}</p>
                  <p className="camp-card__meta">👥 {camp.registered}/{camp.capacity} registered</p>
                  {tab === "mine" && <p className="camp-card__meta camp-card__reminder">🔔 Reminder set — check in on the day</p>}
                  <div className="camp-card__footer">
                    {tab === "available" ? (
                      <Button size="sm" onClick={() => register(camp)} disabled={isMine}>
                        {isMine ? "Registered" : "Register"}
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => cancel(camp.id)}>Cancel registration</Button>
                    )}
                    <button className="link-button" onClick={() => navigate("/app/my-donations")}>My donations →</button>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="pagination-wrap">
            <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
          </div>
        </>
      )}
    </div>
  );
}
