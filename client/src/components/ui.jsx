// Reusable, dependency-free UI primitives for the BloodLink frontend.

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, hint, icon, tone = "primary" }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      {icon && <span className="stat-card__icon">{icon}</span>}
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {hint && <span className="stat-card__hint">{hint}</span>}
      </div>
    </div>
  );
}

const STATUS_TONE = {
  OPEN: "open",
  MATCHED: "matched",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export function StatusBadge({ status }) {
  if (!status) return null;
  const tone = STATUS_TONE[status] || "default";
  return <span className={`badge badge--${tone}`}>{status}</span>;
}

const URGENCY_TONE = {
  CRITICAL: "danger",
  HIGH: "warning",
  MEDIUM: "info",
  LOW: "neutral",
};

export function UrgencyBadge({ urgency }) {
  if (!urgency) return null;
  const tone = URGENCY_TONE[urgency] || "neutral";
  return <span className={`badge badge--${tone}`}>{urgency}</span>;
}

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function Field({ label, children, hint, error, htmlFor }) {
  return (
    <label className="field" htmlFor={htmlFor}>
      <span className="field__label">{label}</span>
      {children}
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}

export function Spinner({ label }) {
  return (
    <div className="spinner-wrap">
      <span className="spinner" aria-hidden="true" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}

export function EmptyState({ icon = "📭", title, message, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action}
    </div>
  );
}

export function Alert({ children, tone = "error", onClose }) {
  if (!children) return null;
  return (
    <div className={`alert alert--${tone}`}>
      <span>{children}</span>
      {onClose && (
        <button className="alert__close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}

export function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
