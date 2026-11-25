import { useEffect, useMemo, useState } from "react";
import { Button, Field } from "./ui";

/* =========================================================
   Layout helpers
   ========================================================= */
export function Avatar({ name, src, size = 44 }) {
  const text = name
    ? name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join("")
    : "?";
  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className="avatar"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="avatar avatar--text"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {text}
    </span>
  );
}

export function ProgressBar({ value, max = 100, tone = "primary" }) {
  const pct = Math.min(100, Math.round((value / max) * 100) || 0);
  return (
    <div className="progress">
      <div className={`progress__bar progress__bar--${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tabs__tab ${active === tab.key ? "tabs__tab--active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, i) => (
        <span key={i} className="breadcrumbs__item">
          {i > 0 && <span className="breadcrumbs__sep">/</span>}
          {item.href ? (
            <a href={item.href} onClick={(e) => { e.preventDefault(); item.onClick?.(); }}>
              {item.label}
            </a>
          ) : (
            <span className="breadcrumbs__current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* =========================================================
   Data display
   ========================================================= */
export function SearchBar({ value, onChange, placeholder = "Search…", onSubmit }) {
  return (
    <form
      className="searchbar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <span className="searchbar__icon">🔍</span>
      <input
        className="searchbar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
}

export function FilterSelect({ label, value, onChange, options, allLabel = "All" }) {
  return (
    <label className="filter-select">
      <span className="filter-select__label">{label}</span>
      <select
        className="input filter-select__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Table({ columns, rows, rowKey = "id", emptyMessage = "No records found." }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.align ? { textAlign: col.align } : undefined}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key} style={col.align ? { textAlign: col.align } : undefined}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - page) > 1) {
      if (pages[pages.length - 1] !== "…") pages.push("…");
      continue;
    }
    pages.push(i);
  }
  if (totalPages === 0) return null;
  return (
    <div className="pagination">
      <span className="pagination__info">
        {total > 0 ? `${(page - 1) * pageSize + 1}–${Math.min(total, page * pageSize)} of ${total}` : "No results"}
      </span>
      <div className="pagination__controls">
        <Button
          size="sm"
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          ← Prev
        </Button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="pagination__ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`pagination__page ${p === page ? "pagination__page--active" : ""}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          ),
        )}
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}

export function Skeleton({ count = 3, height = 90 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}

export function StarRating({ value }) {
  const full = Math.round(value);
  return (
    <span className="stars" title={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= full ? "stars__on" : "stars__off"}>
          ★
        </span>
      ))}
      <span className="stars__value">{value.toFixed(1)}</span>
    </span>
  );
}

/* =========================================================
   Charts (lightweight inline SVG)
   ========================================================= */
export function BarChart({ data, height = 220, color = "var(--primary)" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="chart" style={{ height }}>
      <svg viewBox={`0 0 ${data.length * 60} ${height}`} width="100%" height="100%" preserveAspectRatio="none">
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 30);
          return (
            <g key={i} transform={`translate(${i * 60 + 10}, ${height - 20})`}>
              <rect
                x={0}
                y={-h}
                width={34}
                height={h}
                rx={5}
                fill={color}
                opacity={0.85}
              />
              <text x={17} y={-h - 6} textAnchor="middle" fontSize="11" fill="var(--muted)">
                {d.value}
              </text>
              <text x={17} y={16} textAnchor="middle" fontSize="11" fill="var(--muted)">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function LineChart({ data, height = 220, color = "var(--primary)" }) {
  const width = Math.max(data.length * 70, 300);
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = width / (data.length - 1 || 1);
  const points = data
    .map((d, i) => `${i * stepX},${height - 24 - (d.value / max) * (height - 44)}`)
    .join(" ");
  return (
    <div className="chart" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={i * stepX} cy={height - 24 - (d.value / max) * (height - 44)} r="3.5" fill={color} />
            <text x={i * stepX} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function DonutChart({ data, size = 180 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * radius;
  const segments = data.map((d, i) => {
    const len = (d.value / total) * circ;
    const segOffset = data.slice(0, i).reduce((acc, prev) => acc + ((prev.value / total) * circ), 0);
    return { key: i, len, segOffset, d };
  });
  return (
    <div className="donut" style={{ width: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--neutral-soft)" strokeWidth="18" />
        {segments.map((s) => {
          const seg = (
            <circle
              key={s.key}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={s.d.color}
              strokeWidth="18"
              strokeDasharray={`${s.len} ${circ - s.len}`}
              strokeDashoffset={-s.segOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          return seg;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--ink)">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--muted)">
          total
        </text>
      </svg>
      <div className="donut__legend">
        {data.map((d, i) => (
          <div key={i} className="donut__legend-item">
            <span className="donut__dot" style={{ background: d.color }} />
            <span>{d.label}</span>
            <span className="donut__value">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Form helpers
   ========================================================= */
export function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onCancel} aria-label="Close">×</button>
        </div>
        <div className="modal__body">
          <p style={{ color: "var(--text)" }}>{message}</p>
        </div>
        <div className="modal__footer">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Modal({ title, children, footer, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export function UploadField({ label, accept = "image/*", onFile, preview, hint }) {
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }
    setError("");
    onFile?.(file);
  };
  return (
    <Field label={label} hint={hint} error={error}>
      <input type="file" accept={accept} onChange={handleChange} className="input" />
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
        </div>
      )}
    </Field>
  );
}

export function ImagePreview({ src, alt = "Image", onRemove }) {
  if (!src) return null;
  return (
    <div className="image-preview image-preview--block">
      <img src={src} alt={alt} />
      {onRemove && (
        <button className="image-preview__remove" onClick={onRemove} aria-label="Remove">
          ×
        </button>
      )}
    </div>
  );
}

/* =========================================================
   Password field with visibility toggle
   ========================================================= */
export function PasswordField({ label, value, onChange, ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} htmlFor={rest.id}>
      <div className="password-wrap">
        <input
          id={rest.id}
          type={show ? "text" : "password"}
          className="input"
          value={value}
          onChange={onChange}
          {...rest}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </Field>
  );
}

/* =========================================================
   Interactive map (stylized, no external key required)
   ========================================================= */
export function MapView({ markers = [], center, title = "Map" }) {
  // markers: [{ id, lat, lng, label, sub }] — positioned proportionally.
  const points = useMemo(
    () =>
      markers.map((m) => {
        const x = 12 + ((m.lng + 180) / 360) * 76;
        const y = 12 + ((90 - m.lat) / 180) * 76;
        return { ...m, x, y };
      }),
    [markers],
  );
  return (
    <div className="map">
      <div className="map__grid" aria-label={title}>
        <div className="map__road map__road--h" style={{ top: "38%" }} />
        <div className="map__road map__road--h" style={{ top: "72%" }} />
        <div className="map__road map__road--v" style={{ left: "32%" }} />
        <div className="map__road map__road--v" style={{ left: "68%" }} />
        <div className="map__water" />
        {center && (
          <div className="map__center" style={{ left: `${50}%`, top: `${50}%` }}>
            📍
          </div>
        )}
        {points.map((m) => (
          <button
            key={m.id}
            className="map__marker"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            title={m.label}
          >
            🩸
            <span className="map__marker-label">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Skeleton page wrapper
   ========================================================= */
export function PageSkeleton({ lines = 6 }) {
  return (
    <div className="page">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: i === 0 ? 40 : 90 }} />
      ))}
    </div>
  );
}

// Hook: paginate a list client-side.
export function usePagination(items, pageSize) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [items, pageSize]);
  const total = items.length;
  const paged = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );
  return { page, setPage, pageSize, total, paged };
}
