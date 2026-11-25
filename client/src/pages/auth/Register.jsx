import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Alert, Button, Field } from "../../components/ui";
import { PasswordField } from "../../components/kit";
import { ROLES } from "../../lib/constants";

const EMPTY_FORM = {
  role: "DONOR",
  full_name: "",
  email: "",
  phone: "",
  password: "",
  organization_name: "",
  registration_number: "",
};

export default function Register() {
  const { register } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const orgRoles = ["HOSPITAL", "BLOOD_BANK", "CAMP_ORGANIZER"];
  const showOrg = orgRoles.includes(form.role);
  const orgLabel =
    form.role === "HOSPITAL"
      ? "Hospital name"
      : form.role === "BLOOD_BANK"
        ? "Blood bank name"
        : "Organization name";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!showOrg) {
        delete payload.organization_name;
        delete payload.registration_number;
      } else {
        payload.hospital_name = payload.organization_name;
        delete payload.organization_name;
      }
      const user = await register(payload);
      notify(`Account created. Welcome, ${user.full_name}!`, "success");
      navigate("/app/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Unable to create account. Please try again.";
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
          <h1>Join BloodLink</h1>
          <p>Register to donate blood, request blood, or manage an organization</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Alert tone="error">{error}</Alert>

          <Field label="I am a" htmlFor="role">
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

          <Field label="Full name" htmlFor="full_name">
            <input
              id="full_name"
              required
              placeholder="John Doe"
              value={form.full_name}
              onChange={update("full_name")}
              className="input"
            />
          </Field>

          <Field label="Email" htmlFor="email">
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              className="input"
            />
          </Field>

          <Field label="Phone" htmlFor="phone">
            <input
              id="phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={update("phone")}
              className="input"
            />
          </Field>

          <PasswordField
            label="Password"
            id="password"
            value={form.password}
            onChange={update("password")}
            required
            minLength={6}
            placeholder="••••••••"
          />

          {showOrg && (
            <>
              <Field label={orgLabel} htmlFor="organization_name">
                <input
                  id="organization_name"
                  required
                  placeholder={form.role === "HOSPITAL" ? "City Care Hospital" : "Red Life Blood Bank"}
                  value={form.organization_name}
                  onChange={update("organization_name")}
                  className="input"
                />
              </Field>
              {form.role !== "CAMP_ORGANIZER" && (
                <Field label="Registration number" htmlFor="registration_number">
                  <input
                    id="registration_number"
                    required
                    placeholder="REG-0001"
                    value={form.registration_number}
                    onChange={update("registration_number")}
                    className="input"
                  />
                </Field>
              )}
            </>
          )}

          <Button type="submit" className="auth-form__submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>

          <p className="auth-form__switch">
            Already have an account?{" "}
            <a
              href="#/login"
              onClick={(e) => { e.preventDefault(); navigate("/login"); }}
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
