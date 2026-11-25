import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { navigate, useRoute } from "../../router/useRoute";
import { Alert, Button, Field } from "../../components/ui";
import { Breadcrumbs } from "../../components/kit";

export default function OTP() {
  const { notify } = useToast();
  const route = useRoute();
  const email = route.query.get("email") || "your email";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const startResend = () => {
    setResendIn(30);
    const t = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      notify("OTP verified successfully.", "success");
      navigate("/email-verification", { email });
    }, 700);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <Breadcrumbs
          items={[
            { label: "BloodLink", href: "#/", onClick: () => navigate("/") },
            { label: "OTP verification" },
          ]}
        />
        <div className="auth-card__brand">
          <span className="auth-card__mark">📱</span>
          <h1>Verify with OTP</h1>
          <p>We sent a 6-digit code to {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Alert tone="error">{error}</Alert>
          <Field label="Enter OTP" htmlFor="otp">
            <input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="input otp-input"
            />
          </Field>
          <Button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? "Verifying…" : "Verify OTP"}
          </Button>
          <div className="auth-form__row auth-form__row--center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={resendIn > 0}
              onClick={startResend}
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
            </Button>
          </div>
          <p className="auth-form__switch">
            <a href="#/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              Back to login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
