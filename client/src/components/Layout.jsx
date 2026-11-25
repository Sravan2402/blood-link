import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { navigate } from "../router/useRoute";
import NotificationBell from "./NotificationBell";
import { Badge } from "./ui";

const NAV = {
  DONOR: [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/requests", label: "Find Blood", icon: "🩸" },
    { path: "/history", label: "Donation History", icon: "📋" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ],
  HOSPITAL: [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/requests", label: "My Requests", icon: "📋" },
    { path: "/requests/new", label: "New Request", icon: "➕" },
    { path: "/history", label: "Donations", icon: "🩸" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ],
  ADMIN: [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ],
};

const ROLE_LABEL = {
  DONOR: "Donor",
  HOSPITAL: "Hospital",
  ADMIN: "Admin",
};

function Logo() {
  return (
    <a className="brand" href="#/dashboard" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}>
      <span className="brand__mark">🩸</span>
      <span className="brand__name">BloodLink</span>
    </a>
  );
}

export default function Layout({ children }) {
  const { user, logout, role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = NAV[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar__inner">
          <Logo />

          <button
            className="navbar__toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <nav className={`navbar__nav ${mobileOpen ? "navbar__nav--open" : ""}`}>
            {links.map((link) => (
              <a
                key={link.path}
                href={`#${link.path}`}
                className="navbar__link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                  setMobileOpen(false);
                }}
              >
                <span className="navbar__icon">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="navbar__actions">
            <NotificationBell />
            <div className="navbar__user">
              <div className="navbar__user-info">
                <span className="navbar__user-name">{user?.full_name}</span>
                {role && <Badge tone="neutral">{ROLE_LABEL[role] || role}</Badge>}
              </div>
              <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <p>
          BloodLink · Connecting hospitals with blood donors · Built to save
          lives
        </p>
      </footer>
    </div>
  );
}
