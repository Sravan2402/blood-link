import { useMemo, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Button, Card, EmptyState, SectionHeader, StatusBadge } from "../../components/ui";
import { Tabs, usePagination } from "../../components/kit";
import { bloodCamps } from "../../lib/mockData";
import { formatDate } from "../../lib/constants";

export default function HospitalCamps() {
  const { notify } = useToast();
  const [tab, setTab] = useState("upcoming");

  const filtered = useMemo(() => {
    if (tab === "upcoming") return bloodCamps.filter((c) => c.status === "upcoming" || c.status === "ongoing");
    if (tab === "ongoing") return bloodCamps.filter((c) => c.status === "ongoing");
    if (tab === "completed") return bloodCamps.filter((c) => c.status === "completed");
    return bloodCamps;
  }, [tab]);

  const { page, pageSize, total, paged } = usePagination(filtered, 4);

  return (
    <div className="page">
      <SectionHeader title="Blood Camps" subtitle="Blood donation camps relevant to your hospital network." />

      <Tabs
        tabs={[
          { key: "upcoming", label: "Upcoming" },
          { key: "ongoing", label: "Ongoing" },
          { key: "completed", label: "Completed" },
          { key: "all", label: "All" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {filtered.length === 0 ? (
        <EmptyState icon="🎪" title="No camps" message="No camps match this filter." />
      ) : (
        <>
          <div className="camp-grid">
            {paged.map((camp) => (
              <Card key={camp.id} className="camp-card">
                <div className="camp-card__head">
                  <span className="camp-card__poster">{camp.poster}</span>
                  <StatusBadge status={camp.status.toUpperCase()} />
                </div>
                <h3>{camp.title}</h3>
                <p className="camp-card__meta">📍 {camp.location} · {camp.city}</p>
                <p className="camp-card__meta">📅 {formatDate(camp.date)} · {camp.time}</p>
                <p className="camp-card__meta">👥 {camp.registered}/{camp.capacity} registered</p>
                <div className="camp-card__footer">
                  <Button size="sm" variant="secondary" onClick={() => notify(`Camper list for “${camp.title}” opened.`, "info")}>
                    Donor list
                  </Button>
                  <Button size="sm" onClick={() => notify(`Coordination request sent to ${camp.organizer}.`, "success")}>
                    Co-organize
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="pagination-wrap">
            <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
          </div>
        </>
      )}
    </div>
  );
}
