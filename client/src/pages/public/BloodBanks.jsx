import { useMemo, useState } from "react";
import { Card, EmptyState, Badge } from "../../components/ui";
import { SearchBar, FilterSelect, StarRating, usePagination } from "../../components/kit";
import { bloodBanks } from "../../lib/mockData";
import { BLOOD_GROUPS, bloodGroupColor } from "../../lib/constants";

export default function BloodBanks() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const cities = [...new Set(bloodBanks.map((b) => b.city))];

  const filtered = useMemo(
    () =>
      bloodBanks.filter((b) => {
        const matchesSearch =
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.address.toLowerCase().includes(search.toLowerCase());
        const matchesCity = !city || b.city === city;
        return matchesSearch && matchesCity;
      }),
    [search, city],
  );

  const { page, pageSize, total, paged } = usePagination(filtered, 6);

  return (
    <div className="public-page">
      <section className="page-hero page-hero--compact">
        <span className="hero__eyebrow">Blood banks</span>
        <h1>Blood banks on the BloodLink network</h1>
        <p className="hero__lead">
          Blood banks that maintain inventory, organize camps, and coordinate
          transfers with hospitals.
        </p>
      </section>

      <section className="section">
        <div className="filter-bar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search blood banks…" />
          <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="🏬" title="No blood banks found" message="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="bloodbank-grid">
              {paged.map((b) => (
                <Card key={b.id} className="bloodbank-card">
                  <div className="bloodbank-card__head">
                    <div>
                      <h3>{b.name}</h3>
                      <p>📍 {b.address}</p>
                      <p>📞 {b.phone}</p>
                    </div>
                    {b.open ? <Badge tone="success">Open</Badge> : <Badge tone="neutral">Closed</Badge>}
                  </div>
                  <div className="bloodbank-card__rating">
                    <StarRating value={b.rating} />
                    <span>· {b.unitsAvailable} units available</span>
                  </div>
                  <div className="bloodbank-card__groups">
                    {BLOOD_GROUPS.map((g) => (
                      <span
                        key={g}
                        className="blood-pill-sm"
                        style={{
                          background: `${bloodGroupColor(g)}1a`,
                          color: bloodGroupColor(g),
                        }}
                      >
                        {g}: {b.groups[g] ?? 0}
                      </span>
                    ))}
                  </div>
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
