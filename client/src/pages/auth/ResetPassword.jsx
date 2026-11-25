import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { navigate, useRoute } from "../../router/useRoute";
import { Alert, Button } from "../../components/ui";
import { PasswordField } from "../../components/kit";
import { Breadcrumbs } from "../../components/kit";

export default function ResetPassword() {
  const { notify } = useToast();
  const route = useRoute();
  const email = route.query.get("email") || "";
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      notify("Password reset successfully. Please sign in.", "success");
      navigate("/login");
    }, 700);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <Breadcrumbs
          items={[
            { label: "BloodLink", href: "#/", onClick: () => navigate("/") },
            { label: "Reset password" },
          ]}
        />
        <div className="auth-card__brand">
          <span className="auth-card__mark">🔐</span>
          <h1>Create new password</h1>
          <p>{email ? `Setting a new password for ${email}` : "Set a new password for your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Alert tone="error">{error}</Alert>
          <PasswordField
            label="New password"
            id="password"
            value={form.password}
            onChange={update("password")}
            required
            placeholder="••••••••"
          />
          <PasswordField
            label="Confirm password"
            id="confirm"
            value={form.confirm}
            onChange={update("confirm")}
            required
            placeholder="••••••••"
          />
          <Button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? "Resetting…" : "Reset password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
