import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { navigate } from "../router/useRoute";
import { Alert, Button, Field } from "../components/ui";
import { ROLES } from "../lib/constants";

export default function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState({
    role: "DONOR",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password, form.role);
      notify(`Welcome back, ${user.full_name}!`, "success");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Unable to sign in. Please check your credentials.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="auth-card__mark">🩸</span>
          <h1>BloodLink</h1>
          <p>Sign in to continue saving lives</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Alert tone="error">{error}</Alert>

          <Field label="Role" htmlFor="role">
            <select
              id="role"
              value={form.role}
              onChange={update("role")}
              className="input"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Email" htmlFor="email">
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              className="input"
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
              className="input"
            />
          </Field>

          <Button type="submit" className="auth-form__submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>

          <p className="auth-form__switch">
            New here?{" "}
            <a
              href="#/register"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
