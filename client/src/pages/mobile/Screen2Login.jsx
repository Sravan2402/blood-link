import { useState } from "react";
import { Button, Field, Chip } from "../../components/mobile/ui";
import { loginRoles } from "../../lib/mobileData";

export default function Screen2Login({ navigate, onLogin }) {
  const [role, setRole] = useState("DONOR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const togglePw = () => setShowPw((s) => !s);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="m-screen">
      <div className="m-login">
        <div className="m-login__logo">B</div>
        <h1 className="m-login__title">BloodLink</h1>
        <span className="m-login__tagline">Save lives, faster.</span>

        <div className="m-role-chips">
          {loginRoles.map((r) => (
            <Chip
              key={r.value}
              selected={role === r.value}
              onClick={() => setRole(r.value)}
            >
              {r.label}
            </Chip>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: 320 }}>
          <Field label="Email">
            <input
              className="m-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <div style={{ position: "relative" }}>
              <input
                className="m-input"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={togglePw}
                aria-label="Toggle password visibility"
                style={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "var(--muted-2)",
                }}
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </Field>
          <Button type="submit" variant="primary">Login</Button>
        </form>

        <div className="m-login__links">
          <button className="m-login__link" onClick={() => navigate("/m/donor/forgot")}>Forgot password?</button>
          <button className="m-login__link" onClick={() => navigate("/m/register")}>New here? Register</button>
        </div>
      </div>
    </div>
  );
}
