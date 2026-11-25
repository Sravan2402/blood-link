import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { navigate, useRoute } from "../router/useRoute";
import { PUBLIC_NAV } from "../lib/nav";
import { Button } from "./ui";

const FOOTER_LINKS = [
  { section: "Platform", links: [
    { label: "How It Works", path: "/how-it-works" },
    { label: "Find Blood", path: "/find-blood" },
    { label: "Blood Camps", path: "/blood-camps" },
    { label: "Awareness", path: "/awareness" },
  ]},
  { section: "Organizations", links: [
    { label: "Hospitals", path: "/hospitals" },
    { label: "Blood Banks", path: "/blood-banks" },
    { label: "Contact", path: "/contact" },
  ]},
  { section: "Legal", links: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
  ]},
];

export default function PublicLayout({ children }) {
  const { isAuthenticated, role } = useAuth();
  const route = useRoute();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [route.path]);

  const handleNav = (path) => navigate(path);

  return (
    <div className="public-shell">
      <header className="public-nav">
        <div className="public-nav__inner">
          <a
            className="brand"
            href="#/"
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
          >
            <span className="brand__mark">🩸</span>
            <span className="brand__name">BloodLink</span>
          </a>

          <button
            className="public-nav__toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <nav className={`public-nav__links ${open ? "public-nav__links--open" : ""}`}>
            {PUBLIC_NAV.map((item) => (
              <a
                key={item.path}
                href={`#${item.path}`}
                className={`public-nav__link ${route.path === item.path ? "public-nav__link--active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNav(item.path); }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="public-nav__cta">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/app/dashboard")}>
                {role === "DONOR" ? "Donor" : role === "HOSPITAL" ? "Hospital" : "Go to Portal"}
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="public-main">{children}</main>

      <footer className="public-footer">
        <div className="public-footer__inner">
          <div className="public-footer__brand">
            <div className="brand">
              <span className="brand__mark">🩸</span>
              <span className="brand__name">BloodLink</span>
            </div>
            <p>
              The real-time emergency blood donor finder that connects donors,
              hospitals, blood banks, and administrators on a single platform.
            </p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.section} className="public-footer__col">
              <h4>{group.section}</h4>
              {group.links.map((link) => (
                <a
                  key={link.label}
                  href={`#${link.path}`}
                  onClick={(e) => { e.preventDefault(); navigate(link.path); }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="public-footer__bar">
          <span>© 2026 BloodLink. All rights reserved.</span>
          <span>Built for emergencies · Save lives, one drop at a time</span>
        </div>
      </footer>
    </div>
  );
}
