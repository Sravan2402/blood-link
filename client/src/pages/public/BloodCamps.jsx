import { useMemo, useState } from "react";
import { Button, Card, EmptyState } from "../../components/ui";
import { SearchBar, FilterSelect, usePagination } from "../../components/kit";
import { bloodCamps } from "../../lib/mockData";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { formatDate } from "../../lib/constants";
import { StatusBadge } from "../../components/ui";

const STATUSES = ["All", "upcoming", "ongoing", "completed"];

export default function BloodCamps() {
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("All");

  const cities = [...new Set(bloodCamps.map((c) => c.city))];

  const filtered = useMemo(() => {
    return bloodCamps.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      const matchesCity = !city || c.city === city;
      const matchesStatus = status === "All" || c.status === status;
      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [search, city, status]);

  const { page, setPage, pageSize, total, paged } = usePagination(filtered, 6);

  const register = (camp) => {
    if (!isAuthenticated) {
      notify("Please sign in to register for a camp.", "info");
      navigate("/login");
      return;
    }
    notify(`Registered for “${camp.title}”.`, "success");
  };

  return (
    <div className="public-page">
      <section className="page-hero page-hero--compact">
        <span className="hero__eyebrow">Blood camps</span>
        <h1>Find a blood donation camp near you</h1>
        <p className="hero__lead">
          Camps organized by blood banks and volunteers. Register, attend, and
          donate — every contribution adds to the supply.
        </p>
      </section>

      <section className="section">
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search camps…" />
          <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={STATUSES.filter((s) => s !== "All")} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="🎪" title="No camps found" message="Try adjusting your filters." />
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
                    <Button size="sm" onClick={() => register(camp)}>
                      {camp.status === "completed" ? "View" : "Register"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="pagination-wrap">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</Button>
              <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
              <Button variant="secondary" size="sm" disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(page + 1)}>Next →</Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
