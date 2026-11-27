import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { navigate, useRoute } from "../router/useRoute";
import { PORTAL_NAV } from "../lib/nav";
import { Avatar } from "./kit";
import NotificationBell from "./NotificationBell";

export default function PortalLayout({ children }) {
  const { user, role, roleLabel, logout } = useAuth();
  const route = useRoute();
  // `open` = mobile drawer; `collapsed` = desktop mini-sidebar (icons only).
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const items = PORTAL_NAV[role] || [];

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [route.path]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const groups = [...new Set(items.map((i) => i.group))];

  return (
    <div className={`portal-shell ${collapsed ? "portal-shell--collapsed" : ""}`}>
      <aside
        className={`sidebar ${open ? "sidebar--open" : ""} ${collapsed ? "sidebar--mini" : ""}`}
      >
        <a
          className="sidebar__brand"
          href="#/app/dashboard"
          onClick={(e) => { e.preventDefault(); navigate("/app/dashboard"); }}
        >
          <span className="sidebar__mark">🩸</span>
          {!collapsed && <span>BloodLink</span>}
        </a>
        {!collapsed && <span className="sidebar__role">{roleLabel} Portal</span>}

        <nav className="sidebar__nav">
          {groups.map((group) => (
            <div key={group} className="sidebar__group">
              {!collapsed && <span className="sidebar__group-label">{group}</span>}
              {items
                .filter((i) => i.group === group)
                .map((item) => {
                  const active = route.path === item.path;
                  return (
                    <a
                      key={item.path}
                      href={`#${item.path}`}
                      title={item.label}
                      className={`sidebar__link ${active ? "sidebar__link--active" : ""}`}
                      onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                    >
                      <span className="sidebar__icon">{item.icon}</span>
                      {!collapsed && <span className="sidebar__label">{item.label}</span>}
                    </a>
                  );
                })}
            </div>
          ))}
        </nav>

        {!collapsed && (
          <button
            className="sidebar__collapse"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            ‹
          </button>
        )}
      </aside>

      {collapsed && (
        <button
          className="sidebar__expand"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
        >
          ›
        </button>
      )}

      <div className="portal-body">
        <header className="topnav">
          <button
            className="topnav__toggle"
            onClick={() => (window.innerWidth <= 900 ? setOpen((o) => !o) : setCollapsed((c) => !c))}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="topnav__search">
            <span>🔍</span>
            <input
              placeholder="Search BloodLink…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate("/app/find-blood");
                }
              }}
            />
          </div>
          <div className="topnav__actions">
            <NotificationBell />
            <div className="topnav__user">
              <Avatar name={user?.full_name} size={34} />
              {!collapsed && (
                <div className="topnav__user-info">
                  <span className="topnav__user-name">{user?.full_name}</span>
                  <span className="topnav__user-role">{roleLabel}</span>
                </div>
              )}
              {!collapsed && (
                <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}
