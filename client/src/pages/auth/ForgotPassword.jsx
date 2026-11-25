import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Alert, Button, Field } from "../../components/ui";
import { Breadcrumbs } from "../../components/kit";

export default function ForgotPassword() {
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    // Simulated: a reset link / OTP is sent to the email.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      notify("Reset instructions sent to your email.", "success");
    }, 700);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <Breadcrumbs
          items={[
            { label: "BloodLink", href: "#/", onClick: () => navigate("/") },
            { label: "Login", href: "#/login", onClick: () => navigate("/login") },
            { label: "Forgot password" },
          ]}
        />
        <div className="auth-card__brand">
          <span className="auth-card__mark">🔑</span>
          <h1>Reset your password</h1>
          <p>Enter your email and we'll send you reset instructions</p>
        </div>

        {sent ? (
          <div className="auth-form">
            <Alert tone="success">
              A password reset link and OTP have been sent to {email}.
            </Alert>
            <div className="auth-form__row auth-form__row--center">
              <Button onClick={() => navigate("/otp", { email })}>Continue to OTP</Button>
              <Button variant="secondary" onClick={() => navigate("/reset-password", { email })}>
                Use reset link
              </Button>
            </div>
            <p className="auth-form__switch">
              <a href="#/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                Back to login
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <Alert tone="error">{error}</Alert>
            <Field label="Email address" htmlFor="email">
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </Field>
            <Button type="submit" className="auth-form__submit" disabled={loading}>
              {loading ? "Sending…" : "Send reset instructions"}
            </Button>
            <p className="auth-form__switch">
              <a href="#/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                Back to login
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
