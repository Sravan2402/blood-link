/* =========================================================
   BloodLink — Mobile UI Kit
   Reusable components matching the prototype spec exactly.
   ========================================================= */
import "./mobile.css";

/* ---------- AppBar ---------- */
export function AppBar({ title, subtitle, onBack, right }) {
  return (
    <header className="m-appbar">
      <div className="m-appbar__title-wrap">
        {onBack && (
          <button className="m-appbar__back" onClick={onBack} aria-label="Back">
            ‹
          </button>
        )}
        <div className="m-appbar__titles">
          <h1 className="m-appbar__title">{title}</h1>
          {subtitle && <span className="m-appbar__subtitle">{subtitle}</span>}
        </div>
      </div>
      {right}
    </header>
  );
}

/* ---------- BottomNav ---------- */
export function BottomNav({ items, active, onNavigate }) {
  return (
    <nav className="m-bottomnav">
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            className={`m-bottomnav__item ${isActive ? "m-bottomnav__item--active" : ""}`}
            onClick={() => onNavigate(item.path)}
          >
            <span className="m-bottomnav__square">{item.icon}</span>
            <span className="m-bottomnav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---------- Card ---------- */
export function Card({ children, variant, unread, className, onClick }) {
  const cls = ["m-card"];
  if (variant === "alert") cls.push("m-card--alert");
  if (unread) cls.push("m-card--unread");
  if (className) cls.push(className);
  return (
    <div className={cls.join(" ")} onClick={onClick}>
      {children}
    </div>
  );
}

/* ---------- Chip ---------- */
export function Chip({ children, variant, selected, className }) {
  const cls = ["m-chip"];
  if (variant) cls.push(`m-chip--${variant}`);
  if (selected) cls.push("m-chip--selected");
  if (className) cls.push(className);
  return <span className={cls.join(" ")}>{children}</span>;
}

/* ---------- Button ---------- */
export function Button({ children, variant, className, onClick, type, disabled, full }) {
  const cls = ["m-btn"];
  if (variant) cls.push(`m-btn--${variant}`);
  if (className) cls.push(className);
  if (full) cls.push("m-btn--full");
  return (
    <button
      type={type}
      className={cls.join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* ---------- Row ---------- */
export function Row({ label, children, right }) {
  return (
    <div className="m-row">
      <span className="m-row__label">{label}</span>
      {right !== undefined ? <span className="m-row__right">{right}</span> : children}
    </div>
  );
}

/* ---------- Field ---------- */
export function Field({ label, children, className }) {
  const cls = ["m-field"];
  if (className) cls.push(className);
  return (
    <label className={cls.join(" ")}>
      {label && <span className="m-field__label">{label}</span>}
      {children}
    </label>
  );
}

/* ---------- StatTile ---------- */
export function StatTile({ value, label }) {
  return (
    <div className="m-stattile">
      <span className="m-stattile__value">{value}</span>
      <span className="m-stattile__label">{label}</span>
    </div>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({ name, color }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  const cls = ["m-avatar"];
  if (color) cls.push(`m-avatar--${color}`);
  return <span className={cls.join(" ")}>{initial}</span>;
}

/* ---------- Stepper ---------- */
export function Stepper({ steps, current }) {
  // current: 0 (OPEN), 1 (ACCEPTED), 2 (COMPLETED)
  return (
    <div className="m-stepper">
      {steps.map((step, i) => (
        <div
          key={step}
          className={`m-stepper__seg ${i <= current ? "m-stepper__seg--on" : ""}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

/* ---------- MapView (CSS placeholder) ---------- */
export function MapView({ pins, radius, height, fullWidth }) {
  const cls = ["m-map"];
  if (fullWidth) cls.push("m-map--full");
  if (height) cls.push(`m-map--h${height}`);
  return (
    <div className={cls.join(" ")} style={height ? { height } : undefined}>
      <div className="m-map__road-v" />
      <div className="m-map__road-h" />
      {radius && <div className="m-map__ring" />}
      {pins?.map((pin, i) => (
        <span
          key={i}
          className={`m-map__pin m-map__pin--${pin.color || "red"}`}
          style={{ left: pin.x, top: pin.y }}
        />
      ))}
    </div>
  );
}

/* ---------- InventoryChart ---------- */
export function InventoryChart({ data }) {
  const max = Math.max(...data.map((d) => d.units), 1);
  return (
    <div className="m-invchart">
      {data.map((d) => (
        <div className="m-invchart__col" key={d.group}>
          <span className="m-invchart__units">{d.units}</span>
          <div
            className="m-invchart__bar"
            style={{ height: `${(d.units / max) * 70}px` }}
          />
          <span className="m-invchart__group">{d.group}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- BarChart ---------- */
export function BarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barColor = color || "var(--primary)";
  return (
    <div className="m-barchart">
      <div className="m-barchart__bars">
        {data.map((d, i) => (
          <div className="m-barchart__col" key={i}>
            <div
              className="m-barchart__bar"
              style={{ height: `${(d.value / max) * 100}%`, background: barColor }}
            />
          </div>
        ))}
      </div>
      <div className="m-barchart__labels">
        {data.map((d, i) => (
          <span className="m-barchart__label" key={i}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- ToggleRow ---------- */
export function ToggleRow({ label, on, onClick }) {
  return (
    <button className="m-togglerow" onClick={onClick}>
      <span className="m-togglerow__label">{label}</span>
      <span className={`m-chip ${on ? "m-chip--green" : ""}`}>
        {on ? "On" : "Off"}
      </span>
    </button>
  );
}

/* ---------- LinkRow ---------- */
export function LinkRow({ label, onClick }) {
  return (
    <button className="m-linkrow" onClick={onClick}>
      <span className="m-linkrow__label">{label}</span>
      <span className="m-linkrow__arrow">›</span>
    </button>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({ children }) {
  return <h2 className="m-h">{children}</h2>;
}

/* ---------- Empty state ---------- */
export function EmptyState({ text }) {
  return (
    <div className="m-card m-empty">
      <small>{text}</small>
    </div>
  );
}
