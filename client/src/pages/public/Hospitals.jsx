import { useMemo, useState } from "react";
import { Card, EmptyState } from "../../components/ui";
import { SearchBar, FilterSelect, StarRating, usePagination } from "../../components/kit";
import { hospitals } from "../../lib/mockData";
import { navigate } from "../../router/useRoute";

export default function Hospitals() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const cities = [...new Set(hospitals.map((h) => h.city))];

  const filtered = useMemo(
    () =>
      hospitals.filter((h) => {
        const matchesSearch =
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.address.toLowerCase().includes(search.toLowerCase());
        const matchesCity = !city || h.city === city;
        return matchesSearch && matchesCity;
      }),
    [search, city],
  );

  const { page, pageSize, total, paged } = usePagination(filtered, 6);

  return (
    <div className="public-page">
      <section className="page-hero page-hero--compact">
        <span className="hero__eyebrow">Hospitals</span>
        <h1>Hospitals on the BloodLink network</h1>
        <p className="hero__lead">
          Hospitals that post blood requests and coordinate with donors and
          blood banks across the region.
        </p>
      </section>

      <section className="section">
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search hospitals…" />
          <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="🏥" title="No hospitals found" message="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="partner-grid">
              {paged.map((h) => (
                <Card key={h.id} className="partner-card partner-card--detail">
                  <div className="partner-card__icon">🏥</div>
                  <h3>{h.name}</h3>
                  <p>📍 {h.address}</p>
                  <p>📞 {h.phone}</p>
                  <p>🏷️ Reg: {h.registration}</p>
                  <StarRating value={h.rating} />
                  <button className="link-button" onClick={() => navigate("/contact")}>
                    Contact →
                  </button>
                </Card>
              ))}
            </div>
            <div className="pagination-wrap">
              <span>Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
